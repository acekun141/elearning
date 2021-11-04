import { useState, useMemo, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { changePasswordService } from "../../utils/api/user";
import { GlobalContext } from "@contexts/ContextProvider";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { action } = useContext(GlobalContext);

  const onCurPWChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  const onNewPWChange = (event) => {
    setNewPassword(event.target.value);
  };

  const onConfirmPWChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const { res, err } = await changePasswordService(currentPassword, newPassword);
    if (err) return action.pushAlert("error", err);
    return action.pushAlert("success", res.message);
  }

  const isValidForm = useMemo(() => {
    return currentPassword && newPassword && confirmPassword && newPassword.length >= 6 && newPassword === confirmPassword;
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <form onSubmit={onSubmit}>
      <p className="title mb-5">Change Password</p>
      <Form.Group>
        <Form.Label>Current Password</Form.Label>
        <Form.Control value={currentPassword} onChange={onCurPWChange} type="password" name="current_password" placeholder="Current Password" />
      </Form.Group>
      <Form.Group>
        <Form.Label>New Password</Form.Label>
        <Form.Control value={newPassword} onChange={onNewPWChange} type="password" name="new_password" placeholder="New Password" />
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control value={confirmPassword} onChange={onConfirmPWChange} type="password" name="confirm_password" placeholder="Confirm Password" />
      </Form.Group>
      <div className="button-wrapper d-flex justify-content-end">
        <Button type="submit" disabled={!isValidForm}>Submit</Button>
      </div>
    </form>
  );
}

export default ChangePassword;
