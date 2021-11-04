import { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { verifyService } from "@api/auth";
import { GlobalContext } from "@contexts/ContextProvider";
import { useDispatch, useSelector } from "react-redux";
import { loadingOff, loadingOn } from "../../redux/reducers/common/action";

const Verify = () => {
  const [code, setCode] = useState("");
  const { action } = useContext(GlobalContext);
  const isLoading = useSelector(state => state.common.isLoading);
  const dispatch = useDispatch();

  const history = useHistory();

  const onCodeChange = (event) => {
    setCode(event.target.value);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(loadingOn())
    const { err } = await verifyService(code);
    dispatch(loadingOff())
    if (err) {
      return action.pushAlert("error", err);
    }
    history.push("/signin");
  };

  return (
    <Card className="verify-form">
      <form onSubmit={onSubmit} className="d-flex flex-column">
        <h5 className="title">Verify your email</h5>
        <p className="text-secondary">
          Please enter the code sent to your email
        </p>
        <input
          value={code}
          onChange={onCodeChange}
          placeholder="Access Token"
          name="code"
        />
        <Button type="submit" disabled={code.length < 8 || isLoading}>Submit</Button>
      </form>
    </Card>
  );
};

export default Verify;
