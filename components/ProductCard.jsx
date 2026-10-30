'use client';

import { useState } from 'react';
import EnquireLink from './EnquireLink';
import ProductMedia from './ProductMedia';
import StorageOptions from './StorageOptions';

export default function ProductCard({ model, onDetail, reveal = true }) {
  const [selected, setSelected] = useState(model.variants?.[0]?.name);
  const [storage, setStorage] = useState(model.storageOptions?.[0]);
  const product = `${model.name}${storage ? ` ${storage}` : ''}${selected ? ` in ${selected}` : ''}`;
  return (
    <article className={`product${reveal ? ' reveal' : ''}`}>
      <ProductMedia model={model} selected={selected} onSelect={setSelected} />
      <div className="product-content">
        <span className="product-family">{model.family}</span><h3>{model.name}</h3><p>{model.copy}</p>
        <StorageOptions options={model.storageOptions} selected={storage} onSelect={setStorage} productName={model.name} compact />
        <div className="product-actions">
          <button className="text-button" onClick={() => onDetail({ ...model, selectedColor: selected, selectedStorage: storage })}>Take a closer look</button>
          <EnquireLink product={product} className="add" />
        </div>
      </div>
    </article>
  );
}
