'use client';

import { useEffect, useRef, useState } from 'react';

export default function FeatureVideo({
  id = 'camera-video',
  src = '/assets/iphone-18-pro-camera.mp4',
  poster = '/assets/camera.jpg',
  label = 'iPhone 18 Pro camera showcase',
  className = 'camera',
}) {
  const videoRef = useRef(null);
  const userPaused = useRef(false);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    function syncPlayback() {
      if (!visible || preference.matches || userPaused.current) video.pause();
      else video.play().catch(() => setPaused(true));
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }, { threshold: 0.15 });
    observer.observe(video);
    preference.addEventListener('change', syncPlayback);
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', syncPlayback);
    };
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    userPaused.current = !video.paused;
    if (video.paused) video.play().catch(() => setPaused(true));
    else video.pause();
  }

  return <div className={className}>
    <video id={id} ref={videoRef} muted loop playsInline preload="metadata" poster={poster} aria-label={label} onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
      <source src={src} type="video/mp4" />
      Your browser does not support embedded video.
    </video>
    <button className="hero-playback" aria-controls={id} aria-label={`${paused ? 'Play' : 'Pause'} ${label}`} onClick={togglePlayback}>{paused ? '\u25b6' : '\u2161'}</button>
  </div>;
}
