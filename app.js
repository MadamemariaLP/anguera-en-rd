// RD TRIP CLUB — app (vanilla JS, sin build). Estado local + capa store
// preparada para sincronizar con Supabase (ver ../DISENO.md §4).
(() => {
'use strict';

const T = window.TRIP;
const KEY = 'rdtc-state-v1';
const $ = (s, el = document) => el.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = () => Math.random().toString(36).slice(2, 9);
const eur = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: n % 1 ? 2 : 0 }).format(n);
const num = n => new Intl.NumberFormat('es-ES').format(Math.round(n));
const CUR = { EUR: '€', USD: '$', DOP: 'RD$' };
const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
const parseDay = d => new Date(d + 'T12:00:00');
const KIND = {
  flight: ['✈️', '#7FDBFF'], transfer: ['🚐', '#FFE0A3'], beach: ['🏖️', '#A7F0E4'], adventure: ['🏍️', '#FFC2B8'],
  food: ['🍽️', '#FFE7A8'], chill: ['🌴', '#C9F2D7'], party: ['🎉', '#FFD1E1'], idea: ['💡', '#E8E0FF'],
};
const CATS = [['comida', '🍽️'], ['bebida', '🍹'], ['transporte', '🚕'], ['actividad', '🏍️'], ['súper', '🛒'], ['propinas', '💵'], ['otros', '🧾']];

// ---------- Store ----------
const defaults = () => ({
  unlocked: false, me: null, theme: 'auto', names: {}, avatars: {}, famNames: {},
  votes: {}, signups: {}, docs: {}, paid: {}, wish: {}, expenses: [], posts: [
    { id: 'w1', by: 'coco', text: '¡Bienvenidos al RD TRIP CLUB! 🌴 Votad la villa, subid vuestros platos y canciones en Gustos, y marcad vuestros documentos en Viaje → Checklist.', ts: Date.now(), pin: true },
  ],
  log: [], bingo: {}, missionDone: {}, challenges: {}, photos: [], dishes: [], songs: [], chat: [],
  settleByFam: true, whatsapp: '', fx: { ...T.fx },
  extra: [], removed: [], pins: {}, ui: { route: 'home', sub: {} }, drafts: {},
  music: true, notified: {}, mig: 0,
});
let S;
try { S = Object.assign(defaults(), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = defaults(); }
S.unlocked = true; // sin código de entrada (decisión de María, 30/10)
// Migraciones: datos que el grupo ya confirmó y deben aparecer en todos los móviles.
if (S.mig < 2) { S.paid.pay1 = Object.fromEntries(window.FAMILIES.map(f => [f.id, true])); S.mig = 2; }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { toast('No se pudo guardar (almacenamiento lleno)'); } };

