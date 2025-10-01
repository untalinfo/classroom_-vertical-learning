
import React, { useRef, useEffect } from 'react';
import type { VideoCard } from '../../types';

interface VideoCardProps {
  card: VideoCard;
  isActive: boolean;
}

const VideoCardComponent: React.FC<VideoCardProps> = ({ card, isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(error => {
          console.error("Video play failed:", error);
        });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={card.url}
        className="w-full h-full object-cover"
        loop
        muted
        playsInline
      />
    </div>
  );
};

export default VideoCardComponent;
