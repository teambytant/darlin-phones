'use client';

import { useState } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';
import { models } from './models';

const generations = [...new Set(models.map(model => model.generation))].sort((a, b) => {
  if (/^\d+$/.test(a) && /^\d+$/.test(b)) return Number(b) - Number(a);
  if (/^\d+$/.test(a)) return -1;
  if (/^\d+$/.test(b)) return 1;
  return a.localeCompare(b);
});

const filters = ['All iPhones', 'Pro', 'Pro Max', 'Air', 'Everyday', 'Duo'];

export default function IPhoneCatalog({ onDetail, onCompare }) {
  const [filter, setFilter] = useState('All iPhones');
  const [query, setQuery] = useState('');
  const [generation, setGeneration] = useState('All generations');
  const filtered = models.filter(model => (filter === 'All iPhones' || model.family === filter) && (generation === 'All generations' || model.generation === generation) && model.name.toLowerCase().includes(query.trim().toLowerCase()));

  return <div className="catalog">
    <div className="catalog-heading">
      <p className="catalog-breadcrumb"><Link href="/">Darlin</Link><span aria-hidden="true"> / </span>iPhone</p>
      <p className="eyebrow">THE IPHONE COLLECTION</p>
      <div className="catalog-title"><h1>Find your iPhone.</h1><p>A little more you.<br />A whole world of possibilities.</p></div>
    </div>
    <section id="lineup" className="catalog-collection" aria-label="Browse iPhone models">
      <div className="catalog-toolbar">
        <div className="catalog-filters" role="group" aria-label="Filter by collection">{filters.map(name => <button key={name} aria-pressed={filter === name} onClick={() => setFilter(name)}>{name}</button>)}</div>
        <div className="catalog-search-tools"><label className="generation-filter"><span className="sr-only">Filter by iPhone generation</span><select aria-label="Filter by iPhone generation" value={generation} onChange={event => setGeneration(event.target.value)}><option>All generations</option>{generations.map(value => <option key={value} value={value}>iPhone {value}</option>)}</select></label>
        <label className="catalog-search"><span className="sr-only">Search iPhone models</span><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 5 5" /></svg><input type="search" placeholder="Find a model" value={query} onChange={event => setQuery(event.target.value)} /></label></div>
      </div>
      <div className="catalog-results"><p aria-live="polite">{filtered.length} {filtered.length === 1 ? 'model' : 'models'} to explore</p><button className="text-button" onClick={onCompare}>Compare the collection</button></div>
      <div className="catalog-grid">{filtered.map(model => <ProductCard key={model.name} model={model} reveal={false} onDetail={onDetail} />)}</div>
      {!filtered.length && <div className="catalog-empty"><h2>No matching iPhones.</h2><p>Try another model name or explore the full collection.</p><button className="button" onClick={() => { setFilter('All iPhones'); setQuery(''); setGeneration('All generations'); }}>Show all iPhones</button></div>}
      <p className="availability">Enquire on WhatsApp about your favourite products. Confirm available models, finishes, storage, and prices with Darlin.</p>
    </section>
    <section className="catalog-help"><div><p className="eyebrow">THE FINISHING TOUCH</p><h2>Great phone.<br />Perfect company.</h2><p>Find the cases and everyday essentials to make it yours.</p><Link className="button" href="/accessories">Explore accessories</Link></div><img src="/assets/accessories.jpg" alt="iPhone cases and charging accessories" loading="lazy" /></section>
  </div>;
}
