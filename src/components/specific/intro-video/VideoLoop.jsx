import React, { useRef, useState, useEffect } from "react";
import video1 from "@/assets/videos/hy-autoever-intro1.mp4";
import video2 from "@/assets/videos/hy-autoever-intro2.mp4";
import video3 from "@/assets/videos/hy-autoever-intro3.mp4";

const videos = [video1, video2, video3];

const VideoLoop = () => {
  const videoRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleEnded = () => {
      // 페이드 아웃 시작
      setFade(false);

      setTimeout(() => {
        // 다음 영상으로 인덱스 변경
        setCurrentIndex((prev) => (prev + 1) % videos.length);
        // 페이드 인 시작
        setFade(true);
      }, 500); // 0.5초 페이드 아웃 지속시간
    };

    videoElement.addEventListener("ended", handleEnded);
    videoElement.play().catch((e) => console.warn("play 실패", e));

    return () => {
      videoElement.removeEventListener("ended", handleEnded);
    };
  }, [currentIndex]);

  return (
    <div className="flex-1 relative rounded-xl overflow-hidden">
      <video
        ref={videoRef}
        src={videos[currentIndex]}
        muted
        controls={false}
        playsInline
        className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default VideoLoop;
