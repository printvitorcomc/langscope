/* Progressive enhancement: no dependencies, touch handlers or idle frame loop. */
(() => {
  const cards = [...document.querySelectorAll('.explanation--cards .explanation-card')];
  if (!cards.length) return;

  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        revealObserver.unobserve(entry.target);
      }
    }, { threshold: .12 })
    : null;

  cards.forEach((card, index) => {
    card.style.setProperty('--entry-delay', `${index % 3 * 90}ms`);
    const media = card.querySelector('.explanation-media');
    const image = media?.querySelector('img');
    if (image) {
      const loaded = () => {
        media.classList.remove('is-loading');
        if (image.naturalWidth) media.classList.add('is-loaded');
      };
      image.addEventListener('load', loaded, { once: true });
      image.addEventListener('error', () => media.classList.remove('is-loading'), { once: true });
      if (image.complete) loaded();
      else media.classList.add('is-loading');
    }
    if (revealObserver) revealObserver.observe(card);
    else card.classList.add('is-revealed');
  });

  const desktop = matchMedia('(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)');
  const properties = ['--mouse-x', '--mouse-y', '--rotate-x', '--rotate-y', '--art-x', '--art-y'];
  const states = cards.map(card => {
    let bounds = null, frame = 0, point = null;
    const reset = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      bounds = null;
      point = null;
      card.classList.remove('is-pointer-active');
      properties.forEach(property => card.style.removeProperty(property));
    };
    const paint = () => {
      frame = 0;
      if (!bounds || !point) return;
      const x = Math.max(0, Math.min(1, (point.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (point.y - bounds.top) / bounds.height));
      card.style.setProperty('--mouse-x', `${(x * bounds.width).toFixed(1)}px`);
      card.style.setProperty('--mouse-y', `${(y * bounds.height).toFixed(1)}px`);
      card.style.setProperty('--rotate-x', `${((.5 - y) * 3).toFixed(2)}deg`);
      card.style.setProperty('--rotate-y', `${((x - .5) * 3).toFixed(2)}deg`);
      card.style.setProperty('--art-x', `${((x - .5) * 9).toFixed(2)}px`);
      card.style.setProperty('--art-y', `${((y - .5) * 9).toFixed(2)}px`);
    };
    const move = event => {
      if (event.pointerType !== 'mouse') return;
      if (!bounds) {
        bounds = card.getBoundingClientRect();
        card.classList.add('is-pointer-active');
      }
      point = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(paint);
    };
    return {
      reset,
      connect() {
        card.addEventListener('pointerenter', move);
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', reset);
        card.addEventListener('pointercancel', reset);
      },
      disconnect() {
        card.removeEventListener('pointerenter', move);
        card.removeEventListener('pointermove', move);
        card.removeEventListener('pointerleave', reset);
        card.removeEventListener('pointercancel', reset);
        reset();
      }
    };
  });
  const syncDesktop = () => states.forEach(state => {
    if (desktop.matches) state.connect();
    else state.disconnect();
  });
  const resetAll = () => states.forEach(state => state.reset());
  desktop.addEventListener('change', syncDesktop);
  syncDesktop();
  addEventListener('scroll', resetAll, { passive: true });
  addEventListener('resize', resetAll, { passive: true });
  addEventListener('hashchange', resetAll);
  addEventListener('blur', resetAll);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetAll(); });
})();
