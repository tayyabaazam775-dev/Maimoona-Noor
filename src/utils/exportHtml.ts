import JSZip from 'jszip';
import { HERO_MEDIA, ProductItem, SiteConfig } from '../data/products';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

async function fetchAsUint8Array(url: string): Promise<Uint8Array | null> {
  if (!url) return null;
  try {
    if (url.startsWith('data:')) {
      const base64 = url.split(',')[1];
      if (!base64) return null;
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    }
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    return new Uint8Array(buffer);
  } catch {
    return null;
  }
}

async function imageUrlToDataUrl(url: string): Promise<string> {
  if (!url || url.startsWith('data:')) return url;
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve((reader.result as string) || url);
      reader.onerror = () => resolve(url);
      reader.readAsDataURL(blob);
    });
  } catch {
    return url;
  }
}

function buildStylesCss(): string {
  return `:root {
  --bg-ivory: #FCF9F4;
  --bg-sand: #F4ECE4;
  --plum: #4A1828;
  --plum-dark: #2B0E18;
  --gold: #A67C46;
  --gold-light: #E5C697;
  --ink: #21171A;
  --muted: #6A5A5E;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-ivory);
  color: var(--ink);
  line-height: 1.6;
}
h1, h2, h3, .serif { font-family: "Cormorant Garamond", Georgia, serif; }
.tabular-nums { font-variant-numeric: tabular-nums; }

/* Animations */
@keyframes marqueeScroll {
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
}
@keyframes goldSweep {
  0% { transform: translate3d(-100%, 0, 0); }
  100% { transform: translate3d(220%, 0, 0); }
}
@keyframes kenBurns {
  0% { transform: scale(1) translate3d(0, 0, 0); }
  100% { transform: scale(1.08) translate3d(-1.5%, -1%, 0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

.announcement {
  background: var(--plum);
  color: var(--bg-ivory);
  text-align: center;
  font-size: 12px;
  padding: 8px 16px;
}
header {
  position: sticky;
  top: 0;
  z-index: 30;
  background: rgba(252, 249, 244, 0.96);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(74, 24, 40, 0.12);
}
.nav-wrap {
  max-width: 1280px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}
.brand {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 24px;
  font-weight: 600;
  color: var(--plum);
  text-decoration: none;
  white-space: nowrap;
}
.nav-links {
  display: flex;
  gap: 24px;
  font-size: 14px;
  font-weight: 500;
}
.nav-links a {
  color: var(--muted);
  text-decoration: none;
  transition: color 0.18s ease;
}
.nav-links a:hover { color: var(--plum); }
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
  transition: transform 0.18s ease, background-color 0.18s ease, border-color 0.18s ease;
}
.btn:hover { transform: translateY(-1px); }
.btn-plum { background: var(--plum); color: var(--bg-ivory); }
.btn-plum:hover { background: var(--plum-dark); }
.btn-gold { background: var(--gold-light); color: var(--plum-dark); }
.btn-outline { border-color: rgba(74, 24, 40, 0.25); background: transparent; color: var(--plum); }
.btn-outline:hover { background: var(--bg-sand); }

/* Hero */
.hero {
  position: relative;
  min-height: 520px;
  height: 72vh;
  max-height: 740px;
  background: var(--plum-dark);
  overflow: hidden;
  display: flex;
  align-items: flex-end;
}
.hero img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: kenBurns 12s ease-out forwards;
}
.hero::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(36, 11, 20, 0.9), rgba(36, 11, 20, 0.35), rgba(0, 0, 0, 0.15));
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 48px 24px;
  color: var(--bg-ivory);
  animation: fadeUp 0.7s ease-out both;
}
.hero-kicker {
  font-size: 12px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 10px;
}
.hero h1 {
  font-size: clamp(36px, 5vw, 60px);
  line-height: 1.06;
  max-width: 720px;
  margin-bottom: 12px;
}
.hero p {
  max-width: 580px;
  font-size: 15px;
  opacity: 0.9;
  margin-bottom: 22px;
}

/* Marquee Strip */
.marquee-bar {
  background: var(--plum-dark);
  color: var(--gold-light);
  border-top: 1px solid rgba(229, 198, 151, 0.2);
  border-bottom: 1px solid rgba(229, 198, 151, 0.2);
  overflow: hidden;
  padding: 10px 0;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}
.marquee-track {
  display: flex;
  width: max-content;
  animation: marqueeScroll 32s linear infinite;
}
.marquee-bar:hover .marquee-track { animation-play-state: paused; }
.marquee-item { padding: 0 28px; white-space: nowrap; }

/* Containers */
.container {
  max-width: 1280px;
  margin: 0 auto;
  padding: 64px 24px;
}
.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(74, 24, 40, 0.12);
  padding-bottom: 20px;
  margin-bottom: 24px;
}
.toolbar-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.tabs { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px; }
.tab-btn {
  padding: 8px 16px;
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  background: var(--bg-sand);
  color: var(--muted);
  cursor: pointer;
  transition: all 0.18s ease;
}
.tab-btn.active { background: var(--plum); color: var(--bg-ivory); }
.search-input, .select-input {
  padding: 9px 14px;
  border-radius: 4px;
  border: 1px solid rgba(74, 24, 40, 0.2);
  background: var(--bg-sand);
  font-size: 13px;
  color: var(--ink);
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  gap: 32px;
}
.card {
  transition: transform 0.22s ease;
  animation: fadeUp 0.5s ease-out both;
}
.card:hover { transform: translateY(-3px); }
.card-img {
  aspect-ratio: 3 / 4;
  background: var(--bg-sand);
  border: 1px solid rgba(74, 24, 40, 0.1);
  overflow: hidden;
  margin-bottom: 14px;
  cursor: pointer;
}
.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  display: block;
  transition: transform 0.45s ease;
}
.card:hover .card-img img { transform: scale(1.03); }
.card-meta { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); }
.card-title {
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 22px;
  font-weight: 600;
  color: var(--ink);
  margin: 4px 0;
  cursor: pointer;
}
.card-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--plum);
  margin-bottom: 10px;
}

/* Video Film & Craftsmanship Section */
.film-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 40px;
  align-items: center;
}
.film-player {
  position: relative;
  aspect-ratio: 16 / 9;
  background: var(--plum-dark);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(74, 24, 40, 0.2);
}
.film-player img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.film-player.playing img {
  animation: kenBurns 7s ease-out forwards;
}
.film-scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(33, 9, 17, 0.9), rgba(33, 9, 17, 0.2), rgba(0,0,0,0.15));
}
.film-sweep {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(229, 198, 151, 0.25);
  overflow: hidden;
}
.film-sweep-bar {
  width: 35%;
  height: 100%;
  background: linear-gradient(to right, transparent, var(--gold-light), transparent);
  animation: goldSweep 4.5s ease-in-out infinite;
}
.film-caption {
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 54px;
  color: var(--bg-ivory);
}
.film-controls {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(33, 9, 17, 0.92);
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--bg-ivory);
  font-size: 12px;
}
.film-progress {
  flex: 1;
  height: 5px;
  background: rgba(252, 249, 244, 0.2);
  border-radius: 99px;
  overflow: hidden;
}
.film-progress-fill {
  height: 100%;
  background: var(--gold-light);
  width: 0%;
  transition: width 0.12s linear;
}
.chapter-strip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 8px;
  margin-top: 10px;
}
.chapter-btn {
  padding: 8px 10px;
  text-align: left;
  font-size: 11px;
  border-radius: 4px;
  border: 1px solid rgba(74, 24, 40, 0.15);
  background: var(--bg-sand);
  color: var(--muted);
  cursor: pointer;
}
.chapter-btn.active { background: var(--plum); color: var(--bg-ivory); border-color: var(--plum); }
.metric-row { margin-bottom: 14px; }
.metric-head { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
.metric-track { height: 6px; background: var(--bg-sand); border-radius: 99px; overflow: hidden; border: 1px solid rgba(74, 24, 40, 0.1); }
.metric-fill { height: 100%; background: linear-gradient(to right, var(--plum), var(--gold)); }

/* Outlet & Footer */
.outlet-band {
  background: var(--bg-sand);
  border-top: 1px solid rgba(74, 24, 40, 0.12);
  border-bottom: 1px solid rgba(74, 24, 40, 0.12);
}
footer {
  background: var(--plum-dark);
  color: var(--bg-ivory);
  padding: 56px 24px 32px;
}
.footer-grid {
  max-width: 1280px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 32px;
}
.footer-note {
  max-width: 1280px;
  margin: 40px auto 0;
  padding-top: 20px;
  border-top: 1px solid rgba(252, 249, 244, 0.15);
  font-size: 12px;
  opacity: 0.72;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

/* Modals */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 50;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 16px;
}
.overlay.open { display: flex; }
.modal-box {
  background: var(--bg-ivory);
  max-width: 780px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 4px;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  position: relative;
}
.close-btn {
  position: absolute;
  top: 12px;
  right: 14px;
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--ink);
}
@media (max-width: 720px) {
  .nav-links { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}`;
}

