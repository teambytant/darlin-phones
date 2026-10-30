'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';

export default function LineupCarousel({ models, onDetail }) {
  const trackRef = useRef(null);
  const [active, setActive] = useState(0);
  const [canScroll, setCanScroll] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    function syncPosition() {
      const cards = [...track.children];
      const start = cards[0]?.offsetLeft || 0;
      const closest = cards.reduce((best, card, index) =>
        Math.abs(card.offsetLeft - start - track.scrollLeft) <
        Math.abs(cards[best].offsetLeft - start - track.scrollLeft) ? index : best, 0);
      setActive(closest);
      setCanScroll(track.scrollWidth > track.clientWidth + 1);
    }
    syncPosition();
    track.addEventListener('scroll', syncPosition, { passive: true });
    const observer = new ResizeObserver(syncPosition);
    observer.observe(track);
    return () => {
      track.removeEventListener('scroll', syncPosition);
      observer.disconnect();
    };
  }, []);

  function goTo(index) {
    const track = trackRef.current;
    const card = track.children[index];
    if (!card) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    track.scrollTo({ left: card.offsetLeft - track.children[0].offsetLeft, behavior: reduced ? 'instant' : 'smooth' });
  }

  return <div className="lineup-carousel" role="region" aria-roledescription="carousel" aria-label="Featured iPhone models">
    <div ref={trackRef} className="product-grid" id="products">
      {models.map(model => <ProductCard key={model.name} model={model} onDetail={onDetail} />)}
    </div>
    {canScroll && <div className="lineup-carousel-controls">
      <div className="lineup-slide-position" aria-live="polite" aria-atomic="true">
        <span className="lineup-slide-current">{String(active + 1).padStart(2, '0')}</span>
        <span className="lineup-slide-divider" aria-hidden="true" />
        <span className="lineup-slide-total"><span className="sr-only">of </span>{String(models.length).padStart(2, '0')}</span>
      </div>
      <div className="lineup-arrow-group" role="group" aria-label="Carousel navigation">
        <button type="button" className="lineup-arrow lineup-arrow-back" aria-label="Previous iPhone" aria-controls="products" disabled={active === 0} onClick={() => goTo(active - 1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m14 6-6 6 6 6M8 12h12" /></svg>
        </button>
        <button type="button" className="lineup-arrow lineup-arrow-next" aria-label="Next iPhone" aria-controls="products" disabled={active === models.length - 1} onClick={() => goTo(active + 1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m10 6 6 6-6 6M4 12h12" /></svg>
        </button>
      </div>
    </div>}
  </div>;
}
