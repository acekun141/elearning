import React from "react";
import { Modal } from "react-bootstrap";
import PublicVideo from "./PublicVideo";

const ViewPreviewModal = ({ video_id, onClose }) => {
	return (
		<Modal className="view-preview-modal" show={!!video_id} onHide={onClose} size="lg">
			<Modal.Header closeButton={true}>
				<Modal.Title>Preview</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<PublicVideo video_id={video_id} />
			</Modal.Body>
		</Modal>
	);
}

export default ViewPreviewModal;
