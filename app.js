import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";

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

let map;
let activeChapterIndex = 0;
let playing = false;
let playTimer = null;

let trailsLayer;
let tribesLayer;
let reservationsLayer = null;
const trailsById = new Map();

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
      ${
        c.sources?.length
          ? `<div class="sources">Sources: ${c.sources
              .map(
                (s) =>
                  `<a href="${s.href}" target="_blank" rel="noopener">${escapeHTML(
                    s.label
                  )}</a>`
              )
              .join(" • ")}</div>`
          : ""
      }
    `;
    els.storyBody.appendChild(step);
  });
}

function setActiveStepUI(chapterId) {
  document.querySelectorAll(".step").forEach((s) => {
    s.classList.toggle("is-active", s.dataset.chapter === chapterId);
  });
}

function updateHUD() {
  const c = CHAPTERS[activeChapterIndex];
  els.hudChapterTitle.textContent = c?.title ?? "—";
  els.hudChapterMeta.textContent = c?.meta ?? "";
  els.progressText.textContent = `${activeChapterIndex + 1} / ${CHAPTERS.length}`;
  els.progressFill.style.width = `${((activeChapterIndex + 1) / CHAPTERS.length) * 100}%`;
}

function closePanels() {
  els.layersPanel.classList.add("hidden");
  els.legendPanel.classList.add("hidden");
}

function togglePanel(panel) {
  panel.classList.toggle("hidden");
}

function stopPlay() {
  playing = false;
  els.btnPlay.textContent = "⏯︎";
  if (playTimer) window.clearInterval(playTimer);
  playTimer = null;
}

function startPlay() {
  playing = true;
  els.btnPlay.textContent = "⏸︎";
  if (playTimer) window.clearInterval(playTimer);

  playTimer = window.setInterval(() => {
    const next = activeChapterIndex + 1;
    if (next >= CHAPTERS.length) {
      stopPlay();
      return;
    }
    flyToChapter(next);
  }, 5200);
}

function highlightTrail(trailId) {
  for (const [id, layer] of trailsById.entries()) {
    layer.setStyle({
      opacity: id === trailId ? 0.98 : 0.25,
      weight: id === trailId ? 5 : 3,
    });
  }
}

function clearTrailHighlight() {
  for (const layer of trailsById.values()) {
    layer.setStyle({ opacity: 0.9, weight: 4 });
  }
}

function syncLayersFromCheckboxes() {
  if (!map) return;

  if (els.toggleTribes.checked) {
    if (!map.hasLayer(tribesLayer)) tribesLayer.addTo(map);
  } else {
    if (map.hasLayer(tribesLayer)) map.removeLayer(tribesLayer);
  }

  if (els.toggleTrails.checked) {
    if (!map.hasLayer(trailsLayer)) trailsLayer.addTo(map);
  } else {
    if (map.hasLayer(trailsLayer)) map.removeLayer(trailsLayer);
  }

  if (reservationsLayer) {
    if (els.toggleReservations.checked) {
      if (!map.hasLayer(reservationsLayer)) reservationsLayer.addTo(map);
    } else {
      if (map.hasLayer(reservationsLayer)) map.removeLayer(reservationsLayer);
    }
  }

  writeURLState({ chapterId: CHAPTERS[activeChapterIndex]?.id, layers: getEnabledLayersForURL() });
}

function applyChapterLayerPrefs(c) {
  if (!c?.layers) return;
  els.toggleTribes.checked = !!c.layers.tribes;
  els.toggleTrails.checked = !!c.layers.trails;
  els.toggleReservations.checked = !!c.layers.reservations;
  syncLayersFromCheckboxes();
}

function flyToChapter(idx, { fromScroll = false } = {}) {
  activeChapterIndex = clamp(idx, 0, CHAPTERS.length - 1);
  const c = CHAPTERS[activeChapterIndex];
  if (!c) return;

  setActiveStepUI(c.id);
  updateHUD();

  map.flyTo(c.view.center, c.view.zoom, { duration: 1.8 });

  applyChapterLayerPrefs(c);

  if (c.highlightTrailId) highlightTrail(c.highlightTrailId);
  else clearTrailHighlight();

  writeURLState({ chapterId: c.id, layers: getEnabledLayersForURL() });

  if (!fromScroll) {
    const el = document.querySelector(`.step[data-chapter="${c.id}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

async function loadReservationsOptional() {
  try {
    const res = await fetch("./data/reservations.geojson", { cache: "no-store" });
    if (!res.ok) return;
    const geojson = await res.json();

    reservationsLayer = L.geoJSON(geojson, {
      style: {
        color: "rgba(200,180,110,0.9)",
        weight: 1,
        fillColor: "rgba(200,180,110,0.35)",
        fillOpacity: 0.35,
      },
      onEachFeature: (feature, layer) => {
        const name = feature?.properties?.NAME || feature?.properties?.name || "Reservation";
        layer.bindPopup(`<strong>${escapeHTML(name)}</strong>`);
      },
    });
  } catch {
    // ignore missing file
  }
}

function setupScrollama() {
  const scroller = scrollama();
  scroller
    .setup({ step: ".step", offset: 0.62 })
    .onStepEnter((resp) => {
      const id = resp.element.dataset.chapter;
      const idx = CHAPTERS.findIndex((c) => c.id === id);
      if (idx !== -1) flyToChapter(idx, { fromScroll: true });
    });

  window.addEventListener("resize", scroller.resize);
}

function openModal() {
  els.modalBackdrop.classList.remove("hidden");
  els.modal.classList.remove("hidden");
  els.modalBackdrop.setAttribute("aria-hidden", "false");
}
function closeModal() {
  els.modalBackdrop.classList.add("hidden");
  els.modal.classList.add("hidden");
  els.modalBackdrop.setAttribute("aria-hidden", "true");
}

function toast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.position = "fixed";
  t.style.left = "50%";
  t.style.bottom = "150px";
  t.style.transform = "translateX(-50%)";
  t.style.padding = "10px 12px";
  t.style.borderRadius = "14px";
  t.style.background = "rgba(15,20,33,0.92)";
  t.style.border = "1px solid rgba(255,255,255,0.10)";
  t.style.boxShadow = "0 16px 50px rgba(0,0,0,0.55)";
  t.style.zIndex = "9999";
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 1400);
}

