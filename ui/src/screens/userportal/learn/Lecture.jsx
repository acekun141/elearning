import React, { useEffect } from "react";
import { IoVideocamOutline } from "react-icons/io5";

const Lecture = ({ video, data, onSelectVideo }) => {
  useEffect(() => {
    const chapters = data.sort((a, b) => a.order - b.order);
    if (chapters.length) {
      const videos = chapters[0].videos;
      if (videos.length) {
        onSelectVideo(videos[0]);
      }
    }
  }, []);
  return (
    <div className="lecture">
      <Chapter chapters={data} onSelectVideo={onSelectVideo} video={video} />
    </div>
  );
}

const Chapter = ({ chapters, onSelectVideo, video }) => {
  return (
    chapters.sort((a, b) => a.order - b.order).map(item => (
      <div key={item.id} className="chapter">
        <p className="chapter__name">Chapter {item.order}: {item.name}</p>
        <Video video={video} videos={item.videos} onSelectVideo={onSelectVideo} />
      </div>
    ))
  );
}

const Video = ({ videos, onSelectVideo, video }) => {
  return (
    videos.map(item => (
      <div key={item.id} className={`video ${video.id === item.id ? "active" : ""}`} onClick={() => onSelectVideo(item)}>
        {/* <IoVideocamOutline /> */}
        <p className="video__name">{item.chapter.order}.{item.order} {item.name}</p>
        <p className="time">{new Date(item.duration * 1000).toISOString().substr(11, 8)}</p>
      </div>
    ))
  )
}

export default Lecture;