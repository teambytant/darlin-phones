'use client';

import { useState } from 'react';
import ProductMedia from './ProductMedia';
import EnquireLink from './EnquireLink';

export default function ProductDetails({ model }) {
  const [selected, setSelected] = useState(model.selectedColor || model.variants?.[0]?.name);
  return <div className="product-details">
    <p className="eyebrow">A CLOSER LOOK</p><h2>{model.name}</h2>
    <ProductMedia model={model} selected={selected} onSelect={setSelected} />
    <p>{model.detail}</p>
    <EnquireLink product={`${model.name}${selected ? ` in ${selected}` : ''}`} />
  </div>;
}
