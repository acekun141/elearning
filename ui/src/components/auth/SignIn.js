import { useState, useCallback, useMemo, useContext } from "react";
import { Button } from "react-bootstrap";
import { IoLogoFacebook, IoLogoGoogle } from "react-icons/io5";
import { signInService } from "@api/auth";
import { GlobalContext } from "@contexts/ContextProvider";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  const { action } = useContext(GlobalContext);

  const onEmailChange = useCallback((event) => {
    setEmail(event.target.value);
  }, []);

  const onPwChange = useCallback((event) => {
    setPw(event.target.value);
  }, []);

  const isValidForm = useMemo(() => {
    return !!email && !!pw;
  }, [email, pw]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const { res, err } = await signInService(email, pw)
    if (err) {
      return action.pushAlert("error", err);
    }
    localStorage.setItem("access_token", res.access_token);
    window.location.replace("/")
  };

  return (
    <form onSubmit={onSubmit} className="signin-form d-flex flex-column">
      <h5 className="title">Sign In</h5>
      <input onChange={onEmailChange} value={email} name="email" placeholder="Email" type="email" />
      <input onChange={onPwChange} value={pw} name="password" placeholder="Password" type="password" />
      <Button variant="dark" type="submit" disabled={!isValidForm}>Sign In</Button>
      <p className="text-center mt-2 instead"><a href="/signup">Sign up</a> Instead?</p>
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

export default SignIn;