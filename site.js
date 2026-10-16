(() => {
  'use strict';
  const fr = document.documentElement.lang === 'fr';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const header = document.querySelector('.header');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-navigation');
  const mobile = window.matchMedia('(max-width: 760px)');
  const closeMenu = (restore = false) => {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('is-open');
    document.body.classList.remove('menu-open');
    if (restore) menu.focus();
  };
  menu.addEventListener('click', () => {
    const opening = menu.getAttribute('aria-expanded') !== 'true';
    if (!opening) return closeMenu(true);
    menu.setAttribute('aria-expanded', 'true');
    nav.classList.add('is-open');
    document.body.classList.add('menu-open');
    nav.querySelector('a').focus();
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  mobile.addEventListener('change', () => { if (!mobile.matches) closeMenu(); });
  document.addEventListener('keydown', event => {
    if (menu.getAttribute('aria-expanded') !== 'true') return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const items = [...header.querySelectorAll('a,button')].filter(e => e.getClientRects().length);
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const updateHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 140);
  window.addEventListener('scroll', updateHeader, {passive:true});
  updateHeader();
  document.querySelectorAll('.language-switch a').forEach(a => a.addEventListener('click', () => {
    if (window.location.hash) a.href = a.getAttribute('href').split('#')[0] + window.location.hash;
  }));
  // Objects respond to a fine pointer; the card and its click target stay stable.
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const pointerResets = [];
  document.querySelectorAll('.case-image,.service-card-link,.website-tier').forEach(surface => {
    let frame = 0, bounds = null, point = null;
    const distance = surface.matches('.case-image') ? 3 : 8;
    const reset = () => {
      cancelAnimationFrame(frame);
      frame = 0; bounds = null; point = null;
      surface.style.removeProperty('--pointer-x');
      surface.style.removeProperty('--pointer-y');
    };
    pointerResets.push(reset);
    surface.addEventListener('pointerenter', event => {
      if (reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      bounds = surface.getBoundingClientRect();
    });
    surface.addEventListener('pointermove', event => {
      if (!bounds || reduced.matches || !finePointer.matches || event.pointerType !== 'mouse') return;
      point = {x:event.clientX,y:event.clientY};
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        if (!bounds || !point) return;
        const x = Math.max(-1,Math.min(1,(point.x-bounds.left)/bounds.width*2-1));
        const y = Math.max(-1,Math.min(1,(point.y-bounds.top)/bounds.height*2-1));
        surface.style.setProperty('--pointer-x',`${(x*distance).toFixed(2)}px`);
        surface.style.setProperty('--pointer-y',`${(y*distance).toFixed(2)}px`);
      });
    }, {passive:true});
    surface.addEventListener('pointerleave', reset);
    surface.addEventListener('pointercancel', reset);
  });
  const resetPointers = () => pointerResets.forEach(reset => reset());
  finePointer.addEventListener('change', resetPointers);
  reduced.addEventListener('change', resetPointers);
  window.addEventListener('blur', resetPointers);
  // Native details remain usable without JavaScript; enhance only their transition.
  const disclosureMotion = new Map();
  document.querySelectorAll('.faq-list details, .project-details').forEach(details => {
    const summary = details.querySelector('summary');
    summary.addEventListener('click', event => {
      if (reduced.matches || !details.animate) return;
      event.preventDefault();
      const previous = disclosureMotion.get(details);
      const opening = previous ? !previous.opening : !details.open;
      const from = details.getBoundingClientRect().height;
      previous?.animation.cancel();
      details.style.height = '';
      if (opening) details.open = true;
      const style = getComputedStyle(details);
      const border = parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const to = opening ? details.getBoundingClientRect().height : summary.getBoundingClientRect().height + border;
      details.style.overflow = 'hidden';
      const animation = details.animate([{height:`${from}px`},{height:`${to}px`}], {
        duration:420, easing:'cubic-bezier(.22,1,.36,1)'
      });
      const finish = () => {
        if (disclosureMotion.get(details)?.animation !== animation) return;
        details.open = opening;
        details.style.height = '';
        details.style.overflow = '';
        disclosureMotion.delete(details);
      };
      disclosureMotion.set(details,{animation,opening,finish});
      animation.onfinish = finish;
    });
  });
  reduced.addEventListener('change', () => {
    if (reduced.matches) disclosureMotion.forEach(({animation,finish}) => { animation.cancel(); finish(); });
  });
  if ('IntersectionObserver' in window && !reduced.matches) {
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
      });
    }, {threshold:.06,rootMargin:'0px 0px 40px 0px'});
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    document.documentElement.classList.add('motion-ready');
    document.querySelector('.hero-copy').classList.add('is-entering');
  }
  const hero = document.querySelector('.hero');
  const intro = document.getElementById('alpine-intro');
  const ambient = document.getElementById('alpine-ambient');
  const poster = document.querySelector('.hero-poster');
  const status = document.querySelector('.hero-status');
  const sourceSize = window.innerWidth <= 760 ? 'mobile' : window.innerWidth >= 1800 ? '4k' : 'hd';
  const errorText = fr ? 'L’animation est indisponible. Une image fixe est affichée.' : 'Animation unavailable. A still image is displayed.';
  const saveData = Boolean(navigator.connection?.saveData);
  const bounds = hero.getBoundingClientRect();
  let phase = 'intro', inView = bounds.bottom > -100 && bounds.top < innerHeight + 100;
  let ambientLoaded = false, failed = false, autoplayBlocked = false, pendingPlay = null;
  intro.defaultMuted = ambient.defaultMuted = true;
  intro.muted = ambient.muted = true;
  const active = () => phase === 'ambient' ? ambient : intro;
  const canPlay = () => !reduced.matches && !saveData && !document.hidden && inView && !failed;
  const pause = () => {
    // A pending play() rejects when paused. Its old rejection must not hide a newer playback.
    pendingPlay = null;
    intro.pause(); ambient.pause();
  };
  const still = (announce = false) => {
    pause();
    intro.classList.remove('is-visible'); ambient.classList.remove('is-visible');
    poster.src = 'assets/alpine/still.jpg';
    if (announce) { failed = true; status.textContent = errorText; }
  };
  const playActive = async () => {
    const video = active();
    if (!canPlay() || autoplayBlocked || !video.getAttribute('src') || !video.paused || pendingPlay?.video === video) return;
    const attempt = {video};
    pendingPlay = attempt;
    try { await video.play(); }
    catch (error) {
      if (pendingPlay !== attempt || active() !== video) return;
      if (error.name === 'NotAllowedError') {
        autoplayBlocked = true;
        still();
      } else if (error.name !== 'AbortError') {
        still(true);
      }
      // AbortError is an interrupted request, not a broken video. Resume on visibility/canplay.
    } finally {
      if (pendingPlay === attempt) pendingPlay = null;
    }
  };
  const loadAmbient = () => {
    if (ambientLoaded || reduced.matches || saveData) return;
    ambientLoaded = true;
    ambient.preload = 'auto';
    ambient.src = `assets/alpine/ambient-${sourceSize}.mp4`;
  };
  const prepareAmbient = () => {
    if (intro.currentTime < 1.5 || !Number.isFinite(intro.duration)) return;
    for (let i = 0; i < intro.buffered.length; i++) {
      if (intro.buffered.start(i) <= intro.currentTime &&
          intro.buffered.end(i) - intro.currentTime >= Math.min(3, intro.duration - intro.currentTime - .1)) {
        loadAmbient(); break;
      }
    }
  };
  intro.addEventListener('playing', () => {
    intro.classList.add('is-visible');
    status.textContent = '';
  });
  intro.addEventListener('timeupdate', prepareAmbient);
  intro.addEventListener('progress', prepareAmbient);
  intro.addEventListener('ended', () => {
    pendingPlay = null;
    phase = 'ambient'; loadAmbient(); playActive();
  });
  ambient.addEventListener('playing', () => {
    ambient.classList.add('is-visible');
  });
  for (const video of [intro, ambient]) {
    video.addEventListener('canplay', () => { if (video === active()) playActive(); });
    video.addEventListener('error', () => still(true));
  }
  const start = () => {
    if (reduced.matches || saveData) return still();
    pause();
    failed = false; autoplayBlocked = false; status.textContent = ''; phase = 'intro';
    poster.src = 'assets/alpine/opening.jpg';
    intro.classList.remove('is-visible'); ambient.classList.remove('is-visible');
    const source = `assets/alpine/intro-${sourceSize}.mp4`;
    intro.preload = 'auto';
    // Reuse the early HTML preload rather than restarting its download.
    if (intro.getAttribute('src') !== source) intro.src = source;
    else if (intro.error) intro.load();
    else if (intro.readyState > 0) intro.currentTime = 0;
    // No fixed deadline: a slow first response must remain eligible to play when ready.
    playActive();
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries[0].isIntersecting;
      if (!inView) pause();
      else playActive();
    }, {threshold:0,rootMargin:'100px'}).observe(hero);
  }
  const resume = () => {
    if (!canPlay()) return;
    autoplayBlocked = false;
    playActive();
  };
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pause();
    else resume();
  });
  window.addEventListener('pageshow', resume);
  window.addEventListener('online', () => { if (failed) start(); else resume(); });
  // Some browser settings require a gesture even for muted video. Retry on real interaction.
  for (const event of ['pointerup', 'keydown']) {
    document.addEventListener(event, () => { if (autoplayBlocked) resume(); }, {passive:true});
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) {
      document.documentElement.classList.remove('motion-ready'); still();
    } else start();
  });
  if (reduced.matches || saveData) still();
  else start();
})();
