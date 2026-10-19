export default function ProductCard({ model, saved, onDetail, onToggle }) {
  return (
    <article className="product reveal">
      <div className="product-photo">
        <img src={`/assets/${model.image}.jpg`} alt={`${model.name} front and back`} loading="lazy" />
      </div>
      <div className="product-content">
        <div className="dots" aria-label="Example finishes">
          {model.colors.map(color => <i key={color} style={{ background: color }} />)}
        </div>
        <h3>{model.name}</h3><p>{model.copy}</p>
        <div className="product-actions">
          <button className="text-button" onClick={onDetail}>Take a closer look ↗</button>
          <button className="add" onClick={onToggle} aria-pressed={saved}>{saved ? 'Saved ✓' : 'Shortlist +'}</button>
        </div>
      </div>
    </article>
  );
}