// Photos live in IndexedDB (dataURLs pesan demasiado para localStorage).
const idb = (() => {
  let dbp;
  const open = () => dbp || (dbp = new Promise((res, rej) => {
    const r = indexedDB.open('rdtc', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('photos');
    r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
  }));
  const tx = async (mode, fn) => { const db = await open(); return new Promise((res, rej) => { const t = db.transaction('photos', mode); const q = fn(t.objectStore('photos')); t.oncomplete = () => res(q && q.result); t.onerror = () => rej(t.error); }); };
  return { get: k => tx('readonly', s => s.get(k)), put: (k, v) => tx('readwrite', s => s.put(v, k)), del: k => tx('readwrite', s => s.delete(k)) };
})();
const photoCache = {};
const loadPhoto = async id => photoCache[id] || (photoCache[id] = await idb.get(id).catch(() => null));

// ---------- Domain helpers ----------
const members = () => [...window.MEMBERS, ...S.extra].filter(m => !S.removed.includes(m.id)).map(m => ({ ...m, name: S.names[m.id] || m.name, avatar: S.avatars[m.id] || m.avatar }));
const groupLine = () => { const ms = members(); const a = ms.filter(m => m.kind === 'adult').length, t = ms.filter(m => m.kind === 'teen').length, k = ms.filter(m => m.kind === 'kid').length;
  return `${ms.length} viajeros (${a} adultos${t ? `, ${t} teen` : ''}${k ? `, ${k} peques` : ''})`; };
const mem = id => members().find(m => m.id === id) || { id, name: id === 'coco' ? 'Coco AI' : '¿?', avatar: id === 'coco' ? '🥥' : '👤', fam: '' };
const fams = () => window.FAMILIES.map(f => ({ ...f, name: S.famNames[f.id] || f.name }));
const fam = id => fams().find(f => f.id === id);
const me = () => mem(S.me);
const toEur = (a, c) => c === 'EUR' ? a : a / (S.fx[c] || 1);
const award = (m, pts, why, key) => {
  if (!m) return;
  if (key && S.log.some(l => l.key === key)) return;
  S.log.push({ m, pts, why, key, ts: Date.now() });
  if (pts > 0) toast(`+${pts} pts · ${why}`);
};
const points = m => S.log.filter(l => l.m === m).reduce((a, l) => a + l.pts, 0);
const famPoints = f => members().filter(m => m.fam === f).reduce((a, m) => a + points(m.id), 0);
const now = () => new Date();
const tripStart = new Date(T.start);
const tripDayIdx = () => { const d = now().toISOString().slice(0, 10); return window.DAYS.findIndex(x => x.date === d); };

function nextActivity() {
  const n = now();
  for (const d of window.DAYS) for (const it of d.items) {
    const t = /^\d/.test(it.time) ? new Date(`${d.date}T${it.time}:00`) : parseDay(d.date);
    if (t > n) return { day: d, it };
  }
  return null;
}
function famPaid(f) { return window.MILESTONES.every(p => S.paid[p.id]?.[f]); }

function balances() {
  const bal = {};
  members().forEach(m => (bal[m.id] = 0));
  for (const e of S.expenses) {
    const a = toEur(e.amount, e.cur);
    bal[e.payer] += a;
    const share = a / e.split.length;
    e.split.forEach(id => (bal[id] -= share));
  }
  if (!S.settleByFam) return bal;
  const fb = {};
  members().forEach(m => (fb[m.fam] = (fb[m.fam] || 0) + bal[m.id]));
  return fb;
}
function settleUp(bal) {
  const deb = [], cred = [];
  Object.entries(bal).forEach(([k, v]) => { if (v < -0.5) deb.push([k, -v]); else if (v > 0.5) cred.push([k, v]); });
  deb.sort((a, b) => b[1] - a[1]); cred.sort((a, b) => b[1] - a[1]);
  const out = [];
  let i = 0, j = 0;
  while (i < deb.length && j < cred.length) {
    const x = Math.min(deb[i][1], cred[j][1]);
    out.push({ from: deb[i][0], to: cred[j][0], amt: x });
    deb[i][1] -= x; cred[j][1] -= x;
    if (deb[i][1] < 0.5) i++;
    if (cred[j][1] < 0.5) j++;
  }
  return out;
}
const who = k => S.settleByFam ? (fam(k)?.emoji + ' ' + fam(k)?.name) : (mem(k).avatar + ' ' + mem(k).name);

function myMission(id) {
  const n = parseInt(String(id).replace(/\D/g, ''), 10) || 0;
  return window.MISSIONS[(n * 7 + 3) % window.MISSIONS.length];
}
function bingoLines(cells) {
  const on = new Set([12, ...cells]);
  const L = [];
  for (let r = 0; r < 5; r++) L.push([0, 1, 2, 3, 4].map(c => r * 5 + c));
  for (let c = 0; c < 5; c++) L.push([0, 1, 2, 3, 4].map(r => r * 5 + c));
  L.push([0, 6, 12, 18, 24], [4, 8, 12, 16, 20]);
  return L.filter(l => l.every(i => on.has(i))).length;
}
function badgesOf(id) {
  const m = mem(id);
  const water = ['c1', 'c7'].filter(c => S.challenges[c] === id).length;
  return {
    b1: water >= 2, b2: S.photos.filter(p => p.by === id).length >= 10, b3: !!S.missionDone[id],
    b4: bingoLines(S.bingo[id] || []) > 0, b5: m.fam && famPaid(m.fam), b6: window.POLLS.every(p => S.votes[p.id]?.[id] != null),
  };
}

// ---------- UI primitives ----------
let toastT;
function toast(t) {
  document.querySelectorAll('.toast').forEach(x => x.remove());
  const el = document.createElement('div'); el.className = 'toast'; el.textContent = t; document.body.append(el);
  clearTimeout(toastT); toastT = setTimeout(() => el.remove(), 2300);
}
function confetti(n = 26) {
  const set = ['🌴', '🥥', '🍹', '🌺', '⭐', '🐠', '🎉'];
  for (let i = 0; i < n; i++) {
    const e = document.createElement('div'); e.className = 'confetti';
    e.textContent = set[i % set.length]; e.style.left = Math.random() * 100 + 'vw';
    e.style.animationDuration = 1.6 + Math.random() * 1.6 + 's'; e.style.animationDelay = Math.random() * .4 + 's';
    document.body.append(e); setTimeout(() => e.remove(), 3800);
  }
}
function sheet(html, onMount) {
  const had = !!document.querySelector('.sheet');
  document.querySelectorAll('.sheet,.sheet-bg').forEach(x => x.remove());
  if (!had) history.pushState({ sheet: 1 }, '');
  const bg = document.createElement('div'); bg.className = 'sheet-bg'; bg.dataset.a = 'close-sheet';
  const sh = document.createElement('div'); sh.className = 'sheet'; sh.innerHTML = `<div class="grab"></div>${html}`;
  document.body.append(bg, sh); onMount && onMount(sh);
}
function closeSheet(fromHistory) {
  if (!document.querySelector('.sheet')) return;
  document.querySelectorAll('.sheet,.sheet-bg').forEach(x => x.remove());
  if (!fromHistory && history.state?.sheet) history.back();
}
const copy = async (txt, msg = 'Copiado ✅') => { try { await navigator.clipboard.writeText(txt); toast(msg); } catch { prompt('Copia el texto:', txt); } };

function scene(h = 300) {
  // Atardecer caribeño: sol, olas y palmeras (SVG propio).
  return `<svg class="scene" viewBox="0 0 400 ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#FFF6C8"/><stop offset=".6" stop-color="#FFD66B"/><stop offset="1" stop-color="#FFD66B" stop-opacity="0"/></radialGradient></defs>
    <circle cx="290" cy="${h * .42}" r="90" fill="url(#sun)" opacity=".9"/>
    <circle cx="290" cy="${h * .42}" r="38" fill="#FFF3B0"/>
    <path d="M0 ${h * .7} Q 50 ${h * .66} 100 ${h * .7} T 200 ${h * .7} T 300 ${h * .7} T 400 ${h * .7} V ${h} H0Z" fill="#26C6DA" opacity=".55"/>
    <path d="M0 ${h * .78} Q 60 ${h * .74} 120 ${h * .78} T 240 ${h * .78} T 360 ${h * .78} T 480 ${h * .78} V ${h} H0Z" fill="#00ACC1" opacity=".7"/>
    <path d="M0 ${h * .88} Q 70 ${h * .84} 140 ${h * .88} T 280 ${h * .88} T 420 ${h * .88} V ${h} H0Z" fill="#00838F" opacity=".85"/>
    <g fill="#0B3A53" opacity=".85">
      <path d="M352 ${h} C 350 ${h * .8} 344 ${h * .62} 330 ${h * .47}" stroke="#0B3A53" stroke-width="7" fill="none" stroke-linecap="round"/>
      <path d="M330 ${h * .47} c -30 -10 -58 2 -72 18 c 22 -6 44 -8 72 -18z M330 ${h * .47} c -8 -26 -34 -40 -58 -38 c 20 10 40 22 58 38z M330 ${h * .47} c 18 -22 46 -26 66 -16 c -24 2 -46 8 -66 16z M330 ${h * .47} c 28 -2 50 14 58 34 c -18 -14 -38 -24 -58 -34z M330 ${h * .47} c -2 -26 12 -46 30 -54 c -12 18 -22 36 -30 54z"/>
      <path d="M24 ${h} C 26 ${h * .86} 32 ${h * .75} 44 ${h * .66}" stroke="#0B3A53" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M44 ${h * .66} c -20 -8 -40 0 -50 12 c 16 -4 32 -6 50 -12z M44 ${h * .66} c 14 -16 34 -18 48 -10 c -18 2 -34 6 -48 10z M44 ${h * .66} c 0 -18 10 -32 24 -38 c -10 12 -18 26 -24 38z"/>
    </g>
    <g stroke="#fff" stroke-width="2" fill="none" opacity=".75" stroke-linecap="round"><path d="M120 ${h * .3} q 6 -6 12 0 q 6 -6 12 0"/><path d="M150 ${h * .22} q 4 -4 8 0 q 4 -4 8 0"/></g>
  </svg>`;
}

// ---------- Router ----------
const TABS = [['home', '🏠', 'Inicio'], ['trip', '🗓️', 'Viaje'], [null], ['explore', '🧭', 'Explora'], ['wallet', '💸', 'Wallet']];
// Al reabrir la app se vuelve a la última pantalla y pestaña.
let route = location.hash.slice(1) || S.ui.route || 'home';
let sub = { ...(S.ui.sub || {}), reveal: false }; // subtab por pantalla
if (!location.hash && route !== 'home') history.replaceState(null, '', '#' + route);
window.addEventListener('hashchange', () => { closeSheet(true); route = location.hash.slice(1) || 'home'; render(); window.scrollTo(0, 0); });
// Gesto/botón atrás con una hoja abierta: cierra la hoja en vez de cambiar de pantalla.
window.addEventListener('popstate', () => { if (document.querySelector('.sheet')) closeSheet(true); });
// ← siempre lleva a la pantalla "madre" (en la app instalada no hay barra del navegador).
const PARENT = { tastes: 'group' };
const back = () => go(PARENT[route] || 'home');
const go = r => { if (location.hash.slice(1) === r) return render(); location.hash = r; };

function render() {
  applyTheme();
  const app = $('#app');
  S.ui.route = route; S.ui.sub = sub; save();
  if (!S.unlocked || !S.me) { app.innerHTML = welcome(); return; }
  const V = { home, trip, explore, wallet, games, group, memories, ai, tastes }[route] || home;
  app.innerHTML = topbar() + `<main class="view">${V()}</main>` + nav();
  after[route]?.();
}
const after = {};

function topbar() {
  const av = route === 'home' ? members().slice(0, 4).map(m => `<span>${m.avatar}</span>`).join('') : '';
  const titles = { trip: 'Mi viaje', explore: 'Explora', wallet: 'Wallet', games: 'Juegos', group: 'Grupo', memories: 'Recuerdos', ai: 'Coco AI', tastes: 'Gustos' };
  return `<header class="topbar">
    ${route === 'home' ? '<button class="brand" data-a="go" data-r="home"><span class="brand-mark">🌴</span>RD TRIP CLUB</button>'
      : `<button class="icon-btn" data-a="back" aria-label="Volver">←</button><b class="brand">${titles[route] || ''}</b>`}
    <div class="spacer"></div>
    <button class="avatars" data-a="go" data-r="group" aria-label="Grupo">${av}</button>
    <button class="icon-btn" data-a="music" aria-label="${S.music ? 'Silenciar música' : 'Activar música'}">${S.music ? '🔊' : '🔇'}</button>
    <button class="icon-btn" data-a="go" data-r="memories" aria-label="Recuerdos">📸</button>
    <button class="icon-btn" data-a="settings" aria-label="Ajustes">${me().avatar}</button>
  </header>`;
}
function nav() {
  const btns = TABS.map(t => t[0] ? `<button class="${route === t[0] ? 'on' : ''}" data-a="go" data-r="${t[0]}"><span class="ic">${t[1]}</span>${t[2]}</button>` : '<div class="ai-slot"></div>').join('');
  return `<nav class="nav">${btns}</nav><button class="ai-fab" data-a="go" data-r="ai" aria-label="Coco, asistente IA">🥥</button>`;
}

// ---------- Welcome / invite gate ----------
function welcome() {
  const groups = fams().map(f => `<div class="fam-label">${f.emoji} ${esc(f.name)}</div><div class="who-grid">${members().filter(m => m.fam === f.id).map(m =>
    `<button data-a="pick-me" data-id="${m.id}"><span class="e">${m.avatar}</span>${esc(m.name)}</button>`).join('')}</div>`).join('');
  return `<section class="welcome">${scene(700)}
    <div class="inner"><div class="label">${esc(T.crew)} · 13—26 AGO 2027</div>
    <h1 style="font-size:44px">RD TRIP CLUB</h1><p class="tag" style="margin:8px 0 14px">${esc(T.tagline)}</p>
    <h2 style="font-size:24px">¿Quién eres? 👋</h2>
    <p class="tiny" style="color:#fff;opacity:.9;margin:4px 0 8px">Elige tu perfil. Luego podrás cambiar nombre, avatar y poner un PIN.</p>
    <div class="welcome-scroll">${groups}</div></div></section>`;
}

// ---------- HOME ----------
function home() {
  const n = nextActivity();
  const pending = window.MILESTONES.find(p => fams().some(f => !S.paid[p.id]?.[f.id]));
  const openPoll = window.POLLS.find(p => S.votes[p.id]?.[S.me] == null);
  const word = window.LEXICON[Math.floor(Date.now() / 864e5) % window.LEXICON.length];
  const top = members().map(m => ({ m, p: points(m.id) })).sort((a, b) => b.p - a.p).slice(0, 3);
  const quick = [
    ['trip', '🗓️', 'Planes', '#A7F0E4'], ['explore', '🗺️', 'Mapa', '#7FDBFF'], ['wallet', '💸', 'Gastos', '#FFE7A8'], ['ai', '🥥', 'Coco AI', '#FFD1E1'],
    ['games', '🏆', 'Juegos', '#E8E0FF'], ['group', '👨‍👩‍👧', 'Grupo', '#FFC2B8'], ['memories', '📸', 'Recuerdos', '#C9F2D7'], ['tastes', '🎶', 'Gustos', '#FFE0A3'],
  ];
  return `
  <section class="hero">${scene(320)}
    <div class="content">
      <div class="kicker">República Dominicana 🇩🇴</div>
      <h1>¡Qué lo que,<br>${esc(me().name.split(' ')[0])}!</h1>
      <div class="tag">Friends, sun & unforgettable moments.</div>
      <div class="countdown" id="cd"></div>
      <div class="hero-stats"><span class="chip">👥 ${members().length} viajeros</span><span class="chip">🌙 12 noches</span><span class="chip">📍 3 paradas</span></div>
    </div>
  </section>

  ${n ? `<button class="card next" style="width:100%;text-align:left" data-a="open-day" data-d="${n.day.date}">
    <div class="label">Próxima actividad</div>
    <h3>${esc(n.it.title)}</h3>
    <div class="meta"><span class="chip">📅 ${fmtDay(n.day.date)}</span>${/^\d/.test(n.it.time) ? `<span class="chip">🕐 ${esc(n.it.time)}</span>` : ''}
    ${n.it.cost ? `<span class="chip">💶 ${n.it.cost} ${CUR[n.it.cur]}</span>` : ''}
    ${n.it.optional ? `<span class="chip">🙋 ${(S.signups[n.it.id] || []).length} apuntados</span>` : ''}</div>
    <div class="big-emoji">${KIND[n.it.kind][0]}</div></button>` : ''}

  ${notifCard()}
  <div class="sec-title"><h2>Accesos rápidos</h2></div>
  <div class="grid4">${quick.map(q => `<button class="tile" data-a="go" data-r="${q[0]}"><div class="tile-ic" style="background:${q[3]}">${q[1]}</div>${q[2]}</button>`).join('')}</div>

  ${pending ? `<div class="sec-title"><h2>Próximo paso</h2><button data-a="go" data-r="wallet">Ver pagos</button></div>
  <div class="card"><div class="row"><div class="kind" style="background:#FFE7A8">${pending.emoji}</div>
    <div class="grow"><b>${esc(pending.title)}</b><div class="tiny">${esc(pending.amount)} · ${esc(pending.due)}</div></div></div>
    <div class="bar" style="margin-top:12px"><i style="width:${fams().filter(f => S.paid[pending.id]?.[f.id]).length * 25}%"></i></div>
    <div class="tiny" style="margin-top:6px">${fams().filter(f => S.paid[pending.id]?.[f.id]).length}/4 familias han pagado su parte</div></div>` : ''}

  ${openPoll ? `<div class="sec-title"><h2>Tu voto cuenta</h2><button data-a="go" data-r="group" data-sub="polls">Encuestas</button></div>
  ${pollCard(openPoll)}` : ''}

  <div class="sec-title"><h2>Ranking</h2><button data-a="go" data-r="games">Juegos</button></div>
  <div class="card">${top.every(t => !t.p) ? `<div class="muted">Aún nadie ha sumado puntos. Abre tu <b>misión secreta</b> en Juegos 🤫</div>` :
    top.map((t, i) => `<div class="rank"><span class="pos-n">${['🥇', '🥈', '🥉'][i]}</span><span style="font-size:22px">${t.m.avatar}</span><b class="grow">${esc(t.m.name)}</b><b>${t.p} pts</b></div>`).join('')}</div>

  <div class="sec-title"><h2>Palabra del día</h2></div>
  <div class="card" style="background:linear-gradient(135deg,#FFF3C4,#FFD1E1);color:#0B2A3C;border:0">
    <div class="label" style="color:#0B2A3C">Dominicano para principiantes 🇩🇴</div>
    <h3 style="font-size:28px;margin:6px 0">${esc(word[0])}</h3><div>${esc(word[1])}</div></div>

  <div class="sec-title"><h2>Clima en agosto</h2></div>
  <div class="card"><div class="row"><div style="font-size:40px">⛅</div><div class="grow"><b>~31 °C · mar a 29 °C</b>
    <div class="tiny">Chubascos tropicales cortos por la tarde. Es temporada de huracanes: seguro de viaje y ojo a avisos. Plan B en Coco AI → "¿Qué hacemos si llueve?"</div></div></div></div>`;
}
after.home = () => {
  const el = $('#cd'); if (!el) return;
  const tick = () => {
    if (!document.body.contains(el)) return clearInterval(iv);
    let ms = tripStart - now();
    if (ms <= 0) { const di = tripDayIdx(); el.innerHTML = `<div style="flex:1"><b>${di >= 0 ? 'Día ' + (di + 1) : '🌴'}</b><small>${di >= 0 ? 'del viaje' : '¡Ya estamos!'}</small></div>`; return; }
    const d = Math.floor(ms / 864e5); ms -= d * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const m = Math.floor(ms / 6e4); const s = Math.floor((ms - m * 6e4) / 1000);
    el.innerHTML = [[d, 'días'], [h, 'horas'], [m, 'min'], [s, 'seg']].map(x => `<div><b>${String(x[0]).padStart(2, '0')}</b><small>${x[1]}</small></div>`).join('');
  };
  tick(); const iv = setInterval(tick, 1000);
};
function fmtDay(d) { const x = parseDay(d); return `${DOW[x.getDay()]} ${x.getDate()} ago`; }

// ---------- TRIP ----------
function trip() {
  const t = sub.trip || 'plan';
  const z = Object.fromEntries(window.ZONES.map(z => [z.id, z]));
  const head = `<div class="page-head"><h1>Mi viaje</h1><p>13 → 25 de agosto 2027 · ${esc(T.crew)}</p></div>
  <div class="route">
    <div class="stop"><b style="background:#0B3A53">BCN</b><span>Barcelona</span></div><div class="leg"><em>✈️</em></div>
    <div class="stop"><b style="background:${z.yul.color}">YUL</b><span>Montreal</span></div><div class="leg"><em>✈️</em></div>
    <div class="stop"><b style="background:#7B2FF7">PUJ</b><span>Punta Cana</span></div><div class="leg"><em>🚐</em></div>
    <div class="stop"><b style="background:${z.ltr.color}">LTR</b><span>Las Terrenas</span></div><div class="leg"><em>🚐</em></div>
    <div class="stop"><b style="background:${z.puj.color}">HRH</b><span>Hard Rock</span></div>
  </div>
  <div class="seg">${[['plan', '🗓️ Itinerario'], ['flights', '✈️ Vuelos'], ['stays', '🏡 Alojamiento'], ['check', '✅ Checklist']].map(x => `<button class="${t === x[0] ? 'on' : ''}" data-a="sub" data-k="trip" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;

  if (t === 'flights') { const FS = window.FLIGHTS_STATUS; return head + `<div class="card bought" style="margin-top:14px"><div class="row"><span style="font-size:30px">✅</span><div class="grow"><b>Vuelos comprados y confirmados · ${esc(FS.airline)}</b><div class="tiny">${esc(FS.note)}</div></div></div></div>
    ${window.FLIGHTS.map(f => `<div class="pass">
    <div class="pass-head"><span>${esc(f.leg)}</span><b>✈ ${esc(f.no)}</b><span class="chip ok">Confirmado</span></div>
    <div class="top"><div><div class="iata">${f.from}</div><div class="city">${esc(f.fromCity)}</div></div><div class="plane"><span>✈</span><small>${esc(f.dur)}</small></div>
    <div style="text-align:right"><div class="iata">${f.to}</div><div class="city">${esc(f.toCity)}</div></div></div>
    <div class="bottom"><div><span class="tiny">Fecha</span><b>${esc(f.date)}</b></div><div><span class="tiny">Sale</span><b>${esc(f.dep)}</b></div><div><span class="tiny">Llega</span><b>${esc(f.arr)}</b></div></div>
    <div class="tiny" style="padding:0 18px 14px">${esc(f.note)}</div></div>`).join('')}
    <div class="card" style="margin-top:12px"><b>🍁 eTA de Canadá</b><p class="muted" style="margin:6px 0 0">Hacemos escala en Montreal a la ida y a la vuelta: cada viajero (peques incluidos) necesita su eTA. Márcalo en ✅ Checklist.</p></div>
    <div class="card"><b>🧠 Por qué vía Montreal</b><p class="muted" style="margin:6px 0 0">16 × 720 € = 11.520 € + 800 $ de hotel ≈ 12.205 €. Vía Madrid serían +1.000 € × 16 = 16.000 €. Ahorro ~3.800 € para el grupo.</p></div></div>`; }

  if (t === 'stays') {
    const p1 = window.POLLS[0];
    return head + `<div style="margin-top:14px">${window.STAYS.map(s => `<div class="card">
      ${s.img ? `<div class="stay-img" style="background-image:url(img/${s.img}.jpg)"><span>${esc(s.imgCap)}</span></div>` : ''}
      <div class="row"><div class="kind" style="background:${z[s.zone].color}22">${z[s.zone].emoji}</div><div class="grow"><b>${esc(s.name)}</b><div class="tiny">${esc(s.dates)}</div></div>
      <span class="chip">${esc(s.status)}</span></div>
      <div style="margin-top:8px;font-weight:800">${esc(s.price)}</div>
      ${s.rooms ? `<div style="margin-top:8px">${s.rooms.map(r => `<div class="settle"><span>${fam(r.fam).emoji}</span><span class="grow">${esc(fam(r.fam).name)} · ${esc(r.label)}</span><b>${num(r.price)} $</b></div>`).join('')}<p class="tiny">${esc(s.note)}</p></div>` : ''}
    </div>`).join('')}
    <div class="sec-title"><h2>Villas candidatas</h2><span class="tiny">Las Terrenas · ≥ 4,75 ★</span></div>
    ${window.VILLAS.map((v, i) => `<div class="card villa"><div class="thumb">${['🏡', '🌴', '🥥', '🐚', '💎'][i]}</div><div class="grow">
      <b>${esc(v.name)}</b><div class="tiny">${esc(v.meta)} · ★ ${v.rating}</div>
      <div class="tags">${v.tags.map(x => `<span class="${x === 'Favorita' ? 'hot' : ''}">${esc(x)}</span>`).join('')}</div>
      <div style="margin-top:6px;font:800 18px var(--font-display)">${eur(v.price)} <span class="tiny">· 4 noches · ${eur(Math.round(v.price / members().length))}/pers.</span></div></div></div>`).join('')}
    <div class="sec-title"><h2>Vota la villa</h2></div>${pollCard(p1)}
    <p class="tiny" style="margin-top:8px">Ojo: la luz se paga aparte en todas las villas.</p></div>`;
  }

  if (t === 'check') {
    const mine = S.docs[S.me] || {};
    const done = window.DOCS_CHECKLIST.filter(d => mine[d.id]).length;
    return head + `<div class="card" style="margin-top:14px"><div class="row"><b class="grow">Tus documentos</b><b>${done}/${window.DOCS_CHECKLIST.length}</b></div>
      <div class="bar" style="margin:8px 0 4px"><i style="width:${done / window.DOCS_CHECKLIST.length * 100}%"></i></div>
      ${window.DOCS_CHECKLIST.map((d, i) => `<button class="check" style="width:100%;text-align:left" data-a="doc" data-i="${i}">
        <span class="tick ${mine[d.id] ? 'on' : ''}">${mine[d.id] ? '✓' : ''}</span><span class="grow"><b>${d.emoji} ${esc(d.title)}</b><div class="tiny">${esc(d.detail)}</div></span></button>`).join('')}</div>
      <div class="sec-title"><h2>Estado del grupo</h2></div>
      <div class="card">${members().filter(m => m.kind !== 'kid').map(m => { const c = window.DOCS_CHECKLIST.filter(d => S.docs[m.id]?.[d.id]).length; return `<div class="rank"><span style="font-size:20px">${m.avatar}</span><span class="grow">${esc(m.name)}</span><div class="bar" style="width:90px"><i style="width:${c / window.DOCS_CHECKLIST.length * 100}%"></i></div><b class="tiny" style="width:34px;text-align:right">${c}/${window.DOCS_CHECKLIST.length}</b></div>`; }).join('')}
      <p class="tiny">Los adultos marcan también los documentos de sus peques.</p></div>`;
  }

  const sel = sub.day || (tripDayIdx() >= 0 ? window.DAYS[tripDayIdx()].date : window.DAYS[0].date);
  const day = window.DAYS.find(d => d.date === sel);
  return head + `<div class="daystrip" style="margin-top:14px">${window.DAYS.map(d => { const x = parseDay(d.date); return `<button class="${d.date === sel ? 'on' : ''}" data-a="day" data-d="${d.date}"><small>${DOW[x.getDay()]}</small><b>${x.getDate()}</b><i style="background:${z[d.zone].color}"></i></button>`; }).join('')}</div>
  <div class="card" style="margin:6px 0 14px;background:linear-gradient(135deg,${z[day.zone].color},${z[day.zone].color}AA);color:#fff;border:0">
    <div class="label">${esc(z[day.zone].name)} · Día ${window.DAYS.indexOf(day) + 1}</div>
    <h2 style="font-size:24px;margin-top:4px">${day.emoji} ${esc(day.title)}</h2></div>
  <div class="timeline">${day.items.map(it => { const s = S.signups[it.id] || []; const inn = s.includes(S.me); return `<div class="tl-item card">
    <div class="row"><div class="kind" style="background:${KIND[it.kind][1]}">${KIND[it.kind][0]}</div><div class="grow"><div class="time">${esc(it.time)}</div><h4>${esc(it.title)}</h4>${it.note ? `<div class="tiny">${esc(it.note)}</div>` : ''}</div></div>
    ${it.optional ? `<div class="who"><div class="avatars">${s.slice(0, 6).map(id => `<span>${mem(id).avatar}</span>`).join('')}</div><span class="tiny grow">${s.length} apuntados</span>
      <button class="btn sm ${inn ? 'ghost' : 'sea'}" data-a="signup" data-id="${it.id}">${inn ? 'Me borro' : '¡Me apunto!'}</button></div>` : ''}
  </div>`; }).join('')}</div>`;
}

// ---------- POLLS ----------
function pollCard(p) {
  const pi = window.POLLS.indexOf(p);
  const v = S.votes[p.id] || {};
  const total = Object.keys(v).length;
  const mine = v[S.me];
  return `<div class="card"><b>${p.emoji} ${esc(p.q)}</b><div class="tiny">${total} de ${members().length} han votado</div>
    ${p.options.map((o, i) => { const c = Object.values(v).filter(x => x === i).length; const pct = total ? Math.round(c / total * 100) : 0;
      return `<button class="poll-opt ${mine === i ? 'mine' : ''}" data-a="vote" data-p="${pi}" data-i="${i}"><i style="width:${mine != null ? pct : 0}%"></i><span>${esc(o)}</span>${mine != null ? `<b>${pct}%</b>` : ''}</button>`; }).join('')}</div>`;
}

// ---------- EXPLORE ----------
const M = window.MAP;
const proj = (lat, lon) => [(lon - M.lon0) * M.k, (M.lat0 - lat) * M.ky];
const VIEWS = { all: [-4, -8, M.w + 30, M.h + 34], ltr: [258, 30, 84, 43], puj: [284, 72, 108, 60] };
const pinScale = vb => Math.max(.38, vb[2] / VIEWS.all[2]);
const img = k => k ? `img/${k}.jpg` : '';
function explore() {
  const zf = sub.zone || 'all', cf = sub.cat || 'all', layer = sub.layer || 'ours';
  const zc = Object.fromEntries(window.ZONES.map(z => [z.id, z.color]));
  const places = window.PLACES.filter(p => (zf === 'all' || p.zone === zf) && (cf === 'all' || p.cat === cf || (cf === 'kids' && p.kids)));
  const locals = window.LOCALS.filter(p => (zf === 'all' || p.zone === zf) && (cf === 'all' || p.cat === cf || (cf === 'kids' && p.kids)));
  const card = p => { const w = S.wish[p.id] || []; const on = w.includes(S.me); return `<div class="card pcard">
    ${p.img ? `<button class="pimg" data-a="place" data-id="${p.id}" style="background-image:url(${img(p.img)})"><span class="chip">${p.emoji} ${esc(window.ZONES.find(z => z.id === p.zone)?.short || '')}</span></button>` : ''}
    <div class="pbody"><h4>${esc(p.name)}</h4><div class="muted" style="font-size:13.5px;margin:3px 0 8px">${esc(p.desc)}</div>
    <div class="row" style="gap:8px"><a class="btn sm ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q)}" target="_blank" rel="noopener">📍 Maps</a>
    <button class="btn sm ${on ? 'coral' : 'ghost'}" data-a="wish" data-id="${p.id}">${on ? '❤️' : '🤍'} ${w.length || ''} Me apetece</button></div></div></div>`; };
  return `<div class="page-head"><h1>Explora RD</h1><p>Toda la isla: dónde estaremos y sus sitios icónicos.</p></div>
  <div class="mapwrap" style="margin-top:12px">${islandMap(layer)}
    <div class="map-zoom">${[['all', '🏝️ Isla'], ['ltr', 'Samaná'], ['puj', 'Punta Cana']].map(x => `<button class="${(sub.view || 'all') === x[0] ? 'on' : ''}" data-a="mapview" data-v="${x[0]}">${x[1]}</button>`).join('')}</div></div>
  <div class="seg" style="margin-top:10px">${[['ours', '📍 Donde estaremos'], ['iconic', '⭐ Icónicos'], ['both', '🗺️ Todo']].map(x => `<button class="${layer === x[0] ? 'on' : ''}" data-a="sub" data-k="layer" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
  ${layer !== 'ours' ? `<div class="sec-title"><h2>Icónicos de RD</h2><span class="tiny">toca para ver</span></div>
  <div class="hscroll">${window.ICONIC.map(p => `<button class="icard" data-a="iconic" data-id="${p.id}" style="background-image:linear-gradient(transparent 40%,rgba(0,0,0,.65)),url(${img(p.img)})">
    ${p.far ? '<span class="chip far">otro viaje</span>' : '<span class="chip near">excursión</span>'}<b>${p.emoji} ${esc(p.name)}</b></button>`).join('')}</div>` : ''}
  <div class="seg" style="margin-top:16px">${[['all', '🌎 Todo'], ['ltr', '🏝️ Las Terrenas'], ['puj', '🎸 Punta Cana'], ['yul', '🍁 Montreal']].map(x => `<button class="${zf === x[0] ? 'on' : ''}" data-a="sub" data-k="zone" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
  <div class="pickers" style="margin-top:10px">${[['all', 'Todo'], ['playa', '🏖️ Playas'], ['excursion', '🧭 Excursiones'], ['comida', '🍽️ Comer'], ['fiesta', '🎉 Bares'], ['compras', '🛍️ Compras'], ['kids', '🧸 Peques']].map(x => `<button class="${cf === x[0] ? 'on' : ''}" data-a="sub" data-k="cat" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
  <div style="margin-top:12px">${places.map(card).join('')}</div>
  ${locals.length ? `<div class="sec-title"><h2>⭐ Recomendaciones locales</h2><span class="tiny">verificadas oct 2026</span></div>
  <div class="card">${locals.map(l => `<div class="exp"><div class="ic" style="background:${zc[l.zone]}22">${l.emoji}</div>
    <div class="grow"><b>${esc(l.name)}</b> <span class="tiny">${l.p}${l.kids ? ' · 🧸' : ' · solo adultos'}${l.big ? ' · mesa grande' : ''}</span><div class="tiny" style="color:var(--ink-2)">${esc(l.desc)}</div></div>
    <a class="btn sm ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(l.q)}" target="_blank" rel="noopener" aria-label="Abrir en Maps">📍</a></div>`).join('')}
    <p class="tiny">Revisad horarios y reseñas recientes en Maps antes de ir: en 2027 algo puede haber cambiado.</p></div>` : ''}
  ${!places.length && !locals.length ? '<div class="card muted">Nada por aquí con esos filtros.</div>' : ''}
  <div class="sec-title"><h2>💡 Tips de locales</h2></div>
  <div class="card">${window.TIPS.map(t => `<div class="check"><span style="font-size:22px">${t[0]}</span><span class="grow"><b>${esc(t[1])}</b><div class="tiny" style="color:var(--ink-2)">${esc(t[2])}</div></span></div>`).join('')}</div>`;
}
function islandMap(layer) {
  const v = VIEWS[sub.view || 'all'];
  const ours = window.PLACES.filter(p => !p.offmap);
  const sc = `transform="scale(${pinScale(v).toFixed(3)})"`;
  const pin = (p, cls, fn) => { const [x, y] = proj(p.lat, p.lon); return `<g class="pin ${cls}" data-a="${fn}" data-id="${p.id}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="sc" ${sc}><circle class="hit" r="6"/>${cls === 'ico' ? `<circle r="2.6"/><text y="-4.5" text-anchor="middle">${p.emoji}</text>` : `<circle r="2"/>`}</g></g>`; };
  const base = (lat, lon, c, t, z) => { const [x, y] = proj(lat, lon); return `<g class="pin base" data-a="mapview" data-v="${z}" transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><g class="sc" ${sc}>
    <circle class="pulse" r="6" fill="${c}"/><circle r="4.2" fill="${c}" stroke="#fff" stroke-width="1.4"/>
    <rect x="${z === 'puj' ? -50 : -27}" y="-15.5" width="54" height="9" rx="4.5" fill="#0B3A53"/><text x="${z === 'puj' ? -23 : 0}" y="-9.2" text-anchor="middle" class="lbl">${t}</text></g></g>`; };
  const [lx, ly] = proj(19.31, -69.54), [hx, hy] = proj(18.745, -68.455), [ax, ay] = proj(18.567, -68.363);
  return `<svg id="island" viewBox="${v.join(' ')}" role="img" aria-label="Mapa de La Española con nuestras zonas">
    <defs><filter id="glow"><feGaussianBlur stdDeviation="2.2"/></filter></defs>
    <g class="waves" opacity=".3" stroke="#fff" fill="none" stroke-width=".8"><path d="M10 12 q 8 -4 16 0 t 16 0"/><path d="M300 150 q 8 -4 16 0 t 16 0"/><path d="M60 150 q 8 -4 16 0 t 16 0"/><path d="M200 10 q 8 -4 16 0 t 16 0"/></g>
    <path d="${M.hti}" class="hti"/><text x="60" y="70" class="country">HAITÍ</text>
    <path d="${M.dom}" class="dom"/><text x="165" y="100" class="country">REP. DOMINICANA</text>
    <circle cx="${lx}" cy="${ly}" r="13" fill="#00B4C5" opacity=".35" filter="url(#glow)"/>
    <circle cx="${hx}" cy="${hy}" r="13" fill="#FFB627" opacity=".4" filter="url(#glow)"/>
    <path class="route" vector-effect="non-scaling-stroke" d="M ${ax} ${ay} C ${ax - 30} ${ay - 40}, ${lx + 40} ${ly + 30}, ${lx} ${ly}"/>
    <path class="route" vector-effect="non-scaling-stroke" d="M ${lx} ${ly} C ${lx + 40} ${ly + 20}, ${hx - 20} ${hy - 30}, ${hx} ${hy}"/>
    <text x="${ax + 4}" y="${ay + 9}" class="plane">✈️</text>
    ${layer !== 'iconic' ? ours.map(p => pin(p, 'our', 'place')).join('') : ''}
    ${layer !== 'ours' ? window.ICONIC.map(p => pin(p, 'ico', 'iconic')).join('') : ''}
    ${base(19.31, -69.54, '#00B4C5', 'Las Terrenas', 'ltr')}${base(18.745, -68.455, '#FFB627', 'Hard Rock', 'puj')}
  </svg>`;
}
function animateView(to) {
  const svg = $('#island'); if (!svg) return;
  const from = svg.getAttribute('viewBox').split(' ').map(Number); const t0 = performance.now();
  const step = t => { const k = Math.min(1, (t - t0) / 650); const e = 1 - Math.pow(1 - k, 3);
    const vb = from.map((f, i) => f + (to[i] - f) * e); svg.setAttribute('viewBox', vb.map(n => n.toFixed(2)).join(' '));
    svg.querySelectorAll('.sc').forEach(g => g.setAttribute('transform', `scale(${pinScale(vb).toFixed(3)})`)); if (k < 1) requestAnimationFrame(step); };
  requestAnimationFrame(step);
}
function placeSheet(p, iconic) {
  const w = S.wish[p.id] || []; const on = w.includes(S.me); const c = window.CREDITS[p.img];
  sheet(`${p.img ? `<div class="sheet-img" style="background-image:url(${img(p.img)})"></div>` : ''}
    <h2 style="margin-top:12px">${p.emoji} ${esc(p.name)}</h2><p class="muted" style="margin-top:-4px">${esc(p.desc)}</p>
    ${iconic ? `<div class="settle"><span>🚐</span><span class="grow">${esc(p.how)}</span></div>` : ''}
    <div class="row" style="gap:8px;margin-top:12px"><a class="btn sm ghost" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.q || p.name)}" target="_blank" rel="noopener">📍 Abrir en Maps</a>
    <button class="btn sm ${on ? 'coral' : 'ghost'}" data-a="wish" data-id="${p.id}" data-keep="1">${on ? '❤️' : '🤍'} ${w.length || ''} Me apetece</button></div>
    ${c ? `<p class="tiny" style="margin-top:12px">Foto: ${esc(c.a)} · ${esc(c.l)} · <a href="${esc(c.u)}" target="_blank" rel="noopener">Wikimedia Commons</a></p>` : ''}`);
}

// ---------- GROUP ----------
function group() {
  const t = sub.group || 'fams';
  const head = `<div class="page-head"><h1>El grupo</h1><p>${fams().length} familias · ${groupLine()}</p></div>
  <div class="seg" style="margin-top:12px">${[['fams', '👨‍👩‍👧 Familias'], ['polls', '🗳️ Encuestas'], ['board', '📌 Tablón']].map(x => `<button class="${t === x[0] ? 'on' : ''}" data-a="sub" data-k="group" data-v="${x[0]}">${x[1]}</button>`).join('')}
  <button data-a="go" data-r="tastes">🎶 Gustos</button></div>`;
  if (t === 'polls') return head + `<div style="margin-top:14px">${window.POLLS.map(pollCard).join('')}</div>`;
  if (t === 'board') return head + `<div class="card" style="margin-top:14px">
      <textarea class="input" id="post" data-draft="post" placeholder="Escribe un anuncio para el grupo…">${esc(S.drafts.post || '')}</textarea>
      <div class="row" style="margin-top:8px"><button class="btn sea sm" data-a="post">Publicar</button><div class="grow"></div>
      ${S.whatsapp ? `<a class="btn sm ghost" href="${esc(S.whatsapp)}" target="_blank" rel="noopener">💬 WhatsApp</a>` : '<span class="tiny">Chat del día a día: WhatsApp (pega el enlace en Ajustes)</span>'}</div></div>
    <div class="stack" style="margin-top:12px">${S.posts.slice().sort((a, b) => (b.pin ? 1 : 0) - (a.pin ? 1 : 0) || b.ts - a.ts).map(p => { const m = mem(p.by); return `<div class="post"><div class="av">${m.avatar}</div><div class="grow"><div class="tiny"><b>${esc(m.name)}</b> · ${new Date(p.ts).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} ${p.pin ? '📌' : ''}</div><div class="bubble">${esc(p.text)}</div></div></div>`; }).join('')}</div>`;
  return head + `<div class="stack" style="margin-top:14px">${fams().map(f => {
    const ms = members().filter(m => m.fam === f.id);
    return `<div class="fam" style="background:linear-gradient(135deg,${f.color},${f.color}C0)"><span class="em">${f.emoji}</span>
      <h3>${esc(f.name)}</h3><div style="font-size:12.5px;opacity:.95">Hard Rock: ${esc(f.room)} · ${famPaid(f.id) ? '✅ todo pagado' : '⏳ pagos pendientes'} · ${famPoints(f.id)} pts</div>
      <div class="people">${ms.map(m => `<span>${m.avatar} ${esc(m.name)}${m.id === S.me ? ' (tú)' : ''}</span>`).join('')}</div></div>`;
  }).join('')}</div>
  <button class="btn ghost block" style="margin-top:12px" data-a="edit-names">✏️ Editar nombres y familias</button>`;
}

// ---------- TASTES (platos y canciones) ----------
function tastes() {
  const t = sub.tastes || 'food';
  const head = `<div class="page-head"><h1>Gustos del club</h1><p>Platos favoritos y canciones de cada uno: así el menú del chef y las playlists salen solos.</p></div>
  <div class="seg" style="margin-top:12px">${[['food', '🍽️ Platos'], ['music', '🎶 Canciones']].map(x => `<button class="${t === x[0] ? 'on' : ''}" data-a="sub" data-k="tastes" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;
  if (t === 'music') {
    const songs = S.songs.slice().sort((a, b) => b.likes.length - a.likes.length);
    return head + `<div class="card" style="margin-top:14px;background:linear-gradient(135deg,#1DB980,#0B3A53);color:#fff;border:0">
      <div class="label">Playlist del grupo</div><h2 style="font-size:26px;margin:4px 0">🎧 RD Trip Club Mix</h2>
      <div style="opacity:.9;font-size:13px">${songs.length} ${songs.length === 1 ? 'canción' : 'canciones'} · de ${new Set(songs.map(s => s.by)).size} ${new Set(songs.map(s => s.by)).size === 1 ? 'persona' : 'personas'}</div>
      <div class="row" style="margin-top:12px;gap:8px"><button class="btn sm" style="background:#fff;color:#0B3A53" data-a="add-song">＋ Subir canción</button>
      <button class="btn sm" style="background:rgba(255,255,255,.2);color:#fff" data-a="copy-songs">📋 Copiar lista</button></div></div>
      <div class="seg" style="margin-top:12px">${[['all', 'Todas'], ['adult', '😎 Adultos'], ['kid', '🧸 Peques']].map(x => `<button class="${(sub.sf || 'all') === x[0] ? 'on' : ''}" data-a="sub" data-k="sf" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>
      <div class="card" style="margin-top:12px">${songs.filter(s => (sub.sf || 'all') === 'all' || s.for === sub.sf).map(s => { const m = mem(s.by); const on = s.likes.includes(S.me); const q = encodeURIComponent(`${s.title} ${s.artist}`);
        return `<div class="exp"><div class="ic">${s.for === 'kid' ? '🧸' : '🎵'}</div><div class="grow"><b class="ellipsis" style="display:block">${esc(s.title)}</b><div class="tiny">${esc(s.artist)} · ${m.avatar} ${esc(m.name)}</div>
          <div class="row" style="gap:6px;margin-top:6px"><a class="btn sm ghost" href="${s.url ? esc(s.url) : 'https://open.spotify.com/search/' + q}" target="_blank" rel="noopener">▶ Spotify</a><a class="btn sm ghost" href="https://www.youtube.com/results?search_query=${q}" target="_blank" rel="noopener">YouTube</a></div></div>
          <button class="btn sm ${on ? 'coral' : 'ghost'}" data-a="like-song" data-id="${s.id}">${on ? '❤️' : '🤍'} ${s.likes.length}</button></div>`; }).join('') || '<div class="muted">Aún no hay canciones. ¡Sube la tuya! 🎶</div>'}</div>
      <p class="tiny" style="margin-top:8px">Truco: "Copiar lista" y pégala en Spotify/YouTube Music o pásasela al DJ del catamarán.</p>`;
  }
  const kids = S.dishes.filter(d => d.for === 'kid'), adults = S.dishes.filter(d => d.for !== 'kid');
  const list = arr => arr.slice().sort((a, b) => b.likes.length - a.likes.length).map(d => { const m = mem(d.by); const on = d.likes.includes(S.me);
    return `<div class="exp"><div class="ic">${d.for === 'kid' ? '🧸' : '🍽️'}</div><div class="grow"><b>${esc(d.name)}</b><div class="tiny">${d.note ? esc(d.note) + ' · ' : ''}${m.avatar} ${esc(m.name)}</div></div>
      <button class="btn sm ${on ? 'coral' : 'ghost'}" data-a="like-dish" data-id="${d.id}">${on ? '😋' : '🤍'} ${d.likes.length}</button></div>`; }).join('');
  return head + `<div class="card" style="margin-top:14px;background:linear-gradient(135deg,var(--mango),var(--coral));color:#fff;border:0">
    <div class="label">Menú para el chef de la villa</div><h2 style="font-size:26px;margin:4px 0">👨‍🍳 ${S.dishes.length} platos favoritos</h2>
    <div style="opacity:.92;font-size:13px">${adults.length} de adultos · ${kids.length} de peques</div>
    <div class="row" style="margin-top:12px;gap:8px"><button class="btn sm" style="background:#fff;color:#C2185B" data-a="add-dish">＋ Añadir plato</button>
    <button class="btn sm" style="background:rgba(255,255,255,.22);color:#fff" data-a="copy-menu">📋 Copiar menú</button></div></div>
    <div class="sec-title"><h2>😎 Adultos</h2></div><div class="card">${list(adults) || '<div class="muted">Sin platos todavía.</div>'}</div>
    <div class="sec-title"><h2>🧸 Peques</h2></div><div class="card">${list(kids) || '<div class="muted">¿Qué comen sí o sí los peques? Apúntalo aquí.</div>'}</div>
    <p class="tiny" style="margin-top:8px">"Copiar menú" genera un mensaje en español listo para el chef y la lista del súper (~500 $).</p>`;
}

// ---------- WALLET ----------
function wallet() {
  const t = sub.wallet || 'split';
  const spent = S.expenses.reduce((a, e) => a + toEur(e.amount, e.cur), 0);
  const head = `<div class="page-head"><h1>Wallet</h1><p>Presupuesto, pagos del viaje y gastos compartidos.</p></div>
  <div class="money-hero" style="margin-top:12px"><span class="deco">💸</span>
    <div class="label">Presupuesto del grupo</div><div class="amount">${eur(window.BUDGET.total)}</div>
    <div style="font-size:13px;opacity:.95">~${eur(window.BUDGET.perPerson)} por persona · gastado en destino: <b>${eur(spent)}</b></div></div>
  <div class="seg" style="margin-top:14px">${[['split', '🧾 Gastos'], ['pay', '✅ Pagos'], ['budget', '📊 Presupuesto']].map(x => `<button class="${t === x[0] ? 'on' : ''}" data-a="sub" data-k="wallet" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;

  if (t === 'budget') {
    const L = window.BUDGET.lines, cols = ['#00B4C5', '#FF6B5B', '#FFB627', '#1DB980', '#FF8FB1', '#7B2FF7', '#0B3A53', '#7FDBFF'];
    let acc = 0; const C = 2 * Math.PI * 42;
    const arcs = L.map((l, i) => { const f = l.eur / window.BUDGET.total; const s = `<circle r="42" cx="60" cy="60" fill="none" stroke="${cols[i]}" stroke-width="18" stroke-dasharray="${f * C} ${C}" stroke-dashoffset="${-acc * C}" transform="rotate(-90 60 60)"/>`; acc += f; return s; }).join('');
    return head + `<div class="card donut" style="margin-top:14px"><svg viewBox="0 0 120 120" width="130" height="130">${arcs}<text x="60" y="58" text-anchor="middle" font-size="11" font-weight="800" fill="currentColor">28.340 €</text><text x="60" y="72" text-anchor="middle" font-size="8" fill="currentColor" opacity=".6">plan del PDF</text></svg>
      <div class="legend">${L.map((l, i) => `<div><i style="background:${cols[i]}"></i>${l.emoji} ${esc(l.cat)}<b>${num(l.eur)}</b></div>`).join('')}</div></div>
      <div class="sec-title"><h2>Por familia</h2></div>
      <div class="card">${fams().map(f => `<div class="rank"><span style="font-size:22px">${f.emoji}</span><span class="grow"><b>${esc(f.name)}</b><div class="tiny">${members().filter(m => m.fam === f.id).length} personas</div></span><b>~${eur(window.BUDGET.families[f.id])}</b></div>`).join('')}
      <p class="tiny">Vuelos por persona (720 €), Hard Rock por habitación, Montreal por familia (200 $). Villa, transfer, súper, chef y quads se reparten por cabeza (477 $/pers.). Tipo supuesto 1 € ≈ ${S.fx.USD} $.</p></div>
      <div class="card"><b>🔎 Por confirmar</b><p class="muted" style="margin:6px 0 0">Qué villa elegimos y si el chef está incluido. Rango del total: 30.650 $ – 34.970 $.</p></div>`;
  }
  if (t === 'pay') return head + `<div style="margin-top:14px">${window.MILESTONES.map((p, pi) => { const n = fams().filter(f => S.paid[p.id]?.[f.id]).length; return `<div class="card">
    <div class="row"><div class="kind" style="background:#FFE7A8">${p.emoji}</div><div class="grow"><b>${pi + 1}. ${esc(p.title)}</b><div class="tiny">${esc(p.detail)}</div></div><b>${esc(p.amount)}</b></div>
    <div class="bar" style="margin:12px 0 6px"><i style="width:${n * 25}%"></i></div>
    ${fams().map(f => { const ok = S.paid[p.id]?.[f.id]; return `<button class="settle" style="width:100%" data-a="paid" data-p="${pi}" data-f="${f.id}"><span>${f.emoji}</span><span class="grow" style="text-align:left">${esc(f.name)} · ${eur(p.share[f.id])}</span><span class="tick ${ok ? 'on' : ''}">${ok ? '✓' : ''}</span></button>`; }).join('')}
  </div>`; }).join('')}<p class="tiny">* Precios orientativos: hasta que se pague todo, pueden variar.</p></div>`;

  const bal = balances(); const tr = settleUp(bal);
  return head + `<div class="row" style="margin-top:14px;gap:8px"><button class="btn sea grow" data-a="add-exp">＋ Añadir gasto</button><button class="btn ghost" data-a="add-exp" data-photo="1" aria-label="Foto del ticket">📷</button></div>
    <div class="sec-title"><h2>Cuentas claras</h2><button data-a="toggle-fam">${S.settleByFam ? 'Por familias' : 'Por persona'} ⇄</button></div>
    <div class="card">${tr.length ? tr.map(x => `<div class="settle"><span>${who(x.from)}</span><span class="arrow">→</span><span class="grow">${who(x.to)}</span><b>${eur(Math.round(x.amt))}</b></div>`).join('') : '<div class="muted">Todo cuadrado 🎉 Nadie debe nada.</div>'}</div>
    <div class="sec-title"><h2>Gastos</h2><span class="tiny">${S.expenses.length}</span></div>
    <div class="card">${S.expenses.slice().reverse().map(e => `<div class="exp"><div class="ic">${(CATS.find(c => c[0] === e.cat) || CATS[6])[1]}</div>
      <div class="grow"><b class="ellipsis" style="display:block">${esc(e.title)}</b><div class="tiny">${mem(e.payer).avatar} ${esc(mem(e.payer).name)} · entre ${e.split.length}${e.photo ? ' · 📎 ticket' : ''}</div></div>
      <div><div class="amt">${num(e.amount)} ${CUR[e.cur]}</div>${e.cur !== 'EUR' ? `<div class="tiny" style="text-align:right">${eur(Math.round(toEur(e.amount, e.cur)))}</div>` : ''}</div>
      <button class="tiny" data-a="del-exp" data-id="${e.id}" aria-label="Borrar gasto">✕</button></div>`).join('') || '<div class="muted">Aún no hay gastos. En el Hard Rock casi no habrá 😎; en Las Terrenas: súper, luz, propinas, quads…</div>'}</div>`;
}

// ---------- GAMES ----------
function games() {
  const t = sub.games || 'missions';
  const my = points(S.me);
  const rk = members().map(m => ({ m, p: points(m.id) })).sort((a, b) => b.p - a.p);
  const head = `<div class="page-head"><h1>Juegos</h1><p>Retos, bingo, misiones secretas y ranking.</p></div>
  <div class="score-hero" style="margin-top:12px"><div class="label">Tus puntos</div><div class="pts">${my}</div>
    <div style="font-size:13px;opacity:.95">Puesto #${rk.findIndex(r => r.m.id === S.me) + 1} de ${rk.length} · ${esc(fam(me().fam)?.name || '')}: ${famPoints(me().fam)} pts</div></div>
  <div class="seg" style="margin-top:14px">${[['missions', '🤫 Misiones'], ['bingo', '🎰 Bingo'], ['wheel', '🎡 Ruleta'], ['rank', '🏆 Ranking']].map(x => `<button class="${t === x[0] ? 'on' : ''}" data-a="sub" data-k="games" data-v="${x[0]}">${x[1]}</button>`).join('')}</div>`;

  if (t === 'bingo') {
    const cells = S.bingo[S.me] || [];
    return head + `<div class="card" style="margin-top:14px"><div class="row"><b class="grow">🎰 Bingo dominicano</b><span class="chip">${bingoLines(cells)} líneas</span></div>
      <p class="tiny" style="margin:4px 0 10px">Marca lo que veas durante el viaje. Línea = 50 pts · cartón lleno = 200 pts.</p>
      <div class="bingo">${window.BINGO.map((b, i) => i === 12 ? '<button class="free" disabled>🌴</button>' : `<button class="${cells.includes(i) ? 'on' : ''}" data-a="bingo" data-i="${i}">${esc(b)}</button>`).join('')}</div></div>`;
  }
  if (t === 'wheel') {
    const W = window.WHEEL, cols = ['#00B4C5', '#FF6B5B', '#FFB627', '#1DB980', '#FF8FB1', '#7B2FF7', '#0B3A53', '#26C6DA'];
    const seg = 360 / W.length;
    const slices = W.map((w, i) => { const a0 = (i * seg - 90) * Math.PI / 180, a1 = ((i + 1) * seg - 90) * Math.PI / 180; const x0 = 100 + 98 * Math.cos(a0), y0 = 100 + 98 * Math.sin(a0), x1 = 100 + 98 * Math.cos(a1), y1 = 100 + 98 * Math.sin(a1);
      const mid = i * seg + seg / 2; return `<path d="M100 100 L${x0} ${y0} A98 98 0 0 1 ${x1} ${y1}Z" fill="${cols[i % 8]}" stroke="#fff" stroke-width="2"/><text transform="rotate(${mid} 100 100) translate(100 30)" text-anchor="middle" font-size="16">${w.split(' ')[0]}</text>`; }).join('');
    return head + `<div class="card" style="margin-top:14px;text-align:center"><b>🎡 Ruleta del club</b><p class="tiny">¿Quién paga los helados? ¿Quién elige la música? Que decida la isla.</p>
      <div class="wheel-wrap" style="margin-top:14px"><div class="needle">🔻</div><svg id="wheel" viewBox="0 0 200 200">${slices}<circle cx="100" cy="100" r="16" fill="#fff"/><text x="100" y="106" text-anchor="middle" font-size="16">🥥</text></svg></div>
      <div id="wheel-res" style="font:800 20px var(--font-display);min-height:28px;margin-top:12px"></div>
      <button class="btn coral block" style="margin-top:8px" data-a="spin">¡Girar!</button></div>`;
  }
  if (t === 'rank') {
    const fr = fams().map(f => ({ f, p: famPoints(f.id) })).sort((a, b) => b.p - a.p);
    const kids = rk.filter(r => r.m.kind !== 'adult').slice(0, 5);
    const b = badgesOf(S.me);
    return head + `<div class="card" style="margin-top:14px"><b>Familias</b><div class="podium">${[1, 0, 2].map(i => fr[i] ? `<div><div class="av">${fr[i].f.emoji}</div><div class="tiny">${esc(fr[i].f.name)}</div><div class="step" style="height:${[90, 66, 50][i]}px;background:${fr[i].f.color}">${fr[i].p}</div></div>` : '').join('')}</div></div>
      <div class="sec-title"><h2>Individual</h2></div><div class="card">${rk.map((r, i) => `<div class="rank"><span class="pos-n">${i + 1}</span><span style="font-size:20px">${r.m.avatar}</span><span class="grow">${esc(r.m.name)}${r.m.id === S.me ? ' (tú)' : ''}</span><b>${r.p}</b></div>`).join('')}</div>
      <div class="sec-title"><h2>Liga de peques 🧸</h2></div><div class="card">${kids.map((r, i) => `<div class="rank"><span class="pos-n">${['🥇', '🥈', '🥉', '4', '5'][i]}</span><span style="font-size:20px">${r.m.avatar}</span><span class="grow">${esc(r.m.name)}</span><b>${r.p}</b></div>`).join('')}</div>
      <div class="sec-title"><h2>Tus insignias</h2></div><div class="grid2" style="grid-template-columns:repeat(3,1fr)">${window.BADGES.map(x => `<div class="badge ${b[x.id] ? 'won' : ''}"><span class="e">${x.emoji}</span><b>${esc(x.name)}</b><div>${esc(x.rule)}</div></div>`).join('')}</div>`;
  }
  const done = S.missionDone[S.me];
  return head + `<div class="mission ${sub.reveal ? 'open' : ''}" style="margin-top:14px"><div class="label">Misión secreta · solo para ti</div>
    <div class="secret">${esc(myMission(S.me))}</div>
    ${done ? '<span class="chip" style="background:#1DB980;color:#fff">✅ Cumplida · +100</span>' : `<div class="row" style="justify-content:center;gap:8px"><button class="btn sm" style="background:#fff;color:#0B2A3C" data-a="reveal">${sub.reveal ? '🙈 Ocultar' : '👀 Revelar'}</button>
    <button class="btn sm coral" data-a="mission-done">¡Cumplida!</button></div>`}
    <p class="tiny" style="color:#fff;opacity:.7;margin-top:10px">Que nadie la vea. Al final del viaje se revelan todas en la cena de despedida.</p></div>
    <div class="sec-title"><h2>Retos del club</h2></div>
    <div class="card">${window.CHALLENGES.map((c, i) => { const w = S.challenges[c.id]; return `<div class="exp"><div class="ic">${c.emoji}</div><div class="grow"><b>${esc(c.title)}</b><div class="tiny">${w ? `Ganador: ${mem(w).avatar} ${esc(mem(w).name)}` : 'Sin ganador todavía'}</div></div>
      <button class="btn sm ${w ? 'ghost' : 'sea'}" data-a="challenge" data-i="${i}">${w ? 'Cambiar' : '+' + c.pts}</button></div>`; }).join('')}</div>`;
}

// ---------- MEMORIES ----------
function memories() {
  const df = sub.mday || 'all';
  const list = S.photos.filter(p => df === 'all' || p.day === df);
  const best = S.photos.slice().sort((a, b) => b.likes.length - a.likes.length)[0];
  return `<div class="page-head"><h1>Recuerdos</h1><p>Álbum compartido por días, con etiquetas y concurso de fotos.</p></div>
  <button class="film" style="width:100%;text-align:left;margin-top:12px" data-a="film" ${S.photos.length ? '' : 'disabled'}>
    <div class="play">▶</div><div class="grow"><div class="label">Película del viaje</div><b style="font-size:18px">${S.photos.length ? `${S.photos.length} fotos · ${new Set(S.photos.map(p => p.day)).size} días` : 'Sube fotos para generarla'}</b>
    <div style="font-size:12px;opacity:.8">Resumen automático con música de vuestra playlist</div></div></button>
  <div class="daystrip" style="margin-top:14px"><button class="${df === 'all' ? 'on' : ''}" data-a="sub" data-k="mday" data-v="all"><small>todo</small><b>📚</b></button>
    <button class="${df === 'pre' ? 'on' : ''}" data-a="sub" data-k="mday" data-v="pre"><small>antes</small><b>🧳</b></button>
    ${window.DAYS.map(d => { const x = parseDay(d.date); return `<button class="${df === d.date ? 'on' : ''}" data-a="sub" data-k="mday" data-v="${d.date}"><small>${DOW[x.getDay()]}</small><b>${x.getDate()}</b></button>`; }).join('')}</div>
  <div class="photos" style="margin-top:10px"><label class="ph add" aria-label="Subir fotos">＋<input type="file" accept="image/*" multiple hidden id="up"></label>
    ${list.map(p => `<button class="ph" data-a="photo" data-id="${p.id}" data-ph="${p.id}"><span class="likes">❤️ ${p.likes.length}</span></button>`).join('')}</div>
  ${best && best.likes.length ? `<div class="sec-title"><h2>🏆 Concurso de fotos</h2></div><div class="card row"><div class="ph" data-ph="${best.id}" style="width:72px;height:72px;border-radius:16px;background:var(--bg-2) center/cover"></div>
    <div class="grow"><b>Va ganando ${esc(mem(best.by).name)}</b><div class="tiny">${best.likes.length} votos · se cierra en la cena de despedida</div></div></div>` : ''}`;
}
after.memories = () => {
  document.querySelectorAll('[data-ph]').forEach(async el => { const src = await loadPhoto(el.dataset.ph); if (src) el.style.backgroundImage = `url(${src})`; });
  $('#up')?.addEventListener('change', async e => {
    const files = [...e.target.files]; if (!files.length) return;
    const day = (sub.mday && sub.mday !== 'all') ? sub.mday : (tripDayIdx() >= 0 ? window.DAYS[tripDayIdx()].date : 'pre');
    for (const f of files) {
      const id = uid(); await idb.put(id, await shrink(f, 1280));
      S.photos.push({ id, by: S.me, day, tags: [], likes: [], ts: Date.now() });
      award(S.me, 10, 'foto subida', 'photo-' + id);
    }
    save(); render(); confetti(12);
  });
};
function shrink(file, max) {
  return new Promise((res, rej) => {
    const img = new Image(); const url = URL.createObjectURL(file);
    img.onload = () => { const k = Math.min(1, max / Math.max(img.width, img.height)); const c = document.createElement('canvas'); c.width = img.width * k; c.height = img.height * k; c.getContext('2d').drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(url); res(c.toDataURL('image/jpeg', .82)); };
    img.onerror = rej; img.src = url;
  });
}
async function playFilm() {
  const order = S.photos.slice().sort((a, b) => (a.day > b.day ? 1 : a.day < b.day ? -1 : a.ts - b.ts));
  const slides = [{ title: true }]; let last;
  for (const p of order) { if (p.day !== last) { slides.push({ day: p.day }); last = p.day; } slides.push({ p }); }
  const el = document.createElement('div'); el.className = 'story'; document.body.append(el);
  let i = 0, timer;
  const stop = () => { clearTimeout(timer); el.remove(); };
  el.addEventListener('click', e => { if (e.clientX < innerWidth / 3) i = Math.max(0, i - 2); show(); });
  const bars = () => `<div class="bars">${slides.map((_, k) => `<i class="${k < i ? 'done' : k === i ? 'now' : ''}"><b></b></i>`).join('')}</div><button style="position:absolute;top:calc(22px + env(safe-area-inset-top));right:14px;z-index:3;color:#fff;font-size:24px" id="xfilm">✕</button>`;
  async function show() {
    clearTimeout(timer); if (i >= slides.length) return stop();
    const s = slides[i];
    if (s.title) el.innerHTML = bars() + `${scene(800)}<div class="title-card"><div class="label">Anguera en RD · 2027</div><h1>RD TRIP CLUB</h1><p>${esc(T.tagline)}</p></div>`;
    else if (s.day) { const d = window.DAYS.find(x => x.date === s.day); el.innerHTML = bars() + `<div class="title-card" style="background:none"><div class="label">${s.day === 'pre' ? 'Antes del viaje' : 'Día ' + (window.DAYS.indexOf(d) + 1)}</div><h1>${d ? d.emoji + ' ' + esc(d.title) : '🧳 Preparativos'}</h1></div>`; }
    else { const src = await loadPhoto(s.p.id); el.innerHTML = bars() + `<img src="${src}" alt=""><div class="cap"><div class="tiny" style="color:#fff">${mem(s.p.by).avatar} ${esc(mem(s.p.by).name)}${s.p.tags.length ? ' · con ' + s.p.tags.map(t => esc(mem(t).name)).join(', ') : ''}</div></div>`; }
    $('#xfilm', el).onclick = e => { e.stopPropagation(); stop(); };
    i++; timer = setTimeout(show, 4200);
  }
  show();
}

// ---------- AI CONCIERGE (Coco) ----------
const SUGGEST = ['¿Qué hacemos mañana?', '¿Dónde cenamos todos?', '¿Cuánto hemos gastado?', '¿Quién no ha pagado?', '¿Qué hacemos si llueve?', '¿Qué excursión recomiendas?', '¿Qué documentos faltan?', 'Pon música'];
function ai() {
  const chat = S.chat.length ? S.chat : [{ role: 'bot', html: `¡Hola ${esc(me().name)}! Soy <b>Coco</b> 🥥, el concierge del club. Conozco el itinerario, los gastos, las votaciones y los gustos del grupo. Pregúntame lo que quieras.` }];
  return `<div class="page-head" style="text-align:center"><div class="coco">🥥</div><h1 style="font-size:28px">Coco · AI Concierge</h1><p>Sabe todo del viaje. Para preguntas abiertas, te paso a Claude con el contexto.</p></div>
  <div class="suggest">${SUGGEST.map((s, i) => `<button data-a="ask" data-i="${i}">${s}</button>`).join('')}</div>
  <div class="chat" id="chat">${chat.map(m => `<div class="msg ${m.role}">${m.role === 'me' ? esc(m.text) : m.html}</div>`).join('')}</div>
  <form class="composer" id="ask"><input id="q" data-draft="q" value="${esc(S.drafts.q || '')}" placeholder="Pregúntale a Coco…" autocomplete="off"><button class="btn sea sm" type="submit">Enviar</button></form>
  <div class="row" style="margin-top:10px;gap:8px"><button class="btn ghost sm grow" data-a="claude">✨ Preguntar a Claude con el contexto</button><button class="btn ghost sm" data-a="clear-chat">Borrar</button></div>`;
}
after.ai = () => {
  $('#ask').addEventListener('submit', e => { e.preventDefault(); const q = $('#q').value.trim(); if (q) ask(q); });
  window.scrollTo(0, document.body.scrollHeight);
};
function ask(q) {
  S.chat.push({ role: 'me', text: q }); S.drafts.q = ''; save(); render();
  const c = $('#chat'); c.insertAdjacentHTML('beforeend', '<div class="msg bot typing"><span></span><span></span><span></span></div>');
  window.scrollTo(0, document.body.scrollHeight);
  setTimeout(() => { S.chat.push({ role: 'bot', html: answer(q) }); S.chat = S.chat.slice(-40); save(); render(); }, 650);
}
function answer(raw) {
  const q = raw.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const has = (...w) => w.some(x => q.includes(x));
  const dayHtml = d => `<div class="mini"><b>${d.emoji} ${fmtDay(d.date)} · ${esc(d.title)}</b><ul>${d.items.map(it => `<li>${esc(it.time)} · ${esc(it.title)}${it.optional ? ` <span class="tiny">(${(S.signups[it.id] || []).length} apuntados)</span>` : ''}</li>`).join('')}</ul></div>`;

  if (has('manana', 'hoy', 'plan', 'agenda', 'que hacemos') && !has('llueve', 'lluvia')) {
    const di = tripDayIdx();
    if (di < 0) return `Aún quedan <b>${Math.ceil((tripStart - now()) / 864e5)} días</b> para salir. El día 1 es así:${dayHtml(window.DAYS[0])}Y mientras tanto, lo urgente: <b>${esc(window.MILESTONES[0].title)}</b> (los vuelos son lo que más puede subir).`;
    const wantsTomorrow = has('manana');
    const d = window.DAYS[Math.min(di + (wantsTomorrow ? 1 : 0), window.DAYS.length - 1)];
    return `${wantsTomorrow ? 'Mañana' : 'Hoy'} toca:${dayHtml(d)}`;
  }
  if (has('llueve', 'lluvia', 'tormenta', 'huracan')) {
    const z = tripDayIdx() >= 0 ? window.DAYS[tripDayIdx()].zone : 'ltr';
    return `En agosto suelen ser chubascos cortos: casi siempre en 1 h vuelve el sol ☀️. Plan B ${z === 'puj' ? 'en el Hard Rock' : 'en Las Terrenas'}:<ul>
      ${z === 'puj' ? '<li>Kids club + spa para los mayores</li><li>Torneo de dominó y Bingo del club</li><li>Clase de cócteles o cata de ron (adultos)</li><li>Cine o bolera del resort si está abierto</li>'
      : '<li>Clase de cocina dominicana con el chef (sancocho, tostones)</li><li>Torneo de dominó + Ruleta del club</li><li>Cuevas de Los Haitises (cubiertas y espectaculares)</li><li>Pelis y palomitas en la villa con los peques</li>'}</ul>Y si es temporada de huracanes de verdad: seguid avisos oficiales y el seguro de viaje.`;
  }
  if (has('gastado', 'gasto', 'cuanto llevamos', 'dinero')) {
    const tot = S.expenses.reduce((a, e) => a + toEur(e.amount, e.cur), 0);
    const by = {}; S.expenses.forEach(e => (by[e.cat] = (by[e.cat] || 0) + toEur(e.amount, e.cur)));
    return `En destino lleváis <b>${eur(Math.round(tot))}</b> en ${S.expenses.length} gastos${Object.keys(by).length ? ':<ul>' + Object.entries(by).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<li>${esc(k)}: ${eur(Math.round(v))}</li>`).join('') + '</ul>' : '.'} El presupuesto total del viaje es <b>${eur(window.BUDGET.total)}</b> (~${eur(window.BUDGET.perPerson)}/persona).`;
  }
  if (has('pagado', 'debe', 'deuda', 'pagar', 'quien no')) {
    const pend = window.MILESTONES.map(p => ({ p, f: fams().filter(f => !S.paid[p.id]?.[f.id]) })).filter(x => x.f.length);
    const tr = settleUp(balances());
    return `${pend.length ? '<b>Pagos del viaje pendientes:</b><ul>' + pend.map(x => `<li>${esc(x.p.title)}: ${x.f.map(f => f.emoji + ' ' + esc(f.name)).join(', ')}</li>`).join('') + '</ul>' : '✅ Todas las familias han pagado los 3 pagos grandes.'}
      ${tr.length ? '<b>Gastos compartidos:</b><ul>' + tr.map(x => `<li>${esc(who(x.from))} → ${esc(who(x.to))}: ${eur(Math.round(x.amt))}</li>`).join('') + '</ul>' : 'Gastos compartidos: todo cuadrado.'}`;
  }
  if (has('cena', 'cenar', 'cenamos', 'comer', 'restaurante', 'comida', 'menu')) {
    const fav = S.dishes.slice().sort((a, b) => b.likes.length - a.likes.length).slice(0, 4);
    return `Para ${groupLine()} lo más cómodo:<ul><li><b>En la villa:</b> el chef cocina para todos. ${fav.length ? 'Platos favoritos del grupo: ' + fav.map(d => esc(d.name)).join(', ') + '.' : 'Apuntad vuestros platos en Gustos y le paso el menú.'}</li>
      <li><b>Las Terrenas, mesa grande con peques:</b> ${window.LOCALS.filter(l => l.zone === 'ltr' && l.big).map(l => esc(l.name)).join(', ')}. Pescado con coco: Plaza Delfín.</li>
      <li><b>Fuera del resort:</b> Captain Cook (El Cortecito) o los paradores de Playa Macao (efectivo).</li><li><b>Hard Rock:</b> reservad los à la carte nada más llegar; para un grupo así conviene turno temprano (19:00).</li></ul>`;
  }
  if (has('excursion', 'recomienda', 'recomiendas', 'que ver', 'actividad')) {
    const ranked = window.PLACES.filter(p => p.cat === 'excursion').map(p => ({ p, w: (S.wish[p.id] || []).length })).sort((a, b) => b.w - a.w).slice(0, 4);
    return `Mi top para este grupo (ordenado por lo que más os apetece en Explora):<ul>${ranked.map(r => `<li><b>${r.p.emoji} ${esc(r.p.name)}</b> — ${esc(r.p.desc)}${r.w ? ` (${r.w} ❤️)` : ''}</li>`).join('')}</ul>Con peques pequeños: Cayo Levantado o Salto El Limón a caballo. Para los adultos: catamarán.`;
  }
  if (has('vuelo', 'avion', 'escala', 'montreal', 'pasaje', 'billete')) return `✈️ <b>Comprados y confirmados</b> con Air Transat:<ul>${window.FLIGHTS.map(f => `<li><b>${f.no}</b> ${f.from}→${f.to} · ${esc(f.date)} · ${f.dep}–${f.arr}</li>`).join('')}</ul>Ida: noche en Montreal (16 h de conexión). Vuelta: 4 h 10 min de escala en YUL. Ojo: <b>eTA de Canadá</b> para todos.`;
  if (has('propina', 'moneda', 'pesos', 'dolar', 'cajero', 'tip', 'consejo', 'agua', 'seguridad', 'regate')) {
    const hit = window.TIPS.filter(t => q.includes(t[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 5)));
    return `💡 Tips de locales:<ul>${(hit.length ? hit : window.TIPS.slice(0, 5)).map(t => `<li>${t[0]} <b>${esc(t[1])}:</b> ${esc(t[2])}</li>`).join('')}</ul>Todos en Explora → Tips de locales.`;
  }
  if (has('documento', 'pasaporte', 'eta', 'papeles', 'faltan')) {
    const miss = members().filter(m => m.kind !== 'kid').map(m => ({ m, n: window.DOCS_CHECKLIST.filter(d => !S.docs[m.id]?.[d.id]).length })).filter(x => x.n);
    return miss.length ? `Les faltan documentos por marcar a:<ul>${miss.map(x => `<li>${x.m.avatar} ${esc(x.m.name)}: ${x.n}</li>`).join('')}</ul>Lo crítico: pasaporte, eTA de Canadá y E-Ticket dominicano.` : '✅ Todos los adultos tienen la checklist completa.';
  }
  if (has('musica', 'cancion', 'playlist', 'pon')) {
    const top = S.songs.slice().sort((a, b) => b.likes.length - a.likes.length).slice(0, 6);
    return top.length ? `🎶 Top del club:<ul>${top.map(s => `<li>${esc(s.title)} — ${esc(s.artist)}</li>`).join('')}</ul>Abre Gustos → Canciones para darle al play.` : 'Aún no hay canciones. Sube las tuyas en <b>Gustos → Canciones</b> y armo la playlist 🎧';
  }
  if (has('villa', 'casa')) return `🏡 La favorita es <b>Casa del Río</b> (3.000 €, chef y personal incluidos, frente al mar). Votación actual: ${window.POLLS[0].options.map((o, i) => `${esc(o.split(' ·')[0])}: ${Object.values(S.votes.p1 || {}).filter(v => v === i).length}`).join(' · ')}.`;
  if (has('presupuesto', 'familia', 'cuanto cuesta', 'precio')) return `Presupuesto: <b>${eur(window.BUDGET.total)}</b> el grupo.<ul>${fams().map(f => `<li>${f.emoji} ${esc(f.name)}: ~${eur(window.BUDGET.families[f.id])}</li>`).join('')}</ul>`;
  return `Eso mejor lo piensa Claude con calma 🤓. Pulsa <b>✨ Preguntar a Claude</b>: copio tu pregunta con todo el contexto del viaje y abro claude.ai.<br><span class="tiny">Yo controlo: plan de hoy/mañana, gastos, pagos, lluvia, cenas, excursiones, vuelos, documentos, villa, presupuesto y música.</span>`;
}
function tripContext(q) {
  const tot = S.expenses.reduce((a, e) => a + toEur(e.amount, e.cur), 0);
  return `Eres el concierge de un viaje de grupo a República Dominicana. Responde en español, corto y práctico.
VIAJE: 13–25 ago 2027. ${fams().length} familias, ${groupLine()}. Ruta: Barcelona → Montreal (1 noche) → Punta Cana → Las Terrenas, villa 14–18 ago (chef en casa) → Hard Rock Punta Cana todo incluido 18–25 ago.
ITINERARIO: ${window.DAYS.map(d => `${d.date} ${d.title}: ${d.items.map(i => i.title).join(', ')}`).join(' | ')}
PRESUPUESTO: ${window.BUDGET.total} € (~${window.BUDGET.perPerson} €/pers). Gastado en destino: ${Math.round(tot)} €.
VOTACIONES: ${window.POLLS.map(p => `${p.q} → ${p.options.map((o, i) => `${o}: ${Object.values(S.votes[p.id] || {}).filter(v => v === i).length}`).join(', ')}`).join(' | ')}
PLATOS FAVORITOS: ${S.dishes.map(d => `${d.name} (${d.for === 'kid' ? 'peques' : 'adultos'})`).join(', ') || '—'}
CANCIONES: ${S.songs.map(s => `${s.title} – ${s.artist}`).join(', ') || '—'}

PREGUNTA: ${q}`;
}

// ---------- Sheets ----------
function expenseSheet(photo) {
  const ms = members();
  sheet(`<h2>Nuevo gasto</h2>
    <label class="field"><span>Concepto</span><input class="input" id="e-t" placeholder="Súper, luz de la villa, propinas…"></label>
    <div class="row" style="gap:8px"><label class="field grow"><span>Importe</span><input class="input" id="e-a" type="number" inputmode="decimal" step="0.01"></label>
    <label class="field" style="width:110px"><span>Moneda</span><select class="input" id="e-c"><option>EUR</option><option>USD</option><option>DOP</option></select></label></div>
    <label class="field"><span>Categoría</span><div class="pickers" id="e-cat">${CATS.map((c, i) => `<button type="button" class="${i === 0 ? 'on' : ''}" data-v="${c[0]}">${c[1]} ${c[0]}</button>`).join('')}</div></label>
    <label class="field"><span>Pagó</span><select class="input" id="e-p">${ms.map(m => `<option value="${m.id}" ${m.id === S.me ? 'selected' : ''}>${m.avatar} ${esc(m.name)}</option>`).join('')}</select></label>
    <label class="field"><span>Se reparte entre</span><div class="pickers" id="e-mode"><button type="button" class="on" data-v="all">Todos (${ms.length}, por cabeza)</button><button type="button" data-v="adults">Solo adultos</button><button type="button" data-v="mine">Mi familia</button><button type="button" data-v="custom">Elegir…</button></div></label>
    <div class="pickers hide" id="e-who" style="margin-bottom:12px">${ms.map(m => `<button type="button" data-v="${m.id}">${m.avatar} ${esc(m.name)}</button>`).join('')}</div>
    <label class="field"><span>Foto del ticket (opcional)</span><input class="input" style="padding-top:12px" type="file" accept="image/*" capture="environment" id="e-f"></label>
    <p class="tiny" style="margin-top:-4px">La lectura automática del importe con IA llega con el backend (fase 2). De momento la foto queda adjunta al gasto.</p>
    <button class="btn sea block" data-a="save-exp">Guardar gasto</button>`, sh => {
    sh.querySelectorAll('.pickers').forEach(p => p.addEventListener('click', e => {
      const b = e.target.closest('button'); if (!b) return;
      if (p.id === 'e-who') { b.classList.toggle('on'); return; }
      p.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on');
      if (p.id === 'e-mode') $('#e-who').classList.toggle('hide', b.dataset.v !== 'custom');
    }));
    if (photo) $('#e-f').click(); else $('#e-t').focus();
  });
}
async function saveExpense() {
  const amount = parseFloat($('#e-a').value);
  const title = $('#e-t').value.trim();
  if (!title || !(amount > 0)) return toast('Pon concepto e importe');
  const mode = $('#e-mode .on').dataset.v;
  const ms = members();
  const split = mode === 'all' ? ms.map(m => m.id) : mode === 'adults' ? ms.filter(m => m.kind === 'adult').map(m => m.id)
    : mode === 'mine' ? ms.filter(m => m.fam === me().fam).map(m => m.id) : [...document.querySelectorAll('#e-who .on')].map(b => b.dataset.v);
  if (!split.length) return toast('Elige al menos una persona');
  const e = { id: uid(), title, amount, cur: $('#e-c').value, cat: $('#e-cat .on').dataset.v, payer: $('#e-p').value, split, ts: Date.now() };
  const f = $('#e-f').files[0];
  if (f) { e.photo = 'tk-' + e.id; await idb.put(e.photo, await shrink(f, 1000)); }
  S.expenses.push(e); award(S.me, 5, 'gasto apuntado', 'exp-' + e.id); save(); closeSheet(); render();
}
function settingsSheet() {
  sheet(`<h2>${me().avatar} Tu perfil</h2>
    <label class="field"><span>Nombre</span><input class="input" id="s-n" value="${esc(me().name)}"></label>
    <label class="field"><span>Avatar</span><div class="pickers" id="s-av">${['😎', '🌺', '🏄', '🍹', '⚽', '🌞', '🥥', '🎸', '🐢', '🦀', '🐠', '🦜', '🐙', '🎧', '🦈', '🐳', '🦩', '🧉', '👑', '🤿'].map(a => `<button type="button" class="${a === me().avatar ? 'on' : ''}">${a}</button>`).join('')}</div></label>
    <label class="field"><span>PIN personal (opcional, 4 cifras)</span><input class="input" id="s-pin" inputmode="numeric" maxlength="4" value="${esc(S.pins[S.me] || '')}" placeholder="Para que nadie entre como tú en un móvil compartido"></label>
    <button class="btn sea block" data-a="save-profile">Guardar</button>
    <div class="sec-title"><h2>Ajustes</h2></div>
    <label class="field"><span>Tema</span><div class="pickers" id="s-th">${[['auto', '🌗 Auto'], ['light', '☀️ Día'], ['dark', '🌙 Noche']].map(x => `<button type="button" class="${S.theme === x[0] ? 'on' : ''}" data-v="${x[0]}">${x[1]}</button>`).join('')}</div></label>
    <label class="field"><span>Enlace del grupo de WhatsApp</span><input class="input" id="s-wa" value="${esc(S.whatsapp)}" placeholder="https://chat.whatsapp.com/…"></label>
    <label class="field"><span>Tipo de cambio (1 € =)</span><div class="row" style="gap:8px"><input class="input" id="s-usd" type="number" step="0.01" value="${S.fx.USD}"><span>$</span><input class="input" id="s-dop" type="number" step="1" value="${S.fx.DOP}"><span>RD$</span></div></label>
    <button class="btn ghost block" data-a="save-settings">Guardar ajustes</button>
    <div class="grid2"><button class="btn ghost" data-a="notif">🔔 Notificaciones</button><button class="btn ghost" data-a="music">${S.music ? '🔇 Silenciar música' : '🔊 Activar música'}</button></div>
    <button class="btn ghost block" style="margin-top:10px" data-a="credits">📷 Créditos de fotos</button>
    <div class="sec-title"><h2>Datos</h2></div>
    <div class="grid2"><button class="btn ghost" data-a="export">⬇️ Exportar</button><button class="btn ghost" data-a="import">⬆️ Importar</button></div>
    <p class="tiny">Hasta conectar el backend, los datos viven en este móvil. Exportar/Importar sirve para pasar el estado a otro dispositivo.</p>
    <div class="grid2" style="margin-top:10px"><button class="btn ghost" data-a="switch">🚪 Cerrar sesión</button><button class="btn ghost" data-a="reset" style="color:var(--coral)">Reiniciar demo</button></div>`, sh => {
    sh.querySelectorAll('#s-av,#s-th').forEach(p => p.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; p.querySelectorAll('button').forEach(x => x.classList.remove('on')); b.classList.add('on'); }));
  });
}
function namesSheet() {
  sheet(`<h2>✏️ Nombres</h2>${fams().map(f => `<label class="field"><span>${f.emoji} Nombre de la familia</span><input class="input" data-fam="${f.id}" value="${esc(f.name)}"></label>
    <div class="stack" style="margin-bottom:14px">${members().filter(m => m.fam === f.id).map(m => `<div class="row" style="gap:8px"><span style="font-size:22px">${m.avatar}</span><input class="input grow" data-mem="${m.id}" value="${esc(m.name)}" aria-label="Nombre">
      <button class="icon-btn" data-a="rm-member" data-id="${m.id}" aria-label="Quitar">✕</button></div>`).join('')}</div>`).join('')}
    <div class="card" style="margin-bottom:14px"><b>➕ Añadir persona</b>
      <input class="input" id="n-name" placeholder="Nombre" style="margin-top:8px">
      <div class="row" style="gap:8px;margin-top:8px"><select class="input" id="n-fam">${fams().map(f => `<option value="${f.id}">${f.emoji} ${esc(f.name)}</option>`).join('')}</select>
      <select class="input" id="n-kind"><option value="adult">Adulto</option><option value="teen">Teen</option><option value="kid">Peque</option></select></div>
      <button class="btn ghost block" style="margin-top:8px" data-a="add-member">Añadir al grupo</button></div>
    <button class="btn sea block" data-a="save-names">Guardar</button>`);
}
function addSheet(kind) {
  const food = kind === 'dish';
  sheet(`<h2>${food ? '🍽️ Plato favorito' : '🎶 Subir canción'}</h2>
    <label class="field"><span>${food ? 'Plato' : 'Canción'}</span><input class="input" id="t-a" placeholder="${food ? 'Pescado con coco, macarrones, tostones…' : 'Título'}"></label>
    <label class="field"><span>${food ? 'Nota (alergias, "sin picante"…)' : 'Artista'}</span><input class="input" id="t-b"></label>
    ${food ? '' : '<label class="field"><span>Enlace de Spotify/YouTube (opcional)</span><input class="input" id="t-u" type="url" placeholder="https://open.spotify.com/track/…"></label>'}
    <label class="field"><span>Para</span><div class="pickers" id="t-for"><button type="button" class="${me().kind === 'adult' ? 'on' : ''}" data-v="adult">😎 Adultos</button><button type="button" class="${me().kind !== 'adult' ? 'on' : ''}" data-v="kid">🧸 Peques</button></div></label>
    <label class="field"><span>¿De quién es?</span><select class="input" id="t-by">${members().map(m => `<option value="${m.id}" ${m.id === S.me ? 'selected' : ''}>${m.avatar} ${esc(m.name)}</option>`).join('')}</select></label>
    <p class="tiny" style="margin-top:-6px">Los adultos pueden subir lo de sus peques.</p>
    <button class="btn sea block" data-a="save-${kind}">Guardar</button>`, sh => {
    $('#t-for', sh).addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; sh.querySelectorAll('#t-for button').forEach(x => x.classList.remove('on')); b.classList.add('on'); });
    $('#t-by', sh).addEventListener('change', e => { const k = mem(e.target.value).kind === 'adult' ? 'adult' : 'kid'; sh.querySelectorAll('#t-for button').forEach(x => x.classList.toggle('on', x.dataset.v === k)); });
    $('#t-a', sh).focus();
  });
}
function photoSheet(id) {
  const p = S.photos.find(x => x.id === id); if (!p) return;
  const on = p.likes.includes(S.me);
  sheet(`<div class="ph" data-ph="${p.id}" style="width:100%;aspect-ratio:1;border-radius:20px;background:var(--bg-2) center/cover"></div>
    <div class="row" style="margin-top:12px"><div class="grow"><b>${mem(p.by).avatar} ${esc(mem(p.by).name)}</b><div class="tiny">${p.day === 'pre' ? 'Antes del viaje' : fmtDay(p.day)}</div></div>
    <button class="btn sm ${on ? 'coral' : 'ghost'}" data-a="like-photo" data-id="${p.id}">${on ? '❤️' : '🤍'} ${p.likes.length}</button></div>
    <div class="field" style="margin-top:12px"><span>Etiquetar</span><div class="pickers">${members().map(m => `<button type="button" class="${p.tags.includes(m.id) ? 'on' : ''}" data-a="tag" data-id="${p.id}" data-m="${m.id}">${m.avatar} ${esc(m.name)}</button>`).join('')}</div></div>
    ${p.by === S.me ? `<button class="btn ghost block" style="color:var(--coral)" data-a="del-photo" data-id="${p.id}">Quitar foto</button>` : ''}`,
  async sh => { const el = $('[data-ph]', sh); el.style.backgroundImage = `url(${await loadPhoto(p.id)})`; });
}

// ---------- Intro music: bachata instrumental original (Web Audio, sin archivos) ----------
const Music = (() => {
  let ctx, master, playing = false, stopT;
  const N = n => 440 * Math.pow(2, (n - 69) / 12); // MIDI → Hz
  const BPM = 128, B = 60 / BPM, E = B / 2;
  // i–iv–V7 en La menor, la progresión clásica de bachata
  const CH = { Am: [57, 60, 64], Dm: [62, 65, 69], E7: [64, 68, 71, 74], C: [60, 64, 67], G: [55, 59, 62] };
  const PROG = ['Am', 'Am', 'Dm', 'E7', 'Am', 'C', 'Dm', 'E7', 'Am', 'Am', 'Dm', 'E7', 'Am', 'G', 'E7', 'Am'];
  const MEL = {
    Am: [81, 76, 72, 76, 81, 83, 84, 83], Dm: [86, 81, 77, 81, 86, 84, 81, 77], E7: [80, 83, 86, 83, 88, 86, 83, 80],
    C: [79, 76, 72, 76, 79, 81, 79, 76], G: [79, 74, 71, 74, 79, 81, 83, 79],
  };
  function pluck(t, f, dur, vol, bright = 2600) {
    const o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o1.type = 'triangle'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f * 1.003;
    lp.type = 'lowpass'; lp.frequency.setValueAtTime(bright, t); lp.frequency.exponentialRampToValueAtTime(500, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    const g2 = ctx.createGain(); g2.gain.value = 0.35; o2.connect(g2).connect(lp); o1.connect(lp); lp.connect(g).connect(master);
    o1.start(t); o2.start(t); o1.stop(t + dur + .05); o2.stop(t + dur + .05);
  }
  function bass(t, f, dur) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine'; o.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(.5, t + .02); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master); o.start(t); o.stop(t + dur + .05);
  }
  function bongo(t, hi, acc) {
    const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    const f = hi ? 420 : 290; o.frequency.setValueAtTime(f * 1.5, t); o.frequency.exponentialRampToValueAtTime(f, t + .03);
    g.gain.setValueAtTime(acc ? .32 : .16, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .16);
    o.connect(g).connect(master); o.start(t); o.stop(t + .2);
  }
  let noiseBuf;
  function guira(t, acc) {
    if (!noiseBuf) { noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .1, ctx.sampleRate); const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    const s = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noiseBuf; f.type = 'highpass'; f.frequency.value = 6500;
    g.gain.setValueAtTime(acc ? .14 : .06, t); g.gain.exponentialRampToValueAtTime(0.0001, t + (acc ? .09 : .04));
    s.connect(f).connect(g).connect(master); s.start(t); s.stop(t + .1);
  }
  function schedule(t0) {
    PROG.forEach((c, bar) => {
      const t = t0 + bar * 4 * B, ch = CH[c];
      MEL[c].forEach((n, i) => pluck(t + i * E, N(n), .32, i % 2 ? .07 : .1));
      if (bar % 4 === 3) [0, 1, 2, 3].forEach(i => pluck(t + 3.5 * B + i * E / 2, N(MEL[c][7 - i] - 12), .18, .06, 3200)); // floreo de requinto
      [0, 2].forEach(b => ch.forEach((n, k) => pluck(t + (b + 1) * B + k * .012, N(n - 12), .22, .035, 1800))); // segunda guitarra
      bass(t, N(ch[0] - 24), B * 1.4); bass(t + 1.5 * B, N(ch[0] - 24), B * .6); bass(t + 2 * B, N(ch[2] - 24), B * 1.2); bass(t + 3.5 * B, N(ch[1] - 24), B * .5);
      for (let i = 0; i < 8; i++) { bongo(t + i * E, i % 2 === 0, i === 0 || i === 4); guira(t + i * E, i % 2 === 0); if (i % 2) guira(t + i * E + E / 2, false); }
    });
    return PROG.length * 4 * B;
  }
  function start() {
    if (playing || !S.music) return;
    try {
      if (navigator.audioSession) navigator.audioSession.type = 'playback'; // iPhone: suena aunque el móvil esté en silencio
      ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
      ctx.resume();
      const comp = ctx.createDynamicsCompressor(); master = ctx.createGain(); master.connect(comp).connect(ctx.destination);
      const t0 = ctx.currentTime + .1, len = schedule(t0);
      master.gain.setValueAtTime(0.0001, t0); master.gain.exponentialRampToValueAtTime(.55, t0 + 1.2);
      master.gain.setValueAtTime(.55, t0 + len - 3); master.gain.exponentialRampToValueAtTime(0.0001, t0 + len + .3);
      playing = true; clearTimeout(stopT); stopT = setTimeout(() => { playing = false; }, (len + .5) * 1000);
    } catch { /* sin audio */ }
  }
  function stop() {
    if (!playing || !master) return;
    const t = ctx.currentTime; master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.exponentialRampToValueAtTime(0.0001, t + .4);
    const m = master; setTimeout(() => m.disconnect(), 500); playing = false;
  }
  return { start, stop, get playing() { return playing; } };
})();
// Los navegadores solo dejan sonar audio tras un toque: arranca con el primer toque de cada apertura.
let introDone = false;
document.addEventListener('pointerdown', e => { if (!introDone && S.music && S.unlocked && !e.target.closest?.('[data-a=music]')) { introDone = true; Music.start(); } }, { capture: true });

// ---------- Notificaciones ----------
const canNotify = 'Notification' in window && 'serviceWorker' in navigator;
const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone;
const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);
function notifCard() {
  if (S.notifHidden) return '';
  if (canNotify && Notification.permission === 'granted') return '';
  const iosNeedsInstall = isIOS && !isStandalone();
  const denied = canNotify && Notification.permission === 'denied';
  return `<div class="card notif"><div class="row"><span style="font-size:30px">🔔</span><div class="grow"><b>Activa las notificaciones</b>
    <div class="tiny">${iosNeedsInstall ? 'En iPhone primero instala la app: Safari → Compartir → «Añadir a pantalla de inicio». Luego ábrela desde el icono y pulsa aquí.'
      : denied ? 'Las bloqueaste. Actívalas en los ajustes del móvil → Notificaciones → RD Trip Club.' : 'Avisos de pagos, actividades a las que te apuntas, documentos y cuenta atrás.'}</div></div></div>
    <div class="row" style="gap:8px;margin-top:10px">${!iosNeedsInstall && !denied ? '<button class="btn sm sea" data-a="notif">Activar</button>' : ''}<button class="btn sm ghost" data-a="notif-hide">Ahora no</button></div></div>`;
}
async function notify(key, title, body, url = './#home') {
  if (S.notified[key] || !canNotify || Notification.permission !== 'granted') return;
  S.notified[key] = Date.now(); save();
  const reg = await navigator.serviceWorker.ready.catch(() => null);
  const opts = { body, icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', tag: key, data: { url } };
  if (reg) reg.showNotification(title, opts); else new Notification(title, opts);
}
// Recordatorios que se calculan al abrir la app (los avisos con la app cerrada llegan con el backend, fase 2).
function checkReminders() {
  if (!S.me) return;
  const days = Math.ceil((tripStart - now()) / 864e5);
  if ([200, 100, 60, 30, 14, 7, 3, 1].includes(days)) notify('cd-' + days, `🌴 ¡Quedan ${days} días!`, days > 7 ? 'RD Trip Club cuenta los días contigo.' : 'Revisa la checklist y la maleta 🧳', './#trip');
  const myFam = me().fam;
  window.MILESTONES.forEach(p => { if (!S.paid[p.id]?.[myFam]) notify('pay-' + p.id + '-' + new Date().toISOString().slice(0, 7), `💸 Pago pendiente: ${p.title}`, `${fam(myFam)?.name}: ${eur(p.share[myFam])} · ${p.due}`, './#wallet'); });
  const docs = S.docs[S.me] || {};
  if (days <= 90 && !window.DOCS_CHECKLIST.every(d => docs[d.id])) notify('docs-' + Math.floor(days / 30), '🛂 Documentos pendientes', 'Pasaporte, eTA de Canadá y E-Ticket dominicano.', './#trip');
  const n = nextActivity();
  if (n && /^\d/.test(n.it.time)) {
    const t = new Date(`${n.day.date}T${n.it.time}:00`), mins = (t - now()) / 6e4;
    if (mins > 0 && mins < 180 && (!n.it.optional || (S.signups[n.it.id] || []).includes(S.me))) notify('act-' + n.it.id, `⏰ ${n.it.title}`, `Hoy a las ${n.it.time}`, './#trip');
  }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') checkReminders(); });

// ---------- Actions (delegated; handlers by id/index, never by text) ----------
const A = {
  go: d => { if (d.sub) sub[d.r] = d.sub; closeSheet(true); go(d.r); },
  sub: d => { sub[d.k] = d.v; if (d.k === 'games') sub.reveal = false; render(); },
  'close-sheet': () => closeSheet(),
  'pick-me': d => {
    if (S.pins[d.id] && prompt(`PIN de ${mem(d.id).name}`) !== S.pins[d.id]) return toast('PIN incorrecto 🔒');
    S.me = d.id; S.ui = { route: 'home', sub: {} }; sub = {}; save(); render(); confetti(); toast(`¡Bienvenid@ al club, ${mem(d.id).name}! 🌴`);
  },
  back: () => back(),
  'open-day': d => { sub.trip = 'plan'; sub.day = d.d; go('trip'); },
  day: d => { sub.day = d.d; render(); },
  signup: d => {
    const s = S.signups[d.id] = S.signups[d.id] || [];
    const i = s.indexOf(S.me); if (i >= 0) s.splice(i, 1); else { s.push(S.me); award(S.me, 10, 'te has apuntado', 'su-' + d.id + S.me); }
    save(); render();
  },
  vote: d => {
    const p = window.POLLS[+d.p]; const v = S.votes[p.id] = S.votes[p.id] || {};
    v[S.me] = +d.i; award(S.me, 15, 'voto registrado', 'vote-' + p.id + S.me); save(); render();
  },
  doc: d => { const x = window.DOCS_CHECKLIST[+d.i]; const m = S.docs[S.me] = S.docs[S.me] || {}; m[x.id] = !m[x.id]; if (window.DOCS_CHECKLIST.every(k => m[k.id])) { award(S.me, 50, 'papeles listos', 'docs-' + S.me); confetti(); } save(); render(); },
  wish: d => {
    const w = S.wish[d.id] = S.wish[d.id] || []; const i = w.indexOf(S.me); i >= 0 ? w.splice(i, 1) : w.push(S.me); save();
    if (d.keep) { const p = [...window.PLACES, ...window.ICONIC].find(x => x.id === d.id); placeSheet(p, p.id[0] === 'i'); } else render();
  },
  mapview: d => { sub.view = d.v; S.ui.sub = sub; save(); animateView(VIEWS[d.v]); document.querySelectorAll('.map-zoom button').forEach(b => b.classList.toggle('on', b.dataset.v === d.v)); },
  place: d => placeSheet(window.PLACES.find(p => p.id === d.id)),
  iconic: d => placeSheet(window.ICONIC.find(p => p.id === d.id), true),
  credits: () => sheet(`<h2>📷 Créditos de fotos</h2><p class="muted">Fotos reales de Wikimedia Commons con licencia libre.</p>${Object.entries(window.CREDITS).map(([k, c]) => `<div class="exp"><div class="ic" style="background:center/cover url(img/${k}.jpg)"></div><div class="grow"><b>${esc(c.a)}</b><div class="tiny">${esc(c.l)}</div></div><a class="btn sm ghost" href="${esc(c.u)}" target="_blank" rel="noopener">Ver</a></div>`).join('')}<p class="tiny">Mapa: Natural Earth (dominio público). Música: composición original sintetizada en la app.</p>`),
  paid: d => {
    const p = window.MILESTONES[+d.p]; const x = S.paid[p.id] = S.paid[p.id] || {}; x[d.f] = !x[d.f];
    if (x[d.f]) { members().filter(m => m.fam === d.f && m.kind === 'adult').forEach(m => award(m.id, 25, 'pago hecho', `pay-${p.id}-${m.id}`)); confetti(14); }
    save(); render();
  },
  'toggle-fam': () => { S.settleByFam = !S.settleByFam; save(); render(); },
  'add-exp': d => expenseSheet(!!d.photo),
  'save-exp': () => saveExpense(),
  'del-exp': d => { if (!confirm('¿Borrar este gasto?')) return; const e = S.expenses.find(x => x.id === d.id); if (e?.photo) idb.del(e.photo); S.expenses = S.expenses.filter(x => x.id !== d.id); save(); render(); },
  post: () => { const t = $('#post').value.trim(); if (!t) return; S.posts.push({ id: uid(), by: S.me, text: t, ts: Date.now() }); S.drafts.post = ''; save(); render(); toast('Publicado 📌'); },
  'edit-names': () => namesSheet(),
  'add-member': () => {
    const name = $('#n-name').value.trim(); if (!name) return toast('Escribe el nombre');
    const kind = $('#n-kind').value; S.extra.push({ id: 'x' + uid(), fam: $('#n-fam').value, name, kind, avatar: kind === 'adult' ? '🙂' : kind === 'teen' ? '🎧' : '🐣' });
    save(); namesSheet(); toast(`${name} añadid@ ✓`);
  },
  'rm-member': d => {
    if (d.id === S.me) return toast('No puedes quitarte a ti mism@');
    if (S.expenses.some(e => e.payer === d.id || e.split.includes(d.id))) return toast('Tiene gastos apuntados: bórralos antes');
    if (!confirm(`¿Quitar a ${mem(d.id).name} del grupo?`)) return;
    S.extra = S.extra.filter(m => m.id !== d.id); if (window.MEMBERS.some(m => m.id === d.id)) S.removed.push(d.id); save(); namesSheet();
  },
  'save-names': () => {
    document.querySelectorAll('[data-fam]').forEach(i => (S.famNames[i.dataset.fam] = i.value.trim() || undefined));
    document.querySelectorAll('[data-mem]').forEach(i => (S.names[i.dataset.mem] = i.value.trim() || undefined));
    save(); closeSheet(); render(); toast('Guardado ✓');
  },
  'add-dish': () => addSheet('dish'), 'add-song': () => addSheet('song'),
  'save-dish': () => {
    const n = $('#t-a').value.trim(); if (!n) return toast('Escribe el plato');
    const by = $('#t-by').value; S.dishes.push({ id: uid(), by, name: n, note: $('#t-b').value.trim(), for: $('#t-for .on').dataset.v, likes: [] });
    award(S.me, 5, 'plato añadido', 'dish-' + S.dishes.length + S.me); save(); closeSheet(); render();
  },
  'save-song': () => {
    const n = $('#t-a').value.trim(); if (!n) return toast('Escribe la canción');
    const url = $('#t-u').value.trim();
    S.songs.push({ id: uid(), by: $('#t-by').value, title: n, artist: $('#t-b').value.trim(), url: /^https:\/\//.test(url) ? url : '', for: $('#t-for .on').dataset.v, likes: [] });
    award(S.me, 5, 'canción añadida', 'song-' + S.songs.length + S.me); save(); closeSheet(); render();
  },
  'like-dish': d => { const x = S.dishes.find(k => k.id === d.id); const i = x.likes.indexOf(S.me); i >= 0 ? x.likes.splice(i, 1) : x.likes.push(S.me); save(); render(); },
  'like-song': d => { const x = S.songs.find(k => k.id === d.id); const i = x.likes.indexOf(S.me); i >= 0 ? x.likes.splice(i, 1) : x.likes.push(S.me); save(); render(); },
  'copy-menu': () => {
    const sec = (k, t) => { const l = S.dishes.filter(d => (d.for === 'kid') === (k === 'kid')).sort((a, b) => b.likes.length - a.likes.length); return l.length ? `${t}\n${l.map(d => `• ${d.name}${d.note ? ' (' + d.note + ')' : ''}${d.likes.length ? ' — ' + d.likes.length + ' votos' : ''}`).join('\n')}` : ''; };
    copy(`Hola chef 👋 Somos ${groupLine()}, del 14 al 18 de agosto. Estos son nuestros platos favoritos:\n\n${[sec('adult', '🍽️ ADULTOS'), sec('kid', '🧸 NIÑOS')].filter(Boolean).join('\n\n')}\n\n¡Gracias!`, 'Menú copiado: pégalo en WhatsApp al chef 👨‍🍳');
  },
  'copy-songs': () => copy(S.songs.slice().sort((a, b) => b.likes.length - a.likes.length).map(s => `${s.title} – ${s.artist}`).join('\n') || '—', 'Lista copiada 🎧'),
  bingo: d => {
    const c = S.bingo[S.me] = S.bingo[S.me] || []; const i = +d.i; const before = bingoLines(c);
    const k = c.indexOf(i); k >= 0 ? c.splice(k, 1) : c.push(i);
    const after = bingoLines(c);
    if (after > before) { for (let n = before + 1; n <= after; n++) award(S.me, 50, '¡LÍNEA!', `bingo-${S.me}-${n}`); confetti(); }
    if (c.length === 24) { award(S.me, 200, '¡BINGO! cartón lleno', 'bingo-full-' + S.me); confetti(40); }
    save(); render();
  },
  reveal: () => { sub.reveal = !sub.reveal; render(); },
  'mission-done': () => { if (!confirm('¿Misión cumplida? (palabra de honor 🤞)')) return; S.missionDone[S.me] = true; award(S.me, 100, 'misión secreta', 'mission-' + S.me); confetti(36); save(); render(); },
  challenge: d => {
    const c = window.CHALLENGES[+d.i];
    sheet(`<h2>${c.emoji} ${esc(c.title)}</h2><p class="muted">¿Quién lo ha ganado? (+${c.pts} pts)</p><div class="pickers">${members().map(m => `<button type="button" data-a="win" data-i="${d.i}" data-m="${m.id}">${m.avatar} ${esc(m.name)}</button>`).join('')}</div>`);
  },
  win: d => {
    const c = window.CHALLENGES[+d.i]; const prev = S.challenges[c.id];
    if (prev) S.log = S.log.filter(l => l.key !== 'ch-' + c.id);
    S.challenges[c.id] = d.m; award(d.m, c.pts, c.title, 'ch-' + c.id); save(); closeSheet(); render(); confetti();
  },
  spin: () => {
    const w = $('#wheel'); const n = window.WHEEL.length; const k = Math.floor(Math.random() * n);
    const cur = +(w.dataset.rot || 0); const target = cur + 360 * 5 + (360 - (k * 360 / n + 180 / n)) - (cur % 360);
    w.dataset.rot = target; w.style.transform = `rotate(${target}deg)`; $('#wheel-res').textContent = '…';
    setTimeout(() => { $('#wheel-res').textContent = window.WHEEL[k]; confetti(10); }, 4100);
  },
  film: () => playFilm(),
  photo: d => photoSheet(d.id),
  'like-photo': d => { const p = S.photos.find(x => x.id === d.id); const i = p.likes.indexOf(S.me); if (i >= 0) p.likes.splice(i, 1); else { p.likes.push(S.me); if (p.by !== S.me) award(p.by, 5, 'like en tu foto', `like-${p.id}-${S.me}`); } save(); photoSheet(d.id); render(); },
  tag: d => { const p = S.photos.find(x => x.id === d.id); const i = p.tags.indexOf(d.m); i >= 0 ? p.tags.splice(i, 1) : p.tags.push(d.m); save(); photoSheet(d.id); },
  'del-photo': d => { if (!confirm('¿Quitar la foto?')) return; idb.del(d.id); S.photos = S.photos.filter(p => p.id !== d.id); save(); closeSheet(); render(); },
  ask: d => ask(SUGGEST[+d.i]),
  claude: () => { const last = [...S.chat].reverse().find(m => m.role === 'me'); copy(tripContext(last ? last.text : '¿Qué nos recomiendas para este viaje?'), 'Contexto copiado: pégalo en Claude ✨'); window.open('https://claude.ai/new', '_blank', 'noopener'); },
  'clear-chat': () => { S.chat = []; save(); render(); },
  music: () => { S.music = !S.music; save(); if (S.music) { introDone = true; Music.start(); toast('🔊 Música activada'); } else { Music.stop(); toast('🔇 Música silenciada'); } closeSheet(); render(); },
  notif: async () => {
    if (!canNotify) return toast('Este navegador no permite notificaciones');
    if (isIOS && !isStandalone()) return toast('Primero añade la app a la pantalla de inicio 📲');
    const r = await Notification.requestPermission();
    if (r === 'granted') { toast('🔔 Notificaciones activadas'); notify('welcome', '🌴 RD Trip Club', '¡Listo! Te avisaremos de pagos, planes y la cuenta atrás.'); checkReminders(); }
    else toast('Sin permiso. Puedes activarlas luego en Ajustes.');
    render();
  },
  'notif-hide': () => { S.notifHidden = true; save(); render(); },
  settings: () => settingsSheet(),
  'save-profile': () => {
    const pin = $('#s-pin').value.trim(); if (pin && !/^\d{4}$/.test(pin)) return toast('El PIN son 4 cifras');
    S.names[S.me] = $('#s-n').value.trim() || undefined; S.avatars[S.me] = $('#s-av .on')?.textContent; S.pins[S.me] = pin || undefined;
    save(); closeSheet(); render(); toast('Perfil guardado ✓');
  },
  'save-settings': () => {
    S.theme = $('#s-th .on').dataset.v; const wa = $('#s-wa').value.trim(); S.whatsapp = /^https:\/\/(chat\.whatsapp\.com|wa\.me)\//.test(wa) ? wa : '';
    S.fx.USD = parseFloat($('#s-usd').value) || T.fx.USD; S.fx.DOP = parseFloat($('#s-dop').value) || T.fx.DOP;
    save(); closeSheet(); render(); toast('Ajustes guardados');
  },
  export: () => { const b = new Blob([JSON.stringify(S, null, 1)], { type: 'application/json' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'rd-trip-club.json'; a.click(); },
  import: () => {
    const i = document.createElement('input'); i.type = 'file'; i.accept = 'application/json';
    i.onchange = async () => { try { const d = JSON.parse(await i.files[0].text()); const keep = S.me; S = Object.assign(defaults(), d, { me: keep, unlocked: true }); save(); closeSheet(); render(); toast('Datos importados'); } catch { toast('Archivo no válido'); } };
    i.click();
  },
  switch: () => { S.me = null; S.ui = { route: 'home', sub: {} }; sub = {}; save(); closeSheet(true); history.replaceState(null, '', location.pathname); route = 'home'; render(); },
  reset: () => { if (!confirm('¿Borrar todos los datos de este dispositivo?')) return; localStorage.removeItem(KEY); indexedDB.deleteDatabase('rdtc'); location.hash = ''; location.reload(); },
};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const fn = A[el.dataset.a]; if (!fn) return;
  if (el.tagName === 'A') return;
  e.preventDefault(); fn(el.dataset);
});
document.addEventListener('input', e => { const k = e.target.dataset?.draft; if (k) { S.drafts[k] = e.target.value; save(); } });

function applyTheme() { const r = document.documentElement; if (S.theme === 'auto') r.removeAttribute('data-theme'); else r.dataset.theme = S.theme; }

render();
checkReminders();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
