(() => {
'use strict';

/* ---------- Outils ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const VS = '︎';
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
const motionNeedsPermission = typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function';
const calm = () => !!(S && S.zen);

function hash(str){
  let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++){ const ch = str.charCodeAt(i); h1 = Math.imul(h1 ^ ch, 2654435761); h2 = Math.imul(h2 ^ ch, 1597334677); }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (h1 >>> 0) ^ ((h2 & 0x1fffff) << 3) >>> 0;
}
function rngFrom(str){
  let a = hash(str) >>> 0;
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
const pick = (r, arr) => arr[Math.floor(r() * arr.length)];
function shuffle(r, arr){ const a = arr.slice(); for (let i = a.length - 1; i > 0; i--){ const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

const pad = n => String(n).padStart(2, '0');
const dk = (d = new Date()) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
function addDays(key, n){ const [y,m,d] = key.split('-').map(Number); const t = new Date(y, m - 1, d + n); return dk(t); }
const fmtLong = new Intl.DateTimeFormat('fr-FR', {weekday:'long', day:'numeric', month:'long'});
const fmtBirth = new Intl.DateTimeFormat('fr-FR', {day:'numeric', month:'long', year:'numeric'});
const fmtShort = new Intl.DateTimeFormat('fr-FR', {day:'numeric', month:'short'});
const fromKey = k => { const [y,m,d] = k.split('-').map(Number); return new Date(y, m - 1, d); };

/* ---------- Stockage local ---------- */
const KEY = 'madame-voyance:v1';
let storageOK = true;
function defaultState(){
  return {consent:false, profile:null, points:0, streak:0, best:0, lastVisit:null, days:0, rituals:0,
          deck:'22', art:'rws', back:'nuit', totem:null, pet:true, journal:[], installHide:false, installBonus:false, today:{d:null, done:{}, draws:{}},
          zen:reduceMotion, sound:true, tilt:!motionNeedsPermission, seen:{}, gm:{}};
}
function load(){
  try {
    const raw = localStorage.getItem(KEY);
    localStorage.setItem(KEY + ':test', '1'); localStorage.removeItem(KEY + ':test');
    if (!raw) return defaultState();
    return Object.assign(defaultState(), JSON.parse(raw));
  } catch (e) { storageOK = false; return defaultState(); }
}
function save(){ try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { storageOK = false; } }
let S = load();
ART = artOf(S.art).id;
let shown = S.points;
/* Grimoire : on reprend les cartes déjà tirées avant cette version */
(function backfillSeen(){
  if (!S.seen || typeof S.seen !== 'object') S.seen = {};
  if (Object.keys(S.seen).length) return;
  for (const j of S.journal) if (j && j.id){ const e = S.seen[j.id] || (S.seen[j.id] = {n:0, d:j.d}); e.n++; }
  for (const k in (S.today.draws || {})) if (S.today.d) for (const id of S.today.draws[k]) if (!S.seen[id]) S.seen[id] = {n:1, d:S.today.d};
})();

/* ---------- Application installable (écran d'accueil, hors ligne) ---------- */
const inFrame = (() => { try { return window.self !== window.top; } catch (e) { return true; } })();
const standalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isTouch = (navigator.maxTouchPoints || 0) > 0;
let installEvt = null;
if (!inFrame){
  const head = document.head;
  const link = (rel, href, extra) => { const l = document.createElement('link'); l.rel = rel; l.href = href; if (extra) Object.assign(l, extra); head.appendChild(l); };
  const meta = (name, content) => { const m = document.createElement('meta'); m.name = name; m.content = content; head.appendChild(m); };
  link('manifest', 'manifest.webmanifest');
  link('apple-touch-icon', 'icons/apple-touch-icon.png');
  link('icon', 'icons/favicon-64.png', {type: 'image/png'});
  meta('apple-mobile-web-app-capable', 'yes');
  meta('mobile-web-app-capable', 'yes');
  meta('apple-mobile-web-app-status-bar-style', 'black-translucent');
  meta('apple-mobile-web-app-title', 'Madame Voyance');
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => {}));
  }
  window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installEvt = e; render(); });
  window.addEventListener('appinstalled', () => { installEvt = null; toast('Madame Voyance est sur votre écran d\'accueil'); render(); });
}
if (isIOS) document.documentElement.classList.add('ios');
const dateInput = (id, value) => `<div class="date-wrap${value ? ' has-value' : ''}"><input id="${id}" name="${id}" type="date" min="1900-01-01" max="${dk()}" value="${esc(value || '')}"><span class="date-ph" aria-hidden="true">Touchez pour choisir</span></div>`;
const syncDate = e => { const t = e.target; if (t && t.type === 'date' && t.parentNode.classList) t.parentNode.classList.toggle('has-value', !!t.value); };
document.addEventListener('input', syncDate);
document.addEventListener('change', syncDate);
const canInstall = () => !inFrame && !standalone() && (!!installEvt || isIOS || isTouch);

/* ---------- Profil et calculs ---------- */
const userKey = () => S.profile ? (S.profile.name.trim().toLowerCase() + '|' + S.profile.birth) : 'invite';
const userRng = key => rngFrom(userKey() + '|' + dk() + '|' + key);
const birthParts = b => { const [y,m,d] = b.split('-').map(Number); return {y, m, d}; };

function signIndex(m, d){
  const md = m * 100 + d;
  const starts = [[120,10],[219,11],[321,0],[420,1],[521,2],[621,3],[723,4],[823,5],[923,6],[1023,7],[1122,8],[1222,9]];
  let s = 9; for (const [v, i] of starts) if (md >= v) s = i; return s;
}
function chineseOf(b){
  const {y, m, d} = birthParts(b);
  const yy = (m < 2 || (m === 2 && d < 4)) ? y - 1 : y;
  const animal = ((yy - 4) % 12 + 12) % 12;
  return {animal, element: CH_ELEMENTS[((yy % 10) + 10) % 10], yin: yy % 2 === 1, year: yy};
}
const digitSum = n => String(n).split('').reduce((a, c) => a + (+c || 0), 0);
function reduceMaster(n){ while (n > 9 && n !== 11 && n !== 22 && n !== 33) n = digitSum(n); return n; }
function reduce9(n){ while (n > 9) n = digitSum(n); return n; }
function lifePath(b){ return reduceMaster(digitSum(b.replace(/-/g, ''))); }
function expressionNumber(name){
  const clean = name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z]/g, '');
  let s = 0; for (const ch of clean) s += ((ch.charCodeAt(0) - 97) % 9) + 1;
  return s ? reduceMaster(s) : 1;
}
function personalDay(b){
  const {m, d} = birthParts(b); const now = new Date();
  const year = reduce9(digitSum(d) + digitSum(m) + digitSum(now.getFullYear()));
  const month = reduce9(year + now.getMonth() + 1);
  return reduce9(month + digitSum(now.getDate()));
}

/* Lune : âge depuis la nouvelle lune de référence du 6 janvier 2000 */
const SYNODIC = 29.530588853;
function moonInfo(date = new Date()){
  const ref = Date.UTC(2000, 0, 6, 18, 14);
  const days = (date.getTime() - ref) / 86400000;
  const age = ((days % SYNODIC) + SYNODIC) % SYNODIC;
  const frac = age / SYNODIC;
  const illum = (1 - Math.cos(2 * Math.PI * frac)) / 2;
  const bounds = [1.84, 5.53, 9.23, 12.92, 16.61, 20.3, 23.99, 27.68];
  let idx = bounds.findIndex(b => age < b); if (idx === -1) idx = 0;
  const toFull = age < SYNODIC / 2 ? SYNODIC / 2 - age : SYNODIC * 1.5 - age;
  const toNew = SYNODIC - age;
  return {age, frac, illum, idx, nextFull: new Date(date.getTime() + toFull * 86400000), nextNew: new Date(date.getTime() + toNew * 86400000)};
}
function moonSVG(frac, size = 160){
  const r = 70, cx = 80, cy = 80;
  const k = Math.cos(2 * Math.PI * frac), rx = Math.abs(k * r).toFixed(2);
  let lit;
  if (frac < 0.5) lit = `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${k > 0 ? 0 : 1} ${cx} ${cy - r}Z`;
  else lit = `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${rx} ${r} 0 0 ${k > 0 ? 1 : 0} ${cx} ${cy - r}Z`;
  return `<svg viewBox="0 0 160 160" width="${size}" height="${size}" role="img" aria-label="Phase de la lune">
    <defs><radialGradient id="mg" cx="45%" cy="40%" r="65%"><stop offset="0" stop-color="#fff8e4"/><stop offset=".7" stop-color="#ead9a8"/><stop offset="1" stop-color="#b99a5c"/></radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#231a3d" stroke="rgba(230,195,120,.35)" stroke-width="1"/>
    <path d="${lit}" fill="url(#mg)"/>
    <g fill="rgba(120,100,70,.18)"><circle cx="58" cy="62" r="9"/><circle cx="96" cy="98" r="12"/><circle cx="104" cy="52" r="6"/><circle cx="66" cy="110" r="5"/></g>
  </svg>`;
}

/* ---------- Jeu de tarot ---------- */
const DECK78 = (() => {
  const out = MAJORS.map((c, i) => ({id:'m' + pad(i), name:c[0], num:ROMAN[i], keys:c[1], msg:c[2], tip:c[3], dom:'Arcane majeur : une grande énergie de vie', major:true}));
  for (const sk of ['w','c','s','p']){
    const s = SUITS[sk];
    s.cards.forEach((c, i) => {
      const of = /^[AEIOUÉ]/.test(s.name) ? "d'" : 'de ';
      out.push({id: sk + pad(i + 1), name: RANKS[i] + ' ' + of + s.name, keys:c[0], msg:c[1], tip:s.tip, dom:s.dom, major:false});
    });
  }
  return out;
})();
const CARD = Object.fromEntries(DECK78.map(c => [c.id, c]));
function drawSpread(n){
  const stored = S.today.draws && S.today.draws[n];
  if (stored) return stored.map(id => CARD[id]);
  const pool = S.deck === '78' ? DECK78 : DECK78.slice(0, 22);
  return shuffle(userRng('tarot' + n + '|' + S.deck), pool).slice(0, n);
}

/* ---------- Points, niveaux, séries ---------- */
function levelOf(p){ let i = 0; LEVELS.forEach((l, k) => { if (p >= l.p) i = k; }); return i; }
const isDone = id => !!S.today.done[id];
let toastQueue = [], toastBusy = false;
function toast(html){ toastQueue.push(html); if (!toastBusy) nextToast(); }
function nextToast(){
  const html = toastQueue.shift(); if (!html){ toastBusy = false; return; }
  toastBusy = true; const root = $('#toast-root');
  root.innerHTML = `<div class="toast" role="status">${html}</div>`;
  setTimeout(() => { root.innerHTML = ''; nextToast(); }, 2300);
}
function gain(pts, label){
  const before = levelOf(S.points);
  S.points += pts;
  toast(`<b>+${pts}</b> ✦ ${esc(label)}`);
  flyPoints(pts);
  const after = levelOf(S.points);
  if (after > before) setTimeout(() => levelUp(after), calm() ? 300 : 1300);
}
/* Grimoire : chaque carte tirée y est rangée ; compléter une famille rapporte un bonus */
function recordSeen(ids){
  const fresh = [];
  for (const id of ids){
    if (!S.seen[id]){ S.seen[id] = {n:0, d:dk()}; fresh.push(id); }
    S.seen[id].n++;
  }
  if (fresh.length) setTimeout(() => toast(fresh.length === 1 ? `✦ Nouvelle carte au grimoire : <b>${esc(CARD[fresh[0]].name)}</b>` : `✦ <b>${fresh.length}</b> nouvelles cartes au grimoire`), 700);
  const majors = DECK78.slice(0, 22).every(c => S.seen[c.id]), all = DECK78.every(c => S.seen[c.id]);
  if (majors && !S.gm.majors){ S.gm.majors = true; setTimeout(() => gain(100, 'Les 22 arcanes majeurs au grimoire'), 1400); }
  if (all && !S.gm.all){ S.gm.all = true; setTimeout(() => gain(300, 'Grimoire complet'), 1900); }
  save();
}
function award(id){
  if (isDone(id)) return false;
  const r = RITUALS.find(x => x.id === id);
  S.today.done[id] = true; S.rituals++;
  gain(r.pts, r.n);
  if (DAILY.every(x => S.today.done[x]) && !S.today.done.all){
    S.today.done.all = true;
    setTimeout(() => gain(DAILY_BONUS, 'Rituel du jour accompli'), 400);
  }
  save(); updateChip();
  return true;
}
function checkIn(){
  if (!S.profile) return;
  const today = dk();
  if (S.today.d === today) return;
  S.today = {d: today, done: {}, draws: {}};
  if (S.lastVisit === addDays(today, -1)) S.streak++; else S.streak = 1;
  S.best = Math.max(S.best, S.streak);
  S.lastVisit = today; S.days++;
  gain(VISIT_PTS, 'Visite du jour');
  const bonus = STREAK_BONUS[S.streak];
  if (bonus) setTimeout(() => gain(bonus, `Série de ${S.streak} jours`), 300);
  save();
}

