(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const config = window.BIRTHDAY_CONFIG || {};
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- A small physically inspired flame, rendered locally: no images or GPU libs. ---
  // Multiple nested, animated Bezier shapes approximate the hot mantle, amber
  // envelope and bright inner cone, with independent tip/edge turbulence.
  const flameCanvas = $('candleFlameCanvas');
  const candleGroup = $('candleGroup');
  const cakeScene = $('sceneCake');
  const flameContext = flameCanvas?.getContext?.('2d', { alpha: true });
  if (flameContext) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const canvasWidth = 118;
    const canvasHeight = 132;
    flameCanvas.width = canvasWidth * dpr;
    flameCanvas.height = canvasHeight * dpr;
    flameContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    let frameId = 0;
    let lastFrameAt = 0;
    let frame = 0;

    function flameShape(cx, baseY, height, halfWidth, bend, wiggle, layer) {
      const ctx = flameContext;
      const tipX = cx + bend * (0.8 + layer * .2);
      const tipY = baseY - height;
      const leftBend = -halfWidth * (1.25 + wiggle * .1);
      const rightBend = halfWidth * (1.23 - wiggle * .07);
      ctx.beginPath();
      ctx.moveTo(cx - halfWidth * .35, baseY);
      ctx.bezierCurveTo(cx + leftBend * 1.65, baseY - height * .29,
        tipX - halfWidth * (.85 + wiggle * .17), tipY + height * .21, tipX, tipY);
      ctx.bezierCurveTo(tipX + halfWidth * (.9 - wiggle * .09), tipY + height * .23,
        cx + rightBend * 1.65, baseY - height * .27, cx + halfWidth * .38, baseY);
      ctx.quadraticCurveTo(cx, baseY + halfWidth * .28, cx - halfWidth * .35, baseY);
      ctx.closePath();
    }

    function drawFlame(time) {
      const ctx = flameContext;
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      const t = time / 1000;
      const wind = candleGroup.classList.contains('is-blowing') ? 1 : 0;
      const phase = Math.sin(t * 7.4) * .45 + Math.sin(t * 11.1 + 2.1) * .34 + Math.sin(t * 17.9 + .7) * .17;
      const breath = Math.sin(t * 8.7 - .6) * .55 + Math.sin(t * 13.6) * .35;
      const height = 49 + phase * 7 + breath * 2 - wind * 13;
      const bend = phase * 4.4 + wind * 15;
      const cx = 59;
      const baseY = 104;
      const lightX = cx + bend * .55;
      const lightY = baseY - height * .43;

      // Diffuse warm halo subtly glows around the moving flame.
      ctx.save();
      let glow = ctx.createRadialGradient(lightX, lightY, 1, lightX, lightY, 51);
      glow.addColorStop(0, 'rgba(255,241,170,.38)');
      glow.addColorStop(.30, 'rgba(255,173,79,.2)');
      glow.addColorStop(.70, 'rgba(255,100,44,.065)');
      glow.addColorStop(1, 'rgba(255,90,40,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(lightX, lightY, 51, 0, Math.PI * 2); ctx.fill();

      ctx.globalCompositeOperation = 'screen';
      // Soft red-orange edge: a tapered, unstable envelope.
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(255,124,38,.67)';
      flameShape(cx, baseY, height + 2, 12.5 + phase * 1.5, bend, breath, .2);
      let fire = ctx.createLinearGradient(cx, baseY - height, cx, baseY + 1);
      fire.addColorStop(0, 'rgba(255,105,38,.58)');
      fire.addColorStop(.25, 'rgba(255,126,30,.92)');
      fire.addColorStop(.63, 'rgba(255,180,48,.97)');
      fire.addColorStop(1, 'rgba(255,203,101,.95)');
      ctx.fillStyle = fire; ctx.fill();

      // Gold/yellow hotter inner layer oscillates at a different frequency.
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255,207,69,.45)';
      flameShape(cx, baseY - 1, height * .73 + breath, 8.2 + phase, bend * .54 + Math.sin(t*9.7)*1.5, -phase, .6);
      let gold = ctx.createLinearGradient(cx, baseY - height*.75, cx, baseY);
      gold.addColorStop(0, 'rgba(255,215,76,.46)');
      gold.addColorStop(.23, 'rgba(255,223,103,.95)');
      gold.addColorStop(.78, 'rgba(255,248,172,1)');
      gold.addColorStop(1, 'rgba(255,250,201,.96)');
      ctx.fillStyle = gold; ctx.fill();

      // Nearly white-blue base, the hottest part right above the wick.
      ctx.shadowBlur = 4;
      ctx.shadowColor = 'rgba(255,255,210,.5)';
      flameShape(cx, baseY, 19 + phase * 1.5, 4.4, wind * 1.5, breath, .9);
      let core = ctx.createLinearGradient(cx, baseY - 20, cx, baseY);
      core.addColorStop(0, 'rgba(255,253,205,.3)');
      core.addColorStop(.35, '#fff8d6');
      core.addColorStop(.78, '#fffefa');
      core.addColorStop(1, '#dcefff');
      ctx.fillStyle = core; ctx.fill();
      ctx.restore();
    }

    function tick(now) {
      frameId = 0;
      if (cakeScene.hidden || candleGroup.classList.contains('is-out') || document.hidden) return;
      if (now - lastFrameAt >= 30) { // ~30 FPS for battery-friendly phone animation.
        lastFrameAt = now;
        drawFlame(reducedMotion ? 300 : now);
        frame++;
      }
      if (!reducedMotion || frame < 1) frameId = requestAnimationFrame(tick);
    }
    function sync() {
      cancelAnimationFrame(frameId); frameId = 0;
      frame = 0; lastFrameAt = 0;
      if (!cakeScene.hidden && !candleGroup.classList.contains('is-out') && !document.hidden) {
        frameId = requestAnimationFrame(tick);
      }
    }
    let wasOut = candleGroup.classList.contains('is-out');
    const observer = new MutationObserver(() => {
      const out = candleGroup.classList.contains('is-out');
      if (out !== wasOut || (cakeScene.hidden && frameId) || (!cakeScene.hidden && !frameId && !out)) sync();
      wasOut = out;
    });
    observer.observe(cakeScene, { attributes: true, attributeFilter: ['hidden'] });
    observer.observe(candleGroup, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', sync);
    window.addEventListener('pagehide', () => { cancelAnimationFrame(frameId); observer.disconnect(); });
    sync();
  }

  // --- Polaroids burst from the tap location, rather than opening a box. ---
  const button = $('photoBombButton');
  const overlay = $('photoBurstOverlay');
  const stage = $('photoBurstStage');
  const spotlight = $('photoBurstSpotlight');
  const afterword = $('burstAfterword');
  const lastFocused = { element: null };
  const fallbacks = [
    'linear-gradient(140deg,#eba2bd,#b491d9)',
    'linear-gradient(140deg,#eec1a6,#e998ae)',
    'linear-gradient(140deg,#c3b1e4,#f2b5cc)',
    'linear-gradient(140deg,#f0b3bb,#a5bddc)',
    'linear-gradient(140deg,#eac5a4,#c8a4d7)'
  ];
  const labels = ['A moment to remember', 'A day full of smiles', 'Our little adventure', 'A happy memory', 'More moments to come'];

  function normalizePhotos(items) {
    if (!Array.isArray(items)) return [];
    return items.slice(0, 5).map((item, index) => {
      const src = typeof item === 'string' ? item.trim() : (typeof item?.src === 'string' ? item.src.trim() : '');
      const caption = (typeof item === 'object' && typeof item?.caption === 'string' && item.caption.trim()) ? item.caption.trim() : labels[index];
      return { src, caption };
    }).filter((photo) => photo.src);
  }
  const explicitPhotos = normalizePhotos(config.photoBurstPhotos);
  const galleryPhotos = normalizePhotos(config.galleryPhotos);
  const photos = explicitPhotos.length ? explicitPhotos : galleryPhotos;
  if (photos.length === 0 && typeof config.photoUrl === 'string' && config.photoUrl.trim()) {
    photos.push({ src: config.photoUrl.trim(), caption: config.photoCaption || labels[0] });
  }
  // Five labeled sample cards until real pictures are uploaded. With four actual
  // photos we intentionally launch four (as the user requested 4–5).
  if (photos.length < 4) {
    while (photos.length < 5) photos.push({ src: '', caption: `Add photo ${photos.length + 1} ♡` });
  }
  $('photoBombCountLabel').textContent = `${photos.length} little memories, one big surprise ♡`;
  stage.setAttribute('aria-label', `${photos.length} scattered photos. Tap one to view it larger.`);
  let selectedPhoto = -1;
  let touchStartX = null;
  let isOpen = false;
  let previousOverflow = '';
  let spotlightLoadToken = 0;

  function createCard(photo, index) {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'burst-card';
    card.setAttribute('aria-label', `View photo ${index + 1}: ${photo.caption}`);
    const media = document.createElement('span');
    media.className = 'burst-card-media';
    media.style.setProperty('--fallback-bg', fallbacks[index]);
    const placeholder = document.createElement('span');
    placeholder.className = 'burst-card-placeholder';
    const heart = document.createElement('strong'); heart.textContent = ['♡','✦','♥','✳','♡'][index];
    const hint = document.createElement('small'); hint.textContent = 'YOUR PHOTO HERE';
    placeholder.append(heart, hint);
    if (photo.src) {
      const image = document.createElement('img');
      image.alt = photo.caption;
      image.src = photo.src;
      image.loading = 'eager';
      image.decoding = 'async';
      placeholder.hidden = true;
      image.addEventListener('error', () => { image.remove(); placeholder.hidden = false; });
      media.append(image);
    }
    media.append(placeholder);
    const caption = document.createElement('span');
    caption.className = 'burst-card-caption';
    caption.textContent = photo.caption;
    card.append(media, caption);
    card.addEventListener('click', () => selectPhoto(index));
    return card;
  }

  function makeConfettiPops(x, y) {
    if (reducedMotion) return;
    const ring = document.createElement('span');
    ring.className = 'burst-shockwave';
    ring.style.setProperty('--x', `${x}px`);
    ring.style.setProperty('--y', `${y}px`);
    stage.append(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
    const colors = ['#ffe3ac','#ffafc4','#e0c6ff','#ffe2f0','#ffe5ad'];
    for (let i = 0; i < 12; i++) {
      const spark = document.createElement('span');
      spark.className = 'burst-spark';
      spark.textContent = ['✦','✧','✳','♡'][i % 4];
      const theta = i * Math.PI / 6;
      const r = 52 + ((i * 17) % 72);
      spark.style.setProperty('--x', `${x}px`);
      spark.style.setProperty('--y', `${y}px`);
      spark.style.setProperty('--spark-x', `${Math.cos(theta)*r}px`);
      spark.style.setProperty('--spark-y', `${Math.sin(theta)*r}px`);
      spark.style.setProperty('--spark-color', colors[i % colors.length]);
      spark.style.setProperty('--delay', `${i % 3 * 30}ms`);
      spark.addEventListener('animationend', () => spark.remove(), { once: true });
      stage.append(spark);
    }
  }

  // Layout uses the *rendered* card size, so tablet/landscape CSS and Safari
  // orientation changes never leave photo edges outside the screen.
  function layoutBurstCards(sourceX = null, sourceY = null) {
    const w = stage.clientWidth || window.innerWidth;
    const h = stage.clientHeight || window.innerHeight;
    const isPhone = w < 630;
    const tabletLandscape = w >= 960 && h < w;
    const tabletPortrait = w >= 700 && h >= w;
    const locations = isPhone
      ? [[.255,.26,-13],[.74,.38,12],[.265,.55,10],[.745,.68,-13],[.49,.82,4]]
      : tabletLandscape
        ? [[.23,.32,-13],[.77,.32,10],[.23,.72,11],[.77,.72,-12],[.50,.72,3]]
        : tabletPortrait
          ? [[.23,.30,-13],[.77,.30,10],[.24,.58,12],[.76,.58,-11],[.50,.80,4]]
          : [[.25,.29,-13],[.73,.28,10],[.34,.61,12],[.69,.64,-11],[.50,.79,4]];
    const placements = photos.length === 4 ? locations.slice(0,4) : locations;
    const cards = stage.querySelectorAll('.burst-card');
    const bounded = (value, min, max) => Math.max(min, Math.min(max, value));
    cards.forEach((card, index) => {
      const [px, py, rotation] = placements[index];
      const cardW = card.getBoundingClientRect().width;
      const cardH = card.getBoundingClientRect().height;
      // Rotation makes the bounding box slightly larger; reserve safe padding.
      const minX = cardW * .68 + 10;
      const minY = w >= 700
        ? Math.max(232, cardH * .74 + 25) // tablet: clear the overlay heading
        : Math.max(h < 700 ? 96 : 112, cardH * .66 + 9);
      const maxX = Math.max(minX, w - minX);
      const maxY = Math.max(minY, h - cardH * .66 - 27);
      const tx = bounded(px * w, minX, maxX);
      const ty = bounded(py * h, minY, maxY);
      card.style.left = `${tx}px`;
      card.style.top = `${ty}px`;
      card.style.setProperty('--rotation', `${rotation}deg`);
      if (sourceX !== null && sourceY !== null) {
        card.style.setProperty('--start-x', `${(sourceX - tx).toFixed(1)}px`);
        card.style.setProperty('--start-y', `${(sourceY - ty).toFixed(1)}px`);
        card.style.setProperty('--delay', `${index * 65}ms`);
      }
    });
  }

  function openBurst() {
    // Preserve the launch point before locking body scrolling.
    const rect = button.getBoundingClientRect();
    const sourceX = rect.left + rect.width / 2;
    const sourceY = rect.top + rect.height / 2;
    stage.replaceChildren();
    photos.forEach((photo, index) => stage.append(createCard(photo, index)));
    overlay.hidden = false; // Required so card size measurements reflect tablet CSS.
    spotlight.hidden = true;
    layoutBurstCards(sourceX, sourceY);
    makeConfettiPops(sourceX, sourceY);
    previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.body.classList.add('photo-burst-open');
    selectedPhoto = -1;
    isOpen = true;
    lastFocused.element = document.activeElement;
    $('photoBurstClose').focus({ preventScroll: true });
    afterword.hidden = false;
  }

  function closeBurst() {
    if (!isOpen) return;
    spotlightLoadToken++;
    isOpen = false;
    spotlight.hidden = true;
    overlay.hidden = true;
    stage.replaceChildren();
    selectedPhoto = -1;
    document.body.classList.remove('photo-burst-open');
    document.body.style.overflow = previousOverflow;
    if (lastFocused.element?.isConnected) lastFocused.element.focus({ preventScroll: true });
  }

  function selectPhoto(index) {
    if (!isOpen) return;
    selectedPhoto = (index + photos.length) % photos.length;
    const photo = photos[selectedPhoto];
    const image = $('spotlightImage');
    const placeholder = $('spotlightPlaceholder');
    const token = ++spotlightLoadToken;
    image.hidden = true;
    image.removeAttribute('src');
    placeholder.hidden = false;
    if (photo.src) {
      image.onload = () => { if (token === spotlightLoadToken) { image.hidden = false; placeholder.hidden = true; } };
      image.onerror = () => { if (token === spotlightLoadToken) { image.hidden = true; placeholder.hidden = false; } };
      image.alt = photo.caption;
      image.src = photo.src;
    }
    $('spotlightCaption').textContent = photo.caption;
    $('spotlightCounter').textContent = `${selectedPhoto + 1} / ${photos.length}`;
    spotlight.hidden = false;
    $('spotlightClose').focus({ preventScroll: true });
  }

  function backToScatter() {
    if (spotlight.hidden) return;
    const focusIndex = selectedPhoto;
    spotlight.hidden = true;
    selectedPhoto = -1;
    const card = stage.querySelectorAll('.burst-card')[focusIndex];
    (card || $('photoBurstClose')).focus({ preventScroll: true });
  }

  // Recompute positions after rotating the iPad or changing Split View width.
  // No photo animations are replayed on resize; cards simply settle into place.
  let burstResizeFrame = 0;
  window.addEventListener('resize', () => {
    if (!isOpen || overlay.hidden) return;
    if (burstResizeFrame) cancelAnimationFrame(burstResizeFrame);
    burstResizeFrame = requestAnimationFrame(() => {
      burstResizeFrame = 0;
      layoutBurstCards();
    });
  }, { passive: true });

  button.addEventListener('click', openBurst);
  $('photoBurstClose').addEventListener('click', closeBurst);
  $('spotlightClose').addEventListener('click', backToScatter);
  $('spotlightPrevious').addEventListener('click', () => selectPhoto(selectedPhoto - 1));
  $('spotlightNext').addEventListener('click', () => selectPhoto(selectedPhoto + 1));
  overlay.querySelector('.photo-burst-backdrop').addEventListener('click', () => {
    if (spotlight.hidden) closeBurst(); else backToScatter();
  });
  document.addEventListener('keydown', (event) => {
    if (!isOpen) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      if (spotlight.hidden) closeBurst(); else backToScatter();
    } else if (event.key === 'ArrowLeft' && !spotlight.hidden) {
      event.preventDefault(); selectPhoto(selectedPhoto - 1);
    } else if (event.key === 'ArrowRight' && !spotlight.hidden) {
      event.preventDefault(); selectPhoto(selectedPhoto + 1);
    } else if (event.key === 'Tab') {
      // Keep keyboard focus within the active full-screen dialog.
      const container = spotlight.hidden ? overlay : spotlight;
      const focusable = Array.from(container.querySelectorAll('button:not(:disabled)')).filter((el) => el.getClientRects().length > 0);
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  $('spotlightPhoto').addEventListener('touchstart', (event) => {
    touchStartX = event.touches.length === 1 ? event.touches[0].clientX : null;
  }, { passive: true });
  $('spotlightPhoto').addEventListener('touchend', (event) => {
    if (touchStartX === null || !event.changedTouches.length) return;
    const delta = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) selectPhoto(selectedPhoto + (delta < 0 ? 1 : -1));
    touchStartX = null;
  }, { passive: true });
  window.addEventListener('birthday:reset', () => { closeBurst(); afterword.hidden = true; });
  window.addEventListener('pagehide', () => { if (isOpen) closeBurst(); });
})();
