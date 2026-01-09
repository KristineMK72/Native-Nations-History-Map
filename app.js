import { CHAPTERS } from "./data/chapters.js";
import { TRAILS } from "./data/trails.js";
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
let placesLayer = null;
let tribesLayer = null;

// State
let activeChapterIndex = 0;
let lastChapterId = null;
let ignoreScrollUntil = 0;

// Highlights
let regionPolygonsById = new Map();
let trailPolylinesById = new Map();

// Tribes lazy-load state
let tribesBuilt = false;
let tribesLoading = false;

/* =========================================================
   BIA Tribal Leaders Directory (ArcGIS FeatureServer)
========================================================= */
const TRIBAL_LEADERS_FS =
  "https://services1.arcgis.com/UxqqIfhng71wUT9x/arcgis/rest/services/TribalLeadership_Directory/FeatureServer/0";

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

function setLayerVisible(layer, visible) {
  if (!map || !layer) return;
  const onMap = map.hasLayer(layer);
  if (visible && !onMap) layer.addTo(map);
  if (!visible && onMap) map.removeLayer(layer);
}

function nl2brSafe(text) {
  return escapeHtml(String(text ?? "")).replaceAll("\n", "<br>");
}

/* =========================================================
   ArcGIS fetch helpers (GeoJSON pagination)
========================================================= */
async function fetchArcGisGeoJsonAll(urlBase, { where = "1=1", outFields = "*", pageSize = 2000 } = {}) {
  const features = [];
  let offset = 0;

  while (true) {
    const url =
      `${urlBase}/query?` +
      new URLSearchParams({
        f: "geojson",
        where,
        outFields,
        returnGeometry: "true",
        outSR: "4326",
        resultOffset: String(offset),
        resultRecordCount: String(pageSize),
      });

    const res = await fetch(url);
    if (!res.ok) throw new Error(`ArcGIS query failed: ${res.status}`);
    const gj = await res.json();

    const batch = gj?.features || [];
    features.push(...batch);

    if (batch.length < pageSize) break;
    offset += pageSize;
  }

  return { type: "FeatureCollection", features };
}

/* =========================================================
   Popup helpers
========================================================= */
function renderSources(sources = []) {
  if (!Array.isArray(sources) || !sources.length) return "";
  const items = sources
    .filter((s) => s?.href && s?.label)
    .map(
      (s) =>
        `<a href="${escapeHtml(s.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(s.label)}</a>`
    );
  if (!items.length) return "";
  return `
    <div class="popup-sources">
      <div class="popup-label">Sources</div>
      <div class="popup-links">${items.join(" · ")}</div>
    </div>
  `;
}

function renderImage(image) {
  if (!image?.src) return "";
  const alt = escapeHtml(image.alt || "");
  const credit = escapeHtml(image.credit || "");
  const license = escapeHtml(image.license || "");
  const href = image.href ? escapeHtml(image.href) : "";
  const creditLine = [credit, license].filter(Boolean).join(" • ");

  return `
    <div class="popup-image">
      <img class="popup-img" src="${escapeHtml(image.src)}" alt="${alt}" loading="lazy" referrerpolicy="no-referrer" />
      ${
        creditLine
          ? `<div class="popup-credit">
              ${href ? `<a href="${href}" target="_blank" rel="noopener noreferrer">${creditLine}</a>` : creditLine}
            </div>`
          : ""
      }
    </div>
  `;
}

/* =========================================================
   Popups: trails + regions
========================================================= */
function buildTrailPopup(t) {
  const name = escapeHtml(t?.name ?? "Trail");
  const typeLabel = escapeHtml(t?.typeLabel ?? "");
  const certainty = escapeHtml(t?.certainty ?? "");
  const note = "Routes are simplified for educational context.";

  return `
    <div style="min-width:240px;">
      <strong>${name}</strong>
      ${typeLabel ? `<div style="opacity:.85;font-size:12px;margin-top:4px;">Type: ${typeLabel}</div>` : ""}
      ${certainty ? `<div style="opacity:.7;font-size:12px;">Certainty: ${certainty}</div>` : ""}
      <div style="opacity:.7;font-size:12px;margin-top:6px;">${note}</div>
    </div>
  `;
}

