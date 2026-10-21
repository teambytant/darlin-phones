'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Brand from './Brand';
import IPhoneCatalog from './IPhoneCatalog';
import AccessoriesCatalog from './AccessoriesCatalog';
import EnquireLink from './EnquireLink';
import ProductCard from './ProductCard';
import FeatureVideo from './FeatureVideo';
import CollectionDialog from './CollectionDialog';
import { models } from './models';
import Shop from './Shop';


export default function Showcase({ catalogPage = false, accessoriesPage = false, shopPage = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [modal, setModal] = useState(null);
  const [toast, setToast] = useState('');
  const videoRef = useRef(null);
  const dialogRef = useRef(null);
  const toastTimer = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
    return () => { observer.disconnect(); clearTimeout(toastTimer.current); };
  }, [catalogPage, accessoriesPage, shopPage]);

  useEffect(() => {
    if (modal && !dialogRef.current.open) dialogRef.current.showModal();
    if (!modal && dialogRef.current.open) dialogRef.current.close();
  }, [modal]);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const video = videoRef.current;
    if (!video) return;
    function syncMotionPreference() {
      if (preference.matches) video.pause();
      else video.play().catch(() => setPaused(true));
      setPaused(video.paused);
    }
    syncMotionPreference();
    preference.addEventListener('change', syncMotionPreference);
    return () => preference.removeEventListener('change', syncMotionPreference);
  }, []);

  function toggleVideo() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => notify('Tap play to start the video.'));
    else video.pause();
  }

  function notify(message) {
    clearTimeout(toastTimer.current);
    setToast(message);
    toastTimer.current = setTimeout(() => setToast(''), 2400);
  }
  function openModal(value) { setModal(value); }
  function closeModal() { setModal(null); }

  return <>