/* ---------- Effets : ciel étoilé, étincelles, sons ---------- */
const sky = $('#sky'), sctx = sky.getContext('2d');
const fx = $('#fx'), fctx = fx.getContext('2d');
const nebula = $('.nebula');
const PAL = ['#fbe2a0','#fff3d6','#c9a8ff','#ff9ad5','#8fe9ff','#ffd27a'];
const STAR_COLS = ['#e9e2ff','#f5dc9c','#ffb8e2','#a8eeff'];
const rnd = arr => arr[Math.floor(Math.random() * arr.length)];
let W = 0, H = 0, DPR = 1, stars = [], shooters = [], particles = [], fxRunning = false, skyDirty = true;
let tiltX = 0, tiltY = 0, tX = 0, tY = 0;
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  for (const c of [sky, fx]){ c.width = W * DPR; c.height = H * DPR; }
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0); fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.round(Math.min(240, W * H / 3800));
  stars = Array.from({length:n}, () => {
    const q = Math.random();
    return {x: Math.random() * W, y: Math.random() * H, r: Math.random() < .9 ? Math.random() * 1 + .3 : Math.random() * 1.5 + 1.1,
      p: Math.random() * 6.28, s: .4 + Math.random() * 1.4, z: .25 + Math.random() * .9,
      c: q < .16 ? STAR_COLS[1] : q < .23 ? STAR_COLS[2] : q < .3 ? STAR_COLS[3] : STAR_COLS[0]};
  });
  skyDirty = true;
}
function drawSky(t){
  const still = calm();
  sctx.clearRect(0, 0, W, H);
  const ox = still ? 0 : tiltX * 16, oy = still ? 0 : tiltY * 16;
  for (const st of stars){
    const a = still ? .7 : .35 + .65 * (.5 + .5 * Math.sin(t / 1000 * st.s + st.p));
    const x = st.x + ox * st.z, y = st.y + oy * st.z;
    sctx.globalAlpha = a; sctx.fillStyle = st.c;
    sctx.beginPath(); sctx.arc(x, y, st.r, 0, 6.283); sctx.fill();
    if (st.r > 1.4){
      sctx.globalAlpha = a * .5; sctx.fillRect(x - st.r * 3.2, y - .4, st.r * 6.4, .8); sctx.fillRect(x - .4, y - st.r * 3.2, .8, st.r * 6.4);
      sctx.globalAlpha = a * .18; sctx.beginPath(); sctx.arc(x, y, st.r * 3.2, 0, 6.283); sctx.fill();
    }
  }
  if (!still){
    if (shooters.length < 2 && Math.random() < .004){
      shooters.push({x: Math.random() * W * .7 + W * .25, y: Math.random() * H * .45, vx: -(5 + Math.random() * 4), vy: 2 + Math.random() * 2.5, life: 0, max: 50 + Math.random() * 30, c: rnd(['255,240,200','255,198,236','191,240,255'])});
    }
    for (const sh of shooters){
      sh.life++;
      const x = sh.x + sh.vx * sh.life, y = sh.y + sh.vy * sh.life, len = 16;
      const g = sctx.createLinearGradient(x, y, x - sh.vx * len, y - sh.vy * len);
      g.addColorStop(0, `rgba(${sh.c},.95)`); g.addColorStop(1, `rgba(${sh.c},0)`);
      const fade = Math.max(0, 1 - sh.life / sh.max);
      sctx.globalAlpha = fade; sctx.strokeStyle = g; sctx.lineWidth = 1.8;
      sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x - sh.vx * len, y - sh.vy * len); sctx.stroke();
      sctx.fillStyle = `rgba(${sh.c},1)`; sctx.beginPath(); sctx.arc(x, y, 1.8, 0, 6.283); sctx.fill();
      if (sh.life % 3 === 0 && particles.length < 500) particles.push({x, y, vx: (Math.random() - .5) * .6, vy: Math.random() * .6, life: 0, max: 28, r: .8 + Math.random() * 1.2, c: `rgb(${sh.c})`, g: .01, dr: .98, star: true});
    }
    shooters = shooters.filter(sh => sh.life < sh.max);
    if (shooters.length) runFx();
  }
  sctx.globalAlpha = 1;
}
let lastSky = 0;
function skyLoop(t){
  if (!document.hidden){
    if (calm()){
      if (skyDirty){ tiltX = tiltY = 0; drawSky(0); skyDirty = false; nebula.style.setProperty('--tx', 0); nebula.style.setProperty('--ty', 0); }
    } else if (t - lastSky > 33){
      tiltX += (tX - tiltX) * .08; tiltY += (tY - tiltY) * .08;
      nebula.style.setProperty('--tx', tiltX.toFixed(3)); nebula.style.setProperty('--ty', tiltY.toFixed(3));
      drawSky(t); lastSky = t; skyDirty = true;
    }
  }
  requestAnimationFrame(skyLoop);
}
function runFx(){ if (!fxRunning){ fxRunning = true; requestAnimationFrame(fxLoop); } }
function sparkle(x, y, n = 18, spread = 1, pal){
  if (calm()) return;
  const P = pal || PAL;
  for (let i = 0; i < n && particles.length < 600; i++){
    const a = Math.random() * 6.283, v = (1 + Math.random() * 3.2) * spread;
    particles.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 0, max: 40 + Math.random() * 30, r: 1.5 + Math.random() * 2.5, c: rnd(P), g: .04, dr: .96, star: true});
  }
  runFx();
}
function sparkleAt(el, n, spread, pal){ const b = el.getBoundingClientRect(); sparkle(b.left + b.width / 2, b.top + b.height / 2, n, spread, pal); }
function ringAt(x, y, r1, c, w = 3){ if (calm()) return; particles.push({ring: true, x, y, r1, w, life: 0, max: 34, c}); runFx(); }
/* Particules aspirées vers le centre d'une carte qu'on charge */
function suck(cx, cy, rad, k){
  if (calm() || particles.length > 500) return;
  const a = Math.random() * 6.283, d = rad * (.85 + Math.random() * .6), f = 16 + Math.random() * 6;
  particles.push({x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d, vx: -Math.cos(a) * d / f, vy: -Math.sin(a) * d / f, life: 0, max: f, r: 1 + Math.random() * 1.6 * (1 + k), c: rnd(PAL), g: 0, dr: 1, star: true, fadeIn: true});
  runFx();
}
/* Pluie d'étoiles (passage de niveau) */
function starRain(ms){
  if (calm()) return;
  const end = performance.now() + ms;
  (function drop(){
    for (let k = 0; k < 5 && particles.length < 600; k++) particles.push({x: Math.random() * W, y: -12, vx: (Math.random() - .5) * .8, vy: 2 + Math.random() * 3, life: 0, max: 90 + Math.random() * 80, r: 1.6 + Math.random() * 2.6, c: rnd(PAL), g: .03, dr: .995, star: true, tw: Math.random() * 6});
    runFx();
    if (performance.now() < end) setTimeout(drop, 70);
  })();
}
function fxLoop(){
  fctx.clearRect(0, 0, W, H);
  particles = particles.filter(p => p.life < p.max);
  for (const p of particles){
    p.life++;
    const t = p.life / p.max;
    if (p.ring){
      const e = 1 - Math.pow(1 - t, 3);
      fctx.globalAlpha = (1 - t) * .9; fctx.strokeStyle = p.c; fctx.lineWidth = p.w * (1 - t) + .4;
      fctx.beginPath(); fctx.arc(p.x, p.y, p.r1 * e, 0, 6.283); fctx.stroke();
      continue;
    }
    p.x += p.vx; p.y += p.vy; p.vx *= p.dr; p.vy = p.vy * p.dr + p.g;
    let a = p.fadeIn ? Math.sin(Math.PI * t) : 1 - t;
    if (p.tw) a *= .6 + .4 * Math.sin(p.life * .3 + p.tw);
    const r = p.r * (0.6 + (1 - t) * .6);
    fctx.globalAlpha = Math.max(0, a); fctx.fillStyle = p.c;
    fctx.beginPath();
    fctx.moveTo(p.x, p.y - r * 2); fctx.quadraticCurveTo(p.x, p.y, p.x + r * 2, p.y); fctx.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 2);
    fctx.quadraticCurveTo(p.x, p.y, p.x - r * 2, p.y); fctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 2); fctx.fill();
  }
  fctx.globalAlpha = 1;
  if (particles.length) requestAnimationFrame(fxLoop); else { fxRunning = false; fctx.clearRect(0, 0, W, H); }
}
function flashAt(x, y){
  if (calm()) return;
  const f = $('#flash'); if (!f) return;
  f.style.setProperty('--fx', x + 'px'); f.style.setProperty('--fy', y + 'px');
  f.classList.remove('on'); void f.offsetWidth; f.classList.add('on');
}
function buzz(p){ if (calm()) return; try { if (navigator.vibrate) navigator.vibrate(p); } catch (e) {} }

/* Sons créés dans le navigateur, sans fichier : bol tibétain, carillon, souffle */
const Snd = (() => {
  let ctx = null, out = null, noise = null, riser = null, armed = false;
  /* Le navigateur n'autorise le son qu'après un premier geste de l'utilisateur */
  const arm = () => { armed = true; };
  ['pointerdown', 'keydown'].forEach(t => document.addEventListener(t, arm, {capture: true, once: true}));
  function ac(){
    if (!armed || !S.sound || calm()) return null;
    if (!ctx){
      const C = window.AudioContext || window.webkitAudioContext; if (!C) return null;
      try { ctx = new C(); } catch (e) { return null; }
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -16; comp.ratio.value = 4;
      out = ctx.createGain(); out.gain.value = .34; out.connect(comp); comp.connect(ctx.destination);
      const dl = ctx.createDelay(), fb = ctx.createGain(), lp = ctx.createBiquadFilter(), wet = ctx.createGain();
      dl.delayTime.value = .21; fb.gain.value = .34; lp.type = 'lowpass'; lp.frequency.value = 2600; wet.gain.value = .5;
      out.connect(dl); dl.connect(lp); lp.connect(fb); fb.connect(dl); lp.connect(wet); wet.connect(comp);
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    return ctx;
  }
  function tone(f, t, dur, vol, type, att){
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type || 'sine'; o.frequency.setValueAtTime(f, t);
    g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + (att || .01)); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + .05);
  }
  return {
    unlock(){ ac(); },
    bowl(f = 196, vol = .2){
      const c = ac(); if (!c) return; const t = c.currentTime;
      [[1, 1, 5], [2.76, .38, 3.6], [5.4, .16, 2.4], [8.93, .05, 1.6]].forEach(([m, v, d]) => {
        tone(f * m, t, d, vol * v, 'sine', .04); tone(f * m + .7, t, d, vol * v * .6, 'sine', .04);
      });
    },
    chime(){
      const c = ac(); if (!c) return; const t = c.currentTime;
      [1318.5, 1568, 1760, 2093, 2637].forEach((f, i) => { tone(f, t + i * .075, 1.9, .085, 'sine', .005); tone(f * 2, t + i * .075, .6, .02, 'triangle', .005); });
    },
    ding(){ const c = ac(); if (!c) return; const t = c.currentTime; tone(1760, t, .5, .08, 'sine', .004); tone(2637, t + .07, .7, .07, 'sine', .004); },
    twinkle(){ const c = ac(); if (!c) return; tone(rnd([2093, 2349, 2637, 3136, 3520]), c.currentTime, .7, .045, 'sine', .004); },
    riser(dur){
      const c = ac(); if (!c) return; const t = c.currentTime;
      const g = c.createGain(), o1 = c.createOscillator(), o2 = c.createOscillator(), lfo = c.createOscillator(), lg = c.createGain();
      o1.type = 'sine'; o2.type = 'triangle';
      o1.frequency.setValueAtTime(260, t); o1.frequency.exponentialRampToValueAtTime(1040, t + dur);
      o2.frequency.setValueAtTime(390, t); o2.frequency.exponentialRampToValueAtTime(1560, t + dur);
      lfo.frequency.setValueAtTime(7, t); lfo.frequency.linearRampToValueAtTime(22, t + dur); lg.gain.value = .03;
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.07, t + dur);
      lfo.connect(lg); lg.connect(g.gain); o1.connect(g); o2.connect(g); g.connect(out);
      [o1, o2, lfo].forEach(o => { o.start(t); o.stop(t + dur + 2); });
      riser = {g, t};
    },
    stopRiser(){ if (!riser || !ctx) return; const t = ctx.currentTime, g = riser.g.gain; try { g.cancelScheduledValues(t); g.setValueAtTime(Math.max(g.value, .0002), t); g.exponentialRampToValueAtTime(.0001, t + .15); } catch (e) {} riser = null; },
    whoosh(vol = .05){
      const c = ac(); if (!c) return; const t = c.currentTime;
      if (!noise){ noise = c.createBuffer(1, c.sampleRate * .8, c.sampleRate); const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      const s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
      s.buffer = noise; bp.type = 'bandpass'; bp.Q.value = 1.2;
      bp.frequency.setValueAtTime(500, t); bp.frequency.exponentialRampToValueAtTime(2200, t + .25); bp.frequency.exponentialRampToValueAtTime(700, t + .6);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .18); g.gain.exponentialRampToValueAtTime(.0001, t + .6);
      s.connect(bp); bp.connect(g); g.connect(out); s.start(t); s.stop(t + .7);
    }
  };
})();

/* Points : « +10 » qui s'envole et étoiles qui filent jusqu'au compteur */
let lastTap = null, countRaf = 0;
function tapPoint(){
  if (lastTap && performance.now() - lastTap.t < 1600) return lastTap;
  return {x: W / 2, y: H * .38};
}
function floatText(txt, x, y){
  if (calm()) return;
  const el = document.createElement('span'); el.className = 'float-pts'; el.textContent = txt;
  el.style.left = x + 'px'; el.style.top = y + 'px';
  document.body.appendChild(el); setTimeout(() => el.remove(), 1400);
}
function flyPoints(pts){
  const o = tapPoint();
  floatText('+' + pts, o.x, o.y);
  if (calm() || !document.body.animate){ animateCount(); return; }
  requestAnimationFrame(() => {
    const chip = $('#pchip'); let tx = W - 46, ty = 22;
    if (chip){ const b = chip.getBoundingClientRect(); if (b.bottom > 0 && b.top < H){ tx = b.left + 16; ty = b.top + b.height / 2; } }
    const n = Math.min(10, 3 + Math.round(pts / 5));
    let left = n;
    for (let i = 0; i < n; i++){
      const s = document.createElement('span'); s.className = 'flystar'; s.textContent = '✦';
      s.style.setProperty('--c', rnd(PAL)); document.body.appendChild(s);
      const a = Math.random() * 6.283, d = 30 + Math.random() * 50;
      const mx = o.x + Math.cos(a) * d, my = o.y + Math.sin(a) * d - 20;
      const anim = s.animate([
        {transform: `translate(${o.x - 8}px,${o.y - 8}px) scale(.3)`, opacity: 0},
        {transform: `translate(${mx - 8}px,${my - 8}px) scale(1.25)`, opacity: 1, offset: .35},
        {transform: `translate(${tx - 8}px,${ty - 8}px) scale(.45)`, opacity: .9}
      ], {duration: 720 + i * 55, easing: 'cubic-bezier(.45,0,.7,.2)', delay: i * 25});
      anim.onfinish = () => {
        s.remove();
        if (--left === 0){
          Snd.ding();
          const c = $('#pchip'); if (c){ c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
          animateCount();
        }
      };
    }
  });
}
function lvPct(p){ const lv = levelOf(p), next = LEVELS[lv + 1]; return next ? Math.max(0, Math.min(100, Math.round((p - LEVELS[lv].p) / (next.p - LEVELS[lv].p) * 100))) : 100; }
function paintPoints(){
  document.querySelectorAll('[data-pts]').forEach(n => { n.textContent = shown; });
  document.querySelectorAll('[data-lvbar]').forEach(b => { b.style.width = lvPct(shown) + '%'; });
}
function animateCount(){
  cancelAnimationFrame(countRaf);
  const from = shown, to = S.points, t0 = performance.now(), dur = calm() ? 0 : Math.min(1300, 450 + Math.abs(to - from) * 10);
  const tick = now => {
    const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - Math.pow(1 - k, 3);
    shown = Math.round(from + (to - from) * e); paintPoints();
    if (k < 1) countRaf = requestAnimationFrame(tick);
  };
  countRaf = requestAnimationFrame(tick);
}

/* Effet de profondeur : le ciel suit l'inclinaison du téléphone (ou la souris) */
const tiltSupported = typeof DeviceOrientationEvent !== 'undefined' && isTouch;
let tiltOn = false, tiltAsked = false;
function onOrient(e){
  if (e.gamma == null || !S.tilt) return;
  tX = Math.max(-1, Math.min(1, e.gamma / 30)); tY = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30));
}
function enableTilt(fromGesture){
  if (!tiltSupported || tiltOn || !S.tilt) return;
  if (motionNeedsPermission){
    if (!fromGesture) return;
    DeviceOrientationEvent.requestPermission().then(r => {
      if (r === 'granted'){ window.addEventListener('deviceorientation', onOrient); tiltOn = true; }
      else { S.tilt = false; save(); if (UI.view === 'profil') render(); }
    }).catch(() => {});
  } else { window.addEventListener('deviceorientation', onOrient); tiltOn = true; }
}

