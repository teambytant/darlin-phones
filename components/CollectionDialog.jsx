import { models } from './models';

export default function CollectionDialog({ modal, saved, toggleSaved, close, notify, enquiryRef }) {
  if (!modal) return null;
  const saveButton = name => <button className="button" aria-pressed={saved.includes(name)} onClick={() => toggleSaved(name)}>{saved.includes(name) ? 'Remove from shortlist' : 'Add to shortlist +'}</button>;
  if (modal.type === 'model') {
    const { model } = modal;
    return <><p className="eyebrow">A CLOSER LOOK</p><h2>{model.name}</h2><img src={`/assets/${model.image}.jpg`} alt={model.name} /><p>{model.detail}</p>{saveButton(model.name)}</>;
  }
  if (modal.type === 'accessory') return <><p className="eyebrow">THE FINISHING TOUCH</p><h2>{modal.name}</h2><p>{modal.name === 'AirTag' ? 'Explore AirTag and key ring accessories for the things you take everywhere.' : 'Find a case, charging setup, or MagSafe accessory to complement your iPhone. Confirm compatibility with your exact model.'} Ask Darlin to confirm available products and prices.</p>{saveButton(modal.name)}</>;
  if (modal.type === 'compare') return <><p className="eyebrow">THE COLLECTION AT A GLANCE</p><h2>Which one feels like you?</h2><div className="compare-grid">{models.map(model => <article key={model.name}><img src={`/assets/${model.image}.jpg`} alt={model.name} /><h3>{model.name}</h3><p>{model.copy}</p><button className="text-button" onClick={() => toggleSaved(model.name)}>{saved.includes(model.name) ? 'Remove from shortlist' : 'Shortlist +'}</button></article>)}</div><p>Ask Darlin for exact specifications, available configurations, and current prices.</p></>;
  const enquiry = `Hello Darlin! I’m interested in ${saved.join(', ')}. Please confirm availability, finishes, storage options, and current prices.`;
  async function copyEnquiry() {
    try { await navigator.clipboard.writeText(enquiry); notify('Enquiry copied'); }
    catch { enquiryRef.current?.select(); notify('Select and copy your enquiry'); }
  }
  return <><p className="eyebrow">YOUR FAVOURITES, TOGETHER</p><h2>Your shortlist.</h2>{saved.length ? <>{saved.map(name => <div className="short-row" key={name}><span>{name}</span><button onClick={() => toggleSaved(name)}>Remove ×</button></div>)}<p>Copy this enquiry and share it with Darlin through your preferred contact channel.</p><textarea ref={enquiryRef} aria-label="Your enquiry" readOnly value={enquiry} /><button className="button" onClick={copyEnquiry}>Copy enquiry ↗</button></> : <><p>A fresh start. Explore the collection and save anything that catches your eye.</p><a className="button" href="#lineup" onClick={close}>Explore iPhone ↗</a></>}</>;
}
