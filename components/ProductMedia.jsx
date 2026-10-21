'use client';

export default function ProductMedia({ model, selected, onSelect }) {
  const variants = model.variants || [];
  const finish = variants.find(variant => variant.name === selected) || variants[0];
  return <div className={`product-media${finish ? ' has-finishes' : ''}`}>
    <div className="product-photo">
      <img key={finish?.image || model.image} className="variant-image" src={finish?.image || `/assets/${model.image}.jpg`} alt={`${model.name}${finish ? ` in ${finish.name}` : ''}`} loading="lazy" />
    </div>
    {variants.length > 0 && <div className="colour-options">
      <div className="colour-swatches" role="group" aria-label={`${model.name} colours`}>
        {variants.map(variant => <button key={variant.name} type="button" className="colour-swatch" style={{ '--swatch-colour': variant.hex }} aria-label={variant.name} title={variant.name} aria-pressed={finish.name === variant.name} onClick={() => onSelect(variant.name)}><span /></button>)}
      </div>
      <p className="selected-colour" aria-live="polite">{finish.name}</p>
    </div>}
  </div>;
}
