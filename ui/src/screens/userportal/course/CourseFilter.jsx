import React, { useContext, useEffect, useState } from "react";
import BaseLayout from "@components/layout/BaseLayout";
import SearchBar from "../../../components/course/SearchBar";
import { useSelector } from "react-redux";
import { Container, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { loadingOff, loadingOn } from "../../../redux/reducers/common/action";
import { publicGetListCourseService } from "../../../utils/api/course";
import CourseList from "../../../components/course/CourseList";
import { GlobalContext } from "../../../contexts/ContextProvider";
import LineLoading from "@components/common/LineLoading";
import { useLocation } from "react-router";

const CourseFilter = () => {
  const isLoading = useSelector(state => state.common.isLoading);
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [courses, setCourses] = useState([]);
  const [pagingData, setPagingData] = useState({ has_next: false, page: 1});
  const [currentFilter, setCurrentFilter] = useState(null);
  const { action } = useContext(GlobalContext);
  const location = useLocation();
  const dispatch = useDispatch();

  console.log(location.state);

  useEffect(() => {
    handleGetListCourse();
  }, []);

  const handleGetListCourse = async () => {
    dispatch(loadingOn());
    const {res, err} = await publicGetListCourseService();
    dispatch(loadingOff());
    if (err) return action.pushAlert("error", err);
    setPagingData({has_next: res.has_next, page: res.current_page});
    setCourses(res.courses);
  };

  const handleSearch = async (search, category, filterParam, value) => {
    dispatch(loadingOn());
    const {res, err} = await publicGetListCourseService({ search, category, [filterParam]: value});
    dispatch(loadingOff());
    if (err) return action.pushAlert("error", err);
    setCourses(res.courses);
    setPagingData({has_next: res.has_next, page: res.current_page});
    setCurrentFilter({search, category, filterParam, value});
  };

  const handleMore = async () => {
    if (currentFilter) {
      setIsLoadMore(true);
      const {search, category, filterParam, value} = currentFilter;
      if (filterParam) {
        const {res, err} = await publicGetListCourseService({ search, category, [filterParam]: value, page: pagingData.page + 1});
        setIsLoadMore(false);
        if (err) return action.pushAlert("error", err);
        setCourses(prevState => [...prevState, ...res.courses]);
        setPagingData({has_next: res.has_next, page: res.current_page});
        setCurrentFilter({search, category, filterParam, value});
      } else {
        const {res, err} = await publicGetListCourseService({ search, category, page: pagingData.page + 1});
        setIsLoadMore(false);
        if (err) return action.pushAlert("error", err);
        setCourses(prevState => [...prevState, ...res.courses]);
        setPagingData({has_next: res.has_next, page: res.current_page});
        setCurrentFilter({search, category, filterParam, value});
      }
    } else {
      setIsLoadMore(true);
      const {res, err} = await publicGetListCourseService({ page: pagingData.page + 1});
      setIsLoadMore(false);
      if (err) return action.pushAlert("error", err);
      setCourses(prevState => [...prevState, ...res.courses]);
      setPagingData({has_next: res.has_next, page: res.current_page});
    }
  }

  return (
    <BaseLayout>
      <Container>
        <div className="course-filter-screen">
          <SearchBar isLoading={isLoading} onSearch={handleSearch} category={location.state?.category || null} />
          <CourseList isLoading={isLoading} list={courses} />
          {isLoadMore && (
            <div className="d-flex justify-content-center pt-2">
              <LineLoading />
            </div>
          )}
          {(pagingData.has_next && !isLoadMore) && (
            <div className="d-flex justify-content-center pt-4">
              <Button variant="dark" onClick={handleMore}>More</Button>
            </div>
          )}
        </div>
      </Container>
    </BaseLayout>
  );
}

export default CourseFilter;