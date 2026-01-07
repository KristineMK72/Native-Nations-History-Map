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
  sourceList: $("sourceList"), // optional if you add it in HTML
};

let map;
let trailsLayer, tribesLayer, placesLayer;
let activeChapterIndex = 0;
let lastChapterId = null;

// Optional highlight support if your TRAILS have ids
let trailPolylinesById = new Map();

function setText(el, txt) {
  if (el) el.textContent = txt;
}

function setWidth(el, pct) {
  if (el) el.style.width = `${pct}%`;
}

function setLayerVisible(layer, visible) {
  if (!layer || !map) return;
  const onMap = map.hasLayer(layer);
  if (visible && !onMap) layer.addTo(map);
  if (!visible && onMap) map.removeLayer(layer);
}

function setActiveStep(stepEl) {
  document.querySelectorAll(".step").forEach((s) => s.classList.remove("active"));
  if (stepEl) stepEl.classList.add("active");
}

function renderSources(chapter) {
  if (!els.sourceList) return;
  const sources = chapter.sources || [];
  if (!sources.length) {
    els.sourceList.innerHTML = "";
    return;
  }

  els.sourceList.innerHTML = sources
    .map((s) => {
      const safeLabel = (s.label || "Source").replaceAll("<", "&lt;");
      const url = (s.url || "").trim();
      if (!url) return `<li>${safeLabel}</li>`;
      return `<li><a href="${url}" target="_blank" rel="noreferrer noopener">${safeLabel}</a></li>`;
    })
    .join("");
}

function applyChapterLayers(chapter) {
  const l = chapter.layers || {};
  setLayerVisible(trailsLayer, !!l.trails);
  setLayerVisible(tribesLayer, !!l.tribes);
  setLayerVisible(placesLayer, !!l.places);

  if (chapter.highlight?.trailIds) highlightTrails(chapter.highlight.trailIds);
  else clearTrailHighlights();
}

function highlightTrails(ids) {
  // Only works if TRAILS include id and we stored polylines by id
  for (const [id, poly] of trailPolylinesById.entries()) {
    poly.setStyle({ weight: 4, opacity: 0.35 });
  }
  ids.forEach((id) => {
    const poly = trailPolylinesById.get(id);
    if (poly) poly.setStyle({ weight: 7, opacity: 0.9 });
  });
}

function clearTrailHighlights() {
  for (const poly of trailPolylinesById.values()) {
    poly.setStyle({ weight: 4, opacity: 0.8 });
  }
}

function updateHUD() {
  const c = CHAPTERS[activeChapterIndex];
  setText(els.hudChapterTitle, c?.title || "Chapter");
  setText(els.progressText, `${activeChapterIndex + 1} / ${CHAPTERS.length}`);
  setWidth(els.progressFill, ((activeChapterIndex + 1) / CHAPTERS.length) * 100);
  renderSources(c);
}

function flyToChapter(idx, { animate = true } = {}) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];

  updateHUD();
  applyChapterLayers(c);

  const center = c?.view?.center;
  const zoom = c?.view?.zoom;

  if (map && center && typeof zoom === "number") {
    if (animate) map.flyTo(center, zoom, { duration: 1.8 });
    else map.setView(center, zoom);
  }
}

function onChapterEnter(chapterId) {
  const idx = CHAPTERS.findIndex((c) => c.id === chapterId);
  if (idx === -1) return;
  if (chapterId === lastChapterId) return;
  lastChapterId = chapterId;

  const stepEl = document.querySelector(`.step[data-chapter="${chapterId}"]`);
  setActiveStep(stepEl);
  flyToChapter(idx);
}

function setupScrollChapters() {
  const steps = Array.from(document.querySelectorAll(".step"));
  if (!steps.length) return;

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
      root: els.storyBody || null,
      threshold: [0.25, 0.5, 0.75],
      // “activation band” — feels like scrollytelling
      rootMargin: "-40% 0px -40% 0px",
    }
  );

  steps.forEach((s) => io.observe(s));
}

function initMap() {
  if (!window.L) {
    console.error("Leaflet (window.L) not found. Make sure leaflet.js loads before app.js.");
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

  // Mobile-safe sizing
  requestAnimationFrame(() => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 300);
  setTimeout(() => map.invalidateSize(), 800);

  // Start at first chapter
  flyToChapter(0, { animate: false });
}

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
    }).addTo(trailsLayer);

    if (t.id) trailPolylinesById.set(t.id, poly);
    if (t.name) poly.bindPopup(`<strong>${t.name}</strong>`);
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

  // Tribes (cluster if available)
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

function renderStory() {
  if (!els.storyBody) return;

  els.storyBody.innerHTML = CHAPTERS.map(
    (c) => `
      <section class="step" data-chapter="${c.id}">
        <h2>${c.title}</h2>
        <p>${String(c.body).trim().replace(/\n\s*\n/g, "\n\n")}</p>
      </section>
    `
  ).join("");
}

function boot() {
  if (!els.storyBody) {
    console.error("Missing #storyBody. Check your HTML.");
    return;
  }

  renderStory();
  setupScrollChapters();

  if (els.btnNext) els.btnNext.onclick = () => flyToChapter(activeChapterIndex + 1);
  if (els.btnPrev) els.btnPrev.onclick = () => flyToChapter(activeChapterIndex - 1);

  // Let layout paint before Leaflet measures
  setTimeout(initMap, 180);
}

window.addEventListener("load", boot);
window.addEventListener("resize", () => map && map.invalidateSize());
window.addEventListener("orientationchange", () => map && setTimeout(() => map.invalidateSize(), 400));
