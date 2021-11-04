import React, { useEffect, useState, useMemo } from "react";
import BaseLayout from "@components/layout/BaseLayout";
import { IoStarOutline, IoStar, IoStarHalf, IoVideocamOutline } from "react-icons/io5";
import { useHistory, useParams } from "react-router-dom";
import { currencyValue } from "../../../utils/num";
import { publicGetCourseDetailService } from "../../../utils/api/course";
import Loading from "../../../components/common/Loading";
import ModalPay from "@components/pay/ModalPay";
import { useSelector } from "react-redux";
import Comment from "../comment/Comment";
import RateInput from "../comment/RateInput";
import { confirmPayService } from "../../../utils/api/pay";
import PublicVideo from "@components/course/PublicVideo";

const CourseDetail = () => {
  const {id} = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isShowPay, setIsShowPay] = useState(false);
  const [data, setData] = useState(null);
  const user = useSelector(state => state.user);
  const history = useHistory();

  useEffect(() => {
    if (!id) return history.push('/');
    handleGetDetail();
  }, [id]);

  const goTeacherDetail = (id) => {
    history.push(`/teacher/${id}`);
  };

  const goToSignIn = () => {
    history.push(`/signin`);
  }

  const handleGetDetail = async () => {
    setIsLoading(true);
    const {res, err} = await publicGetCourseDetailService(id);
    if (err) return history.push("/");
    setIsLoading(false);
    setData(res.course);
  };

  const numberOfLecture = useMemo(() => {
    return (data?.chapters || []).reduce((prevValue, item) => {
      return prevValue + item.videos.length;
    }, 0)
  }, [data]);

  const listUserCourses = useMemo(() => {
    if (!user) return [];
    return user.courses.map(item => item.course.id);
  }, [user])

  const onLearn = () => {
    return history.push(`/course/learn/${data.id}`);
  }

  const handleRegister = async () => {
    if (data.price - data.discount === 0) {
      await confirmPayService(data.id);
      window.location.reload();
    } else {
      setIsShowPay(true);
    }
  }

  if (isLoading || !data) return (
    <BaseLayout>
      <div style={{ height: 300 }} className="d-flex align-items-center justify-content-center">
        <Loading />
      </div>
    </BaseLayout>
  )

  return (
    <BaseLayout className="course-detail-layout">
      <ModalPay course={data} isShow={isShowPay} onHide={() => setIsShowPay(false)} />
      <div className="course-detail">
        <div className="course-detail__content">
          {data.preview
            ? (
              <div className="preview-video">
                <PublicVideo video_id={data.preview} />
              </div>
            ) : (
              <div className="cover-wrapper">
                <img src={`/api/image/${data.cover}`} alt="cover-image" />
                <p>{data.name}</p>
              </div>
            )
          }
          <div className="detail">
            <div className="desribe mb-5">
              <h4 style={{ fontWeight: 700 }}>Description</h4>
              <p>{data.describe || "No description yet"}</p>
            </div>
            <div className="course-content mb-5">
              <h4 style={{ fontWeight: 700 }}>Content</h4>
              <div className="d-flex">
                <p className="chapter-info">{data.chapters.length} {data.chapters.length > 0 ? "chapters" : "chapter"}</p>
                <p className="chapter-info">{numberOfLecture} {numberOfLecture > 0 ? "lectures" : "lecture"}</p>
              </div>
              <Chapters chapters={data.chapters} />
            </div>
            <div className="teacher mb-5">
              <h4 style={{ fontWeight: 700 }}>Teacher</h4>
              <div className="teacher__info">
                <img src={`/api/image/${data.user_avatar}`} alt="avatar" />
                <p classname="course-item__user">{data.create_by}</p>
              </div>
              <p className="mt-4">{data.user_describe}</p>
            </div>
            <Rating data={data.rate_detail} total={data.total_rate} />
            {listUserCourses.includes(data.id) && (
              <React.Fragment>
                <div className="mb-5">
                  <h4 className="mb-0" style={{ fontWeight: 700 }}>Your rate</h4>
                  <RateInput courseId={data.id} />
                </div>
              </React.Fragment>
            )}
            <Comment isBought={listUserCourses.includes(data.id)} courseId={data.id} />
          </div>
        </div>
        <div className="course-detail__info">
          <p className="name">{data.name}</p>
          <p className="category">{data.course_type}</p>
          <div className="rate-wrapper">
            <Rate />
            <p>{`(0 rate)`}</p>
          </div>
          <div className="course-detail__user" onClick={() => goTeacherDetail(data.create_by_id)}>
            <img src={`/api/image/${data.user_avatar}`} alt="avatar" />
            <p className="course-item__user">{data.create_by}</p>
          </div>
          {data.price - data.discount === 0
            ? <p className="price text-success">Free</p>
            : (
              <React.Fragment>
                <p className="discount" hidden={!data.discount}><s>{currencyValue(data.price)}</s></p>
                <p className="price">{currencyValue(data.price - data.discount)}</p>
              </React.Fragment>
            )}
          {user && (
            listUserCourses.includes(data.id)
            ? <button onClick={onLearn}>Continue</button>
            : <button onClick={handleRegister}>Register</button>
          )}
          {!user && (
            <button onClick={goToSignIn}>Signin for register</button>
          )}
        </div>
      </div>
    </BaseLayout>
  );
}

