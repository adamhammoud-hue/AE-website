(() => {
  'use strict';
  const hero = document.querySelector('.hero');
  const layer = document.querySelector('.hero-constellation');
  const stars = document.querySelector('.hero-stars');
  const mountains = document.querySelector('.hero-media');
  const button = document.querySelector('.hero-button');
  if (!hero || !layer || !stars || !mountains || !button) return;
  let lastStarSize = '';
  const paintStars = (width, height) => {
    const size = Math.round(width) + ':' + Math.round(height);
    if (size === lastStarSize) return;
    lastStarSize = size;
    // Stable, quiet stars bridge the original still into the surrounding sky.
    let seed = 41839;
    const random = () => {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      return seed / 4294967296;
    };
    const points = [];
    const count = Math.round(width * height / 2300);
    for (let i = 0; i < count; i++) {
      const x = random() * width, y = random() * height;
      const radius = .27 + Math.pow(random(), 4) * .8;
      const opacity = (.22 + random() * .4) * (.5 + .5 * x / width);
      if (radius > .9) points.push('<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="2.2" opacity=".055"/>');
      points.push('<circle cx="' + x.toFixed(2) + '" cy="' + y.toFixed(2) + '" r="' + radius.toFixed(2) + '" opacity="' + opacity.toFixed(3) + '"/>');
    }
    stars.setAttribute('viewBox', '0 0 ' + width + ' ' + height);
    stars.innerHTML = '<g fill="#d6e1ef">' + points.join('') + '</g>';
  };
  const layout = () => {
    const field = layer.getBoundingClientRect();
    const heroBox = hero.getBoundingClientRect();
    const mountainBox = mountains.getBoundingClientRect();
    let top;
    if (innerWidth <= 760) {
      // On phones the mark sits above the copy, leaving both fully readable.
      top = 160 - field.width * .095;
      hero.style.setProperty('--sky-copy-top', Math.ceil(top + field.height + 18) + 'px');
    } else {
      hero.style.removeProperty('--sky-copy-top');
      // The dense foot of the A is at y=350 in the 1672px-wide original.
      // Offset measurements ignore the text's entrance and hover transforms.
      let buttonBottom = button.offsetHeight;
      for (let element = button; element && element !== hero; element = element.offsetParent) {
        buttonBottom += element.offsetTop;
      }
      top = buttonBottom - field.width * 350 / 1672;
    }
    layer.style.top = top.toFixed(2) + 'px';
    const skyHeight = Math.max(220, mountainBox.top - heroBox.top + mountainBox.height * .55);
    hero.style.setProperty('--starfield-height', Math.round(skyHeight) + 'px');
    paintStars(Math.round(heroBox.width), Math.round(skyHeight));
  };
  new ResizeObserver(layout).observe(hero);
  new ResizeObserver(layout).observe(button);
  window.addEventListener('resize', layout, {passive: true});
  document.fonts?.ready.then(layout);
  layout();
})();
