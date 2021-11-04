import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { getCourseCommentService } from "../../../utils/api/rate";
import CommentInput from "./CommentInput";
import LineLoading from "@components/common/LineLoading";
import CommentItem from "./CommentItem";

const Comment = ({ courseId, isBought }) => {
  const [isLoadMore, setIsLoadMore] = useState(true);
  const [comments, setComments] = useState([]);
  const [pagingData, setPagingData] = useState({ page: 1, has_next: false });

  useEffect(() => {
    handleGetComment();
  }, [courseId]);

  const handleGetComment = async (page=1) => {
    setIsLoadMore(true);
    const {res, err} = await getCourseCommentService(courseId, page);
    setIsLoadMore(false);
    if (err) return;
    if (page > 1) {
      setComments(prevState => [ ...prevState, ...res.comments]);
    } else {
      setComments(res.comments);
    }
    setPagingData({ has_next: res.has_next, page: res.current_page });
  };

  const handleLoadMore = () => {
    if (pagingData.has_next) {
      handleGetComment(pagingData.page+1);
    }
  };

  const handleDelete = (id) => {
    setComments(prevState => prevState.filter(item => item.id !== id));
  };

  const handleComment = (item) => {
    setComments(prevState => [item, ...prevState]);
  }

  return (
    <div className="comment card">
      {isBought && <CommentInput onComment={handleComment} courseId={courseId} />}
      {comments.length === 0 && <p className="text-center">No reviews yet</p>}
      {comments.map(item => <CommentItem key={item.id} comment={item} onDelete={handleDelete} />)}
      {isLoadMore && (
        <div className="d-flex justify-content-center">
          <LineLoading />
        </div>
      )}
      {!isLoadMore && pagingData.has_next && (
        <div className="d-flex justify-content-center">
          <Button onClick={handleLoadMore} size="sm" variant="dark">Load More</Button>
        </div>
      )}
    </div>
  );
}

export default Comment;