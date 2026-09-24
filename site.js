// The background stays decorative and follows the visitor's motion preference.
(() => {
  const video = document.getElementById('skyline-video');
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const update = async () => {
    if (document.hidden || motion.matches || navigator.connection?.saveData) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = video.dataset.src;
    video.muted = true;
    try { await video.play(); } catch { /* Keep the skyline poster when autoplay is unavailable. */ }
  };
  video.addEventListener('loadeddata', () => video.classList.add('is-ready'));
  video.addEventListener('error', () => video.classList.remove('is-ready'));
  motion.addEventListener('change', update);
  document.addEventListener('visibilitychange', update);
  void update();
})();

// Reflections track the pointer while the content stays still.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  document.querySelectorAll('.glass-panel').forEach(panel => {
    let frame = 0;
    panel.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      cancelAnimationFrame(frame);
      const {clientX, clientY} = event;
      frame = requestAnimationFrame(() => {
        const box = panel.getBoundingClientRect();
        panel.style.setProperty('--glass-x', `${((clientX - box.left) / box.width) * 100}%`);
        panel.style.setProperty('--glass-y', `${((clientY - box.top) / box.height) * 100}%`);
      });
    }, {passive: true});
    panel.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      panel.style.removeProperty('--glass-x');
      panel.style.removeProperty('--glass-y');
    });
  });
})();

// Progressive scroll reveals and small, pointer-driven glass interactions.
(() => {
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const elements = [...document.querySelectorAll('.section-heading, .service-list article, .studio-art, .concept-art, .studio-copy, .reviews-heading, .review-empty, .contact > .eyebrow, .contact-heading, .contact-details > *')];
  let observer;
  const reveal = element => {
    element.classList.add('is-visible');
    window.setTimeout(() => element.classList.add('has-arrived'), 1100);
  };
  const setup = () => {
    observer?.disconnect();
    if (motion.matches || !('IntersectionObserver' in window)) {
      document.documentElement.classList.remove('motion-ready');
      elements.forEach(element => element.classList.add('is-visible', 'has-arrived'));
      return;
    }
    observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
      });
    }, {threshold: 0.08, rootMargin: '0px 0px -25px 0px'});
    elements.forEach(element => {
      element.classList.add('reveal');
      if (element.closest('.service-list, .concept-gallery, .contact-details')) {
        const index = [...element.parentElement.children].indexOf(element);
        element.style.setProperty('--reveal-delay', `${Math.min(index * 75, 150)}ms`);
      }
      observer.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
  };
  setup();
  motion.addEventListener('change', setup);
  document.querySelectorAll('.service-list article, .review-empty, .glass-control').forEach(element => {
    let frame = 0;
    const magnetic = element.classList.contains('glass-control');
    const reset = () => {
      cancelAnimationFrame(frame);
      ['--tilt-x','--tilt-y','--magnet-x','--magnet-y'].forEach(name => element.style.removeProperty(name));
    };
    element.addEventListener('pointermove', event => {
      if (motion.matches || !finePointer.matches) return;
      cancelAnimationFrame(frame);
      const {clientX,clientY} = event;
      frame = requestAnimationFrame(() => {
        const box = element.getBoundingClientRect();
        const x = Math.max(-.5,Math.min(.5,(clientX-box.left)/box.width-.5));
        const y = Math.max(-.5,Math.min(.5,(clientY-box.top)/box.height-.5));
        if (magnetic) {
          element.style.setProperty('--magnet-x', `${x*8}px`);
          element.style.setProperty('--magnet-y', `${y*8}px`);
        } else {
          element.style.setProperty('--tilt-x', `${-y*3}deg`);
          element.style.setProperty('--tilt-y', `${x*3}deg`);
        }
      });
    }, {passive:true});
    element.addEventListener('pointerleave',reset);
    motion.addEventListener('change',reset);
  });
  document.addEventListener('visibilitychange',() => document.documentElement.classList.toggle('page-hidden',document.hidden));
})();
