import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";
import { PLACES } from "./data/places.js"; // New Data Source

const $ = (id) => document.getElementById(id);

const els = {
  story: $("story"),
  storyBody: $("storyBody"),
  btnToggleStory: $("btnToggleStory"),
  btnPrev: $("btnPrev"),
  btnPlay: $("btnPlay"),
  btnNext: $("btnNext"),
  btnLayers: $("btnLayers"),
  btnLegend: $("btnLegend"),
  layersPanel: $("layersPanel"),
  legendPanel: $("legendPanel"),
  toggleTribes: $("toggleTribes"),
  toggleTrails: $("toggleTrails"),
  togglePlaces: $("togglePlaces"), // New Toggle
  toggleReservations: $("toggleReservations"),
  hudChapterTitle: $("hudChapterTitle"),
  hudChapterMeta: $("hudChapterMeta"),
  progressText: $("progressText"),
  progressFill: $("progressFill"),
  map: $("map")
};

let map, trailsLayer, tribesLayer, placesLayer, reservationsLayer;
let activeChapterIndex = 0;
const trailsById = new Map();

/* ==========================================
   MAP & LAYER SETUP
   ========================================== */

function initMap() {
  setTimeout(() => {
    map = L.map("map", { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; CARTO"
    }).addTo(map);

    setupLayers();
    map.invalidateSize();
    initFromURL();
  }, 150);
}

function setupLayers() {
  // 1. IMPROVED TRAILS
  trailsLayer = L.layerGroup();
  TRAILS.forEach(t => {
    const line = L.polyline(t.coords, {
      color: t.color,
      weight: 4,
      opacity: 0.8,
      dashArray: t.id.includes('migration') ? "10, 10" : null // Dashed for migration
    }).bindPopup(`<strong>${t.name}</strong>`);
    trailsLayer.addLayer(line);
    trailsById.set(t.id, line);
  });
  trailsLayer.addTo(map);

  // 2. HISTORICAL PLACES & ORIGINS
  placesLayer = L.layerGroup();
  PLACES.forEach(p => {
    L.circleMarker([p.lat, p.lng], {
      radius: 7,
      fillColor: "#ff9f43",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9
    })
    .bindPopup(`<strong>${p.name}</strong><br><small>${p.type}</small><p>${p.body}</p>`)
    .addTo(placesLayer);
  });
  placesLayer.addTo(map);

  // 3. TRIBES (Clustered)
  tribesLayer = L.markerClusterGroup({ disableClusteringAtZoom: 7 });
  TRIBES.forEach(tr => {
    L.circleMarker([tr.lat, tr.lng], { radius: 5, fillColor: "#63ff8f", color: "#000", weight: 1, fillOpacity: 0.8 })
     .bindPopup(`<strong>${tr.name}</strong>`)
     .addTo(tribesLayer);
  });
  tribesLayer.addTo(map);
}

/* ==========================================
   STORY LOGIC
   ========================================== */

function flyToChapter(idx) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];
  
  // UI Updates
  document.querySelectorAll(".step").forEach(s => s.classList.toggle("is-active", s.dataset.chapter === c.id));
  els.hudChapterTitle.textContent = c.title;
  els.progressText.textContent = `${activeChapterIndex + 1} / ${CHAPTERS.length}`;
  els.progressFill.style.width = `${((activeChapterIndex + 1) / CHAPTERS.length) * 100}%`;

  // Map Movement
  map.flyTo(c.view.center, c.view.zoom, { duration: 2 });

  // Trail Highlighting
  trailsById.forEach((layer, id) => {
    layer.setStyle({ opacity: id === c.highlightTrailId ? 1 : 0.2 });
  });
}

function syncLayers() {
  if (els.toggleTribes.checked) map.addLayer(tribesLayer); else map.removeLayer(tribesLayer);
  if (els.toggleTrails.checked) map.addLayer(trailsLayer); else map.removeLayer(trailsLayer);
  if (els.togglePlaces.checked) map.addLayer(placesLayer); else map.removeLayer(placesLayer);
}

function boot() {
  els.storyBody.innerHTML = CHAPTERS.map(c => `
    <section class="step" data-chapter="${c.id}">
      <h2>${c.title}</h2>
      <p>${c.body}</p>
    </section>
  `).join("");

  els.btnNext.onclick = () => flyToChapter(activeChapterIndex + 1);
  els.btnPrev.onclick = () => flyToChapter(activeChapterIndex - 1);
  els.toggleTribes.onchange = els.toggleTrails.onchange = els.togglePlaces.onchange = syncLayers;

  initMap();
}

window.onload = boot;
