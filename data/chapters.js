export const CHAPTERS = [
  {
    id: "intro",
    title: "Begin",
    meta: "Orientation",
    body:
      "Scroll to advance through chapters, or use the transport controls. Click features on the map to explore.",
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { tribes: true, trails: true, reservations: false },
  },
  {
    id: "beringia",
    title: "Beringia Crossing",
    meta: "Migration",
    body:
      "Replace this with your narrative text. Keep it 2–4 sentences for best story-map pacing.",
    view: { center: [64, -165], zoom: 3 },
    layers: { tribes: false, trails: false, reservations: false },
  },
  {
    id: "trail-of-tears",
    title: "Trail of Tears",
    meta: "Forced relocation",
    body:
      "Replace with sourced, careful wording. You can attach sources below.",
    view: { center: [35.2, -86.8], zoom: 6 },
    highlightTrailId: "trail-of-tears",
    layers: { tribes: false, trails: true, reservations: false },
    sources: [
      // { label: "Source name", href: "https://..." }
    ],
  },
  {
    id: "ojibwe-route",
    title: "Ojibwe Migration",
    meta: "Routes and movement",
    body:
      "Replace with your narrative. Consider adding 1–2 sources links.",
    view: { center: [47.2, -93.5], zoom: 6 },
    highlightTrailId: "ojibwe-migration",
    layers: { tribes: false, trails: true, reservations: false },
  },
  {
    id: "tribes",
    title: "Tribal Locations",
    meta: "Explore 574 points",
    body:
      "Clustered markers keep the view readable. Zoom in to see individual locations.",
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { tribes: true, trails: false, reservations: false },
  },
];
