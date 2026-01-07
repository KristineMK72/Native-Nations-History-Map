// /app.js
import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";
import { PLACES } from "./data/places.js";
import { REGIONS } from "./data/regions.js";

const $ = (id) => document.getElementById(id);

const els = {
  storyBody: $("storyBody"),
  btnPrev: $("btnPrev"),
  btnNext: $("btnNext"),
  hudChapterTitle: $("hudChapterTitle"),
  progressText: $("progressText"),
  progressFill: $("progressFill"),
};

let map = null;

// Layers
let regionsLayer = null;
let trailsLayer = null;
let tribesLayer = null;
let placesLayer = null;

// Chapter state
let activeChapterIndex = 0;
let lastChapterId = null;
let ignoreScrollUntil = 0;

// Highlight maps
let trailPolylinesById = new Map();
let regionPolygonsById = new Map();

/* =========================================================
   Utilities
========================================================= */
function escapeHtml(s = "") {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setText(el, value) {
  if (el) el.textContent = value;
}

function setWidth(el, pct) {
  if (el) el.style.width = `${pct}%`;
}

function setActiveStep(stepEl) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  if (stepEl) stepEl.classList.add("active");
}

function safeMapInvalidate() {
  if (!map) return;
  requestAnimationFrame(() => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 250);
  setTimeout(() => map.invalidateSize(), 700);
}

/* =========================================================
   Layer control
========================================================= */
function setLayerVisible(layer, visible) {
  if (!map || !layer) return;
  try {
    const onMap = map.hasLayer(layer);
    if (visible && !onMap) layer.addTo(map);
    if (!visible && onMap) map.removeLayer(layer);
  } catch (e) {
    console.warn("Layer toggle failed:", e);
  }
}

/* =========================================================
   Highlights
========================================================= */
function clearTrailHighlights() {
  for (const poly of trailPolylinesById.values()) {
    poly.setStyle({ weight: poly.__baseWeight ?? 4, opacity: 0.8 });
  }
}

function highlightTrails(ids = []) {
  for (const poly of trailPolylinesById.values()) {
    poly.setStyle({ weight: poly.__baseWeight ?? 4, opacity: 0.2 });
  }
  for (const id of ids) {
    const poly = trailPolylinesById.get(id);
    if (poly) poly.setStyle({ weight: (poly.__baseWeight ?? 4) + 3, opacity: 0.95 });
  }
}

function clearRegionHighlights() {
  for (const poly of regionPolygonsById.values()) {
    poly.setStyle({
      fillOpacity: poly.__baseFillOpacity ?? 0.12,
      opacity: 1,
    });
  }
}

function highlightRegions(ids = []) {
  for (const poly of regionPolygonsById.values()) {
    poly.setStyle({ fillOpacity: 0.05, opacity: 0.35 });
  }
  for (const id of ids) {
    const poly = regionPolygonsById.get(id);
    if (poly) poly.setStyle({ fillOpacity: 0.18, opacity: 1 });
  }
}

function applyChapterLayers(chapter) {
  const l = chapter?.layers || {};

  // NEW: regions toggle
  setLayerVisible(regionsLayer, !!l.regions);

  setLayerVisible(trailsLayer, !!l.trails);
  setLayerVisible(tribesLayer, !!l.tribes);
  setLayerVisible(placesLayer, !!l.places);

  // NEW: region highlight
  if (chapter?.highlight?.regionIds?.length) highlightRegions(chapter.highlight.regionIds);
  else clearRegionHighlights();

  // Existing: trail highlight
  if (chapter?.highlight?.trailIds?.length) highlightTrails(chapter.highlight.trailIds);
  else clearTrailHighlights();
}

/* =========================================================
   HUD + navigation
========================================================= */
function updateHUD() {
  const c = CHAPTERS[activeChapterIndex];
  setText(els.hudChapterTitle, c?.title ?? "Chapter");
  setText(els.progressText, `${activeChapterIndex + 1} / ${CHAPTERS.length}`);
  setWidth(els.progressFill, ((activeChapterIndex + 1) / CHAPTERS.length) * 100);
}

