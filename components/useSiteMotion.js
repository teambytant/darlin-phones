'use client';

import { useEffect } from 'react';

const revealTargets = [
  '.reveal', '.shop-section', '.shop-deal', '.shop-reasons', '.shop-contact',
  '.catalog-help', '.collection-tile', '.collection-outro',
  '.catalog-grid > .product', '.shop-popular-grid > .product',
].join(',');

export default function useSiteMotion(pageKey) {
  useEffect(() => {
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!main || !header) return;

    let frame = 0;
    const registered = new WeakSet();
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible', 'motion-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.04 });

    function register() {
      main.querySelectorAll(revealTargets).forEach(element => {
        if (registered.has(element)) return;
        registered.add(element);
        // Only hide elements that have not entered the viewport yet.
        const offscreen = element.getBoundingClientRect().top >= window.innerHeight;
        if (!preference.matches && offscreen) {
          element.classList.add('motion-reveal');
          observer.observe(element);
        } else element.classList.add('visible', 'motion-visible');
      });
    }

    function syncPreference() {
      if (preference.matches) {
        observer.disconnect();
        main.querySelectorAll(revealTargets).forEach(element => {
          element.classList.add('visible', 'motion-visible');
        });
      }
    }

    function syncHeader() {
      frame = 0;
      header.classList.toggle('is-scrolled', window.scrollY > 16);
    }

    function onScroll() {
      if (!frame) frame = requestAnimationFrame(syncHeader);
    }

    register();
    syncHeader();
    const mutations = new MutationObserver(register);
    mutations.observe(main, { childList: true, subtree: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    preference.addEventListener('change', syncPreference);
    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      preference.removeEventListener('change', syncPreference);
    };
  }, [pageKey]);
}
