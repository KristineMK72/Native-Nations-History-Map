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
let activeChapterIndex = 0;

function initMap() {
  if (!window.L) {
    console.error("Leaflet not loaded");
    return;
  }

  const mapEl = $("map");
  if (!mapEl) {
    console.error("#map missing");
    return;
  }

  map = L.map(mapEl, {
    zoomControl: false,
    preferCanvas: true,
  }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; CARTO",
  }).addTo(map);

  setupLayers();

  // 🔑 force size recalculation multiple times
  requestAnimationFrame(() => map.invalidateSize());
  setTimeout(() => map.invalidateSize(), 300);
  setTimeout(() => map.invalidateSize(), 800);

  flyToChapter(0);
}

function setupLayers() {
  L.layerGroup(
    TRAILS.map(t =>
      L.polyline(t.coords, { color: t.color || "#5dade2", weight: 4 })
    )
  ).addTo(map);

  L.layerGroup(
    PLACES.map(p =>
      L.circleMarker([p.lat, p.lng], {
        radius: 7,
        fillColor: "#ff9f43",
        color: "#fff",
        fillOpacity: 0.9,
      }).bindPopup(`<strong>${p.name}</strong>`)
    )
  ).addTo(map);

  const tribesLayer =
    typeof L.markerClusterGroup === "function"
      ? L.markerClusterGroup({ disableClusteringAtZoom: 7 })
      : L.layerGroup();

  TRIBES.forEach(tr =>
    L.circleMarker([tr.lat, tr.lng], {
      radius: 5,
      fillColor: "#63ff8f",
      color: "#000",
      fillOpacity: 0.8,
    }).bindPopup(`<strong>${tr.name}</strong>`).addTo(tribesLayer)
  );

  tribesLayer.addTo(map);
}

function flyToChapter(idx) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];

  if (els.hudChapterTitle) els.hudChapterTitle.textContent = c.title;
  if (els.progressText) els.progressText.textContent = `${idx + 1} / ${CHAPTERS.length}`;
  if (els.progressFill) els.progressFill.style.width = `${((idx + 1) / CHAPTERS.length) * 100}%`;

  map.flyTo(c.view.center, c.view.zoom, { duration: 2 });
}

function boot() {
  if (!els.storyBody) return;

  els.storyBody.innerHTML = CHAPTERS.map(
    c => `<section class="step"><h2>${c.title}</h2><p>${c.body}</p></section>`
  ).join("");

  if (els.btnNext) els.btnNext.onclick = () => flyToChapter(activeChapterIndex + 1);
  if (els.btnPrev) els.btnPrev.onclick = () => flyToChapter(activeChapterIndex - 1);

  // 🔑 wait for mobile layout + orientation
  setTimeout(initMap, 200);
}

window.addEventListener("load", boot);
window.addEventListener("orientationchange", () => {
  if (map) setTimeout(() => map.invalidateSize(), 400);
});
window.addEventListener("resize", () => {
  if (map) map.invalidateSize();
});
