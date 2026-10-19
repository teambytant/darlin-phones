'use client';

import { useEffect, useRef, useState } from 'react';
import ProductCard from './ProductCard';
import CollectionDialog from './CollectionDialog';
import { models } from './models';

const validNames = [...models.map(model => model.name), 'Cases & charging', 'AirTag'];

export default function Showcase() {
  const [saved, setSaved] = useState([]);
  const [storageReady, setStorageReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const dialogRef = useRef(null);
  const enquiryRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('darlin-shortlist') || '[]');
      if (Array.isArray(stored)) setSaved([...new Set(stored.filter(name => validNames.includes(name)))]);
    } catch {}
    setStorageReady(true);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    if (storageReady) {
      try { localStorage.setItem('darlin-shortlist', JSON.stringify(saved)); } catch {}
    }
  }, [saved, storageReady]);

  useEffect(() => {
    if (modal && !dialogRef.current.open) dialogRef.current.showModal();
    if (!modal && dialogRef.current.open) dialogRef.current.close();
  }, [modal]);

  function notify(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }
  function toggleSaved(name) {
    const exists = saved.includes(name);
    setSaved(current => current.includes(name) ? current.filter(item => item !== name) : [...current, name]);
    notify(exists ? 'Removed from your shortlist' : 'Added to your shortlist');
  }
  function openModal(value) { setModal(value); }
  function closeModal() { setModal(null); }

  return <>

<header><a className="brand" href="#"><span className="brandmark">d.</span><span>DARLIN<span className="brand-sub">PHONES & ACCESSORIES</span></span></a><nav className={menuOpen ? "open" : ""} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><a href="#lineup">iPhone</a><a href="#accessories">Accessories</a><a href="#darlin">Why Darlin</a></nav><button className="saved" id="open-saved" onClick={() => openModal({type: "shortlist"})}>Your shortlist <span id="count">{saved.length}</span></button><button className="menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button></header>
<div className="ribbon">A little upgrade. A whole new world. <a href="#lineup">Find your iPhone <span>↗</span></a></div>
<main><section className="intro"><div><p className="eyebrow">MEET YOUR NEXT CHAPTER</p><h1>iPhone.<br className="mobile" /> So you.</h1></div><p>Big possibilities.<br />One beautiful place to begin.</p></section>
<section className={`hero${paused ? " paused" : ""}`} aria-labelledby="hero-title"><div className="hero-copy"><span className="tag">THE PRO COLLECTION</span><h2 id="hero-title">Extraordinary.<br />From every angle.</h2><p>Meet iPhone 18 Pro. Made for your next big thing.</p><a className="button light" href="#lineup">Explore iPhone <span>↗</span></a></div><img src="/assets/hero.jpg" alt="Burgundy iPhone 18 Pro with a striking metallic Pro backdrop" fetchPriority="high" /><div className="hero-bottom"><span>iPhone 18 Pro</span><span>A closer look changes everything.</span><button id="motion" aria-pressed={paused} aria-label={paused ? "Resume gentle hero motion" : "Pause gentle hero motion"} onClick={() => setPaused(!paused)}>{paused ? "\u25b6" : "\u2161"}</button></div></section>
<section id="lineup" className="section lineup"><div className="section-head reveal"><div><p className="eyebrow">FIND YOUR PERFECT FIT</p><h2>Different personalities.<br />All iPhone.</h2></div><button className="text-button" id="compare" onClick={() => openModal({type: "compare"})}>Compare the collection ↗</button></div><div className="product-grid" id="products">{models.map(model => <ProductCard key={model.name} model={model} saved={saved.includes(model.name)} onDetail={() => openModal({type: 'model', model})} onToggle={() => toggleSaved(model.name)} />)}</div><p className="availability">Explore the collection. Ask Darlin to confirm available models, finishes, and current prices.</p></section>
<section className="feature reveal"><div className="feature-copy"><p className="eyebrow">A FRESH PERSPECTIVE</p><h2>Your everyday.<br />Anything but ordinary.</h2><p>The little details. The big moments. A camera that makes you want to capture them all.</p><button className="text-button" onClick={() => openModal({type: "model", model: models[0]})}>Discover the Pro collection ↗</button></div><div className="camera"><img src="/assets/camera.jpg" alt="Close-up of the burgundy iPhone Pro camera lenses" loading="lazy" /></div></section>
<section id="accessories" className="section"><div className="section-head reveal"><div><p className="eyebrow">THE PERFECT PLUS-ONE</p><h2>Make it yours.</h2></div><span className="section-caption">Small additions. Big personality.</span></div><div className="accessory-grid"><article className="accessory reveal"><div><p className="eyebrow">CASES & CHARGING</p><h3>Good looks.<br />Great company.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "Cases & charging"})}>Explore essentials ↗</button></div><img src="/assets/accessories.jpg" alt="A collection of iPhone cases and MagSafe accessories" loading="lazy" /></article><article className="accessory reveal"><div><p className="eyebrow">AIRTAG</p><h3>Keep your favourites.<br />Close.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "AirTag"})}>Explore AirTag ↗</button></div><img src="/assets/airtag.jpg" alt="AirTag with colourful key ring accessories" loading="lazy" /></article></div></section>
<section id="darlin" className="darlin section"><p className="eyebrow reveal">THE DARLIN WAY</p><h2 className="reveal">Great phones.<br />A more personal experience.</h2><div className="benefits"><article className="reveal"><span>01 / DISCOVER</span><h3>A little clarity.<br />A better choice.</h3><p>Explore the collection at your pace and find the iPhone that feels right for you.</p></article><article className="reveal"><span>02 / PERSONALISE</span><h3>The details<br />make it yours.</h3><p>Bring your setup together with cases, charging essentials, and everyday extras.</p></article><article className="reveal"><span>03 / CONNECT</span><h3>Your next step.<br />Made simple.</h3><p>Save your favourites and prepare an enquiry for Darlin with everything in one place.</p></article></div></section>
<section className="closing reveal"><p className="eyebrow">SOMETHING GOOD IS CALLING.</p><h2>Find your next<br />“love this phone.”</h2><a className="button" href="#lineup">Explore the collection ↗</a></section></main>
<footer><a className="brand" href="#"><span className="brandmark">d.</span><span>DARLIN<span className="brand-sub">PHONES & ACCESSORIES</span></span></a><div><a href="#lineup">iPhone</a><a href="#accessories">Accessories</a><a href="#darlin">Why Darlin</a></div><p>© 2026 Darlin Phones & Accessories.</p><small>Independent showcase. Apple and iPhone are trademarks of Apple Inc. Product imagery courtesy of Apple. Availability and pricing require confirmation.</small></footer>

<dialog ref={dialogRef} id="dialog" aria-label="Collection details" onClose={closeModal} onClick={event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
}}><button className="close" aria-label="Close dialog" onClick={closeModal}>&times;</button><div id="dialog-content"><CollectionDialog modal={modal} saved={saved} toggleSaved={toggleSaved} close={closeModal} notify={notify} enquiryRef={enquiryRef} /></div></dialog>
<div id="toast" className={toast ? 'show' : ''} role="status">{toast}</div>
</>;
}
