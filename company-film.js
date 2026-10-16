(() => {
  const section = document.querySelector('#ae-film');
  if (!section) return;
  const video = section.querySelector('video');
  const player = section.querySelector('.company-film-player');
  const cover = section.querySelector('.company-film-cover');
  const controls = section.querySelector('.company-film-controls');
  const status = section.querySelector('.company-film-status');
  const get = name => section.querySelector(`[data-film="${name}"]`);
  const fr = section.dataset.language === 'fr';
  const labels = fr ? {
    play:'Lecture', pause:'Pause', replay:'Revoir le film', mute:'Couper le son', unmute:'Activer le son',
    off:'Sous-titres français : désactivés', on:'Sous-titres français : activés',
    loading:'Chargement du film…', error:'Le film ne peut pas démarrer. Réessayez avec Lecture ou ouvrez le lien 4K ci-dessous.',
    fullscreen:'Le plein écran n’est pas disponible dans ce navigateur.'
  } : {
    play:'Play', pause:'Pause', replay:'Watch again', mute:'Mute', unmute:'Unmute',
    off:'French subtitles: Off', on:'French subtitles: On',
    loading:'Loading the film…', error:'The film could not start. Try Play again or open the 4K link below.',
    fullscreen:'Full screen is not available in this browser.'
  };
  const track = video.addTextTrack('subtitles', 'Français', 'fr');
  track.mode = 'disabled';
  const captions = [{"start": 0.7, "end": 2.5, "text": "Votre entreprise a une histoire."}, {"start": 2.7, "end": 4.9, "text": "Offrez-lui un site qui lui donne vie."}, {"start": 6.72, "end": 8.1, "text": "Essential."}, {"start": 9.07, "end": 12.63, "text": "Un beau départ, pensé pour vous."}, {"start": 13.26, "end": 14.9, "text": "Choisissez votre image d’accueil,"}, {"start": 15.02, "end": 17.5, "text": "vos couleurs et votre typographie."}, {"start": 18.18, "end": 19.8, "text": "Présentez votre activité,"}, {"start": 19.96, "end": 21.25, "text": "valorisez vos services,"}, {"start": 21.25, "end": 23.55, "text": "facilitez la prise de contact."}, {"start": 24.48, "end": 26.54, "text": "Une lecture claire sur mobile."}, {"start": 26.92, "end": 28.4, "text": "Chaque détail est soigné."}, {"start": 28.56, "end": 31.3, "text": "Comme Alant Nutrition,"}, {"start": 31.48, "end": 34.8, "text": "un site simple peut laisser\nune impression durable."}, {"start": 36.4, "end": 37.8, "text": "Signature."}, {"start": 37.94, "end": 41.3, "text": "Une touche de luxe,\net davantage de possibilités."}, {"start": 41.74, "end": 44.35, "text": "Donnez vie à votre accueil\navec une vidéo."}, {"start": 44.56, "end": 46.4, "text": "Racontez une histoire plus riche,"}, {"start": 46.4, "end": 49.08, "text": "avec des pages sur mesure\net des interactions soignées."}, {"start": 49.08, "end": 50.78, "text": "Selon votre projet :"}, {"start": 50.78, "end": 53.32, "text": "des services et tarifs modifiables,"}, {"start": 53.32, "end": 55.25, "text": "des créneaux de rendez-vous,"}, {"start": 55.36, "end": 56.76, "text": "ou un appel direct."}, {"start": 56.76, "end": 59.25, "text": "À l’image de Ton SUCCESS,"}, {"start": 59.44, "end": 63.25, "text": "une présence singulière,\npensée pour votre façon de travailler."}, {"start": 65.5, "end": 68, "text": "Et puis…"}, {"start": 68.9, "end": 71.1, "text": "un site qui vous transporte."}, {"start": 82.4, "end": 83.8, "text": "Immersive Luxury."}, {"start": 83.9, "end": 86.1, "text": "Une expérience à votre image."}, {"start": 86.28, "end": 87.38, "text": "Du sur-mesure."}, {"start": 87.52, "end": 88.8, "text": "Une direction artistique."}, {"start": 88.92, "end": 90.9, "text": "Graphismes et interactions avancés."}, {"start": 91.14, "end": 93.8, "text": "Des ouvertures cinéma\naux parcours animés au défilement."}, {"start": 93.86, "end": 96.2, "text": "des détails qui donnent envie\nde s’arrêter,"}, {"start": 96.36, "end": 98.2, "text": "d’explorer, de se souvenir."}, {"start": 98.4, "end": 100.2, "text": "Votre ambition nous guide."}, {"start": 102.6, "end": 104, "text": "Trois approches."}, {"start": 104.16, "end": 106.55, "text": "Le même engagement\npour votre entreprise."}, {"start": 106.7, "end": 108.55, "text": "Parlons de votre projet."}, {"start": 108.8, "end": 110.65, "text": "AE Company."}, {"start": 110.65, "end": 114.15, "text": "Des sites qui donnent vie\nà vos projets."}];
  captions.forEach(c => {
    const cue = new VTTCue(c.start,c.end,c.text);
    cue.line=-3; cue.size=88; cue.align='center'; track.addCue(cue);
  });
  let loadingTimer, attempt = 0;
  const stamp = t => `${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}`;
  const clearStatus = () => { clearTimeout(loadingTimer); status.textContent=''; };
  function update() {
    const duration = Number.isFinite(video.duration) ? video.duration : 116;
    get('seek').max=duration; get('seek').value=video.currentTime;
    get('time').textContent=`${stamp(video.currentTime)} / ${stamp(duration)}`;
    get('play').textContent=video.ended ? labels.replay : video.paused ? labels.play : labels.pause;
  }
  function waiting() {
    clearTimeout(loadingTimer); status.textContent=labels.loading;
    loadingTimer=setTimeout(() => {status.textContent=labels.error;},15000);
  }
  async function start() {
    const current = ++attempt;
    if (!video.getAttribute('src')) video.src=video.dataset.src;
    else if (video.error) video.load();
    if(video.ended)video.currentTime=0;
    waiting();
    try { await video.play(); if(current===attempt)clearStatus(); }
    catch(e) { if(current!==attempt)return; clearTimeout(loadingTimer); status.textContent=labels.error; }
  }
  cover.addEventListener('click',start);
  get('play').addEventListener('click',()=>video.paused?start():video.pause());
  get('seek').addEventListener('input',()=>{video.currentTime=Number(get('seek').value);update();});
  get('subtitles').addEventListener('click',()=>{
    const enabled=track.mode!=='showing'; track.mode=enabled?'showing':'disabled';
    get('subtitles').textContent=enabled?labels.on:labels.off;
    get('subtitles').setAttribute('aria-pressed',String(enabled));
  });
  get('mute').addEventListener('click',()=>{video.muted=!video.muted;});
  video.addEventListener('volumechange',()=>{
    get('mute').textContent=video.muted?labels.unmute:labels.mute;
    get('mute').setAttribute('aria-pressed',String(video.muted));
  });
  get('fullscreen').addEventListener('click',async()=>{
    try {
      if(document.fullscreenElement)await document.exitFullscreen();
      else if(player.requestFullscreen)await player.requestFullscreen();
      else {status.textContent=labels.fullscreen;}
    } catch(e){status.textContent=labels.fullscreen;}
  });
  video.addEventListener('play',()=>{
    cover.hidden=true;
    if(document.activeElement===cover)get('play').focus({preventScroll:true});
    update();
  });
  video.addEventListener('pause',()=>{attempt++;clearStatus();update();});
  video.addEventListener('ended',update);
  video.addEventListener('timeupdate',update);
  video.addEventListener('loadedmetadata',()=>{get('seek').disabled=false;update();});
  video.addEventListener('waiting',()=>{if(!video.paused)waiting();});
  video.addEventListener('playing',clearStatus);
  video.addEventListener('error',()=>{clearTimeout(loadingTimer);status.textContent=labels.error;});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  // Playback begins only after an explicit visitor action.
  cover.hidden=false; controls.hidden=false; update();
})();
