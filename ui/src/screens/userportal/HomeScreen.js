import BaseLayout from "@components/layout/BaseLayout";
import { Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ListCourse from "../../components/landing/ListCourse";
import TopCategories from "../../components/landing/TopCategories";

const HomeScreen = () => {
  const newCourse = useSelector((state) => state.common.landingInfo.new_course);
  const saleCourse = useSelector((state) => state.common.landingInfo.sale_course);
  const freeCourse = useSelector((state) => state.common.landingInfo.free_course);
  const user = useSelector(state => state.user);
  const history = useHistory();
  return (
    <BaseLayout className="white-page">
      <Container className="landing-page">
        {!user && (
          <div className="banner">
            <div className="banner__text">
              <h1>Studying <span className="text-secondary">Online</span> is now much easier</h1>
              <p>Elearning is an interesting platform that will teach you in more an interactive way</p>
              <button onClick={() => history.push("/signin")}>Join for free</button>
            </div>
            <div className="banner__illustration">
              <img src="banner-illustration.png" alt="illustration"/>
            </div>
          </div>
        )}
        <TopCategories />
        <ListCourse label="New" items={newCourse} />
        <ListCourse label="Sale off" items={saleCourse} />
        <ListCourse label="Free" items={freeCourse} />
      </Container>
    </BaseLayout>
  );
}

export default HomeScreen;
