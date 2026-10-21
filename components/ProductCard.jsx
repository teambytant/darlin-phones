'use client';

import { useState } from 'react';
import EnquireLink from './EnquireLink';
import ProductMedia from './ProductMedia';

export default function ProductCard({ model, onDetail, reveal = true }) {
  const [selected, setSelected] = useState(model.variants?.[0]?.name);
  const product = `${model.name}${selected ? ` in ${selected}` : ''}`;
  return (
    <article className={`product${reveal ? ' reveal' : ''}`}>
      <ProductMedia model={model} selected={selected} onSelect={setSelected} />
      <div className="product-content">
        <h3>{model.name}</h3><p>{model.copy}</p>
        <div className="product-actions">
          <button className="text-button" onClick={() => onDetail({ ...model, selectedColor: selected })}>Take a closer look</button>
          <EnquireLink product={product} className="add" />
        </div>
      </div>
    </article>
  );
}
