import { Fragment } from "react";
import { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { currencyValue } from "../../utils/num";
import { IoStarOutline, IoStarHalf, IoStar } from "react-icons/io5";

const CourseItem = ({ item, isAdmin }) => {
  const history = useHistory();

  const isFree = useMemo(() => {
    if (item.price === 0 && item.discount === 0) return true;
    if (item.discount === 100) return true;
    return false;
  }, [item.price, item.discount]);

  const goToCourse = (id) => {
    if (isAdmin) {
      history.push(`/admin/course/${id}`);
    } else {
      history.push(`/course/${id}`);
    }
  };
  
  const goTeacherDetail = (id) => {
    history.push(`/teacher/${id}`);
  }

  return (
    <div className="course-item">
      <div className="course-item__cover-wrapper">
        <img src={`/api/image/${item.cover}`} alt="cover" />
      </div>
      <div className="course-item__content">
        <p className="course-item__name" onClick={() => goToCourse(item.id)}>{item.name}</p>
        <p className="course-item__category">{item.course_type}</p>
        <div className="course-item__rate">
          <Rate value={item.total_rate} />
          <p>{`(${item.rate_detail['total']} rate${item.rate_detail['total'] > 1 ? 's' : ''})`}</p>
        </div>
        <div className="course-item__user" onClick={() => goTeacherDetail(item.create_by_id)}>
          <img src={`/api/image/${item.user_avatar}`} alt="avatar" />
          <p className="course-item__user">{item.create_by}</p>
        </div>
        <div className="course-item__price">
          {item.discount ? (
            <Fragment>
              <p className="price"><s>{currencyValue(item.price)}</s></p>
              <p className="new-price">{currencyValue(item.price - item.discount)}</p>
            </Fragment>
          ) : (
            <p className={item.price > 0 ? "" : "free"}>{item.price > 0 ? currencyValue(item.price) : "Free"}</p>
          )}
        </div>
      </div>
    </div>
  )
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
};

export default CourseItem;