import fs from "fs";

const url =
  "https://native-land.ca/wp-content/uploads/2018/10/indigenousTerritories.json";

const res = await fetch(url);
if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
const geo = await res.json();

function centroidOfRing(ring) {
  // ring: [[lng,lat], ...]
  let latSum = 0, lngSum = 0, n = 0;
  for (const pt of ring) {
    const [lng, lat] = pt;
    if (typeof lat !== "number" || typeof lng !== "number") continue;
    latSum += lat;
    lngSum += lng;
    n++;
  }
  return n ? [latSum / n, lngSum / n] : [0, 0];
}

const out = [];

for (const f of geo.features) {
  const name = f?.properties?.Name || f?.properties?.name;
  if (!name) continue;

  let ring = null;

  if (f.geometry?.type === "Polygon") ring = f.geometry.coordinates?.[0];
  if (f.geometry?.type === "MultiPolygon") ring = f.geometry.coordinates?.[0]?.[0];

  if (!ring?.length) continue;

  const [lat, lng] = centroidOfRing(ring);

  // Skip nonsense centroids
  if (!isFinite(lat) || !isFinite(lng)) continue;

  out.push({
    name,
    lat: Number(lat.toFixed(5)),
    lng: Number(lng.toFixed(5)),
    state: "",
    link: "https://native-land.ca/",
  });
}

out.sort((a, b) => a.name.localeCompare(b.name));

fs.mkdirSync("data", { recursive: true });
fs.writeFileSync(
  "data/tribes.js",
  "export const TRIBES = " + JSON.stringify(out, null, 2) + ";\n"
);

console.log(`✅ Wrote data/tribes.js with ${out.length} points`);