function buildAppJs(
  productsData: ProductItem[],
  filmScenes: { chapter: string; title: string; caption: string; image: string }[],
  whatsappPhone: string
): string {
  const safeProducts = JSON.stringify(productsData).replace(/<\/script>/gi, '<\\/script>');
  const safeScenes = JSON.stringify(filmScenes).replace(/<\/script>/gi, '<\\/script>');
  const safeWhatsapp = JSON.stringify(whatsappPhone);

  return `const PRODUCTS = ${safeProducts};
const FILM_SCENES = ${safeScenes};
const WHATSAPP_PHONE = ${safeWhatsapp};
const CURRENCY_RATES = {
  PKR: { symbol: 'PKR ', rate: 1 },
  USD: { symbol: '$', rate: 0.0036 },
  GBP: { symbol: '£', rate: 0.0028 },
  AED: { symbol: 'AED ', rate: 0.0132 }
};

let activeCategory = 'all';
let activeCurrency = 'PKR';
let bag = [];
let sceneIndex = 0;
let filmPlaying = true;
let sceneProgress = 0;

function formatMoney(pkr) {
  const cfg = CURRENCY_RATES[activeCurrency] || CURRENCY_RATES.PKR;
  return cfg.symbol + Math.round(pkr * cfg.rate).toLocaleString('en-US');
}

function setCurrency(val) {
  activeCurrency = val;
  renderCatalog();
}

function setCategory(cat, btn) {
  activeCategory = cat;
  document.querySelectorAll('#category-tabs .tab-btn').forEach(function (b) { b.classList.remove('active'); });
  if (btn) btn.classList.add('active');
  renderCatalog();
}

function renderCatalog() {
  const box = document.getElementById('search-box');
  const q = (box ? box.value : '').toLowerCase();
  const grid = document.getElementById('catalog-grid');
  const items = PRODUCTS.filter(function (p) {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.fabric.toLowerCase().includes(q) || p.colorTone.toLowerCase().includes(q);
    return matchCat && matchQ;
  });
  grid.innerHTML = items.map(function (p) {
    return '<article class="card">' +
      '<div class="card-img" onclick="openDetail(\\'' + p.id + '\\')">' +
        '<img src="' + p.image + '" alt="' + p.name + '" />' +
      '</div>' +
      '<div class="card-meta">' +
        '<span>' + p.categoryLabel + ' · ' + p.collectionName + '</span>' +
        '<span style="color: var(--gold);">' + p.availability + '</span>' +
      '</div>' +
      '<div class="card-title" onclick="openDetail(\\'' + p.id + '\\')">' + p.name + '</div>' +
      '<div class="card-price">' +
        '<span class="tabular-nums">' + formatMoney(p.pricePKR) + '</span>' +
        '<span style="font-size: 12px; font-weight: 400; color: var(--muted);">' + p.fabric + '</span>' +
      '</div>' +
      '<button class="btn btn-outline" style="width:100%" onclick="addToBag(\\'' + p.id + '\\', \\'M\\')">Add to Bag</button>' +
    '</article>';
  }).join('');
}

function openDetail(id) {
  const p = PRODUCTS.find(function (x) { return x.id === id; });
  if (!p) return;
  document.getElementById('detail-content').innerHTML =
    '<button class="close-btn" onclick="closeModal()">×</button>' +
    '<div><img src="' + p.image + '" alt="' + p.name + '" style="width:100%; border-radius:4px; aspect-ratio:3/4; object-fit:cover; object-position:top;" /></div>' +
    '<div style="display:flex; flex-direction:column; gap:12px;">' +
      '<span style="font-size:12px; color:var(--gold); text-transform:uppercase;">' + p.collectionName + ' · ' + p.categoryLabel + '</span>' +
      '<h2 style="font-size:32px; line-height:1.1;">' + p.name + '</h2>' +
      '<p style="font-size:18px; font-weight:700; color:var(--plum);" class="tabular-nums">' + formatMoney(p.pricePKR) + '</p>' +
      '<p style="font-size:14px; color:#3B2E32;">' + p.description + '</p>' +
      '<p style="font-size:13px;"><strong>Fabric:</strong> ' + p.fabric + '<br/><strong>Handwork:</strong> ' + p.embroidery + '<br/><strong>Pieces:</strong> ' + p.pieces + '</p>' +
      '<label style="font-size:12px; color:var(--muted);">Select Size: ' +
        '<select id="modal-size" style="margin-left:8px; padding:6px 10px; border:1px solid #ccc; border-radius:4px;">' +
          '<option>XS</option><option>S</option><option selected>M</option><option>L</option><option>XL</option><option>Custom Size</option>' +
        '</select>' +
      '</label>' +
      '<button class="btn btn-plum" onclick="addToBag(\\'' + p.id + '\\', document.getElementById(\\'modal-size\\').value); closeModal(); openBag();">Add to Shopping Bag</button>' +
    '</div>';
  document.getElementById('detail-modal').classList.add('open');
}

function closeModal() { document.getElementById('detail-modal').classList.remove('open'); }

function addToBag(id, size) {
  const p = PRODUCTS.find(function (x) { return x.id === id; });
  if (!p) return;
  const existing = bag.find(function (i) { return i.id === id && i.size === size; });
  if (existing) existing.qty += 1;
  else bag.push({ id: id, name: p.name, pricePKR: p.pricePKR, size: size, qty: 1 });
  updateBagCount();
}

function updateBagCount() {
  document.getElementById('bag-count').textContent = bag.reduce(function (s, i) { return s + i.qty; }, 0);
}

function openBag() {
  const box = document.getElementById('bag-items');
  if (bag.length === 0) {
    box.innerHTML = '<p style="font-size:14px; color:var(--muted);">Your shopping bag is currently empty.</p>';
  } else {
    const total = bag.reduce(function (s, i) { return s + i.pricePKR * i.qty; }, 0);
    box.innerHTML = bag.map(function (i, idx) {
      return '<div style="display:flex; justify-content:space-between; padding:10px 0; border-bottom:1px solid rgba(0,0,0,0.08); font-size:14px;">' +
        '<span>' + i.name + ' (' + i.size + ') × ' + i.qty + '</span>' +
        '<span class="tabular-nums">' + formatMoney(i.pricePKR * i.qty) +
        ' <button onclick="bag.splice(' + idx + ',1); updateBagCount(); openBag();" style="margin-left:8px; color:#991B1B; background:none; border:none; cursor:pointer;">Remove</button></span>' +
      '</div>';
    }).join('') +
    '<div style="padding-top:14px; font-weight:700; display:flex; justify-content:space-between;" class="tabular-nums">' +
      '<span>Total</span><span>' + formatMoney(total) + '</span>' +
    '</div>' +
    '<p style="font-size:12px; color:var(--muted); margin-top:10px;">Confirm Cash on Delivery via Karachi Outlet WhatsApp: ' + WHATSAPP_PHONE + '</p>';
  }
  document.getElementById('bag-modal').classList.add('open');
}

function closeBag() { document.getElementById('bag-modal').classList.remove('open'); }

function renderScene() {
  const scene = FILM_SCENES[sceneIndex] || FILM_SCENES[0];
  const imgEl = document.getElementById('film-img');
  const chapEl = document.getElementById('film-chapter');
  const titleEl = document.getElementById('film-title');
  const capEl = document.getElementById('film-desc');
  if (imgEl) imgEl.src = scene.image;
  if (chapEl) chapEl.textContent = scene.chapter;
  if (titleEl) titleEl.textContent = scene.title;
  if (capEl) capEl.textContent = scene.caption;
  document.querySelectorAll('.chapter-btn').forEach(function (b, i) {
    if (i === sceneIndex) b.classList.add('active');
    else b.classList.remove('active');
  });
}

function selectScene(idx) {
  sceneIndex = idx;
  sceneProgress = 0;
  renderScene();
}

function togglePlay() {
  filmPlaying = !filmPlaying;
  const player = document.getElementById('film-player');
  const btn = document.getElementById('play-btn');
  if (player) player.classList.toggle('playing', filmPlaying);
  if (btn) btn.textContent = filmPlaying ? 'Pause' : 'Play';
}

setInterval(function () {
  if (!filmPlaying) return;
  sceneProgress += 2;
  if (sceneProgress >= 100) {
    sceneProgress = 0;
    sceneIndex = (sceneIndex + 1) % FILM_SCENES.length;
    renderScene();
  }
  const fill = document.getElementById('film-progress-fill');
  if (fill) {
    const totalPct = ((sceneIndex + sceneProgress / 100) / FILM_SCENES.length) * 100;
    fill.style.width = totalPct + '%';
  }
}, 100);

renderCatalog();
renderScene();
`;
}