<header><Link className="brand" href="/" aria-label="Darlin Phones and Accessories home"><Brand /></Link><nav className={menuOpen ? "open" : ""} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><Link href="/shop" aria-current={shopPage ? "page" : undefined}>Shop</Link><Link href="/iphone" aria-current={catalogPage ? "page" : undefined}>iPhone</Link><Link href="/accessories" aria-current={accessoriesPage ? "page" : undefined}>Accessories</Link><a href="/#darlin">Why Darlin</a></nav><EnquireLink className="enquire-nav" /><button className="menu" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>☰</button></header>
<main>{shopPage ? <Shop onDetail={model => openModal({type: "model", model})} /> : accessoriesPage ? <AccessoriesCatalog onDetail={model => openModal({type: "model", model})} /> : catalogPage ? <IPhoneCatalog onDetail={model => openModal({type: "model", model})} onCompare={() => openModal({type: "compare"})} /> : <>
<section className="hero" aria-labelledby="hero-title">
  <div className="hero-copy">
    <p className="hero-brand">Darlin Phones <span>and Accessories.</span></p>
    <h1 id="hero-title">iPhone.</h1>
    <p className="hero-subtitle">So you.</p>
    <div className="hero-actions">
      <Link className="button" href="/iphone">Explore iPhone</Link>
      <Link className="button" href="/accessories">Shop accessories</Link>
    </div>
  </div>
  <video id="hero-video" ref={videoRef} muted loop playsInline preload="auto" aria-label="iPhone showcase video" onPlay={() => setPaused(false)} onPause={() => setPaused(true)}>
    <source src="/assets/apple.mp4" type="video/mp4" />
    Your browser does not support embedded video.
  </video>
  <img className="hero-interior" src="/assets/shop-interior-hero.png" alt="" aria-hidden="true" />
  <button className="hero-playback" id="motion" aria-pressed={paused} aria-label={paused ? "Play hero video" : "Pause hero video"} aria-controls="hero-video" onClick={toggleVideo}>{paused ? '\u25b6' : '\u2161'}</button>
</section>
<section className="pro-showcase" aria-labelledby="pro-showcase-title">
  <div className="pro-showcase-copy">
    <h2 id="pro-showcase-title">iPhone 18 Pro.</h2>
    <p>Pro further.</p>
    <div className="hero-actions">
      <button className="button" onClick={() => openModal({type: 'model', model: models[0]})}>Learn more</button>
      <Link className="text-button" href="/iphone">Explore the Pro collection</Link>
    </div>
  </div>
  <FeatureVideo id="pro-showcase-video" src="/assets/iphone-18-pro-max.mp4" poster={null} label="iPhone 18 Pro and iPhone 18 Pro Max showcase" className="pro-film" />
</section>
<section id="lineup" className="section lineup"><div className="section-head reveal"><div><p className="eyebrow">FIND YOUR PERFECT FIT</p><h2>Different personalities.<br />All iPhone.</h2></div><button className="text-button" id="compare" onClick={() => openModal({type: "compare"})}>Compare the collection</button></div><div className="product-grid" id="products">{models.slice(0, 3).map(model => <ProductCard key={model.name} model={model} onDetail={selectedModel => openModal({type: 'model', model: selectedModel})} />)}</div><p className="availability">Explore the collection. Ask Darlin to confirm available models, finishes, and current prices.</p></section>
<section className="feature reveal"><div className="feature-copy"><p className="eyebrow">A FRESH PERSPECTIVE</p><h2>Your everyday.<br />Anything but ordinary.</h2><p>The little details. The big moments. A camera that makes you want to capture them all.</p><button className="text-button" onClick={() => openModal({type: "model", model: models[0]})}>Discover the Pro collection</button></div><FeatureVideo /></section>
<section id="accessories" className="section"><div className="section-head reveal"><div><p className="eyebrow">THE PERFECT PLUS-ONE</p><h2>Make it yours.</h2></div><span className="section-caption">Small additions. Big personality.</span></div><div className="accessory-grid"><article className="accessory reveal"><div><p className="eyebrow">CASES & CHARGING</p><h3>Good looks.<br />Great company.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "Cases & charging"})}>Explore essentials</button></div><img src="/assets/accessories.jpg" alt="A collection of iPhone cases and MagSafe accessories" loading="lazy" /></article><article className="accessory reveal"><div><p className="eyebrow">AIRTAG</p><h3>Keep your favourites.<br />Close.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "AirTag"})}>Explore AirTag</button></div><img src="/assets/airtag.jpg" alt="AirTag with colourful key ring accessories" loading="lazy" /></article></div></section>
<section id="darlin" className="darlin section"><p className="eyebrow reveal">THE DARLIN WAY</p><h2 className="reveal">Great phones.<br />A more personal experience.</h2><div className="benefits"><article className="reveal"><span>01 / DISCOVER</span><h3>A little clarity.<br />A better choice.</h3><p>Explore the collection at your pace and find the iPhone that feels right for you.</p></article><article className="reveal"><span>02 / PERSONALISE</span><h3>The details<br />make it yours.</h3><p>Bring your setup together with cases, charging essentials, and everyday extras.</p></article><article className="reveal"><span>03 / CONNECT</span><h3>Your next step.<br />Made simple.</h3><p>Ask about your favourite phones and accessories in a WhatsApp chat with Darlin.</p></article></div></section>
<section className="closing reveal"><p className="eyebrow">SOMETHING GOOD IS CALLING.</p><h2>Find your next<br />“love this phone.”</h2><Link className="button" href="/iphone">Explore the collection</Link></section></>}</main>
<footer><Link className="brand" href="/" aria-label="Darlin Phones and Accessories home"><Brand /></Link><div><Link href="/shop" aria-current={shopPage ? "page" : undefined}>Shop</Link><Link href="/iphone" aria-current={catalogPage ? "page" : undefined}>iPhone</Link><Link href="/accessories" aria-current={accessoriesPage ? "page" : undefined}>Accessories</Link><a href="/#darlin">Why Darlin</a></div><p>© 2026 Darlin Phones & Accessories.</p><small>Independent showcase. Apple and iPhone are trademarks of Apple Inc. Product imagery courtesy of Apple. Availability and pricing require confirmation.</small></footer>

<dialog ref={dialogRef} id="dialog" aria-label="Collection details" onClose={closeModal} onClick={event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
}}><button className="close" aria-label="Close dialog" onClick={closeModal}>&times;</button><div id="dialog-content"><CollectionDialog modal={modal} /></div></dialog>
<div id="toast" className={toast ? 'show' : ''} role="status">{toast}</div>
</>;
}