/* Ciel selon l'heure */
const TOD_COLORS = {aube:'#1c1036', jour:'#1a1646', crepuscule:'#150b2e', nuit:'#0a0616'};
function setTod(){
  const h = new Date().getHours();
  const tod = h >= 5 && h < 9 ? 'aube' : h >= 9 && h < 17 ? 'jour' : h >= 17 && h < 21 ? 'crepuscule' : 'nuit';
  if (document.documentElement.dataset.tod !== tod){
    document.documentElement.dataset.tod = tod;
    const m = document.querySelector('meta[name="theme-color"]'); if (m) m.content = TOD_COLORS[tod];
  }
}
function applyZen(){ document.documentElement.classList.toggle('zen', calm()); skyDirty = true; if (calm()){ tX = tY = 0; } }

/* Pierres précieuses aux coins des cadres dorés */
const GEMS = '<i class="gemc tl" aria-hidden="true"></i><i class="gemc tr" aria-hidden="true"></i><i class="gemc bl" aria-hidden="true"></i><i class="gemc br" aria-hidden="true"></i>';
let decoQueued = false;
function decorate(){ decoQueued = false; document.querySelectorAll('.frame:not([data-gems])').forEach(f => { f.dataset.gems = '1'; f.insertAdjacentHTML('beforeend', GEMS); }); }
new MutationObserver(() => { if (!decoQueued){ decoQueued = true; requestAnimationFrame(decorate); } }).observe(document.body, {childList: true, subtree: true});

/* ---------- État d'interface ---------- */
const VIEWS = ['accueil','tarot','astres','oracles','profil'];
const ROUTES = VIEWS.concat(['grimoire']);
const UI = {view:'accueil', tarot:1, astres:'zodiaque', oracle:null, flips:new Set(), confirmErase:false, compat:null, pendulum:null, gsuit:'m', tq:null};

/* ---------- Petits morceaux d'interface ---------- */
const ICONS = {
  accueil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.5a8 8 0 1 0 3 12.6A6.5 6.5 0 0 1 16.5 4.5z"/><path d="M18.5 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 5.5 18 5z"/></svg>',
  tarot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3.5" y="5" width="10" height="15" rx="1.5" transform="rotate(-10 8.5 12.5)"/><rect x="10.5" y="4" width="10" height="15" rx="1.5" transform="rotate(8 15.5 11.5)"/><path d="M15.6 9.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor"/></svg>',
  astres:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 2.5l2 6.5 6.5 3-6.5 3-2 6.5-2-6.5-6.5-3 6.5-3z"/><circle cx="19" cy="5" r="1" fill="currentColor"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>',
  oracles:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  profil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  sndOn:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" fill-opacity=".25"/><path d="M15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
  sndOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor" fill-opacity=".2"/><path d="M16 9.5l5 5M21 9.5l-5 5"/></svg>',
  spark:'<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="currentColor"/></svg>'
};
const NAV_LABELS = {accueil:'Accueil', tarot:'Tarot', astres:'Astres', oracles:'Oracles', profil:'Profil'};

/* Lune de fidélité : la série remplit une lune en 7 jours */
function litPath(frac, cx, cy, r){
  const k = Math.cos(2 * Math.PI * frac), rx = Math.abs(k * r).toFixed(2);
  return frac < 0.5
    ? `M${cx} ${cy - r} A${r} ${r} 0 0 1 ${cx} ${cy + r} A${rx} ${r} 0 0 ${k > 0 ? 0 : 1} ${cx} ${cy - r}Z`
    : `M${cx} ${cy - r} A${r} ${r} 0 0 0 ${cx} ${cy + r} A${rx} ${r} 0 0 ${k > 0 ? 1 : 0} ${cx} ${cy - r}Z`;
}
const streakPos = () => ((Math.max(1, S.streak) - 1) % 7) + 1;
function moonMini(step, cls){
  const frac = step / 7 * 0.5;
  return `<svg viewBox="0 0 20 20" class="${cls || ''}" aria-hidden="true"><circle cx="10" cy="10" r="8.5" fill="#2a2050" stroke="rgba(230,195,120,.45)" stroke-width=".8"/><path d="${litPath(frac, 10, 10, 8.5)}" fill="#f6e4b0"/></svg>`;
}
function moonRow(){
  const p = streakPos();
  const moons = Array.from({length:7}, (_, i) => moonMini(i + 1, i + 1 < p ? '' : i + 1 === p ? 'now' : 'off')).join('');
  const nextB = Object.keys(STREAK_BONUS).map(Number).find(k => k > S.streak);
  return `<div class="moons" aria-hidden="true">${moons}</div>
    <div class="small moon-note"><span>${p === 7 ? 'Pleine lune : 7 jours d\'affilée' : `Pleine lune dans ${7 - p} jour${7 - p > 1 ? 's' : ''}`}</span>${nextB ? `<span class="muted">Bonus de ${STREAK_BONUS[nextB]} pts à ${nextB} jours</span>` : ''}</div>`;
}
function chipInner(){ return `${ICONS.spark}<span data-pts>${shown}</span><span class="sep"></span>${moonMini(streakPos(), 'mmini')}<span>${S.streak} j</span>`; }
function topbar(){
  const on = S.sound && !S.zen;
  return `<div class="topbar"><span class="brand-mini">Madame Voyance</span>
    <div class="tb-right"><button class="snd" data-act="sound" aria-pressed="${on}" aria-label="${on ? 'Couper les sons' : 'Activer les sons'}">${on ? ICONS.sndOn : ICONS.sndOff}</button>
    <a class="chip" href="#profil" id="pchip" aria-label="Mes points et ma série">${chipInner()}</a></div></div>`;
}
function updateChip(){ const c = $('#pchip'); if (c) c.innerHTML = chipInner(); }
function revealBtn(id, label){
  const r = RITUALS.find(x => x.id === id);
  return `<button class="btn btn-gold btn-wide" data-act="reveal" data-id="${id}">${label} <span class="pts">+${r.pts}</span></button>`;
}
function starRating(n){ return `<span class="stars" aria-label="${n} sur 5">${'★'.repeat(n)}<span class="off">${'★'.repeat(5 - n)}</span></span>`; }
function backFace(id){ return `<span class="face back back-${id}"></span>`; }
function cardFront(c){ return `<span class="face front"><img src="${cardImg(c.id)}" alt="${esc(c.name)}" loading="lazy"><span class="fallback">${esc(c.name)}</span></span>`; }

/* ---------- Vue : Accueil ---------- */
function vAccueil(){
  const p = S.profile, z = ZODIAC[signIndex(birthParts(p.birth).m, birthParts(p.birth).d)];
  const now = new Date(), h = now.getHours();
  const hello = h < 5 ? 'Belle nuit' : h < 18 ? 'Bonjour' : 'Bonsoir';
  const doy = Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
  const thought = THOUGHTS[(doy + now.getFullYear()) % THOUGHTS.length];
  const mi = moonInfo();
  const done = DAILY.filter(isDone).length;
  const lv = levelOf(S.points), next = LEVELS[lv + 1];
  const pct = next ? Math.round((S.points - LEVELS[lv].p) / (next.p - LEVELS[lv].p) * 100) : 100;
  const si = signIndex(birthParts(p.birth).m, birthParts(p.birth).d);
  const card = drawSpread(1)[0], cardDone = isDone('tarot1'), horoDone = isDone('horo');
  const ptsOf = id => RITUALS.find(r => r.id === id).pts;
  return `<section class="view">
    ${topbar()}
    <header class="hero">
      <h1 class="wordmark gold"><small>Madame</small>Voyance</h1>
      <div class="date-line"><span>${cap(fmtLong.format(now))}</span><span class="dot"></span><span>${MOON_PHASES[mi.idx].n}</span></div>
      <div class="greet">${hello}, ${esc(p.name)}</div>
    </header>

    <article class="frame h-pensee" aria-labelledby="pt">
      <div class="h-eyebrow" id="pt" style="text-align:center">Pensée du jour</div>
      <p class="thought">« ${esc(thought)} »</p>
      <div class="thought-foot"><button class="btn btn-ghost btn-sm" data-act="breathe">Respirer avec elle${isDone('pensee') ? '' : ' <span class="pts">+5</span>'}</button></div>
    </article>

    ${canInstall() && !S.installHide ? `<div class="install-banner">
      <img src="icons/icon-192.png" alt="" width="48" height="48">
      <div class="grow"><b>Gardez Madame Voyance à portée de main</b><span class="small muted">Sur votre écran d'accueil, comme une vraie app, même hors ligne. +50 points</span></div>
      <div class="ib-actions"><button class="btn btn-gold btn-sm" data-act="install">${installEvt ? 'Installer' : 'Comment faire'}</button>
      <button class="ib-close" data-act="install-hide" aria-label="Masquer">×</button></div>
    </div>` : ''}

    <section class="stack" aria-labelledby="rt">
      <div class="section-head"><h2 id="rt">Votre rituel du jour</h2><span class="count">${done} / ${DAILY.length}</span></div>
      <div class="daily2">
        <div class="dtile hue-tile h-tarot ${cardDone ? 'done' : ''}">
          <div class="dt-head"><span class="h-eyebrow">Carte du jour</span><span class="badge ${cardDone ? 'ok' : ''}">${cardDone ? '✓' : '+' + ptsOf('tarot1')}</span></div>
          <div class="tcard home-card ${cardDone ? 'flipped' : ''}" role="button" tabindex="0" data-act="homeflip" data-card="${card.id}" aria-label="${cardDone ? esc(card.name) : 'Retourner ma carte du jour'}">
            <span class="tc-inner">${backFace(S.back)}${cardFront(card)}</span>
          </div>
          ${cardDone
            ? `<div class="dt-name">${esc(card.name)}</div><div class="dt-text">${esc(card.msg)}</div><button class="dt-link" data-act="card" data-card="${card.id}">Voir la carte</button>`
            : `<div class="dt-name"><span class="hint-hold"><i></i>Gardez le doigt dessus</span></div>`}
        </div>
        <div class="dtile hue-tile h-horo ${horoDone ? 'done' : ''}">
          <div class="dt-head"><span class="h-eyebrow">Horoscope</span><span class="badge ${horoDone ? 'ok' : ''}">${horoDone ? '✓' : '+' + ptsOf('horo')}</span></div>
          <div class="glyph-orb dt-orb"><span>${z.g}${VS}</span></div>
          <div class="dt-name">${z.n}</div>
          ${horoDone
            ? `<div class="dt-text">${esc(horoscopeFor(si).open)}</div><button class="dt-link" data-act="go" data-go='["astres","zodiaque"]'>Lire en entier</button>`
            : `<button class="btn btn-gold btn-sm" data-act="reveal" data-id="horo">Révéler</button>`}
        </div>
      </div>
      <p class="small muted" style="margin:0;text-align:center">${done === DAILY.length
        ? '✦ Rituel accompli. Les étoiles vous retrouvent demain.'
        : `Faites les deux pour un bonus de ${DAILY_BONUS} points.`}</p>
    </section>

    <div class="explore">
      <span class="small muted">Envie d'aller plus loin ?</span>
      <div class="explore-links">
        <button class="h-tarot" data-act="go" data-go='["tarot",3]'>Tirage 3 cartes</button>
        <button class="h-lune" data-act="go" data-go='["astres","lune"]'>Lune</button>
        <button class="h-numero" data-act="go" data-go='["oracles"]'>Oracles</button>
        <button class="h-rune" data-act="go" data-go='["grimoire"]'>Grimoire</button>
      </div>
    </div>

    <a class="frame-plain levelbar" href="#profil" style="text-decoration:none;color:inherit">
      <div class="lv-row"><span class="lv-name">${esc(LEVELS[lv].t)}</span><span class="count"><span data-pts>${shown}</span> pts</span></div>
      <div class="track"><i data-lvbar style="width:${lvPct(shown)}%"></i></div>
      <div class="small muted">${next ? `Encore ${next.p - S.points} points pour devenir ${esc(next.t)}` : 'Vous avez atteint le plus haut niveau.'} · Série : ${S.streak} jour${S.streak > 1 ? 's' : ''}</div>
      ${moonRow()}
    </a>
    ${legalLinks()}
  </section>`;
}

