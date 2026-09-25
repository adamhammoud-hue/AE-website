(() => {
  const player = document.querySelector('.ae-film-player');
  if (!player) return;
  const video = player.querySelector('video');
  const button = player.querySelector('.ae-film-play');
  const status = player.querySelector('.ae-film-status');
  const fr = document.documentElement.lang === 'fr';
  const text = fr ? {play:'Lire la vidéo',pause:'Mettre en pause',loading:'Chargement de la vidéo…',error:'La vidéo ne peut pas démarrer. Réessayez ou utilisez « Ouvrir la vidéo » ci-dessous.'} : {play:'Play the film',pause:'Pause the film',loading:'Loading the video…',error:'The video could not start. Try again or use “Open the video” below.'};
  let pending = false;
  let slowTimer;
  const ready = () => { pending = false; clearTimeout(slowTimer); button.disabled = false; button.textContent = video.paused ? text.play : text.pause; };
  const failed = () => { ready(); status.textContent = text.error; };
  button.hidden = false;
  button.addEventListener('click', async () => {
    if (pending) return;
    if (!video.paused) { video.pause(); return; }
    pending = true; button.disabled = true; button.textContent = text.loading; status.textContent = text.loading;
    if (video.error) video.load();
    slowTimer = setTimeout(() => { if (pending) failed(); }, 15000);
    try { await video.play(); } catch { failed(); }
  });
  video.addEventListener('playing', () => { ready(); status.textContent = ''; });
  video.addEventListener('pause', () => { ready(); status.textContent = ''; });
  video.addEventListener('ended', () => { ready(); status.textContent = ''; });
  video.addEventListener('waiting', () => { if (!video.paused) status.textContent = text.loading; });
  video.addEventListener('error', failed);
})();
