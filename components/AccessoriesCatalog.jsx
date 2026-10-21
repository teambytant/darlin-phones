'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import EnquireLink from './EnquireLink';
import { accessories } from './accessories';

const filters = ['All accessories', 'Cases', 'Charging', 'Audio', 'Everyday extras'];

export default function AccessoriesCatalog({ onDetail }) {
  const [filter, setFilter] = useState('All accessories');
  const [query, setQuery] = useState('');
  const filtered = accessories.filter(model => (filter === 'All accessories' || model.family === filter) && `${model.name} ${model.family}`.toLowerCase().includes(query.trim().toLowerCase()));

  return <div className="catalog">
    <div className="catalog-heading">
      <p className="catalog-breadcrumb"><Link href="/">Darlin</Link><span aria-hidden="true"> / </span>Accessories</p>
      <p className="eyebrow">THE ACCESSORIES COLLECTION</p>
      <div className="catalog-title"><h1>Make it yours.</h1><p>The perfect plus-one.<br />For everything you do.</p></div>
    </div>
    <section id="lineup" className="catalog-collection accessories-collection" aria-label="Browse accessories">
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filter by collection">{filters.map(name => <button key={name} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name}</button>)}</div>
        <label className="catalog-search"><span className="sr-only">Search accessories</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input type="search" placeholder="Find an accessory" value={query} onChange={event => setQuery(event.target.value)} /></label>
      </div>
      <div className="catalog-results"><p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'accessory' : 'accessories'} to explore</p><EnquireLink className="text-button" /></div>
      <div className="catalog-grid">{filtered.map(model => <ProductCard key={model.name} model={model} reveal={false} onDetail={onDetail} />)}</div>
      {!filtered.length && <div className="catalog-empty"><h2>No matching accessories.</h2><p>Try another accessory name or explore the full collection.</p><button className="button" onClick={() => { setFilter('All accessories'); setQuery(''); }}>Show all accessories</button></div>}
      <p className="availability">Enquire on WhatsApp about your favourite products. Confirm compatibility, available finishes, and prices with Darlin.</p>
    </section>
    <section className="catalog-help"><div><p className="eyebrow">BETTER TOGETHER</p><h2>Your next iPhone.<br />Your perfect setup.</h2><p>Find the phone that brings it all together.</p><Link className="button" href="/iphone">Explore iPhone</Link></div><img src="/assets/standard.jpg" alt="iPhone 17" loading="lazy" /></section>
  </div>;
}
