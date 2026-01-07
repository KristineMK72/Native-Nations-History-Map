import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";
import { PLACES } from "./data/places.js";

const $ = (id) => document.getElementById(id);

const els = {
  story: $("story"),
  storyBody: $("storyBody"),
  btnPrev: $("btnPrev"),
  btnNext: $("btnNext"),
  toggleTribes: $("toggleTribes"),
  toggleTrails: $("toggleTrails"),
  togglePlaces: $("togglePlaces"),
  hudChapterTitle: $("hudChapterTitle"),
  progressText: $("progressText"),
  progressFill: $("progressFill"),
  map: $("map")
};

let map, trailsLayer, tribesLayer, placesLayer;
let activeChapterIndex = 0;

function initMap() {
  // Delay ensures CSS transitions and grid layouts are finished painting
  setTimeout(() => {
    map = L.map("map", { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; CARTO"
    }).addTo(map);

    setupLayers();
    
    // Critical: Force Leaflet to detect the container size
    map.invalidateSize();
    // Second check for slower mobile browsers
    setTimeout(() => map.invalidateSize(), 500);
  }, 300);
}

function setupLayers() {
  trailsLayer = L.layerGroup();
  TRAILS.forEach(t => {
    L.polyline(t.coords, { color: t.color, weight: 4, opacity: 0.8 }).addTo(trailsLayer);
  });
  trailsLayer.addTo(map);

  placesLayer = L.layerGroup();
  PLACES.forEach(p => {
    L.circleMarker([p.lat, p.lng], { radius: 7, fillColor: "#ff9f43", color: "#fff", weight: 2, fillOpacity: 0.9 })
     .bindPopup(`<strong>${p.name}</strong><p>${p.body}</p>`)
     .addTo(placesLayer);
  });
  placesLayer.addTo(map);

  tribesLayer = L.markerClusterGroup({ disableClusteringAtZoom: 7 });
  TRIBES.forEach(tr => {
    L.circleMarker([tr.lat, tr.lng], { radius: 5, fillColor: "#63ff8f", color: "#000", weight: 1, fillOpacity: 0.8 })
     .bindPopup(`<strong>${tr.name}</strong>`)
     .addTo(tribesLayer);
  });
  tribesLayer.addTo(map);
}

function flyToChapter(idx) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];
  
  els.hudChapterTitle.textContent = c.title;
  els.progressText.textContent = `${activeChapterIndex + 1} / ${CHAPTERS.length}`;
  els.progressFill.style.width = `${((activeChapterIndex + 1) / CHAPTERS.length) * 100}%`;

  map.flyTo(c.view.center, c.view.zoom, { duration: 2 });
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
  
  initMap();
}

window.onload = boot;