/* ---------- Vue : Tarot ---------- */
function vTarot(){
  const n = UI.tarot, sp = SPREADS[n], id = 'tarot' + n, done = isDone(id);
  const cards = drawSpread(n);
  const flipped = i => done || UI.flips.has(i);
  const deckLocked = !!S.today.draws[n];
  let reading = '';
  if (done){
    if (n === 1){
      const c = cards[0];
      reading = `<div class="frame daily-read">
        <div class="pos">${c.major ? 'Arcane ' + c.num : 'Arcane mineur'}</div>
        <div class="cname">${esc(c.name)}</div>
        <div class="keys">${esc(c.keys)}</div>
        <p class="msg" style="margin:6px 0 4px">${esc(c.msg)}</p>
        <div class="tip"><span>✦</span><span>${esc(c.tip)}</span></div>
        <div class="small muted">${esc(c.dom)}</div>
      </div>`;
    } else {
      reading = `<div class="reading">${cards.map((c, i) => `<button class="read-row" data-act="card" data-card="${c.id}">
        <img src="${cardImg(c.id)}" alt="" loading="lazy">
        <span><span class="pos">${i + 1}. ${esc(sp.pos[i])}</span><div class="cname">${esc(c.name)}</div><div class="keys">${esc(c.keys)}</div><div class="msg">${esc(c.msg)}</div></span>
      </button>`).join('')}</div>`;
    }
  }
  return `<section class="view h-tarot">
    ${topbar()}
    <div><div class="h-eyebrow">Le tarot</div><h1 class="h-title gold">${esc(sp.label)}</h1></div>
    <div class="seg" role="group" aria-label="Type de tirage">
      ${[1,3,10].map(k => `<button data-act="tmode" data-n="${k}" aria-pressed="${k === n}">${k === 1 ? 'Carte du jour' : k === 3 ? '3 cartes' : 'Croix celtique'}</button>`).join('')}
    </div>
    <div class="deck-choice">
      <span class="small muted">${deckLocked ? 'Tirage du jour fixé' : 'Jeu utilisé'}</span>
      <div class="seg" role="group" aria-label="Jeu de cartes" style="min-width:220px">
        <button data-act="deck" data-deck="22" aria-pressed="${S.deck === '22'}">22 arcanes</button>
        <button data-act="deck" data-deck="78" aria-pressed="${S.deck === '78'}">78 cartes</button>
      </div>
    </div>
    <div class="deck-choice art-choice">
      <span class="small muted">Illustrations</span>
      <div class="seg art-seg" role="group" aria-label="Illustrations des cartes">
        ${DECK_ARTS.map(a => `<button data-act="art" data-id="${a.id}" aria-pressed="${ART === a.id}">${esc(a.n)}</button>`).join('')}
      </div>
    </div>
    <div class="stage">
      <div class="spread n${n}">
        ${cards.map((c, i) => `<div class="slot">
          <div class="tcard ${flipped(i) ? 'flipped' : ''}" role="button" tabindex="0" data-act="flip" data-i="${i}" data-card="${c.id}" aria-label="${flipped(i) ? esc(c.name) : 'Carte face cachée, ' + esc(sp.pos[i])}">
            <span class="tc-inner">${backFace(S.back)}${cardFront(c)}</span>
          </div>
          ${n > 1 ? `<span class="slot-label">${n === 10 ? (i + 1) + '. ' : ''}${esc(sp.pos[i])}</span>` : ''}
        </div>`).join('')}
      </div>
      ${done ? `<div class="tap-hint">Touchez une carte pour la voir en grand</div>`
             : `<div class="tap-hint"><span class="hint-hold"><i></i>Concentrez-vous sur votre question, puis gardez le doigt sur ${n === 1 ? 'la carte' : 'chaque carte'} pour la charger d'énergie</span><br>+${sp.pts} points</div>`}
    </div>
    ${reading}
    ${grimLink()}
  </section>`;
}

/* ---------- Vue : Astres ---------- */
function zodiacWheel(si){
  const R = 43, parts = [];
  for (let k = 0; k < 72; k++){ const a = k / 72 * 6.2832; parts.push(`<circle cx="${(50 + 48.5 * Math.cos(a)).toFixed(2)}" cy="${(50 + 48.5 * Math.sin(a)).toFixed(2)}" r="${k % 6 === 0 ? .7 : .35}" fill="rgba(230,195,120,.55)"/>`); }
  ZODIAC.forEach((z, k) => {
    const a = (k / 12) * 6.2832 - Math.PI / 2, a2 = a + Math.PI / 12;
    parts.push(`<line x1="${(50 + 37 * Math.cos(a2)).toFixed(2)}" y1="${(50 + 37 * Math.sin(a2)).toFixed(2)}" x2="${(50 + 47 * Math.cos(a2)).toFixed(2)}" y2="${(50 + 47 * Math.sin(a2)).toFixed(2)}" stroke="rgba(230,195,120,.3)" stroke-width=".4"/>`);
    parts.push(`<text x="${(50 + R * Math.cos(a)).toFixed(2)}" y="${(50 + R * Math.sin(a)).toFixed(2)}" text-anchor="middle" dominant-baseline="central" class="${k === si ? 'me' : ''}">${z.g}${VS}</text>`);
  });
  return `<div class="zwheel"><svg class="zring" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" stroke="rgba(230,195,120,.4)" stroke-width=".5"/><circle cx="50" cy="50" r="37" stroke="rgba(230,195,120,.3)" stroke-width=".4"/>${parts.join('')}</svg>
    <div class="glyph-orb"><span>${ZODIAC[si].g}${VS}</span></div></div>`;
}
function constellation(i){
  const c = CONSTEL[i];
  const lines = c.e.map(([a, b], k) => `<path d="M${c.p[a][0]} ${c.p[a][1]}L${c.p[b][0]} ${c.p[b][1]}" pathLength="1" style="--d:${(k * .2).toFixed(2)}s"/>`).join('');
  const dots = c.p.map(([x, y], k) => { const big = c.b.includes(k); return `<circle cx="${x}" cy="${y}" r="${big ? 1.9 : 1.2}" class="${big ? 'big' : ''}" style="--d:${(k * .1).toFixed(2)}s"/>`; }).join('');
  return `<svg class="constel" viewBox="-4 -4 108 68" role="img" aria-label="Constellation ${ZODIAC_DE[i]}">${lines}${dots}</svg>`;
}
function horoscopeFor(i){
  const z = ZODIAC[i], r = rngFrom(dk() + '|horo|' + i);
  const p = z.pl, P = cap(p);
  return {open: pick(r, HORO.open).replace('{P}', P).replace('{p}', p),
    amour: pick(r, HORO.amour), travail: pick(r, HORO.travail), energie: pick(r, HORO.energie), conseil: pick(r, HORO.conseil),
    s: [2 + Math.floor(r() * 4), 2 + Math.floor(r() * 4), 2 + Math.floor(r() * 4)]};
}
function horoBlock(i){
  const h = horoscopeFor(i);
  return `<div class="horo">
    <p class="lead" style="margin:0;text-align:center;font-style:italic">${esc(h.open)}</p>
    <div class="horo-item amour"><div class="horo-head"><b>Amour</b>${starRating(h.s[0])}</div><div class="msg" style="margin:0">${esc(h.amour)}</div></div>
    <div class="horo-item travail"><div class="horo-head"><b>Travail &amp; argent</b>${starRating(h.s[1])}</div><div class="msg" style="margin:0">${esc(h.travail)}</div></div>
    <div class="horo-item energie"><div class="horo-head"><b>Énergie</b>${starRating(h.s[2])}</div><div class="msg" style="margin:0">${esc(h.energie)}</div></div>
    <div class="tip"><span>✦</span><span><b>Conseil :</b> ${esc(h.conseil)}</span></div>
  </div>`;
}
function vAstres(){
  const b = S.profile.birth, {m, d} = birthParts(b), si = signIndex(m, d), z = ZODIAC[si];
  let body = '';
  if (UI.astres === 'zodiaque'){
    body = `<div class="sign-hero">
        ${zodiacWheel(si)}
        <h2 class="h-title gold" style="font-size:24px">${z.n}</h2>
        <div class="small muted">${z.d}</div>
        <div class="facts"><span class="fact">${z.el}</span><span class="fact">Planète : ${cap(z.pl)}</span></div>
        <p class="small muted" style="margin:4px 0 0;max-width:34ch">${esc(z.t)}</p>
      </div>
      <figure class="frame-plain constel-box">${constellation(si)}<figcaption>La constellation ${ZODIAC_DE[si]}</figcaption></figure>
      ${isDone('horo') ? `<div class="frame">${horoBlock(si)}</div>` : revealBtn('horo', 'Révéler mon horoscope')}
      <div class="stack"><div class="section-head"><h2>Les autres signes</h2></div>
        <div class="signs">${ZODIAC.map((s, k) => `<button data-act="sign" data-i="${k}" aria-label="${s.n}" aria-current="${k === si}">${s.g}${VS}</button>`).join('')}</div>
      </div>`;
  } else if (UI.astres === 'chinois'){
    const ch = chineseOf(b), a = CHINESE[ch.animal];
    const friends = CH_TRINES.find(t => t.includes(ch.animal)).filter(x => x !== ch.animal).map(x => CHINESE[x].n).join(' et ');
    const msg = pick(userRng('chinois'), CH_DAILY).replace('{a}', a.n);
    body = `<div class="sign-hero">
        <div class="glyph-orb"><span class="cjk">${a.h}</span></div>
        <h2 class="h-title gold" style="font-size:24px">${a.n} de ${ch.element}</h2>
        <div class="facts"><span class="fact">Année ${ch.year}</span><span class="fact">${ch.yin ? 'Yin' : 'Yang'}</span></div>
        <div class="keys" style="margin-top:4px">${esc(a.q)}</div>
        <p class="small muted" style="margin:4px 0 0;max-width:34ch">${esc(a.t)}</p>
      </div>
      ${isDone('chinois') ? `<div class="frame stack" style="text-align:center">
          <div class="h-eyebrow">Message du jour</div>
          <p class="lead" style="margin:0">${esc(msg)}</p>
          <div class="small muted">Signes en affinité : ${friends}</div>
        </div>` : revealBtn('chinois', 'Lire le message du jour')}
      <p class="small muted" style="margin:0;text-align:center">L'année chinoise est comptée ici à partir du 4 février (début du printemps chinois).</p>`;
  } else {
    const mi = moonInfo(), ph = MOON_PHASES[mi.idx];
    body = `<div class="moon-wrap">
        ${moonSVG(mi.frac)}
        <h2 class="h-title gold" style="font-size:24px">${ph.n}</h2>
        <div class="small muted">Lune visible à ${Math.round(mi.illum * 100)} %</div>
      </div>
      <div class="stat-row">
        <div class="stat"><b>${Math.floor(mi.age)} j</b><span>âge de la lune</span></div>
        <div class="stat"><b>${fmtShort.format(mi.nextFull)}</b><span>prochaine pleine lune</span></div>
        <div class="stat"><b>${fmtShort.format(mi.nextNew)}</b><span>prochaine nouvelle lune</span></div>
      </div>
      ${isDone('lune') ? `<div class="frame stack">
          <p class="lead" style="margin:0;text-align:center">${esc(ph.c)}</p>
          <div class="tip"><span>☾${VS}</span><span><b>Rituel :</b> ${esc(ph.r)}</span></div>
        </div>` : revealBtn('lune', 'Recevoir le conseil de la lune')}`;
  }
  const hue = UI.astres === 'chinois' ? 'h-chinois' : UI.astres === 'lune' ? 'h-lune' : 'h-horo';
  return `<section class="view ${hue}">
    ${topbar()}
    <div><div class="h-eyebrow">Les astres</div><h1 class="h-title gold">Votre ciel du jour</h1></div>
    <div class="seg" role="group" aria-label="Section">
      ${[['zodiaque','Zodiaque'],['chinois','Chinois'],['lune','Lune']].map(([k, l]) => `<button data-act="amode" data-m="${k}" aria-pressed="${UI.astres === k}">${l}</button>`).join('')}
    </div>
    ${body}
  </section>`;
}

/* ---------- Animal totem ---------- */
const TOT = Object.fromEntries(TOTEMS.map(t => [t.id, t]));
const TQ = (() => {   // moyenne et écart-type de chaque trait pour des réponses au hasard : chaque trait pèse autant
  const mean = TOTEM_AXES.map(() => 0), vr = TOTEM_AXES.map(() => 0);
  TOTEM_QUIZ.forEach(q => {
    const vs = q.a.map(a => TOTEM_AXES.map(k => a[1][k] || 0));
    TOTEM_AXES.forEach((_, i) => { const m = vs.reduce((s, v) => s + v[i], 0) / vs.length; mean[i] += m; vr[i] += vs.reduce((s, v) => s + (v[i] - m) ** 2, 0) / vs.length; });
  });
  return {mean, sd: vr.map(v => Math.sqrt(v) || 1)};
})();
const vlen = v => Math.hypot(...v) || 1;
const cosine = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0) / (vlen(a) * vlen(b));
const birthEl = () => { const bp = birthParts(S.profile.birth); return ZODIAC[signIndex(bp.m, bp.d)]; };
function totemRank(answers){
  const u = TOTEM_AXES.map(() => 0);
  answers.forEach((ai, qi) => { const d = TOTEM_QUIZ[qi].a[ai][1]; for (const k in d) u[TOTEM_AXES.indexOf(k)] += d[k]; });
  const z = u.map((x, i) => (x - TQ.mean[i]) / TQ.sd[i]), el = birthEl().el;
  return TOTEMS.map(t => ({t, s: cosine(z, t.v) + (t.el === el ? TOTEM_EL_BONUS : 0)})).sort((a, b) => b.s - a.s);
}
const totemFriends = t => TOTEMS.filter(o => o.id !== t.id).map(o => ({o, s: cosine(t.v, o.v)})).sort((a, b) => b.s - a.s).slice(0, 2).map(x => x.o);
const sprite = (id, cls) => `<span class="tsprite ${cls || ''}" style="--sp:url('totems/${id}.png')" aria-hidden="true"></span>`;
const isNight = () => { const h = new Date().getHours(); return h >= 22 || h < 6; };

