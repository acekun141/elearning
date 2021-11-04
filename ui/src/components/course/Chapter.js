import { useContext, useEffect, useMemo, useState } from "react";
import { IoAdd } from "react-icons/io5";
import { deleteChapterService, getAllChapterService, moveDownChapterService, moveUpChapterService } from "../../utils/api/course";
import AddChapterModal from "./AddChapterModal";
import { GlobalContext } from "@contexts/ContextProvider";
import Skeleton from "react-loading-skeleton";
import { useDispatch, useSelector } from "react-redux";
import { loadingOff, loadingOn } from "../../redux/reducers/common/action";
import ModalConfirm from "./ModalConfirm";
import ChapterDetail from "./ChapterDetail";

const Chapter = ({ courseId, isOwner }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isShowAdd, setIsShowAdd] = useState(false);
  const [isShowDelete, setIsShowDelete] = useState(false);
  const [chapters, setChapters] = useState([]);
  const isActionLoading = useSelector(state => state.common.isLoading);
  const { action } = useContext(GlobalContext);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCourse();
  }, []);

  const addCallback = async () => {
    const { res, err } = await getAllChapterService(courseId);
    setIsShowAdd(false);
    if (err) return;
    setChapters(res.chapters);
  }

  const deleteChapter = async () => {
    dispatch(loadingOn())
    const {res, err} = await deleteChapterService(isShowDelete);
    if (err) return action.pushAlert("error", err);
    addCallback();
    setIsShowDelete(false);
    dispatch(loadingOff());
  };

  const getAllCourse = async () => {
    setIsLoading(true);
    const { res, err } = await getAllChapterService(courseId);
    setIsLoading(false);
    if (err) return action.pushAlert("error");
    return setChapters(res.chapters);
  };

  const callback = async () => {
    const { res, err } = await getAllChapterService(courseId);
    if (err) return action.pushAlert("error");
    return setChapters(res.chapters);
  }

  const onMoveUp = async (id) => {
    dispatch(loadingOn());
    const {err} = await moveUpChapterService(id);
    if (err) {
      dispatch(loadingOff());
      return action.pushAlert("error", err);
    }
    const {res, err: getError} = await getAllChapterService(courseId);
    if (err) {
      dispatch(loadingOff());
      return action.pushAlert("error", getError);
    }
    dispatch(loadingOff())
    setChapters(res.chapters);
  };

  const onMoveDown = async (id) => {
    dispatch(loadingOn());
    const {err} = await moveDownChapterService(id);
    if (err) {
      dispatch(loadingOff());
      return action.pushAlert("error", err);
    }
    const {res, err: getError} = await getAllChapterService(courseId);
    if (err) {
      dispatch(loadingOff());
      return action.pushAlert("error", getError);
    }
    dispatch(loadingOff())
    setChapters(res.chapters);
  };

  const chaptersOrdered = useMemo(() => {
    return chapters.sort((first, second) => first.order - second.order);
  }, [chapters]);

  if (isLoading) return (
    <div className="admin-course-detail__chapter">
      <Skeleton count={5} height={55} className="mb-2 rounded-16" />
    </div>
  )

  return (
    <div className="admin-course-detail__chapter">
      <AddChapterModal
        courseId={courseId}
        callback={addCallback}
        isOpen={isShowAdd}
        onHide={() => setIsShowAdd(false)}
      />
      <ModalConfirm
        isShow={isShowDelete}
        onConfirm={deleteChapter}
        onHide={() => setIsShowDelete(false)}
        content="Are you want to delete this chapter?"
        confirmLabel="Delete"
      />
      <div className="title">
        <p>Chapter</p>
        <button hidden={!isOwner} onClick={() => setIsShowAdd(true)}>
          <IoAdd />
          Add
        </button>
      </div>
      <div className="chapter__content">
        {chaptersOrdered.map((item) => (
          <ChapterDetail
						isOwner={isOwner}
            callback={callback}
            key={item.id}
            chapters={chapters}
            item={item}
            onMoveDown={onMoveDown}
            onMoveUp={onMoveUp}
            onEdit={() => setIsShowAdd(item)}
            onDelete={() => setIsShowDelete(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default Chapter;