function buildRegionPopup(r) {
  const name = escapeHtml(r?.name ?? "Region");
  const typeLabel = escapeHtml(r?.typeLabel ?? "");
  const certainty = escapeHtml(r?.certainty ?? "");
  const body = escapeHtml(r?.body ?? "");
  return `
    <div style="min-width:240px;">
      <strong>${name}</strong>
      ${typeLabel ? `<div style="opacity:.85;font-size:12px;margin-top:4px;">Type: ${typeLabel}</div>` : ""}
      ${certainty ? `<div style="opacity:.7;font-size:12px;">Certainty: ${certainty}</div>` : ""}
      ${body ? `<div style="opacity:.85;font-size:12px;margin-top:6px;">${body}</div>` : ""}
      <div style="opacity:.7;font-size:12px;margin-top:6px;">Overlays are simplified for educational context.</div>
    </div>
  `;
}

/* =========================================================
   Highlights
========================================================= */
function clearRegionHighlights() {
  for (const poly of regionPolygonsById.values()) {
    poly.setStyle({ fillOpacity: poly.__baseFillOpacity ?? 0.18, opacity: 1 });
  }
}

function highlightRegions(ids = []) {
  for (const poly of regionPolygonsById.values()) {
    poly.setStyle({ fillOpacity: 0.06, opacity: 0.35 });
  }
  for (const id of ids) {
    const poly = regionPolygonsById.get(id);
    if (poly) poly.setStyle({ fillOpacity: 0.24, opacity: 1 });
  }
}

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

/* =========================================================
   Tribes (lazy)
========================================================= */
async function ensureTribesLayerBuilt() {
  if (tribesBuilt || tribesLoading) return;
  tribesLoading = true;

  const hasCluster = typeof L.markerClusterGroup === "function";
  tribesLayer = hasCluster ? L.markerClusterGroup({ disableClusteringAtZoom: 7 }) : L.layerGroup();

  try {
    const geojson = await fetchArcGisGeoJsonAll(TRIBAL_LEADERS_FS, {
      where: "1=1",
      outFields: "*",
      pageSize: 2000,
    });

    const geoLayer = L.geoJSON(geojson, {
      pointToLayer: (_feature, latlng) =>
        L.circleMarker(latlng, {
          radius: 5,
          fillColor: "#63ff8f",
          color: "#000",
          weight: 1,
          fillOpacity: 0.8,
        }),
      onEachFeature: (feature, layer) => {
        const p = feature?.properties || {};
        const name = escapeHtml(
          p?.Tribe_Full_Name ||
            p?.TribeFullName ||
            p?.TRIBE_FULL_NAME ||
            p?.tribe_full_name ||
            p?.name ||
            "Tribal Headquarters"
        );
        const state = escapeHtml(p?.State || p?.STATE || p?.state || "");
        layer.bindPopup(`
          <div style="min-width:220px;">
            <strong>${name}</strong>
            ${state ? `<div style="opacity:.75;font-size:12px;margin-top:4px;">State: ${state}</div>` : ""}
            <div style="opacity:.65;font-size:12px;margin-top:6px;">Source: BIA Tribal Leaders Directory</div>
          </div>
        `);
      },
    });

    if (hasCluster) tribesLayer.addLayer(geoLayer);
    else geoLayer.addTo(tribesLayer);

    tribesBuilt = true;
  } catch (e) {
    console.error("Failed to load BIA tribal points:", e);
  } finally {
    tribesLoading = false;
  }
}

/* =========================================================
   Chapter layers + highlights
========================================================= */
async function applyChapterLayers(chapter) {
  const l = chapter?.layers || {};

  setLayerVisible(regionsLayer, l.regions !== false);
  setLayerVisible(trailsLayer, !!l.trails);
  setLayerVisible(placesLayer, !!l.places);

  if (l.tribes) {
    await ensureTribesLayerBuilt();
    if (tribesLayer) setLayerVisible(tribesLayer, true);
  } else {
    if (tribesLayer) setLayerVisible(tribesLayer, false);
  }

  if (chapter?.highlight?.regionIds?.length) highlightRegions(chapter.highlight.regionIds);
  else clearRegionHighlights();

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

  ignoreScrollUntil = Date.now() + 1400;
  stepEl.scrollIntoView({ behavior: "smooth", block: "center" });
  setActiveStep(stepEl);
}