function totemBody(){
  if (UI.tq){
    const i = UI.tq.i, q = TOTEM_QUIZ[i];
    return `<div class="tq">
      <div class="tq-head"><span class="h-eyebrow">Question ${i + 1} / ${TOTEM_QUIZ.length}</span>
        <button class="dt-link" data-act="tq-back">${i ? 'Précédente' : 'Quitter'}</button></div>
      <div class="track"><i style="width:${Math.round(i / TOTEM_QUIZ.length * 100)}%"></i></div>
      <h2 class="tq-q">${esc(q.q)}</h2>
      <div class="tq-answers">${q.a.map((a, k) => `<button class="tq-a" data-act="tq-a" data-k="${k}" aria-pressed="${UI.tq.ans[i] === k}">${esc(a[0])}</button>`).join('')}</div>
    </div>`;
  }
  if (!S.totem || !TOT[S.totem.id]){
    const z = birthEl();
    return `<div class="frame stack totem-intro">
        <div class="totem-parade">${['loup','hibou','renard','dauphin','papillon','ours'].map(id => sprite(id)).join('')}</div>
        <p class="lead" style="margin:0">Quarante animaux veillent sur Madame Voyance. Lequel vous ressemble ?</p>
        <p class="small muted" style="margin:0">Vingt questions sur votre façon d'être. Votre élément de naissance, ${esc(z.el)} (${esc(z.n)}), fera aussi pencher la balance.</p>
        <button class="btn btn-gold btn-wide" data-act="tq-start">Commencer le quiz <span class="pts">+30</span></button>
      </div>
      <p class="small muted" style="margin:0;text-align:center">Vos réponses ne sont pas gardées : seul l'animal obtenu l'est, sur cet appareil.</p>`;
  }
  const t = TOT[S.totem.id], friends = totemFriends(t), alts = (S.totem.alt || []).map(id => TOT[id]).filter(Boolean);
  const z = birthEl();
  return `<div class="totem-hero">
      <div class="totem-stage mv-${t.mv}">${sprite(t.id, 'big')}</div>
      <div class="h-eyebrow">Votre animal totem</div>
      <h2 class="h-title gold" style="font-size:30px;margin:0">${esc(t.n)}</h2>
      <div class="facts"><span class="fact">${esc(t.el)}</span>${t.el === z.el ? `<span class="fact">comme votre ${esc(z.n)}</span>` : ''}</div>
      <div class="keys">${esc(t.k)}</div>
    </div>
    <div class="frame stack">
      <p class="lead" style="margin:0">${esc(t.d)}</p>
      <div class="tip"><span>✦</span><span><b>Force :</b> ${esc(t.f)}</span></div>
      <div class="tip"><span>☾${VS}</span><span><b>Part d'ombre :</b> ${esc(t.o)}</span></div>
    </div>
    <div class="frame-plain stack" style="text-align:center">
      <div class="h-eyebrow">Le message de votre ${esc(t.n.toLowerCase())}</div>
      <p class="lead" style="margin:0;font-style:italic">« ${esc(t.m)} »</p>
    </div>
    <section class="stack"><div class="section-head"><h2>Affinités</h2></div>
      <div class="totem-mini">${[...alts.slice(0, 2).map(o => [o, 'votre autre facette']), ...friends.filter(o => !alts.slice(0, 2).includes(o)).map(o => [o, 'un esprit proche du vôtre'])]
        .map(([o, why]) => `<button class="tm" data-act="totem-peek" data-id="${o.id}">${sprite(o.id)}<b>${esc(o.n)}</b><span>${why}</span></button>`).join('')}</div>
    </section>
    <div class="frame-plain stack">${switchRow('pet', 'Compagnon sur la barre', `Votre ${esc(t.n.toLowerCase())} se promène en bas de l'écran`, S.pet !== false)}</div>
    <button class="btn btn-ghost btn-wide" data-act="tq-start">Refaire le quiz</button>`;
}
function totemSheet(id){
  const t = TOT[id];
  openSheet(`<div class="totem-hero"><div class="totem-stage mv-${t.mv}">${sprite(t.id, 'big')}</div>
    <h2 class="h-title gold" style="font-size:26px;margin:0">${esc(t.n)}</h2>
    <div class="facts"><span class="fact">${esc(t.el)}</span></div><div class="keys">${esc(t.k)}</div></div>
    <p class="lead" style="margin:0">${esc(t.d)}</p>
    <div class="tip"><span>✦</span><span>${esc(t.f)}</span></div>`);
}
function finishQuiz(){
  const rank = totemRank(UI.tq.ans), first = !S.totem;
  S.totem = {id: rank[0].t.id, alt: rank.slice(1, 3).map(r => r.t.id), d: dk()};
  UI.tq = null; save();
  if (first){ gain(30, 'Animal totem révélé'); S.pet = true; save(); }
  render(); window.scrollTo(0, 0);
  const st = document.querySelector('.totem-stage');
  if (st && !calm()){ const b = st.getBoundingClientRect(); setTimeout(() => { sparkle(b.left + b.width / 2, b.top + b.height / 2, 60, 1.6); ringAt(b.left + b.width / 2, b.top + b.height / 2, 200, '#ffe6a8'); }, 150); Snd.chime(); buzz([20, 40, 60]); }
  Pet.sync();
}

/* Compagnon : l'animal se promène sur la barre de navigation */
const Pet = (() => {
  let el = null, id = null, x = 24, dir = 1, state = 'sit', until = 0, last = 0, raf = 0, sayT = 0;
  const SPEED = {walk: 26, hop: 34, fly: 44, swim: 32, crawl: 10};
  function sync(){
    const nav = $('#nav');
    const want = S.profile && S.totem && TOT[S.totem.id] && S.pet !== false && nav && !nav.hidden;
    if (!want){ if (el){ el.remove(); el = null; id = null; } return; }
    if (!el || id !== S.totem.id){
      if (el) el.remove();
      id = S.totem.id; const t = TOT[id];
      el = document.createElement('button');
      el.className = 'pet mv-' + t.mv; el.type = 'button';
      el.setAttribute('aria-label', `Votre ${t.n.toLowerCase()} : touchez-le pour un message`);
      el.innerHTML = `<span class="pet-flip">${sprite(id)}</span><span class="pet-z" aria-hidden="true">z</span><span class="pet-say" role="status"></span>`;
      el.addEventListener('click', poke);
      nav.appendChild(el);
      x = Math.max(8, Math.random() * (nav.clientWidth - 80));
    }
    if (!raf) raf = requestAnimationFrame(step);
  }
  function step(ts){
    raf = 0; if (!el) return;
    const dt = Math.min(80, ts - (last || ts)); last = ts;
    const W = el.parentNode.clientWidth, sw = el.offsetWidth || 56;
    if (isNight()) state = 'sleep';
    else if (calm() || el.classList.contains('saying')) state = 'sit';   // il s'arrête pour parler
    else if (ts > until && !el.classList.contains('poke')){
      state = Math.random() < .62 ? 'walk' : 'sit';
      until = ts + (state === 'walk' ? 3500 + Math.random() * 6000 : 1800 + Math.random() * 3500);
      if (Math.random() < .35) dir = -dir;
    }
    if (state === 'walk'){
      x += dir * SPEED[TOT[id].mv] * dt / 1000;
      if (x < 6){ x = 6; dir = 1; } if (x > W - sw - 6){ x = W - sw - 6; dir = -1; }
    }
    el.style.transform = `translateX(${x.toFixed(1)}px)`;
    el.dataset.state = state; el.classList.toggle('flip', dir < 0);
    raf = requestAnimationFrame(step);
  }
  function poke(e){
    e.preventDefault(); e.stopPropagation();
    const t = TOT[id]; if (!t) return;
    el.classList.remove('poke'); void el.offsetWidth; el.classList.add('poke'); setTimeout(() => el && el.classList.remove('poke'), 600);
    const lines = [t.m, ...t.k.split(' · ').map(k => k + ' ✦'), isNight() ? 'Chut… je rêve des étoiles.' : 'Belle journée, ' + S.profile.name + ' !'];
    const say = el.querySelector('.pet-say');
    say.textContent = lines[Math.floor(Math.random() * lines.length)];
    const W = el.parentNode.clientWidth;
    say.style.maxWidth = Math.min(240, W - 24) + 'px'; say.style.width = 'max-content';
    const bw = say.offsetWidth;
    say.style.left = Math.max(12 - x, Math.min(W - 12 - bw - x, (el.offsetWidth - bw) / 2)) + 'px';
    el.classList.add('saying'); clearTimeout(sayT); sayT = setTimeout(() => el && el.classList.remove('saying'), 4200);
    const b = el.getBoundingClientRect(); sparkle(b.left + b.width / 2, b.top + b.height / 3, 16, .9); Snd.twinkle(); buzz(12);
    if (!S.today.done.pet){ S.today.done.pet = true; gain(5, 'Câlin à votre ' + t.n.toLowerCase()); save(); }
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden){ last = 0; sync(); } });
  return {sync};
})();

/* ---------- Vue : Oracles ---------- */
const ORACLES = [
  {id:'totem', n:'Animal totem', g:'', d:'Vingt questions pour découvrir l\'animal qui vous ressemble', wide:true},
  {id:'numero', n:'Numérologie', g:'9', d:'Votre chemin de vie et le nombre du jour'},
  {id:'rune', n:'Rune du jour', g:'ᚱ', d:'Une rune tirée de la bourse'},
  {id:'pierre', n:'Pierre & couleur', g:'◆', d:'Votre talisman et votre chiffre chance'},
  {id:'pendule', n:'Pendule', g:'▾', d:'Posez une question fermée'},
  {id:'compat', n:'Compatibilité', g:'♡', d:'Comparez vos astres avec ceux d\'une autre personne', wide:true}
];
function vOracles(){
  if (!UI.oracle){
    const stoneC = pick(userRng('pierre'), STONES).c;
    return `<section class="view h-numero">
      ${topbar()}
      <div><div class="h-eyebrow">Les oracles</div><h1 class="h-title gold">Que voulez-vous savoir ?</h1></div>
      <div class="tiles">
        ${ORACLES.map((o, k) => `<button class="tile hue-tile h-${o.id} ${o.wide ? 'wide' : ''}" data-act="oracle" data-id="${o.id}" style="--d:${(k * 1.3).toFixed(1)}s${o.id === 'pierre' ? ';--ha:' + stoneC : ''}">
          <span class="tg">${o.id === 'totem' ? sprite(S.totem && TOT[S.totem.id] ? S.totem.id : 'loup', 'tile-sprite') : o.id === 'compat' ? o.g + VS : o.g}</span>
          <span class="${o.wide ? 'grow' : ''}"><span class="tn">${o.id === 'totem' && S.totem && TOT[S.totem.id] ? 'Votre totem : ' + TOT[S.totem.id].n : o.n}</span><br><span class="td">${o.id === 'totem' && S.totem && TOT[S.totem.id] ? esc(TOT[S.totem.id].k) : o.d}</span></span>
          ${o.id === 'totem'
            ? `<span class="badge ${S.totem ? 'ok' : ''}">${S.totem ? '✓' : '+30'}</span>`
            : `<span class="badge ${isDone(o.id) ? 'ok' : ''}">${isDone(o.id) ? '✓' : '+' + RITUALS.find(r => r.id === o.id).pts}</span>`}
        </button>`).join('')}
      </div>
    </section>`;
  }
  const o = ORACLES.find(x => x.id === UI.oracle);
  const head = `${topbar()}<button class="back-link" data-act="oracle" data-id="">${ICONS.back}Tous les oracles</button>
    <div><div class="h-eyebrow">Oracle</div><h1 class="h-title gold">${o.n}</h1></div>`;
  return `<section class="view h-${o.id}">${head}${oracleBody(o.id)}</section>`;
}
function oracleBody(id){
  const p = S.profile;
  if (id === 'totem') return totemBody();
  if (id === 'numero'){
    const lp = lifePath(p.birth), ex = expressionNumber(p.name), pd = personalDay(p.birth);
    return `<div class="sign-hero">
        <div class="glyph-orb"><span class="num">${lp}</span></div>
        <h2 class="h-title gold" style="font-size:22px">Chemin de vie ${lp} · ${NUMEROLOGY[lp].t}</h2>
        <p class="lead" style="margin:0;max-width:34ch">${esc(NUMEROLOGY[lp].d)}</p>
      </div>
      ${isDone('numero') ? `<div class="num-grid">
          <div class="frame-plain stack"><div class="h-eyebrow">Jour personnel</div><div class="lucky">${pd}</div><div class="small">${esc(PERSONAL_DAY[pd])}</div></div>
          <div class="frame-plain stack"><div class="h-eyebrow">Expression</div><div class="lucky">${ex}</div><div class="small">Votre prénom vibre en ${ex} : ${esc(NUMEROLOGY[ex].t.toLowerCase())}.</div></div>
        </div>` : revealBtn('numero', 'Calculer mes nombres du jour')}
      <p class="small muted" style="margin:0;text-align:center">Le chemin de vie additionne les chiffres de votre date de naissance. Le jour personnel ajoute la date du jour.</p>`;
  }
  if (id === 'rune'){
    const r = pick(userRng('rune'), RUNES);
    if (!isDone('rune')) return `<div class="stage"><button class="pouch" data-act="reveal" data-id="rune" aria-label="Tirer une rune">ᚠ ᚱ ᛟ</button>
      <div class="tap-hint">Fermez les yeux, respirez, puis touchez la bourse · +10 points</div></div>`;
    return `<div class="stage">
        <div class="rune-stone"><span>${r[0]}</span></div>
        <h2 class="h-title gold" style="font-size:24px;margin:0">${r[1]}</h2>
        <div class="keys">${esc(r[2])}</div>
      </div>
      <div class="frame"><p class="lead" style="margin:0;text-align:center">${esc(r[3])}</p></div>`;
  }
  if (id === 'pierre'){
    const rg = userRng('pierre'), st = pick(rg, STONES), co = pick(rg, COLORS), lucky = 1 + Math.floor(rg() * 49);
    if (!isDone('pierre')) return `<div class="frame stack" style="text-align:center"><p class="lead" style="margin:0">Chaque jour, une pierre, une couleur et un nombre vous accompagnent.</p>${revealBtn('pierre', 'Découvrir mon talisman')}</div>`;
    return `<div class="duo">
        <div class="frame-plain"><div class="gem" style="background:radial-gradient(circle at 40% 30%,#fff9,transparent 40%),linear-gradient(160deg,${st.c},#1a1030)"></div><div class="h-eyebrow">Pierre</div><div class="cname">${st.n}</div><div class="small muted">${esc(st.v)}</div></div>
        <div class="frame-plain"><div class="swatch" style="background:${co.c}"></div><div class="h-eyebrow">Couleur</div><div class="cname">${co.n}</div><div class="small muted">${esc(co.v)}</div></div>
      </div>
      <div class="frame" style="text-align:center"><div class="h-eyebrow">Nombre porte-bonheur</div><div class="lucky gold" style="margin-top:8px">${lucky}</div></div>`;
  }
  if (id === 'pendule'){
    const res = UI.pendulum;
    return `<svg class="pendulum ${res && res.swinging ? 'swing' : ''}" viewBox="0 0 120 170" aria-hidden="true">
        <circle cx="60" cy="6" r="4" fill="var(--gold)"/>
        <g><line x1="60" y1="6" x2="60" y2="118" stroke="var(--gold)" stroke-width="1.2"/>
          <path d="M60 116 L74 132 L60 166 L46 132 Z" fill="url(#pg)" stroke="var(--gold-hi)" stroke-width="1"/></g>
        <defs><linearGradient id="pg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#d9c2ff"/><stop offset="1" stop-color="#6a43c2"/></linearGradient></defs>
      </svg>
      ${res && !res.swinging ? `<div class="frame" style="text-align:center"><div class="answer gold">${res.a}</div><p class="lead" style="margin:6px 0 0">${esc(res.d)}</p><div class="small muted" style="margin-top:8px">« ${esc(res.q)} »</div></div>` : ''}
      <form class="form" data-form="pendule" novalidate>
        <div class="field"><label for="q">Votre question</label><input id="q" name="q" maxlength="140" placeholder="Par exemple : Dois-je accepter cette proposition ?" autocomplete="off"><span class="err" id="q-err"></span></div>
        <button class="btn btn-gold btn-wide" type="submit">Interroger le pendule ${isDone('pendule') ? '' : '<span class="pts">+5</span>'}</button>
      </form>
      <p class="small muted" style="margin:0;text-align:center">Vos questions ne sont jamais enregistrées.</p>`;
  }
  if (id === 'compat'){
    const res = UI.compat;
    return `<form class="form" data-form="compat" novalidate>
        <div class="field"><label for="cn">Prénom de l'autre personne</label><input id="cn" name="cn" maxlength="30" placeholder="Facultatif" autocomplete="off"></div>
        <div class="field"><label for="cb">Sa date de naissance</label>${dateInput('cb', '')}<span class="err" id="cb-err"></span></div>
        <button class="btn btn-gold btn-wide" type="submit">Lire notre compatibilité ${isDone('compat') ? '' : '<span class="pts">+10</span>'}</button>
      </form>
      ${res ? compatResult(res) : ''}
      <p class="small muted" style="margin:0;text-align:center">Ces informations servent au calcul puis sont oubliées : rien n'est enregistré.</p>`;
  }
  return '';
}
function compatResult(res){
  const me = S.profile, a = birthParts(me.birth), b = birthParts(res.birth);
  const za = ZODIAC[signIndex(a.m, a.d)], zb = ZODIAC[signIndex(b.m, b.d)];
  const key = [za.el, zb.el].sort().join('|'), [base, text] = COMPAT[key];
  const la = lifePath(me.birth), lb = lifePath(res.birth);
  const numBonus = la === lb ? 6 : (reduce9(la) % 2 === reduce9(lb) % 2 ? 3 : -2);
  const jitter = Math.floor(rngFrom([me.birth, res.birth].sort().join('|'))() * 9) - 4;
  const score = Math.max(42, Math.min(98, base + numBonus + jitter));
  const circ = 2 * Math.PI * 60;
  const other = res.name ? esc(res.name) : 'L\'autre personne';
  return `<div class="frame stack" style="align-items:center;text-align:center">
    <div class="ring"><svg viewBox="0 0 140 140" aria-hidden="true"><circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,255,255,.08)" stroke-width="8"/>
      <circle cx="70" cy="70" r="60" fill="none" stroke="url(#cg)" stroke-width="8" stroke-linecap="round" stroke-dasharray="${(circ * score / 100).toFixed(1)} ${circ.toFixed(1)}"/>
      <defs><linearGradient id="cg"><stop offset="0" stop-color="#a77dff"/><stop offset="1" stop-color="#e6c378"/></linearGradient></defs></svg><b>${score}%</b></div>
    <div class="facts"><span class="fact">Vous : ${za.n} ${za.g}${VS} · ${za.el}</span><span class="fact">${other} : ${zb.n} ${zb.g}${VS} · ${zb.el}</span></div>
    <p class="lead" style="margin:0">${esc(text)}</p>
    <div class="small muted">Chemins de vie ${la} et ${lb} : ${la === lb ? 'le même nombre, une compréhension instinctive.' : numBonus > 0 ? 'des rythmes qui s\'accordent bien.' : 'des rythmes différents qui s\'enrichissent l\'un l\'autre.'}</div>
  </div>`;
}