function initMap() {
  map = L.map("map", { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  L.Control.geocoder({
    defaultMarkGeocode: true,
    placeholder: "Search a place…",
  }).addTo(map);

  // Trails
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

  // Tribes (clustered)
  const cluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 7,
  });

  for (const tr of TRIBES) {
    const marker = L.circleMarker([tr.lat, tr.lng], {
      radius: 4,
      weight: 1,
      color: "rgba(0,0,0,0.5)",
      fillColor: "#63ff8f",
      fillOpacity: 0.78,
    }).bindPopup(`
      <div style="min-width:220px">
        <strong>${escapeHTML(tr.name)}</strong><br/>
        ${tr.state ? `<div style="opacity:.8">${escapeHTML(tr.state)}</div>` : ""}
        ${tr.link ? `<div style="margin-top:8px"><a href="${tr.link}" target="_blank" rel="noopener">Learn more</a></div>` : ""}
      </div>
    `);
    cluster.addLayer(marker);
  }
  tribesLayer = cluster;
  tribesLayer.addTo(map);

  // Optional reservations
  loadReservationsOptional();

  map.on("click", closePanels);
}

function setupUI() {
  els.btnPrev.addEventListener("click", () => flyToChapter(activeChapterIndex - 1));
  els.btnNext.addEventListener("click", () => flyToChapter(activeChapterIndex + 1));
  els.btnPlay.addEventListener("click", () => (playing ? stopPlay() : startPlay()));

  els.btnLayers.addEventListener("click", (e) => {
    e.stopPropagation();
    els.legendPanel.classList.add("hidden");
    togglePanel(els.layersPanel);
  });
  els.btnLegend.addEventListener("click", (e) => {
    e.stopPropagation();
    els.layersPanel.classList.add("hidden");
    togglePanel(els.legendPanel);
  });

  els.btnToggleStory.addEventListener("click", () => els.story.classList.toggle("open"));

  els.toggleTribes.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleTrails.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleReservations.addEventListener("change", syncLayersFromCheckboxes);

  els.toggleAudio.addEventListener("change", async () => {
    try {
      if (els.toggleAudio.checked) await els.ambientAudio.play();
      else els.ambientAudio.pause();
    } catch {
      els.toggleAudio.checked = false;
      toast("Audio blocked by browser. Tap again after interacting.");
    }
  });

  els.btnAbout.addEventListener("click", openModal);
  els.btnCloseModal.addEventListener("click", closeModal);
  els.modalBackdrop.addEventListener("click", closeModal);

  els.btnShare.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast("Link copied!");
    } catch {
      toast("Copy failed — manually copy the URL.");
    }
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") flyToChapter(activeChapterIndex + 1);
    if (e.key === "ArrowLeft") flyToChapter(activeChapterIndex - 1);
    if (e.key.toLowerCase() === "l") {
      els.legendPanel.classList.add("hidden");
      togglePanel(els.layersPanel);
    }
  });
}

async function initFromURL() {
  const { chapter, layers } = parseURLState();

  if (layers.length) {
    els.toggleTribes.checked = layers.includes("tribes");
    els.toggleTrails.checked = layers.includes("trails");
    els.toggleReservations.checked = layers.includes("reservations");
  }

  syncLayersFromCheckboxes();

  if (chapter) {
    const idx = CHAPTERS.findIndex((c) => c.id === chapter);
    if (idx !== -1) {
      setTimeout(() => flyToChapter(idx), 60);
      return;
    }
  }

  flyToChapter(0);
}

function boot() {
  buildStorySteps();
  initMap();
  setupUI();
  setupScrollama();
  updateHUD();
  initFromURL();
}

boot();
