import React, { useContext, useEffect, useMemo, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { GlobalContext } from "../../contexts/ContextProvider";
import { loadingOff, loadingOn } from "../../redux/reducers/common/action";
import { editUserService } from "../../utils/api/user";

const roleOptions = [
    {text: "Admin", value: "admin"},
    {text: "User", value: "user"},
    {text: "Teacher", value: "teacher"},
]

const ChangeRoleModal = ({user, onHide}) => {
    const [selected, setSelected] = useState(user?.role || "");
    const [deactivate, setDeactivate] = useState(user?.deactivate || false)
    const { action } = useContext(GlobalContext);
    const dispatch = useDispatch();

    useEffect(() => {
        if (user) {
            setSelected(user.role);
            setDeactivate(user.deactivate);
        }
    }, [user]);

    const disabled = useMemo(() => {
        return user?.role === selected && user?.deactivate === deactivate;
    }, [user, selected, deactivate])

    const onSubmit = async () => {
        dispatch(loadingOn());
        const {res, err} = await editUserService(user.id, deactivate, selected);
        if (err) {
            action.pushAlert("error", err);
        } else {
            onHide();
        }
        dispatch(loadingOff());
    };

    return (
        <Modal className="change-role-modal" show={!!user} onHide={onHide}>
            <Modal.Header closeButton>Edit User</Modal.Header>
            <Modal.Body>
                <Form.Switch 
                    onChange={() => setDeactivate(prevState => !prevState)}
                    checked={deactivate}
                    label="Deactivate"
                    id="disabled-custom-switch"
                />
                <div className="mb-4" />
                <Form.Select value={selected} size="sm" onChange={(event) => setSelected(event.target.value)}>
                    {roleOptions.map(item => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.text}
                        </option>)
                    )}
                </Form.Select>
                <div className="d-flex justify-content-end mt-4">
                    <Button onClick={onSubmit} disabled={disabled} variant="dark">Submit</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default ChangeRoleModal;