function scrollStepIntoView(idx) {
  const c = CHAPTERS[idx];
  const stepEl = document.querySelector(`.step[data-chapter="${c.id}"]`);
  if (!stepEl || !els.storyBody) return;

  ignoreScrollUntil = Date.now() + 1400; // better on mobile
  stepEl.scrollIntoView({ behavior: "smooth", block: "center" });
  setActiveStep(stepEl);
}

function goToChapter(idx, { animate = true, scroll = false } = {}) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];

  updateHUD();
  applyChapterLayers(c);

  if (map && c?.view?.center) {
    const zoom = typeof c.view.zoom === "number" ? c.view.zoom : map.getZoom();
    if (animate) map.flyTo(c.view.center, zoom, { duration: 1.8 });
    else map.setView(c.view.center, zoom);
    setTimeout(() => map && map.invalidateSize(), 150);
  }

  if (scroll) scrollStepIntoView(activeChapterIndex);
}

function onChapterEnter(chapterId) {
  if (Date.now() < ignoreScrollUntil) return;
  if (!chapterId || chapterId === lastChapterId) return;

  lastChapterId = chapterId;
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  if (idx === -1) return;

  const stepEl = document.querySelector(`.step[data-chapter="${chapterId}"]`);
  setActiveStep(stepEl);

  goToChapter(idx, { animate: true, scroll: false });
}

/* =========================================================
   Scroll-driven chapters
========================================================= */
function setupScrollChapters() {
  const steps = Array.from(document.querySelectorAll(".step"));
  if (!steps.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      const chapterId = visible?.target?.dataset?.chapter;
      if (chapterId) onChapterEnter(chapterId);
    },
    {
      root: els.storyBody || null,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-40% 0px -40% 0px",
    }
  );

  steps.forEach((s) => io.observe(s));
}

/* =========================================================
   Popups
========================================================= */
function buildTrailPopup(t) {
  const name = t?.name ? escapeHtml(t.name) : "Trail";
  const typeLabel = t?.typeLabel ? escapeHtml(t.typeLabel) : "";
  const certainty = t?.certainty ? escapeHtml(t.certainty) : "";

  const typeLine = typeLabel
    ? `<div style="opacity:.85; font-size:12px; margin-top:4px;">Type: ${typeLabel}</div>`
    : "";

  const certaintyLine = certainty
    ? `<div style="opacity:.7; font-size:12px;">Certainty: ${certainty}</div>`
    : "";

  return `
    <div style="min-width: 220px;">
      <strong>${name}</strong>
      ${typeLine}
      ${certaintyLine}
      <div style="opacity:.7; font-size:12px; margin-top:6px;">
        Routes are simplified for educational context.
      </div>
    </div>
  `;
}

function buildRegionPopup(r) {
  const name = r?.name ? escapeHtml(r.name) : "Region";
  const typeLabel = r?.typeLabel ? escapeHtml(r.typeLabel) : "";
  const certainty = r?.certainty ? escapeHtml(r.certainty) : "";
  const body = r?.body ? escapeHtml(r.body) : "";

  const typeLine = typeLabel
    ? `<div style="opacity:.85; font-size:12px; margin-top:4px;">Type: ${typeLabel}</div>`
    : "";

  const certaintyLine = certainty
    ? `<div style="opacity:.7; font-size:12px;">Certainty: ${certainty}</div>`
    : "";

  return `
    <div style="min-width: 240px;">
      <strong>${name}</strong>
      ${typeLine}
      ${certaintyLine}
      ${body ? `<div style="opacity:.85; font-size:12px; margin-top:6px;">${body}</div>` : ""}
      <div style="opacity:.7; font-size:12px; margin-top:6px;">
        Region overlays are simplified for educational context.
      </div>
    </div>
  `;
}

