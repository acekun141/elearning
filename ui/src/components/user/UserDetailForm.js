import { useState, useContext } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import { range } from "../../utils/num";
// import { GlobalContext } from "@contexts/ContextProvider";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { updateInfoService } from "../../utils/api/user";
import { GlobalContext } from "@contexts/ContextProvider";
import { useMemo } from "react";

const days = range(1,31)
const months = range(1,12)
const years = range(1920, 2020)

const UserDetailForm = () => {
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [phoneNumber, setPhoneNumber] = useState();
  const [describe, setDescribe] = useState("");
  const [day, setDay] = useState();
  const [month, setMonth] = useState();
  const [year, setYear] = useState();
  const user = useSelector(state => state.user);
  const { action } = useContext(GlobalContext);

  useEffect(() => {
    setFirstName(user.first_name);
    setLastName(user.last_name);
    setPhoneNumber(user.phone_number || "");
    setDescribe(user.describe || "");
  }, []);

  const onFirstNameChange = (event) => {
    setFirstName(event.target.value);
  }
  const onLastNameChange = (event) => {
    setLastName(event.target.value);
  }
  const onPhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  }

  const isValidForm = useMemo(() => {
    return firstName && lastName && phoneNumber;
  }, [firstName, lastName, phoneNumber]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { err } = await updateInfoService(firstName, lastName, phoneNumber, describe);
    if (err) return action.pushAlert("error", err);
    return action.pushAlert("success", "Successfully");
  }

  return (
    <form onSubmit={onSubmit} className="edit-user-form">
      <p className="title mb-5">Information</p>
      <Row>
        <Form.Group as={Col}>
          <Form.Label>First Name</Form.Label>
          <Form.Control value={firstName} onChange={onFirstNameChange} name="first_name" placeholder="First Name" />
        </Form.Group>
        <Form.Group as={Col}>
          <Form.Label>Last Name</Form.Label>
          <Form.Control value={lastName} onChange={onLastNameChange} name="last_name" placeholder="Last Name" />
        </Form.Group>
      </Row>
      <Form.Group>
        <Form.Label>Phone Number</Form.Label>
        <Form.Control value={phoneNumber} onChange={onPhoneNumberChange} type="tel" placeholder="Phone Number" />
      </Form.Group>
      {user.role === "admin" && (
        <Form.Group>
          <Form.Label>Describe</Form.Label>
          <Form.Control style={{ minHeight: 250 }} as="textarea" value={describe} onChange={event => setDescribe(event.target.value)} type="text" placeholder="Describe" />
        </Form.Group>
      )}
      <Form.Group as={Row}>
        <Form.Label>Date of birth</Form.Label>
        <Col>
          <Form.Select aria-label="Day">
            {days.map(item => <option key={`day-${item}`}>{item}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select aria-label="Month">
            {months.map(item => <option key={`month-${item}`}>{item}</option>)}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select aria-label="Year">
            {years.map(item => <option key={`year-${item}`}>{item}</option>)}
          </Form.Select>
        </Col>
      </Form.Group>
      <div className="d-flex justify-content-end">
        <Button disabled={!isValidForm} type="submit" className="mt-4">Submit</Button>
      </div>
    </form>
  );
}


export default UserDetailForm;