function buildHtmlDocument(
  siteConfig: SiteConfig,
  heroImageSrc: string,
  filmScenes: { chapter: string; title: string; caption: string; image: string }[],
  inlineStyles: string | null,
  inlineScript: string | null
): string {
  const safeBrand = escapeHtml(siteConfig.brandName);
  const safeAnnouncement = escapeHtml(siteConfig.announcementText);
  const safeHeroKicker = escapeHtml(siteConfig.heroKicker);
  const safeHeroTitle = escapeHtml(siteConfig.heroTitle);
  const safeHeroSubtitle = escapeHtml(siteConfig.heroSubtitle);
  const safeOutletAddress = escapeHtml(siteConfig.outletAddress);
  const safeOutletHours = escapeHtml(siteConfig.outletHours);
  const safeWhatsapp = escapeHtml(siteConfig.whatsappPhone);
  const safeEmail = escapeHtml(siteConfig.conciergeEmail);

  const chapterButtonsHtml = filmScenes
    .map(
      (s, i) =>
        `<button type="button" class="chapter-btn${i === 0 ? ' active' : ''}" onclick="selectScene(${i})">${escapeHtml(s.chapter)}</button>`
    )
    .join('\n          ');

  const marqueePhrase = `${safeBrand} · Karachi Flagship Outlet · Pure Silk &amp; Zardozi · Custom Tailoring · Cash on Delivery Across Pakistan · Worldwide DHL Express`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${safeBrand} — Karachi Pakistani Couture &amp; Luxury Pret</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />
  ${inlineStyles ? `<style>\n${inlineStyles}\n  </style>` : '<link rel="stylesheet" href="styles.css" />'}
</head>
<body>
  <div class="announcement">${safeAnnouncement}</div>

  <header>
    <div class="nav-wrap">
      <a href="#top" class="brand">${safeBrand}</a>
      <nav class="nav-links">
        <a href="#collections">Collections</a>
        <a href="#campaign-film">Campaign Film</a>
        <a href="#karachi-outlet">Karachi Outlet</a>
        <a href="#contact">Contact</a>
      </nav>
      <button type="button" class="btn btn-plum" onclick="openBag()">Bag (<span id="bag-count">0</span>)</button>
    </div>
  </header>

  <section id="top" class="hero">
    <img src="${heroImageSrc}" alt="${safeBrand}" />
    <div class="hero-content">
      <div class="hero-kicker">${safeHeroKicker}</div>
      <h1>${safeHeroTitle}</h1>
      <p>${safeHeroSubtitle}</p>
      <a href="#collections" class="btn btn-gold">Explore Collections</a>
    </div>
  </section>

  <!-- SCROLLING MARQUEE BANNER -->
  <div class="marquee-bar" aria-label="Brand Highlights">
    <div class="marquee-track">
      <span class="marquee-item">${marqueePhrase}</span>
      <span class="marquee-item">${marqueePhrase}</span>
    </div>
  </div>

  <!-- CAMPAIGN FILM & CRAFTSMANSHIP PROGRESS -->
  <section id="campaign-film" class="container">
    <div class="film-grid">
      <div>
        <div id="film-player" class="film-player playing">
          <img id="film-img" src="${filmScenes[0]?.image || heroImageSrc}" alt="Campaign Film" />
          <div class="film-scrim"></div>
          <div class="film-sweep"><div class="film-sweep-bar"></div></div>
          <div class="film-caption">
            <div id="film-chapter" style="font-size:11px; text-transform:uppercase; letter-spacing:0.12em; color:#E5C697;"></div>
            <h3 id="film-title" style="font-size:28px; margin-top:4px;"></h3>
            <p id="film-desc" style="font-size:13px; opacity:0.9; margin-top:4px;"></p>
          </div>
          <div class="film-controls">
            <button id="play-btn" type="button" class="btn btn-gold" style="padding:4px 12px; font-size:11px;" onclick="togglePlay()">Pause</button>
            <div class="film-progress"><div id="film-progress-fill" class="film-progress-fill"></div></div>
          </div>
        </div>
        <div class="chapter-strip">
          ${chapterButtonsHtml}
        </div>
      </div>

      <div>
        <p style="font-size:12px; text-transform:uppercase; letter-spacing:0.14em; color:var(--gold); margin-bottom:8px;">Atelier Campaign Film · Karachi</p>
        <h2 style="font-size:36px; line-height:1.15; margin-bottom:14px;">Motion, Silk &amp; Hand-Stitched Pakistani Artistry</h2>
        <p style="font-size:14px; color:#3B2E32; margin-bottom:24px;">
          Crafted on wooden adda frames at our Zamzama workshop in DHA Phase 5, Karachi.
        </p>
        <div class="metric-row">
          <div class="metric-head"><span>Hand-Drawn Khaka &amp; Pattern Drafting</span><span style="color:var(--gold); font-weight:600;">100%</span></div>
          <div class="metric-track"><div class="metric-fill" style="width:100%;"></div></div>
        </div>
        <div class="metric-row">
          <div class="metric-head"><span>Adda Zardozi, Dabka &amp; Resham</span><span style="color:var(--gold); font-weight:600;">96%</span></div>
          <div class="metric-track"><div class="metric-fill" style="width:96%;"></div></div>
        </div>
        <div class="metric-row">
          <div class="metric-head"><span>Pure Silk, Crinkle Chiffon &amp; Velvet</span><span style="color:var(--gold); font-weight:600;">100%</span></div>
          <div class="metric-track"><div class="metric-fill" style="width:100%;"></div></div>
        </div>
      </div>
    </div>
  </section>

  <!-- COLLECTIONS CATALOG -->
  <main id="collections" class="container" style="padding-top: 16px;">
    <div class="toolbar">
      <div>
        <h2 style="font-size: 36px; color: var(--ink);">Signature Pakistani Ensembles</h2>
        <p style="font-size: 14px; color: var(--muted);">Pure silk pret, festive chiffons, winter velvet shawls &amp; bridal couture.</p>
      </div>
      <div class="toolbar-actions">
        <input id="search-box" class="search-input" type="search" placeholder="Search dresses or fabric..." oninput="renderCatalog()" />
        <select class="select-input" onchange="setCurrency(this.value)">
          <option value="PKR">PKR (Pakistan)</option>
          <option value="USD">USD ($)</option>
          <option value="GBP">GBP (£)</option>
          <option value="AED">AED</option>
        </select>
      </div>
    </div>

    <div class="tabs" id="category-tabs">
      <button class="tab-btn active" onclick="setCategory('all', this)">All Ensembles</button>
      <button class="tab-btn" onclick="setCategory('luxury-pret', this)">Luxury Pret</button>
      <button class="tab-btn" onclick="setCategory('festive-formals', this)">Festive Formals</button>
      <button class="tab-btn" onclick="setCategory('bridal-couture', this)">Bridal Couture</button>
      <button class="tab-btn" onclick="setCategory('winter-velvet', this)">Winter Velvet</button>
    </div>

    <div id="catalog-grid" class="grid"></div>
  </main>

  <section id="karachi-outlet" class="outlet-band">
    <div class="container" style="padding-top: 56px; padding-bottom: 56px;">
      <p style="font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--gold); margin-bottom: 8px;">Karachi Flagship Studio</p>
      <h2 style="font-size: 36px; margin-bottom: 12px;">Visit ${safeBrand} in Karachi</h2>
      <p style="max-width: 680px; font-size: 15px; color: #3B2E32; margin-bottom: 18px;">
        Experience custom tailoring, bridal consultations, and ready-to-wear Pakistani couture at our flagship boutique.
      </p>
      <p style="font-size: 14px;"><strong>Address:</strong> ${safeOutletAddress}</p>
      <p style="font-size: 14px;"><strong>Timings:</strong> ${safeOutletHours}</p>
      <p style="font-size: 14px;"><strong>WhatsApp / Orders:</strong> ${safeWhatsapp}</p>
    </div>
  </section>

  <footer id="contact">
    <div class="footer-grid">
      <div>
        <h3 style="font-size: 26px; margin-bottom: 10px;">${safeBrand}</h3>
        <p style="font-size: 13px; opacity: 0.8;">Pakistani Luxury Pret, Festive Formals &amp; Bridal Couture crafted in Karachi.</p>
      </div>
      <div>
        <h4 style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 10px;">Karachi Outlet</h4>
        <p style="font-size: 13px; opacity: 0.85;">${safeOutletAddress}</p>
        <p style="font-size: 13px; opacity: 0.85; margin-top: 4px;">${safeOutletHours}</p>
      </div>
      <div>
        <h4 style="font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-light); margin-bottom: 10px;">Concierge</h4>
        <p style="font-size: 13px; opacity: 0.85;">WhatsApp: ${safeWhatsapp}</p>
        <p style="font-size: 13px; opacity: 0.85; margin-top: 4px;">Email: ${safeEmail}</p>
      </div>
    </div>
    <div class="footer-note">
      <span>© ${new Date().getFullYear()} ${safeBrand}. Karachi, Pakistan.</span>
      <span>Cash on Delivery Across Pakistan · Worldwide Express</span>
    </div>
  </footer>

  <div id="detail-modal" class="overlay" onclick="if(event.target===this) closeModal()">
    <div class="modal-box" id="detail-content"></div>
  </div>

  <div id="bag-modal" class="overlay" onclick="if(event.target===this) closeBag()">
    <div class="modal-box" style="grid-template-columns: 1fr; max-width: 520px;">
      <button class="close-btn" onclick="closeBag()">×</button>
      <h2 style="font-size: 28px; color: var(--plum);">Your Shopping Bag</h2>
      <div id="bag-items"></div>
    </div>
  </div>

  ${inlineScript ? `<script>\n${inlineScript}\n  </script>` : '<script src="app.js" defer></script>'}
</body>
</html>`;
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadStandaloneHtml(
  products: ProductItem[],
  siteConfig: SiteConfig
): Promise<void> {
  const heroDataUrl = await imageUrlToDataUrl(siteConfig.heroImage);
  const atelierDataUrl = await imageUrlToDataUrl(HERO_MEDIA.atelierImage);
  const embeddedProducts = await Promise.all(
    products.map(async (item) => ({
      ...item,
      image: await imageUrlToDataUrl(item.image),
    }))
  );

  const filmScenes = [
    {
      chapter: '01 · Campaign Film',
      title: 'The Karachi Heritage Edit',
      caption: 'Hand-embroidered kalidar peshwas and heirloom organza dupattas crafted in DHA Phase 5, Karachi.',
      image: heroDataUrl,
    },
    {
      chapter: '02 · Bridal Atelier',
      title: 'Ruh-e-Riwaj Dabka & Velvet',
      caption: 'Over 420 artisan hours per bridal lehenga on traditional wooden adda frames.',
      image: embeddedProducts[3]?.image || heroDataUrl,
    },
    {
      chapter: '03 · Luxury Pret',
      title: 'Pastel Echo Raw Silk Ghararas',
      caption: 'Lightweight sage-mint and ivory ensembles tailored for Eid and intimate receptions.',
      image: embeddedProducts[0]?.image || heroDataUrl,
    },
    {
      chapter: '04 · Karigar Hands',
      title: 'Inside Our Zamzama Workshop',
      caption: 'Every metallic thread, pearl, and gota motif placed individually by hand.',
      image: atelierDataUrl,
    },
  ];

  const html = buildHtmlDocument(
    siteConfig,
    heroDataUrl,
    filmScenes,
    buildStylesCss(),
    buildAppJs(embeddedProducts, filmScenes, siteConfig.whatsappPhone)
  );
  triggerBlobDownload(new Blob([html], { type: 'text/html;charset=utf-8' }), 'index.html');
}

export async function downloadWebsiteZip(
  products: ProductItem[],
  siteConfig: SiteConfig
): Promise<void> {
  const zip = new JSZip();
  const assetsFolder = zip.folder('assets');

  let heroPath = siteConfig.heroImage;
  const heroBytes = await fetchAsUint8Array(siteConfig.heroImage);
  if (heroBytes && assetsFolder) {
    assetsFolder.file('hero-campaign.jpg', heroBytes);
    heroPath = 'assets/hero-campaign.jpg';
  }

  let atelierPath = HERO_MEDIA.atelierImage;
  const atelierBytes = await fetchAsUint8Array(HERO_MEDIA.atelierImage);
  if (atelierBytes && assetsFolder) {
    assetsFolder.file('atelier-craft.jpg', atelierBytes);
    atelierPath = 'assets/atelier-craft.jpg';
  }

  const packagedProducts: ProductItem[] = await Promise.all(
    products.map(async (item, idx) => {
      const bytes = await fetchAsUint8Array(item.image);
      if (bytes && assetsFolder) {
        const filename = `dress-${idx + 1}-${item.slug || item.id}.jpg`;
        assetsFolder.file(filename, bytes);
        return { ...item, image: `assets/${filename}` };
      }
      return item;
    })
  );

  const filmScenes = [
    {
      chapter: '01 · Campaign Film',
      title: 'The Karachi Heritage Edit',
      caption: 'Hand-embroidered kalidar peshwas and heirloom organza dupattas crafted in DHA Phase 5, Karachi.',
      image: heroPath,
    },
    {
      chapter: '02 · Bridal Atelier',
      title: 'Ruh-e-Riwaj Dabka & Velvet',
      caption: 'Over 420 artisan hours per bridal lehenga on traditional wooden adda frames.',
      image: packagedProducts[3]?.image || heroPath,
    },
    {
      chapter: '03 · Luxury Pret',
      title: 'Pastel Echo Raw Silk Ghararas',
      caption: 'Lightweight sage-mint and ivory ensembles tailored for Eid and intimate receptions.',
      image: packagedProducts[0]?.image || heroPath,
    },
    {
      chapter: '04 · Karigar Hands',
      title: 'Inside Our Zamzama Workshop',
      caption: 'Every metallic thread, pearl, and gota motif placed individually by hand.',
      image: atelierPath,
    },
  ];

  zip.file('styles.css', buildStylesCss());
  zip.file(
    'app.js',
    buildAppJs(packagedProducts, filmScenes, siteConfig.whatsappPhone)
  );
  zip.file(
    'index.html',
    buildHtmlDocument(siteConfig, heroPath, filmScenes, null, null)
  );
  zip.file(
    'HOSTING-GUIDE.txt',
    `MAIMOONA NOOR FASHION — WEBSITE PACKAGE & HOSTING GUIDE
=========================================================

1. OPEN LOCALLY ON YOUR COMPUTER
- Unzip this folder anywhere on your computer.
- Double-click index.html to open the website in Chrome, Edge, or Safari.

2. PUBLISH ONLINE FOR FREE (NETLIFY DROP — 30 SECONDS)
- Go to https://app.netlify.com/drop
- Drag and drop the unzipped folder into the browser window.
- Netlify will immediately give you a public https://...netlify.app URL.

3. PUBLISH ON GITHUB PAGES
- Create a new GitHub repository and upload index.html, styles.css, app.js, and the assets/ folder.
- Go to Settings -> Pages -> Deploy from branch (main / root).
- Your site will be live at https://<your-username>.github.io/<repo-name>/
`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, 'maimoona-noor-fashion-website.zip');
}
