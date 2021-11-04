import BaseLayout from "@components/layout/BaseLayout";
import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import LineLoading from "@components/common/LineLoading";
import { getUserCoursesService } from "../../../utils/api/user";
import CourseList from "../../../components/course/CourseList";

const YourCourses = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    handleGetCourses();
  }, []);

  const handleGetCourses = async () => {
    setIsLoading(true);
    const { res, err } = await getUserCoursesService();
    setIsLoading(false);
    if (err) return;
    setCourses(res.courses);
  };

  if (isLoading) return (
    <BaseLayout>
      <Container>
        <h3 style={{ fontWeight: 700 }}>Your courses</h3>
        <div className="d-flex justify-content-center">
          <LineLoading />
        </div>
      </Container>
    </BaseLayout>
  )

  return (
    <BaseLayout>
      <Container>
        <h3 style={{ fontWeight: 700 }}>Your courses</h3>
        <CourseList list={courses} />
      </Container>
    </BaseLayout>
  );
}

export default YourCourses;