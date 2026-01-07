import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
import { TRIBES } from "./data/tribes.js";

/**
 * If your new index uses different IDs, edit them HERE.
 */
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

function assertEl(name, el) {
  if (!el) console.warn(`Missing element #${name}. Update selectors in app.js or add it to index.html.`);
}
Object.entries(els).forEach(([k, v]) => assertEl(k, v));

const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function escapeHTML(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
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

// layers
let trailsLayer;
let tribesLayer; // markercluster group
let reservationsLayer = null; // optional geojson
let trailsById = new Map();

function buildStorySteps() {
  if (!els.storyBody) return;
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
  const steps = [...document.querySelectorAll(".step")];
  for (const s of steps) {
    s.classList.toggle("is-active", s.dataset.chapter === chapterId);
  }
}

function updateHUD() {
  const c = CHAPTERS[activeChapterIndex];
  if (els.hudChapterTitle) els.hudChapterTitle.textContent = c?.title ?? "—";
  if (els.hudChapterMeta) els.hudChapterMeta.textContent = c?.meta ?? "";
  if (els.progressText) els.progressText.textContent = `${activeChapterIndex + 1} / ${CHAPTERS.length}`;
  if (els.progressFill) els.progressFill.style.width = `${((activeChapterIndex + 1) / CHAPTERS.length) * 100}%`;
}

function closePanels() {
  els.layersPanel?.classList.add("hidden");
  els.legendPanel?.classList.add("hidden");
}

function togglePanel(panel) {
  if (!panel) return;
  panel.classList.toggle("hidden");
}

function stopPlay() {
  playing = false;
  if (els.btnPlay) els.btnPlay.textContent = "⏯︎";
  if (playTimer) window.clearInterval(playTimer);
  playTimer = null;
}

function startPlay() {
  playing = true;
  if (els.btnPlay) els.btnPlay.textContent = "⏸︎";
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

function applyChapterLayerPrefs(chapter) {
  if (!chapter?.layers) return;

  if (els.toggleTribes) els.toggleTribes.checked = !!chapter.layers.tribes;
  if (els.toggleTrails) els.toggleTrails.checked = !!chapter.layers.trails;
  if (els.toggleReservations) els.toggleReservations.checked = !!chapter.layers.reservations;

  syncLayersFromCheckboxes();
}

function highlightTrail(trailId) {
  if (!trailId) return;

  // Dim all trails slightly, highlight one
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

function flyToChapter(idx, { fromScroll = false } = {}) {
  activeChapterIndex = clamp(idx, 0, CHAPTERS.length - 1);
  const c = CHAPTERS[activeChapterIndex];
  if (!c) return;

  stopPlay(); // user-driven nav cancels autoplay
  setActiveStepUI(c.id);
  updateHUD();

  if (map) {
    map.flyTo(c.view.center, c.view.zoom, { duration: 1.8 });
  }

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
  // optional file: /data/reservations.geojson
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
        const name =
          feature?.properties?.NAME ||
          feature?.properties?.name ||
          "Reservation";
        layer.bindPopup(`<strong>${escapeHTML(name)}</strong>`);
      },
    });
  } catch {
    // ignore missing file
  }
}

function syncLayersFromCheckboxes() {
  if (!map) return;

  // Tribes
  if (els.toggleTribes?.checked) {
    if (!map.hasLayer(tribesLayer)) tribesLayer.addTo(map);
  } else {
    if (map.hasLayer(tribesLayer)) map.removeLayer(tribesLayer);
  }

  // Trails
  if (els.toggleTrails?.checked) {
    if (!map.hasLayer(trailsLayer)) trailsLayer.addTo(map);
  } else {
    if (map.hasLayer(trailsLayer)) map.removeLayer(trailsLayer);
  }

  // Reservations
  if (reservationsLayer) {
    if (els.toggleReservations?.checked) {
      if (!map.hasLayer(reservationsLayer)) reservationsLayer.addTo(map);
    } else {
      if (map.hasLayer(reservationsLayer)) map.removeLayer(reservationsLayer);
    }
  }

  writeURLState({ chapterId: CHAPTERS[activeChapterIndex]?.id, layers: getEnabledLayersForURL() });
}

function setupScrollama() {
  const scroller = scrollama();
  scroller
    .setup({ step: ".step", offset: 0.62 })
    .onStepEnter((resp) => {
      const id = resp.element.dataset.chapter;
      const idx = CHAPTERS.findIndex((c) => c.id === id);
      if (idx !== -1) {
        // Don’t stop autoplay when autoplay is active and scroll triggers
        flyToChapter(idx, { fromScroll: true });
      }
    });

  window.addEventListener("resize", scroller.resize);
}

