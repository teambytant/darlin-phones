'use client';

import { useState } from 'react';
import entries from './collection-items.json';
import { models } from './models';
import { accessories } from './accessories';
import EnquireLink from './EnquireLink';

const products = [...models, ...accessories];

function productFor(entry) {
  const product = products.find(item => item.image === entry.product);
  return product ? { ...product, selectedColor: entry.selectedColor } : {
    name: entry.title,
    family: entry.category,
    copy: entry.description,
    detail: entry.description,
    galleryImage: entry.image,
  };
}

export default function CollectionGallery({ onDetail }) {
  const [activeId, setActiveId] = useState(null);
  return <div className="collection-page">
    <section className="collection-grid" aria-label="Darlin's phone and accessory gallery">
      {entries.map((entry, index) => {
        const product = productFor(entry);
        return <article key={entry.id} className={`collection-tile collection-theme-${entry.theme || 'light'}${activeId === entry.id ? ' is-active' : ''}`}
          onPointerEnter={event => { if (event.pointerType === 'mouse') setActiveId(entry.id); }}
          onPointerLeave={event => { if (event.pointerType === 'mouse') setActiveId(null); }}
          onKeyDown={event => { if (event.key === 'Escape') setActiveId(null); }}>
          <button type="button" className="collection-photo" aria-label={`View ${entry.title} details`}
            aria-expanded={activeId === entry.id} aria-controls={`collection-details-${entry.id}`}
            onClick={event => {
              if (event.nativeEvent.pointerType === 'touch' || window.matchMedia('(hover: none)').matches) {
                setActiveId(current => current === entry.id ? null : entry.id);
              } else onDetail(product);
            }}>
            <img src={entry.image} alt={entry.alt} loading={index < 2 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'auto'} style={{ objectFit: entry.fit || 'cover', objectPosition: entry.position || 'center' }} />
          </button>
          <span className="collection-tile-number" aria-hidden="true">{String(entries.indexOf(entry) + 1).padStart(2, '0')} / DARLIN</span>
          <div id={`collection-details-${entry.id}`} className="collection-overlay">
            <p className="collection-tile-category">{entry.category}</p>
            <h2>{entry.title}</h2>
            <p className="collection-tile-description">{entry.description}</p>
            <div className="collection-tile-actions">
              <button type="button" onClick={() => onDetail(product)}>Take a closer look</button>
              <EnquireLink product={`${product.name}${entry.selectedColor ? ` in ${entry.selectedColor}` : ''}`} className="collection-enquire" />
            </div>
          </div>
        </article>;
      })}
      {!entries.length && <p className="collection-empty">New moments are on the way. Check back soon.</p>}
    </section>

    <section className="collection-outro">
      <p className="eyebrow">FOUND SOMETHING YOU LOVE?</p>
      <h2>Let's make it yours.</h2>
      <p>Ask us about your favourite phone or accessory.</p>
      <EnquireLink>Talk to Darlin</EnquireLink>
    </section>
  </div>;
}