/* ---------- Vue : Grimoire ---------- */
const GSUITS = [['m','Majeurs'],['w','Bâtons'],['c','Coupes'],['s','Épées'],['p','Deniers']];
const SHORT_RANK = ['As','2','3','4','5','6','7','8','9','10','Valet','Cavalier','Reine','Roi'];
const seenCount = ids => ids.filter(c => S.seen[c.id]).length;
function grimLink(){
  const n = seenCount(DECK78), pct = Math.round(n / 78 * 100);
  return `<button class="frame-plain grim-link h-rune" data-act="go" data-go='["grimoire"]'>
    <span class="gl-ico" aria-hidden="true">✦</span>
    <span class="grow"><b>Mon grimoire</b><span class="small muted">${n} carte${n > 1 ? 's' : ''} sur 78 découvertes</span><span class="track"><i style="width:${pct}%"></i></span></span>
    <span aria-hidden="true" style="color:var(--gold)">›</span></button>`;
}
function vGrimoire(){
  const k = UI.gsuit || 'm', cards = DECK78.filter(c => c.id[0] === k);
  const nAll = seenCount(DECK78), nMaj = seenCount(DECK78.slice(0, 22)), nSuit = seenCount(cards);
  return `<section class="view s-${k}">
    ${topbar()}
    <button class="back-link" data-act="go" data-go='["tarot"]'>${ICONS.back}Retour au tarot</button>
    <div><div class="h-eyebrow">Votre collection</div><h1 class="h-title gold">Grimoire</h1></div>
    <p class="small muted" style="margin:0">Chaque carte que vous tirez vient s'y ranger. Les 22 arcanes majeurs rapportent ${S.gm.majors ? '<b style="color:var(--ok)">✓ 100 points</b>' : '100 points'}, le jeu complet ${S.gm.all ? '<b style="color:var(--ok)">✓ 300 points</b>' : '300 points'}.</p>
    <div class="gprog">
      <div class="stat"><b>${nAll} / 78</b><span>cartes découvertes</span></div>
      <div class="stat"><b>${nMaj} / 22</b><span>arcanes majeurs</span></div>
    </div>
    <div class="seg gsegs" role="group" aria-label="Famille de cartes">
      ${GSUITS.map(([id, l]) => `<button data-act="gsuit" data-s="${id}" aria-pressed="${k === id}">${l}</button>`).join('')}
    </div>
    <div class="section-head"><h2>${k === 'm' ? 'Arcanes majeurs' : esc(SUITS[k].name)}</h2><span class="count">${nSuit} / ${cards.length}</span></div>
    ${k !== 'm' && S.deck !== '78' ? `<p class="small muted" style="margin:-12px 0 0">Les arcanes mineurs n'apparaissent qu'avec le jeu de 78 cartes, à choisir dans l'onglet Tarot.</p>` : ''}
    <div class="ggrid">${cards.map((c, i) => {
      const e = S.seen[c.id], label = c.major ? c.num : SHORT_RANK[i];
      return e
        ? `<button class="gslot" data-act="card" data-card="${c.id}"><span class="gc"><img src="${cardImg(c.id)}" alt="" loading="lazy">${e.n > 1 ? `<span class="cnt">×${e.n}</span>` : ''}</span><span class="gn">${esc(c.name)}</span></button>`
        : `<button class="gslot locked" data-act="glocked" aria-label="Carte pas encore découverte"><span class="gc">${backFace(S.back)}<span class="q">${label}</span></span><span class="gn">?</span></button>`;
    }).join('')}</div>
  </section>`;
}
function switchRow(k, title, sub, on){
  return `<button class="sw-row" role="switch" aria-checked="${!!on}" data-act="toggle" data-k="${k}"><span class="grow"><b>${title}</b><span class="small muted">${sub}</span></span><i class="sw" aria-hidden="true"></i></button>`;
}

/* ---------- Crédits et mentions légales ---------- */
const todo = v => v ? esc(v) : '<i class="muted">à compléter</i>';
function legalLinks(){
  return `<footer class="mini-foot"><button data-act="legal" data-t="credits">Crédits</button><span aria-hidden="true">·</span><button data-act="legal" data-t="mentions">Mentions légales</button><span aria-hidden="true">·</span><button data-act="privacy">Vos données</button></footer>`;
}
function legalSheet(t){
  if (t === 'credits'){
    openSheet(`<div class="legal-doc">
      <div class="h-eyebrow">À propos</div><h2 class="h-title gold" style="font-size:22px;margin:0">Crédits</h2>
      <dl>
        <dt>Conception et textes</dt><dd>${todo(LEGAL.editeur)}</dd>
        <dt>Développement</dt><dd>${todo(LEGAL.developpement)}</dd>
        <dt>Illustrations des cartes</dt>${DECK_ARTS.map(a => `<dd><b>${esc(a.n)}</b> : ${esc(a.credit)}</dd>`).join('')}
        <dt>Animaux totems</dt><dd>Sprites pixel art dessinés à la main pour Madame Voyance.</dd>
        <dt>Polices</dt><dd>Cinzel (Natanael Gama), Cormorant Garamond (Christian Thalmann), Jost (indestructible type*), Noto Sans Runic, Noto Sans Symbols et Noto Serif SC (Google). Licence SIL Open Font, servies par Google Fonts.</dd>
        <dt>Sons</dt><dd>Bol, carillon et souffle sont créés en direct par le navigateur. Aucun fichier audio, aucun enregistrement.</dd>
        <dt>Ciel et astres</dt><dd>Phases de lune calculées à partir du cycle synodique moyen. Constellations dessinées de façon stylisée.</dd>
      </dl>
      <p class="small muted" style="margin:0">Madame Voyance est un divertissement : ses messages n'ont aucune valeur prédictive.</p></div>`);
    return;
  }
  openSheet(`<div class="legal-doc">
    <div class="h-eyebrow">Informations</div><h2 class="h-title gold" style="font-size:22px;margin:0">Mentions légales</h2>
    <dl>
      <dt>Éditeur</dt><dd>${todo(LEGAL.editeur)}, particulier<br>Contact : <span style="user-select:all">${todo(LEGAL.contact)}</span></dd>
      <dt>Directeur de la publication</dt><dd>${todo(LEGAL.directeur)}</dd>
      <dt>Hébergement</dt><dd>GitHub Pages, GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.</dd>
      <dt>Données personnelles</dt><dd>L'éditeur ne collecte aucune donnée. Prénom, date de naissance, points, journal, grimoire et préférences sont enregistrés uniquement dans le navigateur de votre appareil, sans compte, sans cookie et sans mesure d'audience. Vous pouvez tout effacer depuis l'onglet Profil. L'hébergeur et Google Fonts reçoivent l'adresse IP de l'appareil lors du chargement de la page, selon leurs propres politiques de confidentialité.</dd>
      <dt>Nature du service</dt><dd>Application gratuite de divertissement. Les tirages, horoscopes et oracles ne remplacent pas l'avis d'un professionnel de santé, du droit ou de la finance.</dd>
      <dt>Propriété intellectuelle</dt><dd>Textes, design et code © ${esc(LEGAL.annee)} ${LEGAL.editeur ? esc(LEGAL.editeur) : 'l\'éditeur'}. Illustrations des cartes : domaine public.</dd>
    </dl></div>`);
}

