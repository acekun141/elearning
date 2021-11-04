import Loading from "../common/Loading";
import CourseItem from "./CourseItem";
import emptyImg from "../../assets/images/celander.png"

const CourseList = ({ list, isLoading, isAdmin=false }) => {
  if (isLoading) return (
    <div style={{ height: 300 }} className="d-flex justify-content-center align-items-center">
      <Loading />
    </div>
  )

  if (list.length === 0) return (
    <div className="course-list mt-4">
      <div className="empty">
        <img src={emptyImg} alt="empty-icon" />
        <p>No results found</p>
      </div>
    </div>
  )

  return (
    <div className="course-list mt-4">
      {list.map(item => <CourseItem isAdmin={isAdmin} key={item.id} item={item} />)}
    </div>
  )
};

export default CourseList;