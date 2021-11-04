import { Modal, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const ModalConfirm = ({ isShow, onConfirm, onHide, content, confirmLabel="Confirm" }) => {
  const isLoading = useSelector(state => state.common.isLoading);

  return (
    <Modal show={isShow} onHide={onHide}>
      <Modal.Header closeButton>Are you sure?</Modal.Header>
      <Modal.Body>
        <p>{content}</p>
        <div className="d-flex justify-content-end button-wrapper-end">
          <Button onClick={onHide} variant="outline-danger">Cancel</Button>
          <Button onClick={onConfirm} variant="primary" disabled={isLoading}>{confirmLabel}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ModalConfirm;