/* ---------- Vue : Profil ---------- */
function vProfil(){
  const p = S.profile, bp = birthParts(p.birth), z = ZODIAC[signIndex(bp.m, bp.d)];
  const lv = levelOf(S.points), next = LEVELS[lv + 1];
  const pct = next ? Math.round((S.points - LEVELS[lv].p) / (next.p - LEVELS[lv].p) * 100) : 100;
  const journal = S.journal.slice(-21).reverse();
  return `<section class="view">
    ${topbar()}
    <div class="frame id-card">
      <div class="glyph-orb"><span>${z.g}${VS}</span></div>
      <div class="who">
        <div class="name">${esc(p.name)}</div>
        <div class="small muted">Naissance : ${fmtBirth.format(fromKey(p.birth))}</div>
        <div class="small muted">${z.n} · ${CHINESE[chineseOf(p.birth).animal].n} · Chemin de vie ${lifePath(p.birth)}</div>
      </div>
    </div>

    <div class="frame-plain levelbar">
      <div class="lv-row"><span class="lv-name">${esc(LEVELS[lv].t)}</span><span class="count">Niveau ${lv + 1} / ${LEVELS.length}</span></div>
      <div class="track"><i data-lvbar style="width:${lvPct(shown)}%"></i></div>
      <div class="small muted">${next ? `${S.points} / ${next.p} points pour devenir ${esc(next.t)}` : `${S.points} points · niveau maximal atteint`}</div>
    </div>
    <div class="stats4">
      <div class="stat"><b data-pts>${shown}</b><span>points</span></div>
      <div class="stat"><b>${S.streak} j</b><span>série actuelle</span></div>
      <div class="stat"><b>${S.best} j</b><span>meilleure série</span></div>
      <div class="stat"><b>${S.rituals}</b><span>rituels accomplis</span></div>
    </div>

    <section class="stack"><div class="section-head"><h2>Illustrations</h2><span class="count">${DECK_ARTS.length} jeux</span></div>
      <div class="arts">${DECK_ARTS.map(a => `<button class="back-opt art-opt" data-act="art" data-id="${a.id}" aria-pressed="${ART === a.id}">
          <span class="mini"><img src="${cardImg('m17', a.id)}" alt="" loading="lazy"></span><b>${esc(a.n)}</b><span>${esc(a.d)}</span></button>`).join('')}</div>
    </section>

    <section class="stack"><div class="section-head"><h2>Dos de cartes</h2><span class="count">Débloqués par niveau</span></div>
      <div class="backs">${BACKS.map(bk => {
        const locked = lv < bk.lvl;
        return `<button class="back-opt" data-act="back" data-id="${bk.id}" aria-pressed="${S.back === bk.id}" ${locked ? `disabled data-lvl="${bk.lvl + 1}"` : ''}>
          <span class="mini" ${locked ? `data-lvl="${bk.lvl + 1}"` : ''}>${backFace(bk.id)}</span><span>${bk.n}</span></button>`;
      }).join('')}</div>
    </section>

    ${grimLink()}

    <section class="stack"><div class="section-head"><h2>Ambiance</h2></div>
      <div class="frame-plain stack">
        ${switchRow('sound', 'Sons doux', 'Bol tibétain, carillon et souffle', S.sound && !S.zen)}
        ${switchRow('zen', 'Mode zen', 'Coupe les animations, les sons et les vibrations', S.zen)}
        ${tiltSupported ? switchRow('tilt', 'Effet de profondeur', 'Le ciel bouge quand vous inclinez le téléphone', S.tilt && !S.zen) : ''}
        ${S.totem && TOT[S.totem.id] ? switchRow('pet', 'Compagnon sur la barre', `Votre ${esc(TOT[S.totem.id].n.toLowerCase())} se promène en bas de l'écran`, S.pet !== false) : ''}
      </div>
    </section>

    <section class="stack"><div class="section-head"><h2>Journal des cartes</h2><span class="count">${S.journal.length} tirage${S.journal.length > 1 ? 's' : ''}</span></div>
      ${journal.length ? `<div class="journal">${journal.map(j => `<button data-act="card" data-card="${j.id}"><img src="${cardImg(j.id)}" alt="${esc(CARD[j.id].name)}" loading="lazy"><span>${fmtShort.format(fromKey(j.d))}</span></button>`).join('')}</div>`
        : `<p class="small muted" style="margin:0">Vos cartes du jour s'afficheront ici. <a href="#tarot" style="color:var(--gold)">Tirer ma carte du jour</a></p>`}
    </section>

    ${inFrame ? '' : `<section class="stack"><div class="section-head"><h2>Application</h2></div>
      <div class="frame-plain app-row">
        <img src="icons/icon-192.png" alt="" width="56" height="56">
        <div class="grow">${standalone()
          ? `<b>Installée sur cet appareil</b><span class="small muted">Madame Voyance fonctionne aussi sans connexion.</span>`
          : `<b>Écran d'accueil</b><span class="small muted">Installez l'app pour l'ouvrir d'un geste, même hors ligne. +50 points</span>`}</div>
        ${standalone() ? '<span class="badge ok">✓</span>' : `<button class="btn btn-gold btn-sm" data-act="install">${installEvt ? 'Installer' : 'Comment faire'}</button>`}
      </div>
    </section>`}

    <section class="stack"><div class="section-head"><h2>Mes données</h2></div>
      <div class="frame-plain stack">
        <p class="small" style="margin:0">Tout est enregistré uniquement sur cet appareil.${storageOK ? '' : ' <b style="color:var(--danger)">Votre navigateur bloque l\'enregistrement : vos données disparaîtront à la fermeture de la page.</b>'}</p>
        <button class="btn btn-ghost btn-wide" data-act="edit">Modifier mon prénom ou ma date</button>
        <button class="btn btn-ghost btn-wide" data-act="privacy">Revoir l'avertissement</button>
        ${UI.confirmErase
          ? `<div class="stack" style="text-align:center"><p class="small" style="margin:0">Effacer prénom, date, points et journal ? Cette action est définitive.</p>
              <div class="duo"><button class="btn btn-ghost" data-act="erase-no">Annuler</button><button class="btn btn-danger" data-act="erase-yes">Tout effacer</button></div></div>`
          : `<button class="btn btn-danger btn-wide" data-act="erase">Effacer toutes mes données</button>`}
        <div class="legal-box">
          <div class="h-eyebrow">Informations légales</div>
          <p class="small muted" style="margin:0">Aucun compte, aucun cookie, aucune mesure d'audience. Le site est hébergé par GitHub Pages et les polices viennent de Google Fonts : ces deux services voient l'adresse IP de votre appareil quand la page se charge, comme pour tout site web.</p>
          <button class="legal-row" data-act="legal" data-t="mentions"><span>Mentions légales</span><span aria-hidden="true">›</span></button>
          <button class="legal-row" data-act="legal" data-t="credits"><span>Crédits</span><span aria-hidden="true">›</span></button>
        </div>
      </div>
    </section>
    <p class="foot"><img src="icons/icon-192.png" alt="" width="40" height="40" class="foot-icon"><br>Madame Voyance est un divertissement. Ses messages ne remplacent pas l'avis d'un professionnel de santé, du droit ou de la finance.<br>Illustrations : tarots Rider-Waite-Smith (1909) et Jean Dodal (vers 1701), domaine public ; versions 8 bits et Encre générées.</p>
  </section>`;
}

/* ---------- Accueil : avertissement et profil ---------- */
const PRIVACY = `
  <div class="h-eyebrow" style="text-align:center">Avant de commencer</div>
  <h1 class="h-title gold" style="text-align:center;margin-bottom:6px">Vos données restent chez vous</h1>
  <p class="small" style="margin:0">Pour vous offrir des tirages personnels, Madame Voyance utilise :</p>
  <ul class="data-list">
    <li><span><b>Votre prénom</b>, pour vous saluer et personnaliser les tirages.</span></li>
    <li><span><b>Votre date de naissance</b>, pour votre signe, votre signe chinois et votre numérologie.</span></li>
    <li><span><b>Vos points, séries et rituels accomplis</b>, pour suivre votre progression.</span></li>
    <li><span><b>Le journal et le grimoire de vos cartes</b>, et vos préférences (jeu, dos de carte, sons, mode zen).</span></li>
  </ul>
  <p class="small" style="margin:0">Tout est enregistré <b>uniquement dans le navigateur de cet appareil</b>. Rien n'est envoyé ni partagé. Les questions posées au pendule, les dates saisies pour la compatibilité et les réponses au quiz de l'animal totem ne sont pas conservées : seul l'animal obtenu l'est.</p>
  <p class="small muted" style="margin:0">Vous pouvez tout effacer à tout moment depuis l'onglet Profil. Madame Voyance est un divertissement : ses messages ne remplacent pas l'avis d'un professionnel.</p>`;

function profileForm(isEdit){
  const p = S.profile || {name:'', birth:''};
  return `<form class="form" data-form="${isEdit ? 'edit' : 'profile'}" novalidate>
    <div class="field"><label for="pn">Votre prénom</label><input id="pn" name="pn" maxlength="30" autocomplete="given-name" value="${esc(p.name)}" placeholder="Votre prénom"><span class="err" id="pn-err"></span></div>
    <div class="field"><label for="pb">Votre date de naissance</label>${dateInput('pb', p.birth)}<span class="err" id="pb-err"></span></div>
    <button class="btn btn-gold btn-wide" type="submit">${isEdit ? 'Enregistrer' : 'Entrer dans le cercle'}</button>
  </form>`;
}
function showOnboarding(step){
  const ov = $('#onboard'), inner = $('#onboard-in');
  $('#app').hidden = true; $('#nav').hidden = true; ov.hidden = false;
  if (step === 1){
    inner.innerHTML = `<div class="frame stack">${PRIVACY}
      ${storageOK ? '' : '<p class="small" style="margin:0;color:var(--danger)">Votre navigateur bloque l\'enregistrement local : l\'application fonctionnera, mais vos données disparaîtront à la fermeture de la page.</p>'}
      <button class="btn btn-gold btn-wide" data-act="consent">J'ai compris</button></div>`;
  } else {
    inner.innerHTML = `<div class="frame stack">
      <div class="h-eyebrow" style="text-align:center">Faisons connaissance</div>
      <h1 class="h-title gold" style="text-align:center">Bienvenue dans le cercle</h1>
      <p class="small muted" style="margin:0;text-align:center">Ces deux informations suffisent à Madame Voyance pour lire vos astres.</p>
      ${profileForm(false)}</div>`;
  }
  ov.scrollTop = 0;
}
function validateProfile(form){
  const name = form.pn.value.trim(), birth = form.pb.value;
  let ok = true;
  $('#pn-err').textContent = ''; $('#pb-err').textContent = '';
  if (!name){ $('#pn-err').textContent = 'Indiquez votre prénom.'; ok = false; }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(birth) || birth < '1900-01-01' || birth > dk()){ $('#pb-err').textContent = 'Choisissez une date de naissance valide.'; ok = false; }
  return ok ? {name, birth} : null;
}

/* ---------- Fenêtres ---------- */
function openSheet(html){
  Snd.whoosh(.04);
  $('#sheet-root').innerHTML = `<div class="sheet-back" data-act="close"></div><div class="sheet" role="dialog" aria-modal="true"><div class="sheet-in"><div class="grab"></div>${html}<button class="btn btn-ghost btn-wide" data-act="close">Fermer</button></div></div>`;
}
function closeSheet(){ $('#sheet-root').innerHTML = ''; }
function cardSheet(id){
  const c = CARD[id];
  openSheet(`<div class="big-card"><img src="${cardImg(c.id)}" alt="${esc(c.name)}"></div>
    <div class="daily-read"><div class="pos">${c.major ? 'Arcane ' + c.num : 'Arcane mineur'}</div><div class="cname">${esc(c.name)}</div>
    <div class="keys">${esc(c.keys)}</div><p class="msg" style="margin:4px 0">${esc(c.msg)}</p>
    <div class="tip"><span>✦</span><span>${esc(c.tip)}</span></div><div class="small muted">${esc(c.dom)}</div></div>`);
}
function levelUp(lv){
  const unlock = BACKS.find(b => b.lvl === lv);
  const old = document.querySelector('.lvl-ov'); if (old) old.remove();
  const el = document.createElement('div');
  el.className = 'lvl-ov h-tarot'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'Nouveau niveau');
  el.innerHTML = `<div class="rays" aria-hidden="true"></div><div class="lvl-in">
    <div class="h-eyebrow">Nouveau niveau</div>
    <div class="glyph-orb lvl-orb"><span class="num">${lv + 1}</span></div>
    <h2 class="h-title gold">${esc(LEVELS[lv].t)}</h2>
    ${unlock ? `<div class="lvl-back"><span class="mini">${backFace(unlock.id)}</span><span class="small" style="text-align:left">Dos de cartes « ${esc(unlock.n)} » débloqué.<br><span class="muted">Choisissez-le dans votre profil.</span></span></div>`
             : `<p class="lead" style="margin:0">Les étoiles saluent votre fidélité.</p>`}
    <button class="btn btn-gold" data-act="lvl-close">Continuer</button></div>`;
  document.body.appendChild(el);
  el.querySelector('[data-act="lvl-close"]').focus({preventScroll: true});
  Snd.bowl(146.8, .24); setTimeout(() => Snd.chime(), 350); buzz([30, 60, 30, 60, 90]);
  setTimeout(() => { const o = el.querySelector('.lvl-orb'); if (o){ const b = o.getBoundingClientRect(); ringAt(b.left + b.width / 2, b.top + b.height / 2, 220, '#ffe6a8', 4); sparkleAt(o, 70, 1.9); } }, 260);
  starRain(2600);
}
function breathe(){
  const el = document.createElement('div'); el.className = 'breathe';
  el.innerHTML = `<div class="orb"></div><p id="bt">Inspirez…</p><button class="btn btn-ghost" id="bstop">Terminer</button>`;
  document.body.appendChild(el);
  let t = 0; const bt = el.querySelector('#bt');
  Snd.bowl(196, .16);
  const iv = setInterval(() => { t++; bt.textContent = t % 2 ? 'Expirez…' : 'Inspirez…'; if (t >= 4) end(); else Snd.bowl(t % 2 ? 164.8 : 196, .13); }, 4000);
  function end(){ clearInterval(iv); el.remove(); if (award('pensee')) sparkle(innerWidth / 2, innerHeight * .4, 40, 1.4); render(); }
  el.querySelector('#bstop').addEventListener('click', end);
  el.querySelector('#bstop').focus();
}

async function installApp(){
  if (installEvt){
    const evt = installEvt; installEvt = null;
    try { evt.prompt(); await evt.userChoice; } catch (e) {}
    render(); return;
  }
  const share = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-3px"><path d="M12 3v12M8 7l4-4 4 4"/><path d="M6 11v9h12v-9"/></svg>';
  const steps = isIOS
    ? [`Dans Safari, touchez le bouton Partager ${share} en bas de l'écran.`, 'Faites défiler et choisissez « Sur l\'écran d\'accueil ».', 'Touchez « Ajouter » : l\'icône apparaît avec vos autres apps.']
    : ['Ouvrez le menu du navigateur (les trois points ⋮).', 'Choisissez « Installer l\'application » ou « Ajouter à l\'écran d\'accueil ».', 'Confirmez : l\'icône apparaît avec vos autres apps.'];
  openSheet(`<div class="stack" style="align-items:center;text-align:center">
      <img src="icons/icon-192.png" alt="Icône Madame Voyance" width="88" height="88" class="app-icon-lg">
      <div class="h-eyebrow">Sur votre écran d'accueil</div>
      <h2 class="h-title gold" style="font-size:22px;margin:0">Installer Madame Voyance</h2>
    </div>
    <ol class="steps">${steps.map(t => `<li><span>${t}</span></li>`).join('')}</ol>
    <p class="small muted" style="margin:0;text-align:center">Une fois installée, l'app s'ouvre en plein écran et fonctionne sans connexion. Vous gagnez 50 points à la première ouverture.${isIOS ? ' Sur iPhone, l\'app installée garde ses propres données : vous referez une fois votre profil.' : ''}</p>`);
}

/* ---------- Rendu et navigation ---------- */
function render(){
  if (!S.consent){ showOnboarding(1); return; }
  if (!S.profile){ showOnboarding(2); return; }
  $('#onboard').hidden = true; $('#onboard-in').innerHTML = ''; $('#app').hidden = false; $('#nav').hidden = false;
  const v = UI.view, navV = v === 'grimoire' ? 'tarot' : v;
  $('#app').innerHTML = v === 'tarot' ? vTarot() : v === 'astres' ? vAstres() : v === 'oracles' ? vOracles() : v === 'profil' ? vProfil() : v === 'grimoire' ? vGrimoire() : vAccueil();
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', a.dataset.v === navV ? 'page' : 'false'));
  Pet.sync();
}
function go(view, sub, keepScroll){
  if (view === 'tarot' && sub){ if (UI.tarot !== sub) UI.flips = new Set(); UI.tarot = sub; }
  if (view === 'astres' && sub) UI.astres = sub;
  if (view === 'oracles') UI.oracle = sub || null;
  UI.view = view; UI.confirmErase = false;
  if (location.hash !== '#' + view) history.replaceState(null, '', '#' + view);
  render(); if (!keepScroll) window.scrollTo(0, 0);
}
function fromHash(){
  const h = location.hash.slice(1);
  if (ROUTES.includes(h) && h !== UI.view){ if (h === 'oracles') UI.oracle = null; UI.view = h; UI.confirmErase = false; render(); window.scrollTo(0, 0); }
}

