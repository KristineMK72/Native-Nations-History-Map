// /data/trails.js
export const TRAILS = [
  /* =====================================================
     FORCED REMOVAL / 1800s U.S. POLICY ERA
     NOTE: Routes are approximate and representative.
  ===================================================== */

  {
    id: "cherokee-northern-route",
    name: "Cherokee Removal – Northern Overland Route (Approximate)",
    color: "#ff3b3b",
    weight: 4,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [35.045, -85.309], // Chattanooga area
      [35.489, -86.044],
      [35.846, -86.392],
      [36.321, -87.276],
      [37.243, -88.745],
      [37.736, -89.332],
      [37.954, -91.767],
      [37.108, -93.292],
      [36.747, -95.976] // Indian Territory (OK)
    ],
  },

  {
    id: "cherokee-water-route",
    name: "Cherokee Removal – River Route (Approximate)",
    color: "#ff6b6b",
    weight: 3,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [35.045, -85.309], // TN River access
      [34.980, -87.568],
      [35.120, -90.000], // Mississippi River area
      [35.467, -94.516]  // Arkansas River region
    ],
  },

  {
    id: "choctaw-removal",
    name: "Choctaw Removal Routes (Approximate)",
    color: "#ff9f43",
    weight: 3,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [32.298, -90.184], // central MS
      [33.520, -92.535], // AR direction
      [34.746, -94.000],
      [35.467, -95.523]  // eastern OK
    ],
  },

  {
    id: "creek-removal",
    name: "Muscogee (Creek) Removal Routes (Approximate)",
    color: "#ffcc00",
    weight: 3,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [32.377, -86.300], // Montgomery area
      [33.942, -88.050],
      [35.117, -90.000],
      [35.467, -94.516]
    ],
  },

  {
    id: "chickasaw-removal",
    name: "Chickasaw Removal (Approximate)",
    color: "#f4a261",
    weight: 3,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [34.366, -89.519], // North MS (approx homeland region)
      [35.155, -90.052], // Memphis area corridor
      [34.746, -94.000], // AR direction
      [35.467, -95.523]  // eastern OK
    ],
  },

  {
    id: "navajo-long-walk",
    name: "Diné (Navajo) Long Walk to Bosque Redondo (Approximate)",
    color: "#c77dff",
    weight: 4,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [35.686, -105.937], // Santa Fe area (military hub)
      [35.084, -106.650], // Albuquerque area
      [34.404, -103.205], // eastern NM plains
      [34.473, -104.245]  // Fort Sumner / Bosque Redondo area
    ],
  },

  {
    id: "dakota-1862-exile",
    name: "Dakota Exile – Fort Snelling to Crow Creek (Approximate)",
    color: "#ffd166",
    weight: 4,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "approximate",
    coords: [
      [44.892, -93.196],  // Fort Snelling area (MN)
      [44.455, -95.788],  // Lower MN River valley
      [44.178, -97.608],  // eastern SD
      [43.902, -99.258]   // Crow Creek area (SD)
    ],
  },

  /* =====================================================
     SEMINOLE: not one trail — repeated conflict + forced relocation attempts.
     Represented as a pressure/relocation corridor (contextual).
  ===================================================== */

  {
    id: "seminole-removal-pressure",
    name: "Seminole Removal & Conflict Corridor (Contextual, Approximate)",
    color: "#2a9d8f",
    weight: 4,
    type: "forced-removal",
    typeLabel: "Forced Removal",
    certainty: "contextual",
    coords: [
      [30.332, -81.655], // NE Florida corridor (Jacksonville)
      [29.651, -82.324], // North-central FL (Gainesville)
      [28.538, -81.379], // Central FL (Orlando)
      [27.950, -82.457], // Tampa Bay area
      [26.715, -80.053]  // South FL corridor (Palm Beach area)
    ],
  },

  /* =====================================================
     CONFLICT / FLIGHT / PURSUIT ROUTES (Approximate)
  ===================================================== */

  {
    id: "nez-perce-1877",
    name: "Nez Perce (Nimiipuu) Flight of 1877 (Approximate)",
    color: "#4cc9f0",
    weight: 4,
    type: "conflict-flight",
    typeLabel: "Conflict / Flight",
    certainty: "approximate",
    coords: [
      [46.400, -116.900], // north-central ID corridor
      [45.780, -111.160], // Yellowstone region corridor
      [46.880, -110.360], // central MT
      [48.550, -109.780]  // Bear Paw area (north MT)
    ],
  },

  /* =====================================================
     COLONIAL MISSION SYSTEM (Context / Approximate corridor)
  ===================================================== */

  {
    id: "california-mission-corridor",
    name: "California Mission System Corridor (Contextual, Approximate)",
    color: "#f8961e",
    weight: 3,
    type: "colonial-mission",
    typeLabel: "Colonial Mission System",
    certainty: "contextual",
    coords: [
      [38.340, -122.666], // Sonoma area
      [37.774, -122.419], // San Francisco area
      [36.600, -121.894], // Monterey area
      [35.282, -120.659], // San Luis Obispo area
      [34.421, -119.698], // Santa Barbara area
      [34.053, -118.243], // Los Angeles area
      [33.020, -117.282]  // San Diego area
    ],
  },

  /* =====================================================
     INDIGENOUS MIGRATION & TRADITIONAL TEACHINGS
  ===================================================== */

  {
    id: "ojibwe-seven-stops",
    name: "Ojibwe (Anishinaabe) Seven Stops Migration (Traditional Teaching)",
    color: "#00e5ff",
    weight: 4,
    type: "traditional-migration",
    typeLabel: "Traditional Teaching",
    certainty: "symbolic",
    coords: [
      [45.312, -65.975], // Atlantic region (symbolic)
      [45.421, -75.697], // Ottawa River region
      [46.312, -79.461],
      [46.514, -84.352],
      [46.786, -92.100],
      [47.500, -94.700]  // western Great Lakes
    ],
  },
];
