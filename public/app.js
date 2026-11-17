(() => {
  'use strict';

  // All birthday words come from config.js. No audio or personal data is sent to a server.
  const config = window.BIRTHDAY_CONFIG || {};
  const $ = (id) => document.getElementById(id);
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const scenes = {
    intro: $('sceneIntro'),
    cake: $('sceneCake'),
    reveal: $('sceneReveal')
  };
  let currentScene = 'intro';
  let candleOut = false;
  let micWanted = false;
  let micSession = 0;
  let micStream = null;
  let micContext = null;
  let micSource = null;
  let micRaf = 0;
  let celebrationTimer = 0;
  let confettiRaf = 0;
  let musicOn = false;
  let musicAudio = null;
  let resumeMusicAfterMic = false;
  const galleryPhotos = [];
  const badPhotoIndices = new Set();
  let galleryIndex = 0;

  const safeText = (value, fallback) =>
    typeof value === 'string' && value.trim() ? value.trim() : fallback;

  function personalize() {
    const recipient = safeText(config.recipientName, 'My Love');
    $('introLine').textContent = safeText(config.introLine, 'I made you a little corner of the universe.');
    $('wishInstruction').textContent = safeText(config.wishInstruction, 'Close your eyes and make a wish.');
    $('recipientName').textContent = `${recipient}!`;
    $('letterTitle').textContent = safeText(config.letterTitle, 'For a very special you');
    $('fromName').textContent = safeText(config.fromName, 'The one who loves you');
    $('giftTitle').textContent = safeText(config.giftTitle, 'One more little surprise...');
    $('giftMessage').textContent = safeText(config.giftMessage, 'More happiness is coming your way. 💗');
    document.title = `A birthday love letter for ${recipient} ♡`;
    const songTitle = safeText(config.songTitle, 'To the Bone');
    const songArtist = safeText(config.songArtist, 'Pamungkas');
    $('songTitle').textContent = songTitle;
    $('songArtist').textContent = songArtist;

    const letter = $('letterContent');
    letter.replaceChildren();
    const paragraphs = Array.isArray(config.letterParagraphs) && config.letterParagraphs.length
      ? config.letterParagraphs
      : ['Here is to another beautiful year filled with love, laughter, and lovely surprises.'];
    for (const item of paragraphs.slice(0, 8)) {
      if (typeof item !== 'string' || !item.trim()) continue;
      const p = document.createElement('p');
      p.textContent = item.trim();
      letter.appendChild(p);
    }

    const defaults = [
      { front: 'Your smile', back: 'It makes ordinary moments feel like magic.' },
      { front: 'Your heart', back: 'Your kindness makes life more beautiful.' },
      { front: 'Being you', back: 'The world is better with you in it.' }
    ];
    const reasons = Array.isArray(config.reasons) && config.reasons.length ? config.reasons : defaults;
    const grid = $('reasonGrid');
    grid.replaceChildren();
    ['♡', '✳', '✦'].forEach((symbol, index) => {
      const reason = reasons[index] && typeof reasons[index] === 'object' ? reasons[index] : defaults[index];
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'reason-card';
      card.setAttribute('aria-expanded', 'false');
      const front = safeText(reason.front, defaults[index].front);
      const back = safeText(reason.back, defaults[index].back);
      card.setAttribute('aria-label', `Reveal note ${index + 1}: ${front}`);
      const inner = document.createElement('span');
      inner.className = 'reason-card-inner';
      const faceFront = document.createElement('span');
      faceFront.className = 'reason-front';
      const icon = document.createElement('span');
      icon.className = 'reason-symbol';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = symbol;
      const name = document.createElement('span');
      name.className = 'reason-name';
      name.textContent = front;
      const hint = document.createElement('span');
      hint.className = 'reason-hint';
      hint.textContent = 'tap to flip ↗';
      faceFront.append(icon, name, hint);
      const faceBack = document.createElement('span');
      faceBack.className = 'reason-back';
      const backIcon = document.createElement('span');
      backIcon.className = 'back-icon';
      backIcon.setAttribute('aria-hidden', 'true');
      backIcon.textContent = '♥';
      const backText = document.createElement('span');
      backText.className = 'back-text';
      backText.textContent = back;
      faceBack.append(backIcon, backText);
      inner.append(faceFront, faceBack);
      card.append(inner);
      card.addEventListener('click', () => {
        const open = card.getAttribute('aria-expanded') !== 'true';
        card.setAttribute('aria-expanded', String(open));
        card.setAttribute('aria-label', open ? `Hide note ${index + 1}: ${back}` : `Reveal note ${index + 1}: ${front}`);
      });
      grid.appendChild(card);
    });

    // Keep the gallery hidden: photos are revealed only when the surprise box is tapped.
    // effects.js reads galleryPhotos directly from config.js for the photo burst.
  }

  function setupGallery() {
    if (!Array.isArray(config.galleryPhotos)) return;
    for (const photo of config.galleryPhotos.slice(0, 30)) {
      const src = typeof photo === 'string' ? photo : photo?.src;
      if (typeof src !== 'string' || !src.trim()) continue;
      const caption = typeof photo === 'object' && photo !== null ? photo.caption : '';
      galleryPhotos.push({ src: src.trim(), caption: safeText(caption, 'A memory worth keeping ♡') });
    }
    if (!galleryPhotos.length) return;
    $('memoriesSection').hidden = false;
    $('memoriesTitle').textContent = safeText(config.galleryTitle, 'A few moments I treasure');
    $('memoriesControls').hidden = galleryPhotos.length === 1;
    const dots = $('memoriesDots');
    dots.replaceChildren();
    galleryPhotos.forEach((photo, index) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'memory-dot';
      dot.setAttribute('aria-label', `View photo ${index + 1}`);
      dot.addEventListener('click', () => showGalleryPhoto(index));
      dots.appendChild(dot);
    });
    dots.hidden = galleryPhotos.length === 1;
    showGalleryPhoto(0);
  }

  function showGalleryPhoto(index) {
    if (!galleryPhotos.length) return;
    galleryIndex = (index + galleryPhotos.length) % galleryPhotos.length;
    const photo = galleryPhotos[galleryIndex];
    $('memoryImage').src = photo.src;
    $('memoryImage').alt = photo.caption;
    $('memoryCaption').textContent = photo.caption;
    $('memoryCount').textContent = `${galleryIndex + 1} / ${galleryPhotos.length}`;
    Array.from($('memoriesDots').children).forEach((dot, i) => {
      const selected = i === galleryIndex;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-current', selected ? 'true' : 'false');
    });
  }

  $('memoryImage').addEventListener('error', () => {
    if (!galleryPhotos.length) return;
    badPhotoIndices.add(galleryIndex);
    if (badPhotoIndices.size >= galleryPhotos.length) {
      $('memoriesSection').hidden = true;
      return;
    }
    let nextIndex = (galleryIndex + 1) % galleryPhotos.length;
    while (badPhotoIndices.has(nextIndex)) nextIndex = (nextIndex + 1) % galleryPhotos.length;
    showGalleryPhoto(nextIndex);
  });

  function showScene(sceneName) {
    currentScene = sceneName;
    Object.entries(scenes).forEach(([key, element]) => {
      const active = key === sceneName;
      element.hidden = !active;
      element.classList.toggle('is-active', active);
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (sceneName === 'cake') $('cakeTitle').focus({ preventScroll: true });
    if (sceneName === 'reveal') $('revealTitle').focus({ preventScroll: true });
  }

  function setStatus(message) {
    $('micStatus').textContent = message;
  }

  async function cleanupMic() {
    micWanted = false;
    micSession++;
    cancelAnimationFrame(micRaf);
    micRaf = 0;
    if (micSource) {
      try { micSource.disconnect(); } catch { /* already disconnected */ }
      micSource = null;
    }
    if (micStream) {
      micStream.getTracks().forEach((track) => track.stop());
      micStream = null;
    }
    if (micContext) {
      const ctx = micContext;
      micContext = null;
      try { await ctx.close(); } catch { /* some browsers close this automatically */ }
    }
    $('micVisual').hidden = true;
    $('micLevel').style.width = '0%';
    $('micButtonLabel').textContent = 'Use my microphone';
    $('micButton').setAttribute('aria-pressed', 'false');
  }

  async function toggleMicrophone() {
    if (candleOut || currentScene !== 'cake') return;
    if (micWanted) {
      await cleanupMic();
      resumeBackgroundMusic();
      setStatus('Microphone off. You can try again or tap to blow.');
      return;
    }
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setStatus('Microphone needs HTTPS or a supported browser. Tap to blow instead ♡');
      return;
    }

    resumeMusicAfterMic = musicOn;
    stopMusic(); // Avoid the background tune affecting breath detection.
    const session = ++micSession;
    micWanted = true;
    $('micButtonLabel').textContent = 'Stop listening';
    $('micButton').setAttribute('aria-pressed', 'true');
    setStatus('Allow microphone access when your phone asks ✨');

    let stream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
        video: false
      });
      if (!micWanted || session !== micSession || currentScene !== 'cake') {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      micStream = stream;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) throw new Error('Audio analysis is unavailable');
      micContext = new AudioContextClass();
      if (micContext.state === 'suspended') await micContext.resume();
      if (!micWanted || session !== micSession || currentScene !== 'cake') return;
      micSource = micContext.createMediaStreamSource(stream);
      const analyser = micContext.createAnalyser();
      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.35;
      micSource.connect(analyser);
      const data = new Uint8Array(analyser.fftSize);
      $('micVisual').hidden = false;
      setStatus('Getting ready... keep the phone quiet for a moment.');

      let calibrationStart = performance.now();
      let calibrationSum = 0;
      let calibrationSamples = 0;
      let baseline = 0.01;
      let threshold = 0.03;
      let calibrated = false;
      let activeSince = 0;
      let lastFrame = calibrationStart;

      function monitor(now) {
        if (!micWanted || session !== micSession || candleOut || currentScene !== 'cake') return;
        analyser.getByteTimeDomainData(data);
        let energy = 0;
        for (let i = 0; i < data.length; i++) {
          const sample = (data[i] - 128) / 128;
          energy += sample * sample;
        }
        const rms = Math.sqrt(energy / data.length);
        const elapsed = now - calibrationStart;
        if (!calibrated) {
          calibrationSum += rms;
          calibrationSamples++;
          $('micLevel').style.width = `${Math.min(100, (elapsed / 800) * 100)}%`;
          if (elapsed >= 800) {
            baseline = calibrationSum / Math.max(1, calibrationSamples);
            threshold = Math.max(0.025, Math.min(0.16, baseline * 2.9 + 0.008));
            calibrated = true;
            setStatus('Listening! Blow softly across the bottom of your phone 🎂');
          }
        } else {
          const relative = Math.max(0, Math.min(1, rms / Math.max(0.025, threshold * 1.6)));
          $('micLevel').style.width = `${Math.round(relative * 100)}%`;
          const isBlowing = rms > threshold && rms > baseline * 1.9;
          $('candleGroup').classList.toggle('is-blowing', isBlowing);
          if (isBlowing) {
            activeSince += Math.min(50, now - lastFrame);
            if (activeSince >= 170) {
              extinguishCandle();
              return;
            }
          } else {
            activeSince = Math.max(0, activeSince - 55);
          }
          // Slowly follow normal ambient sound, but not a sudden breath.
          if (rms < threshold * 0.72) baseline = baseline * 0.997 + rms * 0.003;
        }
        lastFrame = now;
        micRaf = requestAnimationFrame(monitor);
      }
      micRaf = requestAnimationFrame(monitor);
    } catch (error) {
      if (stream && !micStream) stream.getTracks().forEach((track) => track.stop());
      if (session !== micSession) return;
      const name = error?.name || '';
      await cleanupMic();
      resumeBackgroundMusic();
      if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
        setStatus('Microphone permission was denied. No worries — tap to blow ♡');
      } else if (name === 'NotFoundError') {
        setStatus('No microphone found. Tap to blow the candle instead ♡');
      } else {
        setStatus('Microphone not available here. Tap to blow instead ♡');
      }
    }
  }

  function extinguishCandle() {
    if (candleOut || currentScene !== 'cake') return;
    candleOut = true;
    clearTimeout(celebrationTimer);
    $('candleGroup').classList.add('is-out');
    $('candleGroup').classList.remove('is-blowing');
    $('cakeArea').setAttribute('aria-label', 'Birthday cake with its candle blown out. Your wish is on its way!');
    $('cakeCaption').textContent = 'your wish is on its way ✧';
    $('micButton').disabled = true;
    $('tapBlowButton').disabled = true;
    setStatus('Your wish is on its way... ✨');
    void cleanupMic();
    celebrationTimer = window.setTimeout(() => {
      showScene('reveal');
      fireConfetti();
      resumeBackgroundMusic();
    }, isReducedMotion ? 450 : 1250);
  }

  function resetWish() {
    clearTimeout(celebrationTimer);
    void cleanupMic();
    candleOut = false;
    $('candleGroup').classList.remove('is-out', 'is-blowing');
    $('cakeArea').setAttribute('aria-label', 'Birthday cake with one lit candle. Swipe across it to blow out the candle.');
    $('cakeCaption').textContent = 'one little candle • a thousand wishes';
    $('micButton').disabled = false;
    $('tapBlowButton').disabled = false;
    setStatus('You can also swipe across the cake ✨');
    $('burstAfterword').hidden = true;
    window.dispatchEvent(new Event('birthday:reset'));
    document.querySelectorAll('.reason-card').forEach((card) => {
      if (card.getAttribute('aria-expanded') === 'true') card.click();
    });
    showScene('cake');
  }

  // Local audio uploaded by the site owner to public/music/our-song.mp3.
  // There is no Spotify dependency or third-party player.
  const customMusicUrl = typeof config.musicUrl === 'string' ? config.musicUrl.trim() : '';
  const customVolume = typeof config.musicVolume === 'number' && Number.isFinite(config.musicVolume)
    ? Math.max(0, Math.min(1, config.musicVolume)) : 0.38;
  let musicFileAvailable = null;
  const musicStatus = $('musicStatus');

  function setMusicStatus(message) {
    musicStatus.textContent = message;
  }

  // A lightweight existence check ensures missing files don't leave a silent player.
  // The uploaded file will be detected automatically after Railway redeploys.
  async function checkMusicFile() {
    if (!customMusicUrl) {
      musicFileAvailable = false;
      setMusicStatus('Our song is not configured yet ♡');
      return;
    }
    try {
      const response = await fetch(customMusicUrl, { method: 'HEAD', cache: 'no-store' });
      musicFileAvailable = response.ok;
      if (response.ok) {
        $('musicToggle').hidden = false;
        if (!musicOn) setMusicStatus('Tap Play, or open the letter to hear our song ♫');
      } else {
        $('musicToggle').hidden = true;
        setMusicStatus('Our song will be here soon ♡');
      }
    } catch {
      musicFileAvailable = false;
      $('musicToggle').hidden = true;
      setMusicStatus('Our song is unavailable right now ♡');
    }
  }

  function updateMusicButton() {
    $('musicToggle').setAttribute('aria-pressed', String(musicOn));
    $('musicToggle').setAttribute('aria-label', musicOn ? 'Pause our song' : 'Play our song');
    $('musicToggle').title = musicOn ? 'Pause our song' : 'Play our song';
    $('songPlayButton').setAttribute('aria-pressed', String(musicOn));
    $('songPlayButton').setAttribute('aria-label', musicOn ? 'Pause our song' : 'Play our song');
    $('songListenButton').setAttribute('aria-pressed', String(musicOn));
    $('songListenButton').textContent = musicOn ? 'Pause Ⅱ' : 'Play ♫';
    $('songPlayIcon').textContent = musicOn ? 'Ⅱ' : '▶';
    $('songPlayButton').classList.toggle('is-playing', musicOn);
  }

  async function startMusic() {
    if (musicOn || !customMusicUrl) return;
    // Playback is initiated directly by a tap (the play controls or the invitation).
    try {
      if (!musicAudio) {
        musicAudio = new Audio(customMusicUrl);
        musicAudio.preload = 'auto';
        musicAudio.loop = config.musicLoop !== false;
        musicAudio.volume = customVolume;
        musicAudio.addEventListener('ended', () => {
          musicOn = false;
          updateMusicButton();
          setMusicStatus('Tap Play if you want to hear our song again ♡');
        });
        musicAudio.addEventListener('error', () => {
          musicOn = false;
          musicFileAvailable = false;
          updateMusicButton();
          setMusicStatus('The song file could not be loaded. Check the filename in GitHub.');
        });
      }
      await musicAudio.play();
      musicOn = true;
      musicFileAvailable = true;
      $('musicToggle').hidden = false;
      updateMusicButton();
      setMusicStatus('Now playing our song ♡');
    } catch {
      musicOn = false;
      updateMusicButton();
      setMusicStatus(musicFileAvailable === false
        ? 'Our song will be here soon ♡'
        : 'Tap Play again to start the music ♡');
    }
  }

  function toggleMusic() {
    resumeMusicAfterMic = false;
    if (musicOn) {
      stopMusic();
      setMusicStatus('Music paused. Tap Play when you are ready ♡');
    } else {
      void startMusic();
    }
  }

  function stopMusic() {
    if (musicAudio) musicAudio.pause();
    musicOn = false;
    updateMusicButton();
  }

  function resumeBackgroundMusic() {
    if (!resumeMusicAfterMic || document.hidden) return;
    resumeMusicAfterMic = false;
    void startMusic(); // Some phones may require another tap after mic permission.
  }

  void checkMusicFile();
  updateMusicButton();

  // Short, lightweight canvas confetti that does not run forever or under reduced-motion settings.
  function fireConfetti() {
    if (isReducedMotion) return;
    cancelAnimationFrame(confettiRaf);
    const canvas = $('confetti');
    const context = canvas.getContext('2d');
    if (!context) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(w * pixelRatio);
    canvas.height = Math.round(h * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    const colors = ['#f9afbb','#ffe4b2','#d7b7ff','#fff4ed','#ff9bca','#b6c9ff'];
    const particles = Array.from({ length: w < 500 ? 75 : 135 }, () => ({
      x: Math.random() * w,
      y: -Math.random() * h * .65 - 15,
      size: 3 + Math.random() * 6,
      vy: 1.4 + Math.random() * 2.8,
      vx: (Math.random() - .5) * 1.7,
      rotation: Math.random() * 6.3,
      spin: (Math.random() - .5) * .09,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    const start = performance.now();
    let last = start;
    function animate(now) {
      const delta = Math.min(2.2, (now - last) / 16.67);
      last = now;
      context.clearRect(0, 0, w, h);
      for (const piece of particles) {
        piece.x += piece.vx * delta;
        piece.y += piece.vy * delta;
        piece.rotation += piece.spin * delta;
        context.save();
        context.translate(piece.x, piece.y);
        context.rotate(piece.rotation);
        context.fillStyle = piece.color;
        context.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * .65);
        context.restore();
      }
      if (now - start < 4400 && currentScene === 'reveal' && !document.hidden) {
        confettiRaf = requestAnimationFrame(animate);
      } else {
        context.clearRect(0, 0, w, h);
      }
    }
    confettiRaf = requestAnimationFrame(animate);
  }

  personalize();
  $('openSurprise').addEventListener('click', () => {
    if (config.musicStartOnOpen === true) void startMusic();
    showScene('cake');
  });
  $('micButton').addEventListener('click', () => { void toggleMicrophone(); });
  $('tapBlowButton').addEventListener('click', extinguishCandle);
  $('musicToggle').addEventListener('click', toggleMusic);
  $('songPlayButton').addEventListener('click', toggleMusic);
  $('songListenButton').addEventListener('click', toggleMusic);
  $('memoryPrev').addEventListener('click', () => showGalleryPhoto(galleryIndex - 1));
  $('memoryNext').addEventListener('click', () => showGalleryPhoto(galleryIndex + 1));
  let memoryTouchStart = null;
  $('memoriesFrame').addEventListener('pointerdown', (event) => {
    memoryTouchStart = { x: event.clientX, y: event.clientY };
  });
  $('memoriesFrame').addEventListener('pointerup', (event) => {
    if (!memoryTouchStart) return;
    const dx = event.clientX - memoryTouchStart.x;
    const dy = event.clientY - memoryTouchStart.y;
    if (Math.abs(dx) > 46 && Math.abs(dy) < 110) showGalleryPhoto(galleryIndex + (dx < 0 ? 1 : -1));
    memoryTouchStart = null;
  });
  $('memoriesFrame').addEventListener('pointercancel', () => { memoryTouchStart = null; });
  $('replayButton').addEventListener('click', resetWish);

  let pointerStart = null;
  $('cakeArea').addEventListener('pointerdown', (event) => {
    pointerStart = { x: event.clientX, y: event.clientY };
  });
  $('cakeArea').addEventListener('pointerup', (event) => {
    if (!pointerStart) return;
    const deltaX = Math.abs(event.clientX - pointerStart.x);
    const deltaY = Math.abs(event.clientY - pointerStart.y);
    if (deltaX > 48 && deltaY < 105) extinguishCandle();
    pointerStart = null;
  });
  $('cakeArea').addEventListener('pointercancel', () => { pointerStart = null; });

  window.addEventListener('pagehide', () => {
    void cleanupMic();
    resumeMusicAfterMic = false;
    stopMusic();
    cancelAnimationFrame(confettiRaf);
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && micWanted) {
      void cleanupMic();
      if (currentScene === 'cake' && !candleOut) setStatus('Microphone stopped when the page was hidden. Tap to try again.');
    }
  });
})();
