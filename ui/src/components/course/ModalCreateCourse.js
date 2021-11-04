import { useContext, useMemo, useState, useRef } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSourceModal } from "../../redux/reducers/modal/actions";
import { LIST_COURSE_TYPE } from "../../utils/constants";
import { GlobalContext } from "@contexts/ContextProvider";
import { loadingOn, loadingOff } from "../../redux/reducers/common/action";
import { createCourseService } from "../../utils/api/course";

const ModalCreateCourse = () => {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseType, setCourseType] = useState("")
  const isShowCreateCourse = useSelector(state => state.modal.isShowCreateCourse);
  const isLoading = useSelector(state => state.common.isLoading);
  const { action } = useContext(GlobalContext);
  const inputRef = useRef(null);

  const dispatch = useDispatch()

  const clearForm = () => {
    setCourseName("");
    setCourseType("");
  }

  const onClose = () => {
    clearForm();
    dispatch(setCreateSourceModal(false));
  };

  const isValidForm = useMemo(() => {
    return courseName && courseType && file;
  }, [courseName, courseType, file])

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loadingOn());
    const { err } = await createCourseService(courseName, courseType, file);
    dispatch(loadingOff());
    if (err) action.pushAlert("error", err)
    return onClose();
  };
  
  const handleUploadFile = (event) => {
    if (event.target.files.length < 0) return;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      setFile(event.target.result);
    }
  };

  return (
    <Modal show={isShowCreateCourse} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input onChange={handleUploadFile} style={{ display: "none" }} ref={inputRef} type="file" accept="image/*" />
          <Form.Group>
            <Form.Label>Course Name</Form.Label>
            <Form.Control
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              type="text"
              placeholder="Course Name"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Course Type</Form.Label>
            <Form.Select value={courseType} onChange={(event) => setCourseType(event.target.value)} aria-label="Select your type">
              <option value="">Select your type</option>
              {LIST_COURSE_TYPE.map(item => (
                <option value={item} key={item}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {file && <img className="mb-2" style={{ width: "100%", height: "auto" }} src={file} alt="cover" />}
          <div className="d-grid">
            <Button onClick={() => inputRef.current.click()} size="sm">Upload Cover Image</Button>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" disabled={!isValidForm || isLoading} variant="dark">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCreateCourse;
