import { models } from './models';
import EnquireLink from './EnquireLink';
import ProductDetails from './ProductDetails';

export default function CollectionDialog({ modal }) {
  if (!modal) return null;
  if (modal.type === 'model') {
    const { model } = modal;
    return <ProductDetails key={`${model.name}-${model.selectedColor || ''}`} model={model} />;
  }
  if (modal.type === 'accessory') return <><p className="eyebrow">THE FINISHING TOUCH</p><h2>{modal.name}</h2><p>{modal.name === 'AirTag' ? 'Explore AirTag and key ring accessories for the things you take everywhere.' : 'Find a case, charging setup, or MagSafe accessory to complement your iPhone. Confirm compatibility with your exact model.'} Ask Darlin to confirm available products and prices.</p><EnquireLink product={modal.name} /></>;
  if (modal.type === 'compare') return <><p className="eyebrow">THE COLLECTION AT A GLANCE</p><h2>Which one feels like you?</h2><div className="compare-grid">{models.map(model => <article key={model.name}><img src={`/assets/${model.image}.jpg`} alt={model.name} loading="lazy" /><h3>{model.name}</h3><p>{model.copy}</p><EnquireLink product={model.name} className="text-button" /></article>)}</div><p>Ask Darlin for exact specifications, available configurations, and current prices.</p></>;
  return null;
}
