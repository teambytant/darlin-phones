'use client';

import { useLayoutEffect, useRef, useState } from 'react';

export default function ProductZoom({ src, alt }) {
  const [zoom, setZoom] = useState(1);
  const viewportRef = useRef(null);
  const previousZoom = useRef(1);
  const drag = useRef(null);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const ratio = zoom / previousZoom.current;
    viewport.scrollLeft = (viewport.scrollLeft + viewport.clientWidth / 2) * ratio - viewport.clientWidth / 2;
    viewport.scrollTop = (viewport.scrollTop + viewport.clientHeight / 2) * ratio - viewport.clientHeight / 2;
    previousZoom.current = zoom;
  }, [zoom]);

  function changeZoom(delta) {
    setZoom(value => Math.min(3, Math.max(1, value + delta)));
  }

  function stopDrag(event) {
    drag.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    event.currentTarget.classList.remove('is-dragging');
  }

  return <section className="product-zoom" aria-label="Product image viewer">
    <div className={`zoom-viewport${zoom > 1 ? ' is-zoomed' : ''}`} ref={viewportRef}
      tabIndex={0} aria-label={`${alt}. ${Math.round(zoom * 100)} percent zoom. Use zoom controls, then scroll or drag to explore.`}
      onDoubleClick={() => setZoom(value => value === 1 ? 2 : 1)}
      onPointerDown={event => {
        if (zoom === 1 || event.pointerType !== 'mouse' || event.button !== 0) return;
        const viewport = event.currentTarget;
        drag.current = { x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop };
        viewport.setPointerCapture(event.pointerId);
        viewport.classList.add('is-dragging');
        event.preventDefault();
      }}
      onPointerMove={event => {
        if (!drag.current) return;
        event.currentTarget.scrollLeft = drag.current.left - (event.clientX - drag.current.x);
        event.currentTarget.scrollTop = drag.current.top - (event.clientY - drag.current.y);
      }}
      onPointerUp={stopDrag} onPointerCancel={stopDrag}
      onLostPointerCapture={event => { drag.current = null; event.currentTarget.classList.remove('is-dragging'); }}>
      <div className="zoom-canvas" style={{ width: `${zoom * 100}%`, height: `${zoom * 100}%` }}>
        <img src={src} alt={alt} draggable="false" />
      </div>
    </div>
    <div className="zoom-toolbar">
      <span className="zoom-hint">{zoom === 1 ? 'Zoom in for the details' : 'Drag or swipe to explore'}</span>
      <div className="zoom-controls" role="group" aria-label="Image zoom controls">
        <button type="button" onClick={() => changeZoom(-0.5)} disabled={zoom === 1} aria-label="Zoom out">&minus;</button>
        <output aria-live="polite" aria-label="Zoom level">{Math.round(zoom * 100)}%</output>
        <button type="button" onClick={() => changeZoom(0.5)} disabled={zoom === 3} aria-label="Zoom in">+</button>
        <button type="button" className="zoom-reset" onClick={() => setZoom(1)} disabled={zoom === 1}>Reset</button>
      </div>
    </div>
  </section>;
}