async function goToChapter(idx, { animate = true, scroll = false } = {}) {
  activeChapterIndex = Math.max(0, Math.min(CHAPTERS.length - 1, idx));
  const c = CHAPTERS[activeChapterIndex];

  updateHUD();
  await applyChapterLayers(c);

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
   Layers
========================================================= */
function setupLayers() {
  // Regions
  regionsLayer = L.layerGroup();
  regionPolygonsById = new Map();

  for (const r of REGIONS) {
    if (!Array.isArray(r?.coords) || r.coords.length < 3) continue;

    const style = r.style || {};
    const baseFillOpacity = typeof style.fillOpacity === "number" ? style.fillOpacity : 0.18;

    const poly = L.polygon(r.coords, {
      color: style.color || "#ffffff",
      fillColor: style.color || "#ffffff",
      weight: typeof style.weight === "number" ? style.weight : 2,
      opacity: 1,
      fillOpacity: baseFillOpacity,
      interactive: true,
    }).addTo(regionsLayer);

    poly.__baseFillOpacity = baseFillOpacity;

    if (r.id) regionPolygonsById.set(r.id, poly);
    poly.bindPopup(buildRegionPopup(r));
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
    poly.bindPopup(buildTrailPopup(t));
  }
  trailsLayer.addTo(map);

  // Places (with images + sources)
  placesLayer = L.layerGroup();

  for (const p of PLACES) {
    if (typeof p?.lat !== "number" || typeof p?.lng !== "number") continue;

    const name = escapeHtml(p.name ?? "Place");
    const type = escapeHtml(p.type ?? "");
    const body = escapeHtml(p.body ?? "");

    L.circleMarker([p.lat, p.lng], {
      radius: 7,
      fillColor: "#ff9f43",
      color: "#fff",
      weight: 2,
      fillOpacity: 0.9,
    })
      .bindPopup(
        `
        <div class="popup" style="min-width:240px; max-width:340px;">
          <strong>${name}</strong>
          ${type ? `<div style="opacity:.75; font-size:12px; margin-top:4px;">Type: ${type}</div>` : ""}
          ${renderImage(p.image)}
          ${body ? `<div style="margin-top:8px;">${body}</div>` : ""}
          ${renderSources(p.sources)}
        </div>
        `
      )
      .addTo(placesLayer);
  }

  placesLayer.addTo(map);

  // Tribes are lazy-built
  tribesLayer = null;
  tribesBuilt = false;
  tribesLoading = false;
}

/* =========================================================
   Init + render
========================================================= */
function initMap() {
  if (!window.L) {
    console.error("Leaflet not loaded.");
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
   Story (sidebar) render
========================================================= */
function renderStory() {
  if (!els.storyBody) return;

  els.storyBody.innerHTML = CHAPTERS.map((c) => {
    const img = c.image;

    const imageHtml = img?.src
      ? `
        <figure class="chapter-figure">
          <img
            class="chapter-image"
            src="${escapeHtml(img.src)}"
            alt="${escapeHtml(img.alt || c.title)}"
            loading="lazy"
            referrerpolicy="no-referrer"
          />
          <figcaption class="chapter-credit">
            ${
              img.href
                ? `<a href="${escapeHtml(img.href)}" target="_blank" rel="noreferrer">
                     ${escapeHtml(img.credit || "Wikimedia Commons")}
                   </a>`
                : escapeHtml(img.credit || "Wikimedia Commons")
            }
            ${img.license ? ` <span class="chapter-license">— ${escapeHtml(img.license)}</span>` : ""}
          </figcaption>
        </figure>
      `
      : "";

    return `
      <section class="step" data-chapter="${escapeHtml(c.id)}">
        <h2>${escapeHtml(c.title)}</h2>
        ${imageHtml}
        <p>${nl2brSafe(String(c.body || "").trim())}</p>
      </section>
    `;
  }).join("");

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

  if (els.btnNext) els.btnNext.onclick = () => goToChapter(activeChapterIndex + 1, { animate: true, scroll: true });
  if (els.btnPrev) els.btnPrev.onclick = () => goToChapter(activeChapterIndex - 1, { animate: true, scroll: true });

  setTimeout(initMap, 120);
}

window.addEventListener("load", boot);
