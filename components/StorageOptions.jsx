'use client';

export default function StorageOptions({ options = [], selected, onSelect, productName, compact = false }) {
  if (!options.length) return null;

  return <fieldset className={`storage-options${compact ? ' storage-options-compact' : ''}`}>
    <legend>Storage <strong aria-live="polite">{selected}</strong></legend>
    <div className="storage-choices">
      {options.map(size => <button key={size} type="button" aria-label={`${productName} ${size} storage`}
        aria-pressed={selected === size} onClick={() => onSelect(size)}>{size}</button>)}
    </div>
  </fieldset>;
}
