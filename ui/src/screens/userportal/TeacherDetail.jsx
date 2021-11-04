import React, { useEffect, useState } from "react";
import BaseLayout from "@components/layout/BaseLayout";
import { Container, Button } from "react-bootstrap";
import Skeleton from "react-loading-skeleton";
import { useDispatch } from "react-redux";
import { getTeacherInfoService } from "../../utils/api/user";
import { useParams, useHistory } from "react-router-dom";
import { publicGetListCourseService } from "../../utils/api/course";
import CourseList from "../../components/course/CourseList";
import LineLoading from "@components/common/LineLoading";

const TeacherDetail = () => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const [pagingData, setPagingData] = useState({ has_next: false, page: 1 });
  const [detail, setDetail] = useState(null);
  const [courses, setCourses] = useState(null);
  const {id} = useParams();
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (!id) return history.replace('/');
    handleGetTeacherInfo();
    handleGetCourses();
  }, [id])

  const handleGetTeacherInfo = async () => {
    setIsLoadData(true);
    const {res, err} = await getTeacherInfoService(id);
    setIsLoadData(false);
    if (err) return history.replace("/");
    setDetail(res);
  }

  const handleGetCourses = async () => {
    const {res, err} = await publicGetListCourseService({ teacher_id: id });
    if (err) return setCourses([]);
    setCourses(res.courses);
    setPagingData({ has_next: res.has_next, page: res.current_page });
  }

  const handleGetNext = async () => {
    setIsLoadingMore(true);
    const {res, err} = await publicGetListCourseService({ teacher_id: id, page: pagingData.page + 1 });
    setIsLoadingMore(false);
    if (err) return setCourses([]);
    setCourses(prevState => [...prevState, ...res.courses]);
    setPagingData({ has_next: res.has_next, page: res.current_page });
  }

  if (isLoadData || !detail) return (
    <BaseLayout>
      <Container>
        <TeacherLoading />
      </Container>
    </BaseLayout>
  );
  return (
    <BaseLayout>
      <Container>
        <div className="teacher-detail">
          <div className="user-info">
            <div className="user-info__avatar">
              <img src={`/image/${detail.avatar}`} alt="avatar" />
            </div>
            <p>{detail.first_name} {detail.last_name}</p>
          </div>
          <div className="describe">
            <h5>Describe</h5>
            <p>{detail.describe}</p>
          </div>
          <div className="courses">
            <h5>Courses</h5>
            {courses ? <CourseList list={courses} isLoading={false} /> : <Skeleton height={300} />}
            {isLoadingMore && (
              <div className="d-flex justify-content-center pt-4">
                <LineLoading />
              </div>
            )}
            {pagingData.has_next && !isLoadingMore && (
              <div className="d-flex justify-content-center pt-4">
                <Button variant="dark" onClick={handleGetNext}>More</Button>
              </div>
            )}
          </div>
        </div>
      </Container>
    </BaseLayout>
  );
}

const TeacherLoading = () => {
  return (
    <div className="teacher-detail">
      <div className="user-info">
        <div className="user-info__avatar">
          <Skeleton height={200} widht={200} />
        </div>
      </div>
      <div className="describe">
        <h5>Describe</h5>
        <Skeleton height={200} />
      </div>
      <div className="courses">
        <h5>Courses</h5>
        <Skeleton height={300} />
      </div>
    </div>
  );
}

export default TeacherDetail;