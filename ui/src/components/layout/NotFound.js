import { Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import robotTyping from "../../assets/images/robottyping.png";

const NotFound = () => {
  const history = useHistory();
  const goHome = () => {
    history.push("/");
  }
  return (
    <div className="d-flex flex-column align-items-center justify-content-center pt-5">
      <img style={{ height: 300, width: "auto" }} src={robotTyping} alt="illustration" />
      <h1><strong>404 Page Not Found</strong></h1>
      <Button onClick={goHome} variant="outline-dark">Go Home</Button>
    </div>
  );
}

export default NotFound;