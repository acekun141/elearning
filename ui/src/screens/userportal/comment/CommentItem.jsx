import React, { useContext, useMemo } from "react";
import moment from "moment/moment";
import { IoTrashOutline } from "react-icons/io5";
import { useSelector } from "react-redux";
import { deleteCommentService } from "../../../utils/api/rate";
import { GlobalContext } from "../../../contexts/ContextProvider";

const CommentItem = ({ comment, onDelete }) => {
  const user = useSelector(state => state.user);
  const { action } = useContext(GlobalContext);

  const handleDelete = async () => {
    onDelete(comment.id);
    const {res, err} = await deleteCommentService(comment.id);
    if (err) return action.pushAlert("error", "Cannot delete comment");
  };
  
  const isValidUser = useMemo(() => {
    if (!user) return false;
    return user.id === comment.user.id;
  }, [user, comment]);

  return (
    <div className="comment-item">
      <div className="comment-item__avatar">
        {comment.user.avatar && <img src={`/image/${comment.user.avatar}`} alt="avatar" />}
      </div>
      <div className="comment-item__content">
        <div className="box-message">
          <p className="user">{comment.user.full_name}</p>
          <p className="message">{comment.content}</p>
        </div>
        <p className="time">{moment(comment.create_at).format("MM/DD/YYYY HH:mm")}</p>
      </div>
      {isValidUser && (
        <div className="comment-item__option" onClick={handleDelete}>
          <IoTrashOutline />
        </div> 
      )}
    </div>
  );
}

export default CommentItem;