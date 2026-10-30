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
    let disposed = false;
    let pending = false;
    let frame = 0;

    // Set both DOM properties and attributes before requesting playback.
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');

    function tryPlayback() {
      if (disposed || document.hidden || pending || !video.paused) return;
      video.muted = true;
      pending = true;
      Promise.resolve(video.play()).catch(() => {
        // Mobile autoplay may need readiness, visibility, or a user gesture.
        // The listeners below retry at those points without a polling loop.
      }).finally(() => { pending = false; });
    }

    function resumeVisiblePage() {
      if (!document.hidden) tryPlayback();
    }

    const readinessEvents = ['loadedmetadata', 'loadeddata', 'canplay'];
    const gestureEvents = ['pointerdown', 'touchstart', 'keydown'];
    readinessEvents.forEach(event => video.addEventListener(event, tryPlayback));
    gestureEvents.forEach(event => document.addEventListener(event, tryPlayback, { capture: true, passive: true }));
    document.addEventListener('visibilitychange', resumeVisiblePage);
    window.addEventListener('pageshow', resumeVisiblePage);

    const observer = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      // Let scroll-reveal styles update before Safari checks visibility.
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(tryPlayback);
    }, { threshold: 0.01 });
    observer.observe(video);
    tryPlayback();

    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      readinessEvents.forEach(event => video.removeEventListener(event, tryPlayback));
      gestureEvents.forEach(event => document.removeEventListener(event, tryPlayback, true));
      document.removeEventListener('visibilitychange', resumeVisiblePage);
      window.removeEventListener('pageshow', resumeVisiblePage);
    };
  }, [src]);

  return <div className={`${className} embedded-video`}>
    <video ref={videoRef} src={src} poster={poster} autoPlay muted loop playsInline
      preload="auto" aria-label={label} disablePictureInPicture />
  </div>;
}
