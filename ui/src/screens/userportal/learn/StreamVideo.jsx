import React, { useEffect } from "react"
import dashjs from "dashjs";

const StreamVideo = ({ video: data }) => {

  useEffect(() => {
    if (!data) return null;
    var video, player, url = `https://leeminhung.space:8000/chapter/view-admin-video/${data.id}`;
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

  if (!data) return (
    <div className="stream-video null">
      <img src="/robot.png" alt="empty-icon" />
    </div>
  )

  return (
    <div className="stream-video">
      <video
        className="mb-2"
        controls
        id="videoPlayer"
        autoPlay={true}
      />
      <p>{data.chapter.order}.{data.order} {data.name}</p>
    </div>
  );
}

export default StreamVideo;