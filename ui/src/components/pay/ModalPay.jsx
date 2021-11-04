import React from "react";
import { Modal} from "react-bootstrap";
import {Elements} from "@stripe/react-stripe-js";
import {loadStripe} from "@stripe/stripe-js";
import CardInput from "./CardInput";

const stripePromise = loadStripe('pk_test_51HFaFdDo1P0sBmDSoWEfmk9bFct98scK7uaclLRBdYXfNJZiyVYCqYP5SDGpZRkUChH2pJrO6uqle7Xi34dK05Lu00h2dKiBBR');

const ModalPay = ({ isShow, onHide, course }) => {
  console.log(course);
  return (
    <Modal className="modal-pay" show={isShow} onHide={onHide}>
      <Modal.Header closeButton>Pay</Modal.Header>
      <Modal.Body>
        <Elements stripe={stripePromise}>
          <CardInput callback={() => window.location.reload()} amount={course.price - course.discount} courseId={course.id} />
        </Elements>
      </Modal.Body>
    </Modal>
  );
}

export default ModalPay;