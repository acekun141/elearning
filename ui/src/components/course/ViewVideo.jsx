import React, { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import { viewVideoService } from "../../utils/api/video";
import { Modal } from "react-bootstrap";
import dashjs from "dashjs";

const ViewVideoModal = ({ video: data, isShow, onHide }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [video, setVideo] = useState(null);

  useEffect(() => {
    if (!data) return null;
    var video, player, url = `http://localhost:8000/chapter/view-admin-video/${data.id}`;
    video = document.getElementById('videoPlayer');
    player = dashjs.MediaPlayer().create();
    player.extend("RequestModifier", function () {
      return {
        modifyRequestHeader: function (xhr) {
            xhr.setRequestHeader('x-access-token', localStorage.getItem("access_token"));
            return xhr;
        },
        modifyRequestURL: function (url) {
            return url + `?videoid=${data.id}`;
        }
      };
    });
    player.initialize(video, url, false);
  }, [data]);

  // const handleGetVideo = async () => {
  //   setIsLoading(true);
  //   const {res, err} = await viewVideoService(data.filename);
  //   setIsLoading(false);
  //   if (err) return;
  // }

  if (isLoading) return (
    <Modal size="lg" show={isShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Skeleton height={300} />
      </Modal.Body>
    </Modal>
  )

  return (
    <Modal size="lg" show={isShow} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>View Video</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <video
          className="mb-2"
          style={{ width: "100%", height: "auto" }}
          controls
          id="videoPlayer"
        />
      </Modal.Body>
    </Modal>
  );
}

export default ViewVideoModal;