/* ============ PERSONNALISATION ============
   Images des cartes : remplacez les fichiers du dossier cards/ en gardant les mêmes noms
   (m00 à m21 pour les arcanes majeurs ; w = Bâtons, c = Coupes, s = Épées, p = Deniers, 01 à 14),
   ou changez simplement la fonction ci-dessous. */
const cardImg = id => 'cards/' + id + '.webp';

(() => {
'use strict';

/* ---------- Outils ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const VS = '︎';
const reduceMotion = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

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
          deck:'22', back:'nuit', journal:[], installHide:false, installBonus:false, today:{d:null, done:{}, draws:{}}};
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
  const after = levelOf(S.points);
  if (after > before) setTimeout(() => levelUp(after), 900);
}
function award(id){
  if (isDone(id)) return false;
  const r = RITUALS.find(x => x.id === id);
  S.today.done[id] = true; S.rituals++;
  gain(r.pts, r.n);
  if (RITUALS.every(x => S.today.done[x.id]) && !S.today.done.all){
    S.today.done.all = true;
    setTimeout(() => gain(ALL_DONE_PTS, 'Tous les rituels du jour'), 400);
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

/* ---------- Effets : ciel étoilé et étincelles ---------- */
const sky = $('#sky'), sctx = sky.getContext('2d');
const fx = $('#fx'), fctx = fx.getContext('2d');
let W = 0, H = 0, DPR = 1, stars = [], shooting = null, particles = [], fxRunning = false;
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
  for (const c of [sky, fx]){ c.width = W * DPR; c.height = H * DPR; }
  sctx.setTransform(DPR, 0, 0, DPR, 0, 0); fctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  const n = Math.round(Math.min(220, W * H / 4200));
  stars = Array.from({length:n}, () => ({x: Math.random() * W, y: Math.random() * H, r: Math.random() < .9 ? Math.random() * 1 + .3 : Math.random() * 1.4 + 1, p: Math.random() * 6.28, s: .4 + Math.random() * 1.4, gold: Math.random() < .18}));
  if (reduceMotion) drawSky(0);
}
function drawSky(t){
  sctx.clearRect(0, 0, W, H);
  for (const st of stars){
    const a = reduceMotion ? .7 : .35 + .65 * (.5 + .5 * Math.sin(t / 1000 * st.s + st.p));
    sctx.globalAlpha = a;
    sctx.fillStyle = st.gold ? '#f5dc9c' : '#e9e2ff';
    sctx.beginPath(); sctx.arc(st.x, st.y, st.r, 0, 6.283); sctx.fill();
    if (st.r > 1.4){
      sctx.globalAlpha = a * .5; sctx.fillRect(st.x - st.r * 3, st.y - .4, st.r * 6, .8); sctx.fillRect(st.x - .4, st.y - st.r * 3, .8, st.r * 6);
    }
  }
  if (shooting){
    const s = shooting; s.life += 1;
    const x = s.x + s.vx * s.life, y = s.y + s.vy * s.life;
    const g = sctx.createLinearGradient(x, y, x - s.vx * 14, y - s.vy * 14);
    g.addColorStop(0, 'rgba(255,240,200,.9)'); g.addColorStop(1, 'rgba(255,240,200,0)');
    sctx.globalAlpha = Math.max(0, 1 - s.life / 60); sctx.strokeStyle = g; sctx.lineWidth = 1.6;
    sctx.beginPath(); sctx.moveTo(x, y); sctx.lineTo(x - s.vx * 14, y - s.vy * 14); sctx.stroke();
    if (s.life > 60) shooting = null;
  } else if (!reduceMotion && Math.random() < .0025){
    shooting = {x: Math.random() * W * .7 + W * .2, y: Math.random() * H * .4, vx: -(4 + Math.random() * 3), vy: 2 + Math.random() * 2, life: 0};
  }
  sctx.globalAlpha = 1;
}
let lastSky = 0;
function skyLoop(t){
  if (!document.hidden && t - lastSky > 33){ drawSky(t); lastSky = t; }
  requestAnimationFrame(skyLoop);
}
function sparkle(x, y, n = 18, spread = 1){
  if (reduceMotion) return;
  for (let i = 0; i < n; i++){
    const a = Math.random() * 6.283, v = (1 + Math.random() * 3.2) * spread;
    particles.push({x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 1, life: 0, max: 40 + Math.random() * 30, r: 1.5 + Math.random() * 2.5, gold: Math.random() < .7});
  }
  if (!fxRunning){ fxRunning = true; requestAnimationFrame(fxLoop); }
}
function sparkleAt(el, n, spread){ const b = el.getBoundingClientRect(); sparkle(b.left + b.width / 2, b.top + b.height / 2, n, spread); }
function fxLoop(){
  fctx.clearRect(0, 0, W, H);
  particles = particles.filter(p => p.life < p.max);
  for (const p of particles){
    p.life++; p.x += p.vx; p.y += p.vy; p.vx *= .96; p.vy = p.vy * .96 + .04;
    const a = 1 - p.life / p.max, r = p.r * (0.6 + a * .6);
    fctx.globalAlpha = a; fctx.fillStyle = p.gold ? '#fbe2a0' : '#c9a8ff';
    fctx.beginPath();
    fctx.moveTo(p.x, p.y - r * 2); fctx.quadraticCurveTo(p.x, p.y, p.x + r * 2, p.y); fctx.quadraticCurveTo(p.x, p.y, p.x, p.y + r * 2);
    fctx.quadraticCurveTo(p.x, p.y, p.x - r * 2, p.y); fctx.quadraticCurveTo(p.x, p.y, p.x, p.y - r * 2); fctx.fill();
  }
  fctx.globalAlpha = 1;
  if (particles.length) requestAnimationFrame(fxLoop); else { fxRunning = false; fctx.clearRect(0, 0, W, H); }
}

/* ---------- État d'interface ---------- */
const VIEWS = ['accueil','tarot','astres','oracles','profil'];
const UI = {view:'accueil', tarot:1, astres:'zodiaque', oracle:null, flips:new Set(), confirmErase:false, compat:null, pendulum:null};

/* ---------- Petits morceaux d'interface ---------- */
const ICONS = {
  accueil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 4.5a8 8 0 1 0 3 12.6A6.5 6.5 0 0 1 16.5 4.5z"/><path d="M18.5 3.5l.5 1.5 1.5.5-1.5.5-.5 1.5-.5-1.5L16.5 5.5 18 5z"/></svg>',
  tarot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><rect x="3.5" y="5" width="10" height="15" rx="1.5" transform="rotate(-10 8.5 12.5)"/><rect x="10.5" y="4" width="10" height="15" rx="1.5" transform="rotate(8 15.5 11.5)"/><path d="M15.6 9.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor"/></svg>',
  astres:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M12 2.5l2 6.5 6.5 3-6.5 3-2 6.5-2-6.5-6.5-3 6.5-3z"/><circle cx="19" cy="5" r="1" fill="currentColor"/><circle cx="5" cy="19" r="1" fill="currentColor"/></svg>',
  oracles:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3.2"/><circle cx="12" cy="12" r="1" fill="currentColor"/></svg>',
  profil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c1.2-3.8 4-5.5 7.5-5.5s6.3 1.7 7.5 5.5"/></svg>',
  back:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
  spark:'<svg viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z" fill="currentColor"/></svg>'
};
const NAV_LABELS = {accueil:'Accueil', tarot:'Tarot', astres:'Astres', oracles:'Oracles', profil:'Profil'};

function topbar(){
  return `<div class="topbar"><span class="brand-mini">Madame Voyance</span>
    <a class="chip" href="#profil" id="pchip" aria-label="Mes points et ma série">${ICONS.spark}<span>${S.points}</span><span class="sep"></span><span>${S.streak} j</span></a></div>`;
}
function updateChip(){ const c = $('#pchip'); if (c) c.innerHTML = `${ICONS.spark}<span>${S.points}</span><span class="sep"></span><span>${S.streak} j</span>`; }
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
  const done = RITUALS.filter(r => isDone(r.id)).length;
  const lv = levelOf(S.points), next = LEVELS[lv + 1];
  const pct = next ? Math.round((S.points - LEVELS[lv].p) / (next.p - LEVELS[lv].p) * 100) : 100;
  const chGlyph = CHINESE[chineseOf(p.birth).animal].h;
  const lp = lifePath(p.birth);
  const glyphFor = r => r.id === 'horo' ? z.g + VS : r.id === 'chinois' ? chGlyph : r.id === 'numero' ? lp : r.g;
  return `<section class="view">
    ${topbar()}
    <header class="hero">
      <h1 class="wordmark gold"><small>Madame</small>Voyance</h1>
      <div class="date-line"><span>${cap(fmtLong.format(now))}</span><span class="dot"></span><span>${MOON_PHASES[mi.idx].n}</span></div>
      <div class="greet">${hello}, ${esc(p.name)}</div>
    </header>

    <article class="frame" aria-labelledby="pt">
      <div class="h-eyebrow" id="pt" style="text-align:center">Pensée du jour</div>
      <p class="thought">« ${esc(thought)} »</p>
      <div class="thought-foot">${isDone('pensee')
        ? `<button class="btn btn-ghost" data-act="breathe">Respirer encore avec elle</button>`
        : `<button class="btn btn-gold" data-act="breathe">Respirer avec elle <span class="pts">+5</span></button>`}</div>
    </article>

    ${canInstall() && !S.installHide ? `<div class="install-banner">
      <img src="icons/icon-192.png" alt="" width="48" height="48">
      <div class="grow"><b>Gardez Madame Voyance à portée de main</b><span class="small muted">Sur votre écran d'accueil, comme une vraie app, même hors ligne. +50 points</span></div>
      <div class="ib-actions"><button class="btn btn-gold btn-sm" data-act="install">${installEvt ? 'Installer' : 'Comment faire'}</button>
      <button class="ib-close" data-act="install-hide" aria-label="Masquer">×</button></div>
    </div>` : ''}

    <section class="stack" aria-labelledby="rt">
      <div class="section-head"><h2 id="rt">Rituels du jour</h2><span class="count">${done} / ${RITUALS.length}</span></div>
      <div class="rituals">
        ${RITUALS.map(r => `<button class="rit ${isDone(r.id) ? 'done' : ''}" data-act="go" data-go='${JSON.stringify(r.go)}'>
          <span class="g">${esc(String(glyphFor(r)))}</span>
          <span class="t">${esc(r.n)}<br><span class="p">${isDone(r.id) ? '✓ accompli' : '+' + r.pts + ' points'}</span></span>
        </button>`).join('')}
      </div>
      <p class="small muted" style="margin:0;text-align:center">Accomplissez les ${RITUALS.length} rituels pour un bonus de ${ALL_DONE_PTS} points.</p>
    </section>

    <a class="frame-plain levelbar" href="#profil" style="text-decoration:none;color:inherit">
      <div class="lv-row"><span class="lv-name">${esc(LEVELS[lv].t)}</span><span class="count">${S.points} pts</span></div>
      <div class="track"><i style="width:${pct}%"></i></div>
      <div class="small muted">${next ? `Encore ${next.p - S.points} points pour devenir ${esc(next.t)}` : 'Vous avez atteint le plus haut niveau.'} · Série : ${S.streak} jour${S.streak > 1 ? 's' : ''}</div>
    </a>
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
  return `<section class="view">
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
    <div class="stage">
      <div class="spread n${n}">
        ${cards.map((c, i) => `<div class="slot">
          <button class="tcard ${flipped(i) ? 'flipped' : ''}" data-act="flip" data-i="${i}" data-card="${c.id}" aria-label="${flipped(i) ? esc(c.name) : 'Carte face cachée, ' + esc(sp.pos[i])}">
            <span class="tc-inner">${backFace(S.back)}${cardFront(c)}</span>
          </button>
          ${n > 1 ? `<span class="slot-label">${n === 10 ? (i + 1) + '. ' : ''}${esc(sp.pos[i])}</span>` : ''}
        </div>`).join('')}
      </div>
      ${done ? `<div class="tap-hint">Touchez une carte pour la voir en grand</div>`
             : `<div class="tap-hint">Concentrez-vous sur votre question, puis touchez ${n === 1 ? 'la carte pour la retourner' : 'chaque carte pour la retourner'} · +${sp.pts} points</div>`}
    </div>
    ${reading}
  </section>`;
}

/* ---------- Vue : Astres ---------- */
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
    <div class="horo-item"><div class="horo-head"><b>Amour</b>${starRating(h.s[0])}</div><div class="msg" style="margin:0">${esc(h.amour)}</div></div>
    <div class="horo-item"><div class="horo-head"><b>Travail &amp; argent</b>${starRating(h.s[1])}</div><div class="msg" style="margin:0">${esc(h.travail)}</div></div>
    <div class="horo-item"><div class="horo-head"><b>Énergie</b>${starRating(h.s[2])}</div><div class="msg" style="margin:0">${esc(h.energie)}</div></div>
    <div class="tip"><span>✦</span><span><b>Conseil :</b> ${esc(h.conseil)}</span></div>
  </div>`;
}
function vAstres(){
  const b = S.profile.birth, {m, d} = birthParts(b), si = signIndex(m, d), z = ZODIAC[si];
  let body = '';
  if (UI.astres === 'zodiaque'){
    body = `<div class="sign-hero">
        <div class="glyph-orb"><span>${z.g}${VS}</span></div>
        <h2 class="h-title gold" style="font-size:24px">${z.n}</h2>
        <div class="small muted">${z.d}</div>
        <div class="facts"><span class="fact">${z.el}</span><span class="fact">Planète : ${cap(z.pl)}</span></div>
        <p class="small muted" style="margin:4px 0 0;max-width:34ch">${esc(z.t)}</p>
      </div>
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
  return `<section class="view">
    ${topbar()}
    <div><div class="h-eyebrow">Les astres</div><h1 class="h-title gold">Votre ciel du jour</h1></div>
    <div class="seg" role="group" aria-label="Section">
      ${[['zodiaque','Zodiaque'],['chinois','Chinois'],['lune','Lune']].map(([k, l]) => `<button data-act="amode" data-m="${k}" aria-pressed="${UI.astres === k}">${l}</button>`).join('')}
    </div>
    ${body}
  </section>`;
}

/* ---------- Vue : Oracles ---------- */
const ORACLES = [
  {id:'numero', n:'Numérologie', g:'9', d:'Votre chemin de vie et le nombre du jour'},
  {id:'rune', n:'Rune du jour', g:'ᚱ', d:'Une rune tirée de la bourse'},
  {id:'pierre', n:'Pierre & couleur', g:'◆', d:'Votre talisman et votre chiffre chance'},
  {id:'pendule', n:'Pendule', g:'▾', d:'Posez une question fermée'},
  {id:'compat', n:'Compatibilité', g:'♡', d:'Comparez vos astres avec ceux d\'une autre personne', wide:true}
];
function vOracles(){
  if (!UI.oracle){
    return `<section class="view">
      ${topbar()}
      <div><div class="h-eyebrow">Les oracles</div><h1 class="h-title gold">Que voulez-vous savoir ?</h1></div>
      <div class="tiles">
        ${ORACLES.map(o => `<button class="tile ${o.wide ? 'wide' : ''}" data-act="oracle" data-id="${o.id}">
          <span class="tg">${o.id === 'compat' ? o.g + VS : o.g}</span>
          <span class="${o.wide ? 'grow' : ''}"><span class="tn">${o.n}</span><br><span class="td">${o.d}</span></span>
          <span class="badge ${isDone(o.id) ? 'ok' : ''}">${isDone(o.id) ? '✓' : '+' + RITUALS.find(r => r.id === o.id).pts}</span>
        </button>`).join('')}
      </div>
    </section>`;
  }
  const o = ORACLES.find(x => x.id === UI.oracle);
  const head = `${topbar()}<button class="back-link" data-act="oracle" data-id="">${ICONS.back}Tous les oracles</button>
    <div><div class="h-eyebrow">Oracle</div><h1 class="h-title gold">${o.n}</h1></div>`;
  return `<section class="view">${head}${oracleBody(o.id)}</section>`;
}
function oracleBody(id){
  const p = S.profile;
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
      <div class="track"><i style="width:${pct}%"></i></div>
      <div class="small muted">${next ? `${S.points} / ${next.p} points pour devenir ${esc(next.t)}` : `${S.points} points · niveau maximal atteint`}</div>
    </div>
    <div class="stats4">
      <div class="stat"><b>${S.points}</b><span>points</span></div>
      <div class="stat"><b>${S.streak} j</b><span>série actuelle</span></div>
      <div class="stat"><b>${S.best} j</b><span>meilleure série</span></div>
      <div class="stat"><b>${S.rituals}</b><span>rituels accomplis</span></div>
    </div>

    <section class="stack"><div class="section-head"><h2>Dos de cartes</h2><span class="count">Débloqués par niveau</span></div>
      <div class="backs">${BACKS.map(bk => {
        const locked = lv < bk.lvl;
        return `<button class="back-opt" data-act="back" data-id="${bk.id}" aria-pressed="${S.back === bk.id}" ${locked ? `disabled data-lvl="${bk.lvl + 1}"` : ''}>
          <span class="mini" ${locked ? `data-lvl="${bk.lvl + 1}"` : ''}>${backFace(bk.id)}</span><span>${bk.n}</span></button>`;
      }).join('')}</div>
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
      </div>
    </section>
    <p class="foot"><img src="icons/icon-192.png" alt="" width="40" height="40" class="foot-icon"><br>Madame Voyance est un divertissement. Ses messages ne remplacent pas l'avis d'un professionnel de santé, du droit ou de la finance.<br>Illustrations : tarot Rider-Waite-Smith (1909), domaine public.</p>
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
    <li><span><b>Le journal de vos cartes du jour</b> et vos préférences (jeu, dos de carte).</span></li>
  </ul>
  <p class="small" style="margin:0">Tout est enregistré <b>uniquement dans le navigateur de cet appareil</b>. Rien n'est envoyé ni partagé. Les questions posées au pendule et les dates saisies pour la compatibilité ne sont pas conservées.</p>
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
  openSheet(`<div class="stack levelup"><div class="glyph-orb"><span class="num">${lv + 1}</span></div>
    <div class="h-eyebrow">Nouveau niveau</div><h2 class="h-title gold">${esc(LEVELS[lv].t)}</h2>
    ${unlock ? `<p class="lead" style="margin:0">Vous débloquez le dos de cartes « ${unlock.n} ». Choisissez-le dans votre profil.</p>` : `<p class="lead" style="margin:0">Les étoiles saluent votre fidélité.</p>`}</div>`);
  setTimeout(() => sparkle(innerWidth / 2, innerHeight * .55, 60, 1.6), 200);
}
function breathe(){
  const el = document.createElement('div'); el.className = 'breathe';
  el.innerHTML = `<div class="orb"></div><p id="bt">Inspirez…</p><button class="btn btn-ghost" id="bstop">Terminer</button>`;
  document.body.appendChild(el);
  let t = 0; const bt = el.querySelector('#bt');
  const iv = setInterval(() => { t++; bt.textContent = t % 2 ? 'Expirez…' : 'Inspirez…'; if (t >= 4) end(); }, 4000);
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
  const v = UI.view;
  $('#app').innerHTML = v === 'tarot' ? vTarot() : v === 'astres' ? vAstres() : v === 'oracles' ? vOracles() : v === 'profil' ? vProfil() : vAccueil();
  document.querySelectorAll('.nav a').forEach(a => a.setAttribute('aria-current', a.dataset.v === v ? 'page' : 'false'));
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
  if (VIEWS.includes(h) && h !== UI.view){ if (h === 'oracles') UI.oracle = null; UI.view = h; UI.confirmErase = false; render(); window.scrollTo(0, 0); }
}

/* ---------- Actions ---------- */
document.addEventListener('click', e => {
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
    case 'flip': {
      const i = +el.dataset.i, n = UI.tarot, id = 'tarot' + n;
      if (el.classList.contains('flipped')){ cardSheet(el.dataset.card); break; }
      UI.flips.add(i); el.classList.add('flipped');
      el.setAttribute('aria-label', CARD[el.dataset.card].name);
      setTimeout(() => sparkleAt(el, 22, 1.1), reduceMotion ? 0 : 380);
      if (UI.flips.size >= n && !isDone(id)){
        const cards = drawSpread(n);
        S.today.draws[n] = cards.map(c => c.id);
        if (n === 1){ S.journal.push({d: dk(), id: cards[0].id}); if (S.journal.length > 120) S.journal = S.journal.slice(-120); }
        award(id);
        setTimeout(() => { render(); const r = document.querySelector('.reading, .daily-read'); if (r) r.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'start'}); }, reduceMotion ? 0 : 1000);
      }
      break;
    }
    case 'card': cardSheet(el.dataset.card); break;
    case 'amode': UI.astres = el.dataset.m; render(); break;
    case 'sign': {
      const i = +el.dataset.i, z = ZODIAC[i];
      openSheet(`<div class="sign-hero"><div class="glyph-orb"><span>${z.g}${VS}</span></div><h2 class="h-title gold" style="font-size:24px">${z.n}</h2><div class="small muted">${z.d} · ${z.el}</div></div>${horoBlock(i)}`);
      break;
    }
    case 'reveal': {
      const id = el.dataset.id, rect = el.getBoundingClientRect();
      if (award(id)) sparkle(rect.left + rect.width / 2, rect.top + rect.height / 2, 34, 1.3);
      render(); break;
    }
    case 'oracle': UI.oracle = el.dataset.id || null; UI.pendulum = null; UI.compat = null; render(); window.scrollTo(0, 0); break;
    case 'back': if (!el.disabled){ S.back = el.dataset.id; save(); render(); } break;
    case 'edit': openSheet(`<div class="h-eyebrow">Mes informations</div>${profileForm(true)}`); break;
    case 'privacy': openSheet(`<div class="stack">${PRIVACY}</div>`); break;
    case 'erase': UI.confirmErase = true; render(); break;
    case 'erase-no': UI.confirmErase = false; render(); break;
    case 'erase-yes':
      try { localStorage.removeItem(KEY); } catch (err) {}
      S = defaultState(); UI.view = 'accueil'; UI.confirmErase = false; history.replaceState(null, '', '#accueil'); render(); break;
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
    UI.pendulum = {q, a: r.a, d: r.d, swinging: !reduceMotion};
    render();
    setTimeout(() => {
      if (!UI.pendulum || UI.pendulum.q !== q) return;
      UI.pendulum.swinging = false;
      award('pendule'); render();
      const ans = document.querySelector('.answer'); if (ans) sparkleAt(ans, 30, 1.2);
    }, reduceMotion ? 0 : 2800);
    return;
  }
  if (kind === 'compat'){
    const b = f.cb.value;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(b) || b < '1900-01-01' || b > dk()){ $('#cb-err').textContent = 'Choisissez une date de naissance valide.'; return; }
    UI.compat = {name: f.cn.value.trim().slice(0, 30), birth: b};
    award('compat'); render();
    const ring = document.querySelector('.ring'); if (ring){ ring.scrollIntoView({behavior: reduceMotion ? 'auto' : 'smooth', block:'center'}); setTimeout(() => sparkleAt(ring, 34, 1.3), 300); }
  }
});

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });
document.addEventListener('error', e => { const t = e.target; if (t && t.tagName === 'IMG'){ const f = t.closest('.face'); if (f) f.classList.add('noimg'); else t.style.visibility = 'hidden'; } }, true);
document.addEventListener('pointerdown', e => { if (e.target.closest('.btn, .rit, .tile, .seg button, .signs button')) sparkle(e.clientX, e.clientY, 7, .6); });
window.addEventListener('hashchange', fromHash);
document.addEventListener('visibilitychange', () => { if (!document.hidden && S.profile && S.today.d !== dk()){ UI.flips = new Set(); checkIn(); render(); } });
window.addEventListener('resize', resize);

/* ---------- Démarrage ---------- */
$('#nav').innerHTML = `<div class="nav-in">${VIEWS.map(v => `<a href="#${v}" data-v="${v}">${ICONS[v]}<span>${NAV_LABELS[v]}</span></a>`).join('')}</div>`;
resize();
if (!reduceMotion) requestAnimationFrame(skyLoop);
const h0 = location.hash.slice(1);
if (VIEWS.includes(h0)) UI.view = h0;
if (S.consent && S.profile) checkIn();
function installBonus(){ if (standalone() && S.profile && !S.installBonus){ S.installBonus = true; gain(50, 'Application installée'); save(); } }
installBonus();
render();
})();
