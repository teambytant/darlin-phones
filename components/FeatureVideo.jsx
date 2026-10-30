'use client';

import { useEffect, useRef } from 'react';

export default function FeatureVideo({
  src = '/assets/iphone-18-pro-camera.mp4',
  poster = '/assets/camera.jpg',
  label = 'iPhone Pro camera showcase',
  className = 'camera',
}) {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    video.play().catch(() => {});
  }, [src]);

  return <div className={`${className} embedded-video`}>
    <video ref={videoRef} src={src} poster={poster} autoPlay muted loop playsInline
      preload="auto" aria-label={label} disablePictureInPicture />
  </div>;
}
