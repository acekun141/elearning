import { useContext, useMemo, useState, useRef, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSourceModal } from "../../redux/reducers/modal/actions";
import { GlobalContext } from "@contexts/ContextProvider";
import { loadingOn, loadingOff } from "../../redux/reducers/common/action";
import { uploadVideo } from "../../utils/api/video";

const ModalAddVideo = ({ info, isShow, onHide, callback, chapterId }) => {
  const [duration, setDuration] = useState(null);
  const [url, setUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [videoName, setVideoName] = useState("");
  const isLoading = useSelector(state => state.common.isLoading);
  const { action } = useContext(GlobalContext);
  const inputRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
  }, []);

  const clearForm = () => {
    setFile(null);
    setVideoName("");
  }

  const onClose = () => {
    clearForm();
    onHide();
  };

  const isValidForm = useMemo(() => {
    return !!file && !!videoName && !!duration;
  }, [file, videoName, duration]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loadingOn());
    const {res, err} = await uploadVideo(chapterId, videoName, file, duration);
    dispatch(loadingOff());
    if (err) return action.pushAlert("error", err);
    callback();
    onClose();
  };
  
  const handleUploadFile = (event) => {
    if (event.target.files.length < 0) return;
    const file = event.target.files[0];
    if (file) {
      setFile(file);
      setUrl(URL.createObjectURL(file));
      handleGetDuration(URL.createObjectURL(file));
    }
  };

  const handleGetDuration = (result) => {
    var media = new Audio(result);
    media.onloadedmetadata = function(){
      setDuration(media.duration);
    }
  }

  return (
    <Modal size="lg" show={isShow} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input
            onChange={handleUploadFile}
            style={{ display: "none" }}
            ref={inputRef}
            type="file"
            accept="video/*"
          />
          <Form.Group>
            <Form.Label>Video</Form.Label>
            <Form.Control
              value={videoName}
              onChange={(event) => setVideoName(event.target.value)}
              type="text"
              placeholder="Video Name"
            />
          </Form.Group>
          {file && (
            <video
              className="mb-2"
              style={{ width: "100%", height: "auto" }}
              controls
            >
              <source src={url} />
            </video>
          )}
          <div className="d-grid">
            <Button onClick={() => inputRef.current.click()} size="sm">
              Upload Video
            </Button>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button
              type="submit"
              disabled={!isValidForm || isLoading}
              variant="dark"
            >
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalAddVideo;
