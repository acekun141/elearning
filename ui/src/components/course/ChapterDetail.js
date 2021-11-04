import { useState } from "react";
import { IoArrowDown, IoArrowUp, IoChevronDown, IoTrashOutline, IoColorWandOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import Videos from "./Videos";


const ChapterDetail = ({item, onMoveDown, onMoveUp, onEdit, onDelete, chapters, callback, isOwner}) => {
  const [isExpanse, setIsExpanse] = useState(false);
  const isActionLoading = useSelector(state => state.common.idLoading);
  const handleExpanse = () => {
    setIsExpanse(prevState => !prevState);
  }
  return (
    <div className="chapter-detail">
      <div className="chapter">
        <p>
          Chapter {item.order}: {item.name}
        </p>
        <div className="chapter__buttons" hidden={!isOwner}>
          <button
            onClick={() => onMoveUp(item.id)}
            disabled={item.order === 1 || isActionLoading}
            className="primary"
          >
            <IoArrowUp />
          </button>
          <button
            onClick={() => onMoveDown(item.id)}
            disabled={item.order === chapters.length || isActionLoading}
            className="primary"
          >
            <IoArrowDown />
          </button>
          <button
            onClick={() => onEdit(item)}
            disabled={isActionLoading}
            className="primary"
          >
            <IoColorWandOutline />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            disabled={isActionLoading}
            className="delete"
          >
            <IoTrashOutline />
          </button>
          <button onClick={handleExpanse} className={`expanse-button ${isExpanse ? "active" : ""}`}>
            <IoChevronDown />
          </button>
        </div>
      </div>
      {isExpanse && <Videos callback={callback} chapterId={item.id} />}
    </div>
  );
}

export default ChapterDetail;
