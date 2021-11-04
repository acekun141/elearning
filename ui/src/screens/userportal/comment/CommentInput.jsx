import React, { useContext, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { GlobalContext } from "../../../contexts/ContextProvider";
import { commentService } from "../../../utils/api/rate";

const CommentInput = ({ courseId, onComment }) => {
  const [content, setContent] = useState("");
  const user = useSelector(state => state.user);
  const { action } = useContext(GlobalContext);


  const shortName = useMemo(() => {
    return user.first_name.charAt(0) + user.last_name.charAt(0);
  }, [user]);

  const onSubmit = async (event) => {
    event.preventDefault();
    const {res, err} = await commentService(courseId, content);
    if (err) return action.pushAlert("error", err);
    onComment(res.comment);
    setContent("");
  };

  return (
    <form onSubmit={onSubmit} className="comment-input p-0 mb-5">
      {user.avatar ? <img src={`/image/${user.avatar}`} alt="avatar" /> : <div className="short-name">{shortName}</div>}
      <input placeholder="Write a comment" value={content} onChange={event => setContent(event.target.value)} />
      <button type="submit" disabled={!content} hidden={true} />
    </form>
  );
}

export default CommentInput;