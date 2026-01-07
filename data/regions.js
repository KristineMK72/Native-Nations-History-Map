// /data/regions.js
export const REGIONS = [
  {
    id: "southwest",
    name: "Southwest (Contextual Region)",
    typeLabel: "Region Overlay",
    certainty: "contextual",
    style: { color: "#a78bfa", weight: 2, fillOpacity: 0.12 },
    coords: [
      [37.0, -114.5],
      [37.0, -103.0],
      [31.2, -103.0],
      [31.2, -114.5],
    ],
    body:
      "Contextual region overlay for learning (not a boundary of Nations or jurisdictions).",
  },
  {
    id: "plains",
    name: "Plains (Contextual Region)",
    typeLabel: "Region Overlay",
    certainty: "contextual",
    style: { color: "#60a5fa", weight: 2, fillOpacity: 0.12 },
    coords: [
      [49.0, -106.5],
      [49.0, -93.0],
      [33.0, -93.0],
      [33.0, -106.5],
    ],
    body:
      "Contextual region overlay for learning (not a boundary of Nations or jurisdictions).",
  },
  {
    id: "california",
    name: "California (Contextual Region)",
    typeLabel: "Region Overlay",
    certainty: "contextual",
    style: { color: "#f59e0b", weight: 2, fillOpacity: 0.12 },
    coords: [
      [42.1, -124.4],
      [42.1, -114.1],
      [32.5, -114.1],
      [32.5, -124.4],
    ],
    body:
      "Contextual region overlay for learning (not a boundary of Nations or jurisdictions).",
  },
];