const Rate = ({size="", value=0}) => {
  const list = Array(5).fill("");
  return (
    <div className={`rate ${size}`}>
      {list.map((item, index) => {
        if (value - index >= 1) {
          return <IoStar key={index} />;
        } else if (value - index == 0.5) {
          return <IoStarHalf key={index} />;
        } else {
          return <IoStarOutline key={index} />;
        }
      })}
    </div>
  )
}

const Rating = ({ data, total }) => {
  return (
    <div className="rating mb-5">
      <h4 style={{ fontWeight: 700 }}>Rating</h4>
      <div className="total d-flex align-items-center">
        <Rate size="lg" value={total} />
        <p>{`(${data['total']} rate${data['total'] > 1 ? 's' : ''})`}</p>
      </div>
      <div className="rate-number d-flex align-items-center">
        <Rate value={5} />
        <p>{`(${data['5_star']} rate${data['5_star'] > 1 ? 's' : ''})`}</p>
      </div>
      <div className="rate-number d-flex align-items-center">
        <Rate value={4} />
        <p>{`(${data['4_star']} rate${data['4_star'] > 1 ? 's' : ''})`}</p>
      </div>
      <div className="rate-number d-flex align-items-center">
        <Rate value={3} />
        <p>{`(${data['3_star']} rate${data['3_star'] > 1 ? 's' : ''})`}</p>
      </div>
      <div className="rate-number d-flex align-items-center">
        <Rate value={2} />
        <p>{`(${data['2_star']} rate${data['2_star'] > 1 ? 's' : ''})`}</p>
      </div>
      <div className="rate-number d-flex align-items-center">
        <Rate value={1} />
        <p>{`(${data['1_star']} rate${data['1_star'] > 1 ? 's' : ''})`}</p>
      </div>
    </div>
  );
}

const Chapters = ({chapters}) => {
  const chaptersOrdered = useMemo(() => {
    return chapters.sort((first, second) => first.order - second.order);
  }, [chapters]);
  const handleTotalTime = (videos=[]) => {
    return videos.reduce((a, b) => {
      return a + b.duration;
    }, 0);
  };
  return (
    <div className="chapters">
      {chaptersOrdered.map((item) => (
        <div key={item.id} className="chapter">
          <div className="d-flex justify-content-between align-items-center chapter-name">
            <p>
              Chapter {item.order}: {item.name}
            </p>
            <p>
              {item.videos.length} {item.videos.length > 0 ? "lectures" : "lecture"} - {new Date(handleTotalTime(item.videos) * 1000).toISOString().substr(11, 8)}
            </p>
          </div>
          <div className="chapter-videos">
            {item.videos.map((video) => (
              <div key={video.id} className="video">
                <div className="d-flex align-items-center">
                  <IoVideocamOutline />
                  <p className="name">{item.order}.{video.order} {video.name}</p>
                </div>
                <p className="time">{new Date(video.duration * 1000).toISOString().substr(11, 8)}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseDetail;
