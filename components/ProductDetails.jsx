'use client';

import { useState } from 'react';
import ProductZoom from './ProductZoom';
import StorageOptions from './StorageOptions';
import EnquireLink from './EnquireLink';

export default function ProductDetails({ model }) {
  const [selected, setSelected] = useState(model.selectedColor || model.variants?.[0]?.name);
  const [storage, setStorage] = useState(model.storageOptions?.includes(model.selectedStorage) ? model.selectedStorage : model.storageOptions?.[0]);
  const variants = model.variants || [];
  const finish = variants.find(variant => variant.name === selected) || variants[0];
  const image = model.galleryImage || finish?.image || `/assets/${model.image}.jpg`;
  const product = `${model.name}${storage ? ` ${storage}` : ''}${finish ? ` in ${finish.name}` : ''}`;

  return <div className="product-details">
    <ProductZoom key={image} src={image} alt={product} />
    <div className="product-details-copy">
      <p className="eyebrow">A CLOSER LOOK</p>
      <p className="detail-family">{model.family}</p>
      <h2>{model.name}</h2>
      <p className="detail-tagline">{model.copy}</p>
      {variants.length > 0 && <div className="detail-finishes">
        <p className="detail-finish-label">Colour <strong aria-live="polite">{finish.name}</strong></p>
        <div className="colour-swatches" role="group" aria-label={`${model.name} colours`}>
          {variants.map(variant => <button key={variant.name} type="button" className="colour-swatch"
            style={{ '--swatch-colour': variant.hex }} aria-label={variant.name} title={variant.name}
            aria-pressed={finish.name === variant.name} onClick={() => setSelected(variant.name)}><span /></button>)}
        </div>
      </div>}
      <StorageOptions options={model.storageOptions} selected={storage} onSelect={setStorage} productName={model.name} />
      <p className="detail-description">{model.detail}</p>
      <EnquireLink product={product}>Enquire on WhatsApp</EnquireLink>
      <p className="detail-note">Confirm availability and current pricing with Darlin.</p>
    </div>
  </div>;
}
