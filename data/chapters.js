// /data/chapters.js
export const CHAPTERS = [
  {
    id: "begin",
    title: "Begin",
    body: `
This story-map is an overview—an invitation to learn, not a complete history.
Scroll to move through chapters. The map will guide you, and you can click features to explore.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { trails: false, tribes: false, places: false },
    sources: [],
  },

  {
    id: "beringia",
    title: "Beringia Crossing",
    body: `
Many Indigenous histories describe deep relationships with homelands that reach far beyond written records.
Some scientific models propose early migrations into the Americas during Ice Age periods, possibly including routes across or along the Bering region.
Different Nations hold their own origin teachings; this chapter is presented with respect for that diversity.
`,
    view: { center: [64.5, -168.0], zoom: 3 },
    layers: { trails: false, tribes: false, places: false },
    sources: [
      { label: "Add a source link (optional)", url: "" },
    ],
  },

  {
    id: "trail-of-tears",
    title: "Trail of Tears",
    body: `
In the 1800s, U.S. policies of removal forced many Indigenous people from their homelands.
Families were displaced, communities were fractured, and countless lives were lost along routes of forced travel.
This chapter is a reminder that these were not “movements”—they were coercion backed by law and violence.
`,
    view: { center: [35.6, -87.0], zoom: 5 },
    layers: { trails: true, tribes: false, places: true },
    // If your TRAILS dataset has ids, you can highlight one:
    // highlight: { trailIds: ["trail_of_tears"] },
    sources: [
      { label: "Add a source link (optional)", url: "" },
    ],
  },

  {
    id: "ojibwe-migration",
    title: "Ojibwe Migration",
    body: `
Ojibwe (Anishinaabe) histories include migration traditions that connect communities across large regions.
These teachings are often carried through language, family lines, and sacred responsibilities.
On the map, we focus on place and movement—while recognizing that the full story lives in community memory.
`,
    view: { center: [47.5, -94.5], zoom: 6 },
    layers: { trails: false, tribes: true, places: true },
    sources: [
      { label: "Add a source link (optional)", url: "" },
    ],
  },

  {
    id: "tribal-locations",
    title: "Tribal Locations",
    body: `
Indigenous Nations are present and thriving today. Boundaries, names, and locations can change over time—and map points are always incomplete.
Use this layer as a starting point. If you can, visit official Nation websites for accurate names, governance, and community information.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { trails: false, tribes: true, places: false },
    sources: [
      { label: "Add a source link (optional)", url: "" },
    ],
  },
];
