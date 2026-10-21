'use client';

import Link from 'next/link';
import ProductCard from './ProductCard';
import EnquireLink from './EnquireLink';
import { models } from './models';
import { accessories } from './accessories';

const categories = [
  { name: 'iPhone', copy: 'The latest models', href: '/iphone', image: '/assets/pro.jpg' },
  { name: 'iPhone Air', copy: 'Light. Powerful.', href: '/iphone', image: '/assets/air.jpg' },
  { name: 'Cases', copy: 'Made to match', href: '/accessories', image: '/assets/case-woven.jpg' },
  { name: 'Charging', copy: 'Power for every day', href: '/accessories', image: '/assets/charger.jpg' },
  { name: 'Audio', copy: 'Sound, your way', href: '/accessories', image: '/assets/airpods.jpg' },
  { name: 'Everyday extras', copy: 'Keep close', href: '/accessories', image: '/assets/airtag.jpg' },
];

export default function Shop({ onDetail }) {
  const popular = [...models.slice(0, 4), accessories[0], accessories[6]];
  return <div className="shop-page">
    <section className="shop-hero" aria-labelledby="shop-title">
      <div className="shop-hero-copy"><p className="shop-kicker">NEW ARRIVALS</p><h1 id="shop-title">The latest iPhone.<br /><span>Made for you.</span></h1><p>Find the iPhone and accessories that fit your everyday, with help from Darlin whenever you need it.</p><div className="shop-hero-actions"><Link className="button" href="/iphone">Shop iPhone</Link><Link className="shop-outline-button" href="/accessories">Explore accessories</Link></div></div>
      <div className="shop-hero-visual" aria-hidden="true"><img src="/assets/colours/pro-burgundy.png" alt="" /><img src="/assets/colours/air-skyblue.png" alt="" /></div><div className="shop-hero-orb"><small>UP TO</small><strong>100%</strong><span>personal help</span></div><div className="shop-promises" aria-label="Shopping benefits"><span>Genuine products</span><span>WhatsApp support</span><span>Finish matching</span><span>Availability confirmation</span></div>
    </section>
    <section className="shop-section shop-categories" aria-labelledby="shop-category-title"><div className="shop-section-head"><div><p className="shop-kicker">MAKE IT YOURS</p><h2 id="shop-category-title">Shop by category.</h2></div><Link href="/iphone">See all iPhone</Link></div><div className="category-grid">{categories.map(category => <Link className="shop-category" href={category.href} key={category.name}><div><img src={category.image} alt="" /></div><h3>{category.name}</h3><p>{category.copy}</p></Link>)}</div></section>
    <section className="shop-deal" aria-labelledby="shop-deal-title"><div><p className="shop-kicker">DARLIN SELECTION</p><h2 id="shop-deal-title">The details that<br />bring it together.</h2><p>Choose your iPhone, then add a case, charger, and the extras that make it yours.</p><Link className="button" href="/accessories">Shop accessories</Link></div><div className="shop-deal-products" aria-hidden="true"><img src="/assets/case-woven.jpg" alt="" /><img src="/assets/charger.jpg" alt="" /><img src="/assets/airpods.jpg" alt="" /></div></section>
    <section className="shop-section shop-popular" aria-labelledby="popular-title"><div className="shop-section-head"><div><p className="shop-kicker">CURATED FOR YOU</p><h2 id="popular-title">Popular right now.</h2></div><button className="text-button" onClick={() => onDetail(models[0])}>Explore the collection</button></div><div className="shop-popular-grid">{popular.map(item => <ProductCard key={item.name} model={item} onDetail={onDetail} reveal={false} />)}</div></section>
    <section className="shop-reasons" aria-labelledby="reasons-title"><h2 id="reasons-title">Why shop with Darlin?</h2><div><article><b>01</b><h3>Personal guidance</h3><p>Tell us what you need and we will help you narrow down the right iPhone or accessory.</p></article><article><b>02</b><h3>Finishes that fit</h3><p>See available colours, cases, and accessories before you make your choice.</p></article><article><b>03</b><h3>Easy enquiry</h3><p>Ask about availability and current pricing through WhatsApp in one tap.</p></article><article><b>04</b><h3>Support when needed</h3><p>We are here for the next question, too.</p></article></div></section>
    <section className="shop-contact"><div><p className="shop-kicker">READY WHEN YOU ARE</p><h2>Let’s find your<br />next favourite.</h2></div><EnquireLink className="button" product="an iPhone or accessory" /></section>
  </div>;
}
