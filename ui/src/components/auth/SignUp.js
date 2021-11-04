import { useState, useCallback, useMemo, useContext } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "react-bootstrap";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io5";
import { signUpService } from "@api/auth";
import { useDispatch, useSelector } from "react-redux";
import { GlobalContext } from "@contexts/ContextProvider";
import { signUp } from "../../redux/reducers/user/actions";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const dispatch = useDispatch();
  const isLoading = useSelector(state => state.common.isLoading);

  const history = useHistory();
  const { action } = useContext(GlobalContext);

  const onConfirmPwChange = useCallback((event) => {
    setConfirmPw(event.target.value);
  }, []);

  const onEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const onPwChange = useCallback((event) => {
    setPw(event.target.value);
  }, []);

  const onFirstNameChange = useCallback((event) => {
    setFirstName(event.target.value);
  }, []);

  const onLastNameChange = useCallback((event) => {
    setLastName(event.target.value);
  }, []);

  const isValidForm = useMemo(() => {
    return !!email && !!pw && !!confirmPw && !!firstName && !!lastName && confirmPw === pw && pw.length > 6;
  }, [email, pw, confirmPw, firstName, lastName]);

  const isDoesNotMatch = useMemo(() => {
    if (!!confirmPw && !!pw) {
      return confirmPw !== pw;
    }
    return false;
  }, [confirmPw, pw]);

  const onSubmit = async (event) => {
    event.preventDefault();
    dispatch(signUp(email, pw, firstName, lastName, (res, err) => {
      if (err) return action.pushAlert("error", err);
      return history.push("/verify");
    }));
  };

  return (
    <form onSubmit={onSubmit} className="signin-form d-flex flex-column">
      <h5 className="title">Sign Up</h5>
      <input value={email} onChange={onEmailChange} name="email" placeholder="Email" type="email" />
      <input value={firstName} onChange={onFirstNameChange} name="first_name" placeholder="First Name" />
      <input value={lastName} onChange={onLastNameChange} name="last_name" placeholder="Last Name" />
      <input value={pw} onChange={onPwChange} name="password" placeholder="Password" type="password" />
      <input value={confirmPw} onChange={onConfirmPwChange} name="confirm_password" placeholder="Confirm Password" type="password" />
      {isDoesNotMatch && <p className="text-danger"><small>Confirm password does not match</small></p>}
      <Button variant="dark" type="submit" disabled={!isValidForm || isLoading}>Sign Up</Button>
      <p className="text-center mt-2 instead"><a href="/signin">Sign in</a> Instead?</p>
      <span className="or-span">Or</span>
      <div className="another-way d-flex justify-content-between align-items-center">
        <Button variant="outline-dark">
          <IoLogoFacebook />
          <p className="m-0">Facebook</p>
        </Button>
        <Button variant="outline-dark">
          <IoLogoGoogle />
          <p className="m-0">Google</p>
        </Button>
      </div>
    </form>
  );
}

export default SignUp;