/* =========================================================
   Map + layers
========================================================= */
function setupLayers() {
  // Regions (polygons)
  regionsLayer = L.layerGroup();
  regionPolygonsById = new Map();

  for (const r of REGIONS) {
    if (!r?.coords?.length) continue;

    const style = r.style || {};
    const baseFillOpacity = typeof style.fillOpacity === "number" ? style.fillOpacity : 0.12;

    const poly = L.polygon(r.coords, {
      color: style.color || "#ffffff",
      weight: style.weight ?? 2,
      opacity: 1,
      fillOpacity: baseFillOpacity,
    }).addTo(regionsLayer);

    poly.__baseFillOpacity = baseFillOpacity;

    if (r.id) regionPolygonsById.set(r.id, poly);
    if (r.name) poly.bindPopup(buildRegionPopup(r));
  }
  regionsLayer.addTo(map);

  // Trails
  trailsLayer = L.layerGroup();
  trailPolylinesById = new Map();

  for (const t of TRAILS) {
    if (!t?.coords?.length) continue;

    const baseWeight = typeof t.weight === "number" ? t.weight : 4;

    const poly = L.polyline(t.coords, {
      color: t.color || "#5dade2",
      weight: baseWeight,
      opacity: 0.8,
    }).addTo(trailsLayer);

    poly.__baseWeight = baseWeight;

    if (t.id) trailPolylinesById.set(t.id, poly);
    if (t.name) poly.bindPopup(buildTrailPopup(t));
  }
  trailsLayer.addTo(map);

  // Places
  placesLayer = L.layerGroup();
  for (const p of PLACES) {
    if (typeof p?.lat !== "number" || typeof p?.lng !== "number") continue;

    const name = escapeHtml(p.name ?? "Place");
    const body = escapeHtml(p.body ?? "");

    L.circleMarker([p.lat, p.lng], {
      radius: 7,
      fillColor: "#ff9f43",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9,
    })
      .bindPopup(`<strong>${name}</strong><p>${body}</p>`)
      .addTo(placesLayer);
  }
  placesLayer.addTo(map);

  // Tribes (cluster if available; fallback if not)
  const hasCluster = typeof L.markerClusterGroup === "function";
  tribesLayer = hasCluster ? L.markerClusterGroup({ disableClusteringAtZoom: 7 }) : L.layerGroup();

  for (const tr of TRIBES) {
    if (typeof tr?.lat !== "number" || typeof tr?.lng !== "number") continue;

    const name = escapeHtml(tr.name ?? "Nation / Community");

    L.circleMarker([tr.lat, tr.lng], {
      radius: 5,
      fillColor: "#63ff8f",
      color: "#000",
      weight: 1,
      fillOpacity: 0.8,
    })
      .bindPopup(`<strong>${name}</strong>`)
      .addTo(tribesLayer);
  }
  tribesLayer.addTo(map);
}

function initMap() {
  if (!window.L) {
    console.error("Leaflet not loaded. Ensure leaflet.js loads before app.js.");
    return;
  }

  const mapEl = $("map");
  if (!mapEl) {
    console.error("Missing #map element in HTML.");
    return;
  }

  map = L.map(mapEl, { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; CARTO",
  }).addTo(map);

  setupLayers();
  safeMapInvalidate();

  goToChapter(0, { animate: false, scroll: true });

  window.addEventListener("resize", safeMapInvalidate);
  window.addEventListener("orientationchange", () => setTimeout(safeMapInvalidate, 350));
}

/* =========================================================
   Render story + boot
========================================================= */
function renderStory() {
  if (!els.storyBody) return;

  els.storyBody.innerHTML = CHAPTERS.map(
    (c) => `
      <section class="step" data-chapter="${c.id}">
        <h2>${escapeHtml(c.title)}</h2>
        <p>${escapeHtml(String(c.body).trim()).replaceAll("\n", "<br>")}</p>
      </section>
    `
  ).join("");

  // Tap/click a chapter card to jump
  document.querySelectorAll(".step").forEach((stepEl) => {
    stepEl.style.cursor = "pointer";
    stepEl.addEventListener("pointerup", () => {
      const id = stepEl.dataset.chapter;
      const idx = CHAPTERS.findIndex((c) => c.id === id);
      if (idx !== -1) goToChapter(idx, { animate: true, scroll: true });
    });
  });
}

function boot() {
  if (!els.storyBody) {
    console.error("Missing #storyBody element in HTML.");
    return;
  }

  renderStory();
  setupScrollChapters();

  if (els.btnNext) els.btnNext.onclick = () =>
    goToChapter(activeChapterIndex + 1, { animate: true, scroll: true });

  if (els.btnPrev) els.btnPrev.onclick = () =>
    goToChapter(activeChapterIndex - 1, { animate: true, scroll: true });

  setTimeout(initMap, 180);
}

window.addEventListener("load", boot);