function openModal() {
  els.modalBackdrop?.classList.remove("hidden");
  els.modal?.classList.remove("hidden");
  els.modalBackdrop?.setAttribute("aria-hidden", "false");
}
function closeModal() {
  els.modalBackdrop?.classList.add("hidden");
  els.modal?.classList.add("hidden");
  els.modalBackdrop?.setAttribute("aria-hidden", "true");
}

function toast(msg) {
  const wrap = document.body;
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
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 1500);
}

function initMap() {
  map = L.map("map", { zoomControl: false, preferCanvas: true }).setView([39.5, -98.35], 4);

  // Dark basemap
  L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
  }).addTo(map);

  L.control.zoom({ position: "bottomright" }).addTo(map);

  // Search (nice “app” feel)
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

  // Tribes cluster
  const tribeCluster = L.markerClusterGroup({
    showCoverageOnHover: false,
    spiderfyOnMaxZoom: true,
    disableClusteringAtZoom: 7,
  });

  for (const tr of TRIBES) {
    const m = L.circleMarker([tr.lat, tr.lng], {
      radius: 4,
      weight: 1,
      color: "rgba(0,0,0,0.5)",
      fillColor: "#63ff8f",
      fillOpacity: 0.78,
    }).bindPopup(`
      <div style="min-width:220px">
        <strong>${escapeHTML(tr.name)}</strong><br/>
        ${tr.state ? `<div style="opacity:.8">${escapeHTML(tr.state)}</div>` : ""}
        ${
          tr.link
            ? `<div style="margin-top:8px"><a href="${tr.link}" target="_blank" rel="noopener">Learn more</a></div>`
            : ""
        }
      </div>
    `);
    tribeCluster.addLayer(m);
  }

  tribesLayer = tribeCluster;

  // Add defaults
  trailsLayer.addTo(map);
  tribesLayer.addTo(map);

  loadReservationsOptional(); // optional file

  // close panels on map click
  map.on("click", closePanels);
}

function setupUI() {
  els.btnPrev?.addEventListener("click", () => flyToChapter(activeChapterIndex - 1));
  els.btnNext?.addEventListener("click", () => flyToChapter(activeChapterIndex + 1));
  els.btnPlay?.addEventListener("click", () => (playing ? stopPlay() : startPlay()));

  els.btnLayers?.addEventListener("click", (e) => {
    e.stopPropagation();
    els.legendPanel?.classList.add("hidden");
    togglePanel(els.layersPanel);
  });
  els.btnLegend?.addEventListener("click", (e) => {
    e.stopPropagation();
    els.layersPanel?.classList.add("hidden");
    togglePanel(els.legendPanel);
  });

  els.btnToggleStory?.addEventListener("click", () => els.story?.classList.toggle("open"));

  els.toggleTribes?.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleTrails?.addEventListener("change", syncLayersFromCheckboxes);
  els.toggleReservations?.addEventListener("change", syncLayersFromCheckboxes);

  els.toggleAudio?.addEventListener("change", async () => {
    try {
      if (!els.ambientAudio) return;
      if (els.toggleAudio.checked) await els.ambientAudio.play();
      else els.ambientAudio.pause();
    } catch {
      els.toggleAudio.checked = false;
      toast("Audio blocked by browser. Tap again after interacting.");
    }
  });

  els.btnAbout?.addEventListener("click", openModal);
  els.btnCloseModal?.addEventListener("click", closeModal);
  els.modalBackdrop?.addEventListener("click", closeModal);

  els.btnShare?.addEventListener("click", async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied!");
    } catch {
      toast("Copy failed — manually copy the URL.");
    }
  });

  // Keyboard shortcuts
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") flyToChapter(activeChapterIndex + 1);
    if (e.key === "ArrowLeft") flyToChapter(activeChapterIndex - 1);
    if (e.key.toLowerCase() === "l") {
      els.legendPanel?.classList.add("hidden");
      togglePanel(els.layersPanel);
    }
  });
}

async function initFromURL() {
  const { chapter, layers } = parseURLState();

  if (layers.length) {
    if (els.toggleTribes) els.toggleTribes.checked = layers.includes("tribes");
    if (els.toggleTrails) els.toggleTrails.checked = layers.includes("trails");
    if (els.toggleReservations) els.toggleReservations.checked = layers.includes("reservations");
  }

  syncLayersFromCheckboxes();

  if (chapter) {
    const idx = CHAPTERS.findIndex((c) => c.id === chapter);
    if (idx !== -1) {
      await sleep(60);
      flyToChapter(idx);
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
