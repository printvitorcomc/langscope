/* Static, resolution-aware sky extension. No renderer, image texture or frame loop. */
(() => {
  const scene = document.querySelector('.footer-scene');
  if (!scene) return;
  const canvas = scene.querySelector('canvas');
  const ctx = canvas.getContext('2d', { alpha: true });
  let ready = false, queued = 0, lastSize = '';
  const random = seed => () => {
    seed = Math.imul(seed ^ seed >>> 15, 1 | seed);
    seed ^= seed + Math.imul(seed ^ seed >>> 7, 61 | seed);
    return ((seed ^ seed >>> 14) >>> 0) / 4294967296;
  };
  function paint() {
    queued = 0;
    if (!ctx || !ready) return;
    const { width: w, height: h } = canvas.getBoundingClientRect();
    if (!w || !h) return;
    // At most 2M backing pixels, irrespective of a phone's advertised DPR.
    const dpr = Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(2000000 / (w * h)));
    const key = `${Math.round(w)}:${Math.round(h)}:${dpr.toFixed(2)}`;
    if (key === lastSize) return;
    lastSize = key;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const rand = random(2833), count = Math.min(21000, Math.round(w * h * .025));
    for (let i = 0; i < count; i++) {
      const x = rand() * w, y = rand() * h, r = .15 + rand() * .45;
      ctx.fillStyle = `rgba(225,223,218,${.035 + rand() * .16})`;
      ctx.fillRect(x, y, r, r);
    }
    // Faint orbital traces belong to this sky, not to a rectangular image edge.
    ctx.strokeStyle = 'rgba(255,231,199,.12)'; ctx.lineWidth = .65;
    ctx.setLineDash([.65, 4.2]);
    ctx.beginPath(); ctx.ellipse(w * .75, h * 1.43, w * .82, h * .98, -.17, Math.PI, Math.PI * 1.86); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(w * -.12, h * 1.47, w * .72, h * 1.12, .21, Math.PI * 1.06, Math.PI * 2); ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < Math.min(85, w * h / 11000); i++) {
      const x = rand() * w, y = rand() * h;
      ctx.fillStyle = `rgba(255,234,202,${.15 + rand() * .3})`;
      ctx.beginPath(); ctx.arc(x, y, .3 + rand() * .45, 0, Math.PI * 2); ctx.fill();
    }
  }
  function schedulePaint() {
    if (!queued && ready) queued = requestAnimationFrame(paint);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      const visible = entries.some(entry => entry.isIntersecting);
      scene.classList.toggle('is-in-view', visible && !document.hidden);
      if (visible) { ready = true; schedulePaint(); }
    }, { rootMargin: '350px 0px' }).observe(scene);
  } else { ready = true; schedulePaint(); }
  if ('ResizeObserver' in window) new ResizeObserver(schedulePaint).observe(canvas);
  else addEventListener('resize', schedulePaint, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) scene.classList.remove('is-in-view');
    else if (scene.getBoundingClientRect().top < innerHeight && scene.getBoundingClientRect().bottom > 0) scene.classList.add('is-in-view');
  });
})();
