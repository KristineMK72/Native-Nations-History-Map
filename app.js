import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";

// Helper for cleaner DOM selection
const $ = (id) => document.getElementById(id);

// UI Elements
const els = {
  story: $("story"),
  storyBody: $("storyBody"),
  btnToggleStory: $("btnToggleStory"),
  btnPrev: $("btnPrev"),
  btnPlay: $("btnPlay"),
  btnNext: $("btnNext"),
  btnLayers: $("btnLayers"),
  btnLegend: $("btnLegend"),
  btnShare: $("btnShare"),
  btnAbout: $("btnAbout"),
  layersPanel: $("layersPanel"),
  legendPanel: $("legendPanel"),
  toggleTribes: $("toggleTribes"),
  toggleTrails: $("toggleTrails"),
  toggleReservations: $("toggleReservations"),
  toggleAudio: $("toggleAudio"),
  hudChapterTitle: $("hudChapterTitle"),
  hudChapterMeta: $("hudChapterMeta"),
  progressText: $("progressText"),
  progressFill: $("progressFill"),
  modal: $("modal"),
  modalBackdrop: $("modalBackdrop"),
  btnCloseModal: $("btnCloseModal"),
  ambientAudio: $("ambientAudio"),
};

// State Variables
let map;
let activeChapterIndex = 0;
let playing = false;
let playTimer = null;
let trailsLayer;
let tribesLayer;
let reservationsLayer = null;
const trailsById = new Map();

/* ==========================================
   UTIL & STATE MANAGEMENT
   ========================================== */

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clamp(n, a, b) {
  return Math.max(a, Math.min(b, n));
}

function parseURLState() {
  const u = new URL(window.location.href);
  return {
    chapter: u.searchParams.get("chapter"),
    layers: (u.searchParams.get("layers") || "").split(",").filter(Boolean),
  };
}

function writeURLState({ chapterId, layers }) {
  const u = new URL(window.location.href);
  if (chapterId) u.searchParams.set("chapter", chapterId);
  if (layers?.length) u.searchParams.set("layers", layers.join(","));
  else u.searchParams.delete("layers");
  window.history.replaceState({}, "", u.toString());
}

function getEnabledLayersForURL() {
  const layers = [];
  if (els.toggleTribes?.checked) layers.push("tribes");
  if (els.toggleTrails?.checked) layers.push("trails");
  if (els.toggleReservations?.checked) layers.push("reservations");
  return layers;
}

/* ==========================================
   MAP INITIALIZATION
   ========================================== */

function initMap() {
  // Use setTimeout to ensure the browser has finished the layout (grid/flex)
  setTimeout(() => {
    map = L.map("map", { 
      zoomControl: false, 
      preferCanvas: true,
      trackResize: true 
    }).setView([39.5, -98.35], 4);

    // Dark theme tiles
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    // Leaflet Geocoder
    if (L.Control.Geocoder) {
      L.Control.geocoder({
        defaultMarkGeocode: true,
        placeholder: "Search a place…",
      }).addTo(map);
    }

    // Initialize layers
    setupMapLayers();
    
    // CRITICAL: Tell Leaflet the container size has changed after initialization
    map.invalidateSize();

    // Now that map is ready, sync with URL or start at chapter 0
    initFromURL();
  }, 150); // Short delay to allow CSS grid to settle
}

function setupMapLayers() {
  // Historical Trails
  trailsLayer = L.layerGroup();
  for (const t of TRAILS) {
    const line = L.polyline(t.coords, {
      color: t.color,
      weight: t.weight ?? 4,
      opacity: 0.9,
    }).bindPopup(`<strong>${escapeHTML(t.name)}</strong>`);
    trailsLayer.addLayer(line);
    trailsById.set(t.id, line);
  }
  trailsLayer.addTo(map);

  // Tribal Locations (Cluster)
  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 7,
  });

  for (const tr of TRIBES) {
    const marker = L.circleMarker([tr.lat, tr.lng], {
      radius: 5,
      weight: 1,
      color: "rgba(0,0,0,0.5)",
      fillColor: "#63ff8f",
      fillOpacity: 0.8,
    }).bindPopup(`
      <div style="min-width:180px">
        <strong>${escapeHTML(tr.name)}</strong><br/>
        ${tr.state ? `<div style="opacity:.8; font-size:0.9em;">${escapeHTML(tr.state)}</div>` : ""}
        ${tr.link ? `<div style="margin-top:8px"><a href="${tr.link}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `);
    cluster.addLayer(marker);
  }
  tribesLayer = cluster;
  tribesLayer.addTo(map);

  loadReservationsOptional();
  map.on("click", closePanels);
}

async function loadReservationsOptional() {
  try {
    const res = await fetch("./data/reservations.geojson");
    if (!res.ok) return;
    const geojson = await res.json();

    reservationsLayer = L.geoJSON(geojson, {
      style: {
        color: "rgba(200,180,110,0.8)",
        weight: 1,
        fillColor: "rgba(200,180,110,0.3)",
        fillOpacity: 0.3,
      },
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.NAME || feature?.properties?.name || "Reservation";
        layer.bindPopup(`<strong>${escapeHTML(name)}</strong>`);
      },
    });
    // Check if it should be visible based on UI
    if (els.toggleReservations.checked) reservationsLayer.addTo(map);
  } catch (err) {
    console.warn("Reservations GeoJSON not found or invalid.");
  }
}

/* ==========================================
   STORY & UI LOGIC
   ========================================== */

