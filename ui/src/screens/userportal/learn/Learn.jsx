import React, { useEffect, useState } from "react";
import BaseLayout from "@components/layout/BaseLayout";
import StreamVideo from "./StreamVideo";
import Lecture from "./Lecture";
import { useParams, useHistory } from "react-router-dom";
import { getLearnCourseDetailService } from "../../../utils/api/course";
import Loading from "@components/common/Loading";

const Learn = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    if (!id) return history.push('/');
    handleGetCourseDetail();
  }, [id]);

  const handleGetCourseDetail = async () => {
    setIsLoading(true);
    const {res, err} = await getLearnCourseDetailService(id);
    setIsLoading(false);
    if (err) return history.push('/');
    setCourse(res.course);
  };

  const onSelectVideo = (video) => {
    setSelectedVideo(video);
  };

  if (isLoading || !course) return <LoadingComponent />

  return (
    <BaseLayout className="course-detail-layout">
      <div className="learn">
        <StreamVideo video={selectedVideo} />
        <Lecture video={selectedVideo || {}} data={course.chapters} onSelectVideo={onSelectVideo} />
      </div>
    </BaseLayout>
  );
}

const LoadingComponent = () => (
  <BaseLayout className="course-detail-layout">
    <div className="learn loading">
      <Loading />
    </div>
  </BaseLayout>
)

export default Learn;