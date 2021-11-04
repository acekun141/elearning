import React, { useEffect } from "react";
import dashjs from "dashjs";

const PublicVideo = ({ video_id }) => {

  useEffect(() => {
    if (!video_id) return null;
    var video, player, url = `https://leeminhung.space:8000/chapter/view-preview/${video_id}`;
    video = document.getElementById('videoPlayer');
    player = dashjs.MediaPlayer().create();
    player.extend("RequestModifier", function () {
      return {
        modifyRequestHeader: function (xhr) {
            xhr.setRequestHeader('x-access-token', localStorage.getItem("access_token"));
            return xhr;
        },
        modifyRequestURL: function (url) {
            return url + `?videoid=${video_id}`;
        }
      };
    });
    player.initialize(video, url, false);
  }, [video_id]);

	return (
		<div className="view-public-video">
      <video
        className="mb-2"
        controls
        id="videoPlayer"
        autoPlay={true}
      />
		</div>
	);
}

export default PublicVideo;