function buildStorySteps() {
  els.storyBody.innerHTML = "";
  CHAPTERS.forEach((c) => {
    const step = document.createElement("section");
    step.className = "step";
    step.dataset.chapter = c.id;

    step.innerHTML = `
      <h2>${escapeHTML(c.title)}</h2>
      <div class="meta">${escapeHTML(c.meta || "")}</div>
      <p>${escapeHTML(c.body || "")}</p>
      ${c.sources?.length ? `<div class="sources">Sources: ${c.sources.map(s => `<a href="${s.href}" target="_blank">${escapeHTML(s.label)}</a>`).join(" • ")}</div>` : ""}
    `;
    els.storyBody.appendChild(step);
  });
}

function flyToChapter(idx, { fromScroll = false } = {}) {
  activeChapterIndex = clamp(idx, 0, CHAPTERS.length - 1);
  const c = CHAPTERS[activeChapterIndex];
  if (!c || !map) return;

  // UI Updates
  document.querySelectorAll(".step").forEach(s => s.classList.toggle("is-active", s.dataset.chapter === c.id));
  els.hudChapterTitle.textContent = c.title;
  els.hudChapterMeta.textContent = c.meta || "";
  els.progressText.textContent = `${activeChapterIndex + 1} / ${CHAPTERS.length}`;
  els.progressFill.style.width = `${((activeChapterIndex + 1) / CHAPTERS.length) * 100}%`;

  // Map Movement
  map.flyTo(c.view.center, c.view.zoom, { duration: 1.8 });

  // Layer Visibility
  if (c.layers) {
    els.toggleTribes.checked = !!c.layers.tribes;
    els.toggleTrails.checked = !!c.layers.trails;
    els.toggleReservations.checked = !!c.layers.reservations;
    syncLayersFromCheckboxes();
  }

  // Highlights
  if (c.highlightTrailId) {
    trailsById.forEach((layer, id) => {
      layer.setStyle({ opacity: id === c.highlightTrailId ? 1.0 : 0.2, weight: id === c.highlightTrailId ? 6 : 3 });
    });
  } else {
    trailsById.forEach(layer => layer.setStyle({ opacity: 0.9, weight: 4 }));
  }

  writeURLState({ chapterId: c.id, layers: getEnabledLayersForURL() });

  if (!fromScroll) {
    const el = document.querySelector(`.step[data-chapter="${c.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function syncLayersFromCheckboxes() {
  if (!map) return;
  if (els.toggleTribes.checked) map.addLayer(tribesLayer); else map.removeLayer(tribesLayer);
  if (els.toggleTrails.checked) map.addLayer(trailsLayer); else map.removeLayer(trailsLayer);
  if (reservationsLayer) {
    if (els.toggleReservations.checked) map.addLayer(reservationsLayer); else map.removeLayer(reservationsLayer);
  }
}

function setupScrollama() {
  const scroller = scrollama();
  scroller
    .setup({ step: ".step", offset: 0.6 })
    .onStepEnter((resp) => {
      const idx = CHAPTERS.findIndex(c => c.id === resp.element.dataset.chapter);
      if (idx !== -1) flyToChapter(idx, { fromScroll: true });
    });
  window.addEventListener("resize", scroller.resize);
}

function setupUI() {
  els.btnPrev.addEventListener("click", () => flyToChapter(activeChapterIndex - 1));
  els.btnNext.addEventListener("click", () => flyToChapter(activeChapterIndex + 1));
  
  els.btnToggleStory.addEventListener("click", () => els.story.classList.toggle("open"));
  
  els.btnLayers.addEventListener("click", (e) => { e.stopPropagation(); els.legendPanel.classList.add("hidden"); els.layersPanel.classList.toggle("hidden"); });
  els.btnLegend.addEventListener("click", (e) => { e.stopPropagation(); els.layersPanel.classList.add("hidden"); els.legendPanel.classList.toggle("hidden"); });
  
  els.toggleTribes.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleTrails.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleReservations.addEventListener("change", syncLayersFromCheckboxes);

  els.btnAbout.addEventListener("click", () => { els.modal.classList.remove("hidden"); els.modalBackdrop.classList.remove("hidden"); });
  els.btnCloseModal.addEventListener("click", () => { els.modal.classList.add("hidden"); els.modalBackdrop.classList.add("hidden"); });
  
  els.btnPlay.addEventListener("click", toggleAutoplay);
}

function toggleAutoplay() {
  playing = !playing;
  els.btnPlay.textContent = playing ? "⏸︎" : "⏯︎";
  if (playing) {
    playTimer = setInterval(() => {
      if (activeChapterIndex >= CHAPTERS.length - 1) { toggleAutoplay(); return; }
      flyToChapter(activeChapterIndex + 1);
    }, 5000);
  } else {
    clearInterval(playTimer);
  }
}

function closePanels() {
  els.layersPanel.classList.add("hidden");
  els.legendPanel.classList.add("hidden");
}

async function initFromURL() {
  const { chapter, layers } = parseURLState();
  if (layers.length) {
    els.toggleTribes.checked = layers.includes("tribes");
    els.toggleTrails.checked = layers.includes("trails");
    els.toggleReservations.checked = layers.includes("reservations");
    syncLayersFromCheckboxes();
  }
  const startIdx = chapter ? CHAPTERS.findIndex(c => c.id === chapter) : 0;
  flyToChapter(startIdx === -1 ? 0 : startIdx);
}

/* ==========================================
   BOOTSTRAP
   ========================================== */

function boot() {
  buildStorySteps();
  setupUI();
  initMap(); 
  setupScrollama();
}

// Ensure the DOM is fully loaded before booting
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
