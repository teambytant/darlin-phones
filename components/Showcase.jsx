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
import CollectionGallery from './CollectionGallery';
import useSiteMotion from './useSiteMotion';


export default function Showcase({ catalogPage = false, accessoriesPage = false, shopPage = false, galleryPage = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modal, setModal] = useState(null);
  const [modalClosing, setModalClosing] = useState(false);
  const dialogRef = useRef(null);

  useSiteMotion(`${catalogPage}-${accessoriesPage}-${shopPage}-${galleryPage}`);

  useEffect(() => {
    if (modal && !dialogRef.current.open) dialogRef.current.showModal();
    if (!modal && dialogRef.current.open) dialogRef.current.close();
  }, [modal]);

  useEffect(() => {
    if (!modalClosing) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = setTimeout(() => {
      setModal(null);
      setModalClosing(false);
    }, reduced ? 0 : 180);
    return () => clearTimeout(timer);
  }, [modalClosing]);

  function openModal(value) { setModalClosing(false); setModal(value); }
  function closeModal() { if (modal) setModalClosing(true); }

  return <>

<a className="skip-link" href="#main-content">Skip to content</a>
<header onKeyDown={event => { if (event.key === "Escape") setMenuOpen(false); }}><Link className="brand" href="/" aria-label="Darlin Phones and Accessories home"><Brand /></Link><nav id="main-navigation" className={menuOpen ? "open" : ""} aria-label="Main navigation" onClick={() => setMenuOpen(false)}><Link href="/" aria-current={!catalogPage && !accessoriesPage && !shopPage && !galleryPage ? "page" : undefined}>Home</Link><Link href="/shop" aria-current={shopPage ? "page" : undefined}>Shop</Link><Link href="/iphone" aria-current={catalogPage ? "page" : undefined}>iPhone</Link><Link href="/accessories" aria-current={accessoriesPage ? "page" : undefined}>Accessories</Link><Link href="/collection" aria-current={galleryPage ? "page" : undefined}>Collection</Link><a href="/#darlin">Why Darlin</a></nav><span className="shop-location"><svg width="17" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg><span>Accra Circle, <br />Vodafone Main Office</span></span><EnquireLink className="enquire-nav" /><button className="menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-controls="main-navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span className="menu-icon" aria-hidden="true"><span /><span /><span /></span></button></header>
<main id="main-content">{galleryPage ? <CollectionGallery onDetail={model => openModal({type: "model", model})} /> : shopPage ? <Shop onDetail={model => openModal({type: "model", model})} /> : accessoriesPage ? <AccessoriesCatalog onDetail={model => openModal({type: "model", model})} /> : catalogPage ? <IPhoneCatalog onDetail={model => openModal({type: "model", model})} onCompare={() => openModal({type: "compare"})} /> : <>
<section className="hero" aria-labelledby="hero-title">
  <div className="hero-copy">
    <p className="eyebrow hero-eyebrow">DARLIN PHONES & ACCESSORIES</p>
    <h1 id="hero-title">Your next iPhone.<br /><span>So you.</span></h1>
    <p className="hero-subtitle">Find your favourite. Make it yours. Explore iPhone and the little extras that bring it all together.</p>
    <div className="hero-actions">
      <Link className="button" href="/iphone">Explore iPhone</Link>
      <Link className="button button-secondary" href="/accessories">Shop accessories</Link>
    </div>
    <p className="hero-note"><span aria-hidden="true">&bull;</span> A little guidance? We’re a WhatsApp away.</p>
  </div>
  <FeatureVideo src="/assets/apple.mp4" poster="/assets/hero.jpg" label="iPhone showcase" className="hero-media" />
  <div className="hero-caption"><span>THE DARLIN COLLECTION</span><span>Find your everyday favourite</span></div>
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
  <FeatureVideo src="/assets/iphone-18-pro-max.mp4" poster="/assets/pro.jpg" label="iPhone 18 Pro collection" className="pro-film" />
</section>
<section id="lineup" className="section lineup"><div className="section-head reveal"><div><p className="eyebrow">FIND YOUR PERFECT FIT</p><h2>Different personalities.<br />All iPhone.</h2></div><button className="text-button" id="compare" onClick={() => openModal({type: "compare"})}>Compare the collection</button></div><div className="product-grid" id="products">{models.slice(0, 3).map(model => <ProductCard key={model.name} model={model} onDetail={selectedModel => openModal({type: 'model', model: selectedModel})} />)}</div><p className="availability">Explore the collection. Ask Darlin to confirm available models, finishes, and current prices.</p></section>
<section className="feature reveal"><div className="feature-copy"><p className="eyebrow">A FRESH PERSPECTIVE</p><h2>Your everyday.<br />Anything but ordinary.</h2><p>The little details. The big moments. A camera that makes you want to capture them all.</p><button className="text-button" onClick={() => openModal({type: "model", model: models[0]})}>Discover the Pro collection</button></div><FeatureVideo /></section>
<section id="accessories" className="section"><div className="section-head reveal"><div><p className="eyebrow">THE PERFECT PLUS-ONE</p><h2>Make it yours.</h2></div><span className="section-caption">Small additions. Big personality.</span></div><div className="accessory-grid"><article className="accessory reveal"><div><p className="eyebrow">CASES & CHARGING</p><h3>Good looks.<br />Great company.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "Cases & charging"})}>Explore essentials</button></div><img src="/assets/accessories.jpg" alt="A collection of iPhone cases and MagSafe accessories" loading="lazy" /></article><article className="accessory reveal"><div><p className="eyebrow">AIRTAG</p><h3>Keep your favourites.<br />Close.</h3><button className="text-button" onClick={() => openModal({type: "accessory", name: "AirTag"})}>Explore AirTag</button></div><img src="/assets/airtag.jpg" alt="AirTag with colourful key ring accessories" loading="lazy" /></article></div></section>
<section id="darlin" className="darlin section"><p className="eyebrow reveal">THE DARLIN WAY</p><h2 className="reveal">Great phones.<br />A more personal experience.</h2><div className="benefits"><article className="reveal"><span>01 / DISCOVER</span><h3>A little clarity.<br />A better choice.</h3><p>Explore the collection at your pace and find the iPhone that feels right for you.</p></article><article className="reveal"><span>02 / PERSONALISE</span><h3>The details<br />make it yours.</h3><p>Bring your setup together with cases, charging essentials, and everyday extras.</p></article><article className="reveal"><span>03 / CONNECT</span><h3>Your next step.<br />Made simple.</h3><p>Ask about your favourite phones and accessories in a WhatsApp chat with Darlin.</p></article></div></section>
<section className="closing reveal"><p className="eyebrow">SOMETHING GOOD IS CALLING.</p><h2>Find your next<br />“love this phone.”</h2><Link className="button" href="/iphone">Explore the collection</Link></section></>}</main>
<footer><Link className="brand" href="/" aria-label="Darlin Phones and Accessories home"><Brand /></Link><div><Link href="/shop" aria-current={shopPage ? "page" : undefined}>Shop</Link><Link href="/iphone" aria-current={catalogPage ? "page" : undefined}>iPhone</Link><Link href="/accessories" aria-current={accessoriesPage ? "page" : undefined}>Accessories</Link><Link href="/collection" aria-current={galleryPage ? "page" : undefined}>Collection</Link><a href="/#darlin">Why Darlin</a></div><section className="footer-socials" aria-label="Social media"><span className="footer-social" aria-label="Snapchat profile coming soon"><span className="snapchat-icon" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c-3 0-4.5 2-4.5 5v2c-.7.5-1.4.4-2 .1-.9-.4-1.5.8-.5 1.3l1.8.9C6.3 15 4.9 16 3.5 16.5c.4 1 1.4 1.3 2.6 1.5l.5 1.5 2.2-.3c1 .4 1.7 1.3 3.2 1.3s2.2-.9 3.2-1.3l2.2.3.5-1.5c1.2-.2 2.2-.5 2.6-1.5-1.4-.5-2.8-1.5-3.3-4.2l1.8-.9c1-.5.4-1.7-.5-1.3-.6.3-1.3.4-2-.1V8c0-3-1.5-5-4.5-5Z" /></svg></span><span className="footer-social-copy"><span>Snapchat</span><span className="footer-social-placeholder">Coming soon</span></span></span></section><p>© 2026 Darlin Phones & Accessories.</p><small>Independent showcase. Apple and iPhone are trademarks of Apple Inc. Product imagery courtesy of Apple. Availability and pricing require confirmation.</small></footer>

<dialog ref={dialogRef} id="dialog" className={[modal?.type === "model" ? "product-dialog" : "", modalClosing ? "is-closing" : ""].filter(Boolean).join(" ")} aria-label={modal?.type === "model" ? `${modal.model.name} details` : "Collection details"} onCancel={event => { event.preventDefault(); closeModal(); }} onClose={() => { setModal(null); setModalClosing(false); }} onClick={event => {
  if (event.target !== event.currentTarget) return;
  const bounds = event.currentTarget.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeModal();
}}><button className="close" aria-label="Close dialog" onClick={closeModal}>&times;</button><div id="dialog-content"><CollectionDialog modal={modal} /></div></dialog>
</>;
}
