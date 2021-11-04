import AdminLayout from "@components/layout/AdminLayout";
import { useContext, useEffect, useState } from "react";
import CourseList from "../../components/course/CourseList";
import SearchBar from "../../components/course/SearchBar";
import { getAllCourseService } from "../../utils/api/course";
import { GlobalContext } from "../../contexts/ContextProvider";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { action } = useContext(GlobalContext);

  useEffect(() => {
    handleGetCourses();
  }, []);

  const handleGetCourses = async (search="", category="") => {
    setIsLoading(true);
    const { res, err } = await getAllCourseService(search, category);
    setIsLoading(false);
    if (err) return action.pushAlert("error", err)
    setCourses(res.courses);
  }

  return (
    <AdminLayout>
      <h1 className="content-title">Course</h1>
      <SearchBar isLoading={isLoading} onSearch={handleGetCourses} />
      <CourseList isAdmin={true} isLoading={isLoading} list={courses} />
    </AdminLayout>
  );
}

export default Courses;
