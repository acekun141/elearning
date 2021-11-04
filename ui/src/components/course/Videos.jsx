import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap"
import ModalAddVideo from "./ModalAddVideo";
import LineLoading from "@components/common/LineLoading";
import { getListVideoService } from "../../utils/api/video";
import ViewVideoModal from "./ViewVideo";
import ModalConfirm from "./ModalConfirm";
import { deleteVideoService } from "../../utils/api/course";

const Videos = ({chapterId, callback}) => {
  const [isShowConfirm, setIsShowConfirm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [videos, setVideos] = useState([]);
  const [isShowView, setIsShowView] = useState(null);
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    if (!chapterId) return;
    handleGetVideo();
  }, [chapterId]);

  const handleGetVideo = async () => {
    setIsLoading(true);
    const {res, err} = await getListVideoService(chapterId);
    setIsLoading(false);
    if (err) return;
    setVideos(res.videos);
  };

  const videoCallback = async () => {
    const {res, err} = await getListVideoService(chapterId);
    if (err) return;
    setVideos(res.videos);
  };

  const handleShowView = (item) => {
    setIsShowView(item);
  };

  const handleDelete = async () => {
    await deleteVideoService(isShowConfirm.id);
    videoCallback();
    setIsShowConfirm(null);
  };

  if (isLoading) return (
    <div className="d-flex justify-content-center">
      <LineLoading />
    </div>
  )

  return (
    <div className="videos">
      <ModalAddVideo callback={videoCallback} video={isShowModal} chapterId={chapterId} isShow={isShowModal} onHide={() => setIsShowModal(false)} />
      <ModalConfirm
        content={`Do you want to delete this video?`}
        onConfirm={handleDelete}
        isShow={isShowConfirm}
        onHide={() => setIsShowConfirm(false)}
      />
      {!!isShowView && (<ViewVideoModal isShow={!!isShowView} onHide={() => setIsShowView(null)} video={isShowView} />)}
      <div className="videos__content">
        {videos.map(item => (
          <div className="videos__video" key={item.id}>
            <div className="video-name">
              <p className="name">{item.chapter.order}.{item.order} {item.name}</p>
              <p className="time">{new Date(item.duration * 1000).toISOString().substr(11, 8)}</p>
            </div>
            <div className="video-actions">
              <button onClick={() => handleShowView(item)}>View</button>
              {/* <button>Edit</button> */}
              <button onClick={() => setIsShowConfirm(item)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center button-wrapper">
        <Button onClick={() => setIsShowModal(true)} variant="outline-primary" size="sm">Add Video</Button>
      </div>
    </div>
  );
}

export default Videos;