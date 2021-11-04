import { useContext, useMemo, useState, useRef, useEffect } from "react";
import { Modal, Form, Button, Row, Col } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setCreateSourceModal } from "../../redux/reducers/modal/actions";
import { LIST_COURSE_TYPE } from "../../utils/constants";
import { GlobalContext } from "@contexts/ContextProvider";
import { loadingOn, loadingOff } from "../../redux/reducers/common/action";
import { createCourseService, editCourseInfoService } from "../../utils/api/course";

const ModalEditInfo = ({ info, isShow, onHide, callback }) => {
  const [file, setFile] = useState(null);
  const [courseName, setCourseName] = useState("");
  const [courseType, setCourseType] = useState("")
  const [describe, setDescribe] = useState("");
  const [discount, setDiscount] = useState(0);
  const [price, setPrice] = useState(0);
  const isLoading = useSelector(state => state.common.isLoading);
  const { action } = useContext(GlobalContext);
  const inputRef = useRef(null);

  const dispatch = useDispatch()

  useEffect(() => {
    setCourseName(info.name);
    const category = LIST_COURSE_TYPE.filter(item => item === info.course_type)[0];
    setCourseType(category);
    setDiscount(info.discount);
    setPrice(info.price);
    setDescribe(info.describe || "");
  }, []);

  const clearForm = () => {
    setCourseName("");
    setCourseType("");
  }

  const onClose = () => {
    clearForm();
    dispatch(setCreateSourceModal(false));
  };

  const isValidForm = useMemo(() => {
    return (
      !!courseName &&
      !!courseType &&
      typeof(discount) === "number" &&
      typeof(price) === "number" &&
      discount >= 0 &&
      price >= 0
    );
  }, [courseName, courseType, discount, price]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(loadingOn());
    const { err } = await editCourseInfoService(info.id, courseName, courseType, discount, price, file, describe);
    dispatch(loadingOff());
    if (err) action.pushAlert("error", err)
    onHide();
    return callback();
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
    <Modal size="lg" show={isShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form onSubmit={handleSubmit}>
          <input onChange={handleUploadFile} style={{ display: "none" }} ref={inputRef} type="file" accept="image/*" />
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              value={courseName}
              onChange={(event) => setCourseName(event.target.value)}
              type="text"
              placeholder="Course Name"
            />
          </Form.Group>
          <Form.Group className="mb-4">
            <Form.Label>Type</Form.Label>
            <Form.Select value={courseType} onChange={(event) => setCourseType(event.target.value)} aria-label="Select your type">
              <option value="">Select your type</option>
              {LIST_COURSE_TYPE.map(item => (
                <option value={item} key={item}>{item}</option>
              ))}
            </Form.Select>
          </Form.Group>
          <Row>
            <Form.Group as={Col}>
              <Form.Label>Discount</Form.Label>
              <Form.Control
                value={discount}
                onChange={(event) => setDiscount(Number.parseInt(event.target.value))}
                type="number"
                placeholder="Enter discount"
              />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                value={price}
                onChange={(event) => setPrice(Number.parseInt(event.target.value))}
                type="number"
                placeholder="Enter price"
              />
            </Form.Group>
          </Row>
          <Form.Group className="mb-4">
            <Form.Label>Description</Form.Label>
            <Form.Control
              style={{ minHeight: 200 }}
              as="textarea"
              value={describe}
              onChange={(event) => setDescribe(event.target.value)}
              type="text"
              placeholder="Description"
            />
          </Form.Group>
          {!file && <img className="mb-2" style={{ width: "100%", height: "auto" }} src={`/image/${info.cover}`} alt="cover" />}
          {file && <img className="mb-2" style={{ width: "100%", height: "auto" }} src={file} alt="cover" />}
          <div className="d-grid">
            <Button onClick={() => inputRef.current.click()} size="sm">Change Cover Image</Button>
          </div>
          <div className="d-flex justify-content-end mt-4">
            <Button type="submit" disabled={!isValidForm || isLoading} variant="dark">
              Submit
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default ModalEditInfo;