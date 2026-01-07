// /app.js
import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";
import { PLACES } from "./data/places.js";

const $ = (id) => document.getElementById(id);

const els = {
  storyBody: $("storyBody"),
  btnPrev: $("btnPrev"),
  btnNext: $("btnNext"),
  hudChapterTitle: $("hudChapterTitle"),
  progressText: $("progressText"),
  progressFill: $("progressFill"),
};

let map;
let trailsLayer, tribesLayer, placesLayer;
let activeChapterIndex = 0;
let lastChapterId = null;

// Optional highlighting if TRAILS objects have ids
let trailPolylinesById = new Map();

/* ---------------------------
   Small helpers
----------------------------*/
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

/* ---------------------------
   Layer visibility + highlights
----------------------------*/
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

function clearTrailHighlights() {
  for (const poly of trailPolylinesById.values()) {
    poly.setStyle({ weight: 4, opacity: 0.8 });
  }
}

function highlightTrails(ids) {
  for (const poly of trailPolylinesById.values()) {
    poly.setStyle({ weight: 4, opacity: 0.25 });
  }
  for (const id of ids) {
    const poly = trailPolylinesById.get(id);
    if (poly) poly.setStyle({ weight: 7, opacity: 0.95 });
  }
}

function applyChapterLayers(chapter) {
  // Because chapters ALWAYS define layers in our design,
  // the experience is consistent and intentional.
  const l = chapter.layers || {};
  setLayerVisible(trailsLayer, !!l.trails);
  setLayerVisible(tribesLayer, !!l.tribes);
  setLayerVisible(placesLayer, !!l.places);

  if (chapter.highlight?.trailIds) highlightTrails(chapter.highlight.trailIds);
  else clearTrailHighlights();
}

/* ---------------------------
   HUD + chapter navigation
----------------------------*/
function updateHUD() {
  const c = CHAPTERS[activeChapterIndex];
  setText(els.hudChapterTitle, c?.title ?? "Chapter");
  setText(els.progressText, `${activeChapterIndex + 1} / ${CHAPTERS.length}`);
  setWidth(els.progressFill, ((activeChapterIndex + 1) / CHAPTERS.length) * 100);
}

function goToChapter(idx, { animate = true } = {}) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];

  updateHUD();
  applyChapterLayers(c);

  if (!map || !c?.view?.center) return;
  const zoom = typeof c.view.zoom === "number" ? c.view.zoom : map.getZoom();

  if (animate) map.flyTo(c.view.center, zoom, { duration: 1.8 });
  else map.setView(c.view.center, zoom);
}

function onChapterEnter(chapterId) {
  if (chapterId === lastChapterId) return;
  lastChapterId = chapterId;

  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  if (idx === -1) return;

  const stepEl = document.querySelector(`.step[data-chapter="${chapterId}"]`);
  setActiveStep(stepEl);
  goToChapter(idx);
}

/* ---------------------------
   Scroll-driven chapters
----------------------------*/
function setupScrollChapters() {
  const steps = Array.from(document.querySelectorAll(".step"));
  if (!steps.length) return;

  const root = els.storyBody || null;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible?.target?.dataset?.chapter) {
        onChapterEnter(visible.target.dataset.chapter);
      }
    },
    {
      root,
      threshold: [0.25, 0.5, 0.75],
      rootMargin: "-40% 0px -40% 0px",
    }
  );

  steps.forEach((s) => io.observe(s));
}

/* ---------------------------
   Map + layers
----------------------------*/
function setupLayers() {
  // Trails
  trailsLayer = L.layerGroup();
  trailPolylinesById = new Map();

  for (const t of TRAILS) {
    if (!t?.coords?.length) continue;

    const poly = L.polyline(t.coords, {
      color: t.color || "#5dade2",
      weight: 4,
      opacity: 0.8,
    });

    if (t.name) poly.bindPopup(`<strong>${t.name}</strong>`);
    poly.addTo(trailsLayer);

    if (t.id) trailPolylinesById.set(t.id, poly);
  }
  trailsLayer.addTo(map);

  // Places
  placesLayer = L.layerGroup();
  for (const p of PLACES) {
    if (typeof p?.lat !== "number" || typeof p?.lng !== "number") continue;

    L.circleMarker([p.lat, p.lng], {
      radius: 7,
      fillColor: "#ff9f43",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9,
    })
      .bindPopup(`<strong>${p.name ?? "Place"}</strong><p>${p.body ?? ""}</p>`)
      .addTo(placesLayer);
  }
  placesLayer.addTo(map);

  // Tribes (cluster if available; fallback if not)
  const hasCluster = typeof L.markerClusterGroup === "function";
  tribesLayer = hasCluster ? L.markerClusterGroup({ disableClusteringAtZoom: 7 }) : L.layerGroup();

  for (const tr of TRIBES) {
    if (typeof tr?.lat !== "number" || typeof tr?.lng !== "number") continue;

    L.circleMarker([tr.lat, tr.lng], {
      radius: 5,
      fillColor: "#63ff8f",
      color: "#000",
      weight: 1,
      fillOpacity: 0.8,
    })
      .bindPopup(`<strong>${tr.name ?? "Nation / Community"}</strong>`)
      .addTo(tribesLayer);
  }
  tribesLayer.addTo(map);
}

function initMap() {
  if (!window.L) {
    console.error("Leaflet not loaded. Ensure leaflet.js loads before app.js.");
    return;
  }
  if (!$("map")) {
    console.error("Missing #map element in HTML.");
    return;
  }

  map = L.map("map", { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; CARTO",
  }).addTo(map);

  setupLayers();
  safeMapInvalidate();

  // Start at Chapter 1 (Begin) with no animation
  goToChapter(0, { animate: false });

  // Keep Leaflet happy on mobile rotation/resizes
  window.addEventListener("resize", safeMapInvalidate);
  window.addEventListener("orientationchange", () => setTimeout(safeMapInvalidate, 350));
}

/* ---------------------------
   Render story + boot
----------------------------*/
function renderStory() {
  if (!els.storyBody) return;

  els.storyBody.innerHTML = CHAPTERS.map(
    (c) => `
      <section class="step" data-chapter="${c.id}">
        <h2>${c.title}</h2>
        <p>${String(c.body).trim()}</p>
      </section>
    `
  ).join("");
}

function boot() {
  if (!els.storyBody) {
    console.error("Missing #storyBody element in HTML.");
    return;
  }

  renderStory();
  setupScrollChapters();

  if (els.btnNext) els.btnNext.onclick = () => goToChapter(activeChapterIndex + 1);
  if (els.btnPrev) els.btnPrev.onclick = () => goToChapter(activeChapterIndex - 1);

  // Let layout paint before Leaflet measures size
  setTimeout(initMap, 180);
}

window.addEventListener("load", boot);