/* ---------- Tirage : charger la carte, puis la révéler ---------- */
function markFlipping(el){ el.classList.add('flipping'); setTimeout(() => el.classList.remove('flipping'), 1100); }
function flipTarot(el){
  const i = +el.dataset.i, n = UI.tarot, id = 'tarot' + n;
  UI.flips.add(i); el.classList.add('flipped'); markFlipping(el);
  el.setAttribute('aria-label', CARD[el.dataset.card].name);
  if (UI.flips.size >= n && !isDone(id)){
    const cards = drawSpread(n);
    S.today.draws[n] = cards.map(c => c.id);
    if (n === 1){ S.journal.push({d: dk(), id: cards[0].id}); if (S.journal.length > 120) S.journal = S.journal.slice(-120); }
    recordSeen(cards.map(c => c.id));
    award(id);
    setTimeout(() => { render(); const r = document.querySelector('.reading, .daily-read'); if (r) r.scrollIntoView({behavior: calm() ? 'auto' : 'smooth', block:'start'}); }, calm() ? 0 : 1200);
  }
}
function flipHome(el){
  el.classList.add('flipped'); markFlipping(el);
  const c = drawSpread(1)[0];
  S.today.draws[1] = [c.id];
  S.journal.push({d: dk(), id: c.id}); if (S.journal.length > 120) S.journal = S.journal.slice(-120);
  recordSeen([c.id]);
  award('tarot1');
  setTimeout(render, calm() ? 0 : 1200);
}
function doFlip(el){ if (el.dataset.act === 'homeflip') flipHome(el); else flipTarot(el); }
function revealFx(el){
  const b = el.getBoundingClientRect(), cx = b.left + b.width / 2, cy = b.top + b.height / 2, m = Math.max(b.width, b.height);
  lastTap = {x: cx, y: cy, t: performance.now()};
  if (calm()) return;
  el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); setTimeout(() => el.classList.remove('pop'), 850);
  flashAt(cx, cy);
  ringAt(cx, cy, m * 1.2, '#ffe6a8', 4); setTimeout(() => ringAt(cx, cy, m * 1.9, '#c9a8ff', 3), 120); setTimeout(() => ringAt(cx, cy, m * 2.6, '#8fe9ff', 2), 240);
  setTimeout(() => sparkle(cx, cy, 56, 1.7), 300);
  Snd.chime(); Snd.bowl(174.6, .15); buzz([18, 40, 70]);
}
let chg = null, eatClick = false, downAt = null;
function chargeK(c, now){ return c.rel == null ? Math.min(1, (now - c.t0) / c.full) : Math.min(1, c.k0 + (now - c.rel) / c.rest * (1 - c.k0)); }
function startCharge(el, quick){
  if (chg || el.classList.contains('flipped')) return;
  if (calm()){ revealFx(el); doFlip(el); return; }
  const now = performance.now();
  const c = chg = {el, t0: now, full: 1400, rel: quick ? now : null, k0: 0, rest: 650, down: !quick};
  el.classList.add('charging');
  Snd.riser(quick ? .65 : 1.4); buzz(12);
  const step = t => {
    if (chg !== c) return;
    const k = chargeK(c, t);
    el.style.setProperty('--charge', k.toFixed(3));
    const b = el.getBoundingClientRect();
    if (Math.random() < .55 + k * .45) suck(b.left + b.width / 2, b.top + b.height / 2, Math.max(b.width, b.height) * .8, k);
    if (k >= 1) finishCharge(c); else requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function releaseCharge(){
  const c = chg; if (!c || !c.down) return;
  c.down = false;
  if (c.rel == null){ const now = performance.now(); c.k0 = chargeK(c, now); c.rel = now; c.rest = 450; }
}
function abortCharge(){
  const c = chg; if (!c) return;
  chg = null; c.el.classList.remove('charging'); c.el.style.removeProperty('--charge'); Snd.stopRiser();
}
function finishCharge(c){
  chg = null;
  const el = c.el;
  el.classList.remove('charging'); el.style.removeProperty('--charge'); Snd.stopRiser();
  if (c.down) eatClick = true;
  revealFx(el);
  doFlip(el);
}

/* ---------- Actions ---------- */
document.addEventListener('click', e => {
  if (eatClick){ eatClick = false; if (e.target.closest('.tcard')){ e.preventDefault(); return; } }
  const navA = e.target.closest('.nav a');
  if (navA && navA.dataset.v === UI.view){ e.preventDefault(); if (UI.view === 'oracles') UI.oracle = null; render(); window.scrollTo(0, 0); return; }
  const el = e.target.closest('[data-act]'); if (!el) return;
  const act = el.dataset.act;
  switch (act){
    case 'consent': S.consent = true; save(); sparkleAt(el, 24); render(); break;
    case 'go': { const g = JSON.parse(el.dataset.go); go(g[0], g[1]); break; }
    case 'breathe': breathe(); break;
    case 'tmode': UI.flips = new Set(); UI.tarot = +el.dataset.n; render(); break;
    case 'deck':
      if (S.today.draws[UI.tarot]){ toast('Le tirage du jour est déjà fixé'); break; }
      S.deck = el.dataset.deck; UI.flips = new Set(); save(); render(); break;
    case 'flip': case 'homeflip': {
      if (el.classList.contains('flipped') || (act === 'homeflip' && isDone('tarot1'))){ cardSheet(el.dataset.card); break; }
      if (!chg) startCharge(el, true);
      break;
    }
    case 'card': cardSheet(el.dataset.card); break;
    case 'amode': UI.astres = el.dataset.m; render(); break;
    case 'sign': {
      const i = +el.dataset.i, z = ZODIAC[i];
      openSheet(`<div class="h-horo stack"><div class="sign-hero"><div class="glyph-orb"><span>${z.g}${VS}</span></div><h2 class="h-title gold" style="font-size:24px">${z.n}</h2><div class="small muted">${z.d} · ${z.el}</div></div><figure class="constel-box" style="padding:0">${constellation(i)}</figure>${horoBlock(i)}</div>`);
      break;
    }
    case 'reveal': {
      const id = el.dataset.id, rect = el.getBoundingClientRect(), cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
      if (award(id)){ sparkle(cx, cy, 40, 1.4); ringAt(cx, cy, Math.max(rect.width, 120), '#ffe6a8'); if (id === 'rune') Snd.bowl(130.8, .22); else Snd.chime(); buzz(25); }
      render(); break;
    }
    case 'sound':
      if (S.zen){ toast('Le mode zen coupe les sons. Désactivez-le dans le profil.'); break; }
      S.sound = !S.sound; save(); render(); if (S.sound){ Snd.unlock(); Snd.ding(); } break;
    case 'toggle': {
      const k = el.dataset.k;
      if (k === 'sound' && S.zen){ S.zen = false; S.sound = true; }
      else if (k === 'tilt' && S.zen){ S.zen = false; S.tilt = true; }
      else S[k] = !S[k];
      applyZen(); save();
      if (k === 'tilt'){ if (S.tilt) enableTilt(true); else { tX = tY = 0; } }
      if (k === 'sound' && S.sound){ Snd.unlock(); Snd.ding(); }
      if (k === 'zen' && !S.zen){ sparkleAt(el, 30, 1.2); Snd.chime(); }
      render(); break;
    }
    case 'lvl-close': { const o = el.closest('.lvl-ov'); if (o) o.remove(); break; }
    case 'gsuit': UI.gsuit = el.dataset.s; render(); break;
    case 'glocked': toast('Cette carte ne s\'est pas encore montrée à vous'); break;
    case 'oracle': UI.oracle = el.dataset.id || null; UI.pendulum = null; UI.compat = null; UI.tq = null; render(); window.scrollTo(0, 0); break;
    case 'tq-start': UI.tq = {i: 0, ans: []}; render(); window.scrollTo(0, 0); break;
    case 'tq-back': if (!UI.tq) break; if (UI.tq.i) UI.tq.i--; else UI.tq = null; render(); break;
    case 'tq-a': {
      if (!UI.tq) break;
      UI.tq.ans[UI.tq.i] = +el.dataset.k;
      el.setAttribute('aria-pressed', 'true'); sparkleAt(el, 8, .6);
      setTimeout(() => { if (!UI.tq) return; if (UI.tq.i < TOTEM_QUIZ.length - 1){ UI.tq.i++; render(); } else finishQuiz(); }, calm() ? 0 : 220);
      break;
    }
    case 'totem-peek': totemSheet(el.dataset.id); break;
    case 'back': if (!el.disabled){ S.back = el.dataset.id; save(); render(); } break;
    case 'art': S.art = ART = artOf(el.dataset.id).id; save(); render(); break;
    case 'edit': openSheet(`<div class="h-eyebrow">Mes informations</div>${profileForm(true)}`); break;
    case 'legal': legalSheet(el.dataset.t); break;
    case 'privacy': openSheet(`<div class="stack">${PRIVACY}</div>`); break;
    case 'erase': UI.confirmErase = true; render(); break;
    case 'erase-no': UI.confirmErase = false; render(); break;
    case 'erase-yes':
      try { localStorage.removeItem(KEY); } catch (err) {}
      S = defaultState(); ART = 'rws'; shown = 0; applyZen(); UI.view = 'accueil'; UI.confirmErase = false; history.replaceState(null, '', '#accueil'); render(); break;
    case 'install': installApp(); break;
    case 'install-hide': S.installHide = true; save(); render(); break;
    case 'close': closeSheet(); break;
  }
});

document.addEventListener('submit', e => {
  const f = e.target; if (!f.dataset.form) return;
  e.preventDefault();
  const kind = f.dataset.form;
  if (kind === 'profile' || kind === 'edit'){
    const p = validateProfile(f); if (!p) return;
    const first = !S.profile;
    S.profile = p; save();
    if (kind === 'edit') closeSheet();
    if (first){ sparkle(innerWidth / 2, innerHeight / 2, 60, 1.6); checkIn(); installBonus(); UI.view = 'accueil'; history.replaceState(null, '', '#accueil'); }
    render(); return;
  }
  if (kind === 'pendule'){
    const q = f.q.value.trim();
    if (!q){ $('#q-err').textContent = 'Écrivez une question à laquelle on peut répondre par oui ou non.'; return; }
    const norm = q.toLowerCase().replace(/\s+/g, ' ');
    const r = pick(rngFrom(userKey() + '|' + dk() + '|pendule|' + norm), PENDULUM);
    UI.pendulum = {q, a: r.a, d: r.d, swinging: !calm()};
    render();
    setTimeout(() => {
      if (!UI.pendulum || UI.pendulum.q !== q) return;
      UI.pendulum.swinging = false;
      award('pendule'); render();
      const ans = document.querySelector('.answer'); if (ans){ sparkleAt(ans, 36, 1.3); Snd.chime(); buzz(25); }
    }, calm() ? 0 : 2800);
    return;
  }
  if (kind === 'compat'){
    const b = f.cb.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b) || b < '1900-01-01' || b > dk()){ $('#cb-err').textContent = 'Choisissez une date de naissance valide.'; return; }
    UI.compat = {name: f.cn.value.trim().slice(0, 30), birth: b};
    award('compat'); render();
    const ring = document.querySelector('.ring'); if (ring){ ring.scrollIntoView({behavior: calm() ? 'auto' : 'smooth', block:'center'}); setTimeout(() => { sparkleAt(ring, 40, 1.4, ['#ff9ad5','#ffc0a8','#fbe2a0','#fff3d6']); Snd.chime(); }, 300); }
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSheet();
  const el = e.target;
  if ((e.key === 'Enter' || e.key === ' ') && el && el.classList && el.classList.contains('tcard')){ e.preventDefault(); el.click(); }
});
document.addEventListener('error', e => { const t = e.target; if (t && t.tagName === 'IMG'){ const f = t.closest('.face'); if (f) f.classList.add('noimg'); else t.style.visibility = 'hidden'; } }, true);
const TOUCHY = '.btn, .tile, .seg button, .signs button, .explore-links button, .read-row, .gslot, .grim-link, .sw-row, .snd, .back-opt';
const RIPPLE = '.btn, .seg button, .signs button, .explore-links button';
const SKY_SKIP = 'button, a, input, label, form, .frame, .frame-plain, .tile, .dtile, .sheet, .nav, .stat, .tcard, .lvl-ov, .breathe, .overlay .frame';
document.addEventListener('pointerdown', e => {
  eatClick = false;
  lastTap = {x: e.clientX, y: e.clientY, t: performance.now()};
  if (S.sound && !S.zen) Snd.unlock();
  const card = e.target.closest('.tcard');
  if (card && !card.classList.contains('flipped') && e.button === 0 && !(card.dataset.act === 'homeflip' && isDone('tarot1'))){
    downAt = {x: e.clientX, y: e.clientY, id: e.pointerId};
    startCharge(card, false);
    return;
  }
  const t = e.target.closest(TOUCHY);
  if (t){
    sparkle(e.clientX, e.clientY, 7, .6);
    if (!calm() && t.matches(RIPPLE)){
      const b = t.getBoundingClientRect(), d = Math.max(b.width, b.height) * 2.4, r = document.createElement('span');
      r.className = 'ripple'; r.style.width = r.style.height = d + 'px'; r.style.left = (e.clientX - b.left) + 'px'; r.style.top = (e.clientY - b.top) + 'px';
      t.appendChild(r); setTimeout(() => r.remove(), 700);
    }
    return;
  }
  if (!e.target.closest(SKY_SKIP)){ sparkle(e.clientX, e.clientY, 16, .9); Snd.twinkle(); }
});
document.addEventListener('pointermove', e => {
  if (chg && chg.down && downAt && e.pointerId === downAt.id && Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 14) abortCharge();
  if (e.pointerType === 'mouse' && S.tilt && !calm()){ tX = (e.clientX / W - .5) * 1.2; tY = (e.clientY / H - .5) * 1.2; }
});
document.addEventListener('pointerup', e => {
  releaseCharge(); downAt = null;
  if (!calm()){ const t = e.target.closest(TOUCHY); if (t){ t.classList.remove('boing'); void t.offsetWidth; t.classList.add('boing'); setTimeout(() => t.classList.remove('boing'), 520); } }
  if (motionNeedsPermission && S.tilt && !tiltOn && !tiltAsked){ tiltAsked = true; enableTilt(true); }
});
document.addEventListener('pointercancel', () => { abortCharge(); downAt = null; });
document.addEventListener('contextmenu', e => { if (e.target.closest('.tcard')) e.preventDefault(); });
window.addEventListener('hashchange', fromHash);
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.profile && S.today.d !== dk()){ UI.flips = new Set(); checkIn(); render(); } });
window.addEventListener('resize', resize);

/* ---------- Démarrage ---------- */
$('#nav').innerHTML = `<div class="nav-in">${VIEWS.map(v => `<a href="#${v}" data-v="${v}">${ICONS[v]}<span>${NAV_LABELS[v]}</span></a>`).join('')}</div>`;
resize();
setTod(); setInterval(setTod, 5 * 60 * 1000);
applyZen();
requestAnimationFrame(skyLoop);
enableTilt(false);
const h0 = location.hash.slice(1);
if (ROUTES.includes(h0)) UI.view = h0;
if (S.consent && S.profile) checkIn();
function installBonus(){ if (standalone() && S.profile && !S.installBonus){ S.installBonus = true; gain(50, 'Application installée'); save(); } }
installBonus();
render();
})();
