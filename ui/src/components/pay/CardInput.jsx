import React, { useContext, useState } from "react";
import { Form, Button } from "react-bootstrap";
import {CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import { currencyValue } from "../../utils/num";
import { payService, confirmPayService } from "../../utils/api/pay";
import { GlobalContext } from "../../contexts/ContextProvider";

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};



function CardSection({ amount, courseId, callback }) {
  const [email, setEmail] = useState("");
  const { action } = useContext(GlobalContext);
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { res, err } = await payService(email, courseId);
    if (err) return action.pushAlert("error", err);

    const result = await stripe.confirmCardPayment(res.client_secret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          email
        },
      },
    });

    if (result.error) {
      action.pushAlert("error", err);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        await confirmPayService(courseId);
        action.pushAlert("success", "Pay Successfully");
        if (typeof(callback) === "function") callback();
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Form.Group className="mb-4">
        <Form.Label>Email</Form.Label>
        <Form.Control
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          placeholder="Email"
        />
      </Form.Group>
      <label>
        Card details
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </label>
      <div className="d-flex justify-content-end mt-4">
        <Button type="submit" disabled={!email} variant="dark">Pay {currencyValue(amount)}</Button>
      </div>
    </form>
  );
};

export default CardSection;