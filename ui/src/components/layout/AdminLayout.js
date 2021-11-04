import { Container } from "react-bootstrap";
import ModalCreateCourse from "../course/ModalCreateCourse";
import SideBar from "./SideBar";

const AdminLayout = ({ children, isNoPadding=false }) => {
  return (
    <div className="admin-layout">
      <ModalCreateCourse />
      <SideBar />
      <Container fluid={true} className={`content ${isNoPadding ? "p-0" : ""}`}>
        {children}
      </Container>
    </div>
  );
}

export default AdminLayout;