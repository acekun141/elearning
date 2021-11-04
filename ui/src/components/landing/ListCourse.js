import React from "react";
import { useContext, Fragment } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { IoChevronForward, IoChevronBack, IoStarOutline, IoStar, IoStarHalf } from "react-icons/io5";
import { useHistory } from "react-router-dom";
import { currencyValue } from "../../utils/num";

const ListCourse = ({ items, label }) => {
  return (
    <div className="list-course">
      <h3>{label}</h3>
      <div className="list-course__content">
        <ScrollMenu wrapperClassName="list-course-scroll" LeftArrow={LeftArrow} RightArrow={RightArrow}>
          {items.map((item, index) => <Course data={item} key={item.id} itemId={index} />)}
        </ScrollMenu>
      </div>
    </div>
  );
}

const LeftArrow = () => {
  const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
  return (
    <button className="left-arrow arrow" disabled={isFirstItemVisible} onClick={() => scrollPrev()}>
      <IoChevronBack />
    </button>
  );
}

const RightArrow = () => {
  const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
  return (
    <button className="right-arrow arrow" disabled={isLastItemVisible} onClick={() => scrollNext()}>
      <IoChevronForward />
    </button>
  );
}

const Course = ({ data, itemId }) => {
  const visibility = React.useContext(VisibilityContext);

  const visible = visibility.isItemVisible(itemId);
  const history = useHistory();

  const goToCourse = (id) => {
    history.push(`/course/${id}`);
  };
  return (
    <div className="course-item" tabIndex={0}>
      <div className="course-item__cover-wrapper">
        <img src={`/api/image/${data.cover}`} alt="cover" />
      </div>
      <div className="course-item__content">
        <p className="course-item__name" onClick={() => goToCourse(data.id)}>{data.name}</p>
        <p className="course-item__category">{data.course_type}</p>
        <div className="course-item__rate">
          <Rate value={data.total_rate} />
          <p>{`(${data.rate_detail['total']} rate${data.rate_detail['total'] > 1 ? 's' : ''})`}</p>
        </div>
        <div className="course-item__user" onClick={() => history.push(`/teacher/${data.create_by_id}`)}>
          <img src={`/api/image/${data.user_avatar}`} alt="avatar" />
          <p className="course-item__user">{data.create_by}</p>
        </div>
        <div className="course-item__price">
          {data.discount ? (
            <Fragment>
              <p className="price"><s>{currencyValue(data.price)}</s></p>
              <p className="new-price">{currencyValue(data.price - data.discount)}</p>
            </Fragment>
          ) : (
            <p className={data.price > 0 ? "" : "free"}>{data.price > 0 ? currencyValue(data.price) : "Free"}</p>
          )}
        </div>
      </div>
    </div>
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

export default ListCourse;