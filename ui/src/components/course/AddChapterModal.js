import { useEffect, useMemo, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { loadingOff, loadingOn } from "../../redux/reducers/common/action";
import { addChapterService, editChapterService } from "../../utils/api/course";

const AddChapterModal = ({ isOpen, onHide, courseId, callback }) => {
  const [chapterName, setChapterName] = useState("");
  const isLoading = useSelector(state => state.common.isLoading);
  const dispatch = useDispatch();
  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(loadingOn());
    if (typeof(isOpen) === "object") {
      await editChapterService(isOpen.id, chapterName);
    } else {
      await addChapterService(chapterName, courseId);
    }
    dispatch(loadingOff());
    callback();
  };
  const isEdit = useMemo(() => {
    return typeof(isOpen) === "object";
  }, [isOpen]);

  useEffect(() => {
    if (typeof(isOpen) === "object") {
      setChapterName(isOpen.name);
    } else {
      setChapterName("");
    }
  }, [isOpen]);
  return (
    <Modal show={isOpen} onHide={onHide}>
      <Modal.Header closeButton>{isEdit ? "Edit" : "Add"} Chapter</Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Chapter Name</Form.Label>
            <Form.Control
              value={chapterName}
              type="text"
              onChange={event => setChapterName(event.target.value)}
              placeholder="Chapter Name"
            />
          </Form.Group>
          <div className="d-flex justify-content-end">
            <Button type="submit" disabled={!chapterName || isLoading} variant="dark">Submit</Button>
          </div>
        </Form> 
      </Modal.Body>
    </Modal>
  );
}

export default AddChapterModal;