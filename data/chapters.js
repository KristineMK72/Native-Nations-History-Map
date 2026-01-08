// /data/chapters.js

function commonsFilePath(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}
function commonsFilePage(fileName) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;
}

export const CHAPTERS = [
  {
    id: "begin",
    title: "Introduction",
    image: {
      src: commonsFilePath("North American cultural areas.png"),
      alt: "Map of Indigenous cultural areas in North America at the time of European colonization.",
      credit: "Nikater / Wikimedia Commons",
      license: "Public domain",
      href: commonsFilePage("North American cultural areas.png"),
    },
    body: `
This map is a guided overview of Indigenous histories across what is now the United States.
It does not tell a single story—because there is no single Indigenous history.

Before continuing, a few grounding principles:
• Indigenous Nations are distinct political, cultural, and linguistic communities.
• Maps simplify; lived histories do not.
• Nation voices and self-identification matter more than any dataset.

Scroll to move through regions and time periods.
Each chapter highlights patterns, not absolutes—and is meant to invite deeper learning.
`,
    view: { center: [39.5, -98.35], zoom: 4.2 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    sources: [],
  },

  {
    id: "deep-time",
    title: "Deep Time and Indigenous Presence",
    image: {
      src: commonsFilePath("Beringia-Map Bathymetry web72 final.png"),
      alt: "Map showing the ancient Beringia land bridge and surrounding bathymetry.",
      credit: "National Park Service (via Wikimedia Commons)",
      license: "Public domain (US federal government work; verify on file page)",
      href: commonsFilePage("Beringia-Map Bathymetry web72 final.png"),
    },
    body: `
Indigenous Peoples have lived on and cared for these lands since time immemorial.

Some Nations describe their origins through Creation teachings tied directly to place.
Archaeology and genetics describe human presence in the Americas stretching back at least 15,000–20,000 years, with ongoing debate and discovery.

These knowledge systems serve different purposes:
• Indigenous origin teachings describe responsibility, relationship, and identity.
• Scientific models attempt to reconstruct patterns from material evidence.

Neither replaces the other.
`,
    view: { center: [60, -120], zoom: 3 },
    layers: { regions: true, trails: false, tribes: false, places: false },
    sources: [],
  },

  {
    id: "northeast",
    title: "Northeast Woodlands",
    image: {
      src: commonsFilePath("Exterior view of traditional Iroquois longhouse.jpg"),
      alt: "Exterior view of a traditional Iroquois longhouse.",
      credit: "Wikimedia Commons contributor (see file page)",
      license: "CC BY 2.0",
      href: commonsFilePage("Exterior view of traditional Iroquois longhouse.jpg"),
    },
    body: `
The Northeast Woodlands supported dense populations long before European contact.
Nations here developed sophisticated political systems, agriculture, diplomacy, and trade networks.

Key characteristics included:
• Confederacies such as the Haudenosaunee (Iroquois Confederacy)
• Longhouse communities and matrilineal governance
• Extensive trade routes connecting the Atlantic coast to the interior

European arrival profoundly disrupted these systems through disease, land seizure, and warfare.
`,
    view: { center: [43, -75], zoom: 5 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    sources: [],
  },

  {
    id: "southeast",
    title: "Southeast: Complex Societies and Removal",
    image: {
      src: commonsFilePath("Trails of Tears en.png"),
      alt: "Map of the routes taken during the Trails of Tears forced relocations (1830s).",
      credit: "Wikimedia Commons contributor (see file page)",
      license: "License varies (verify on file page)",
      href: commonsFilePage("Trails of Tears en.png"),
    },
    body: `
The Southeast was home to large, complex Indigenous societies with deep agricultural traditions.

Before removal policies, Nations such as the Cherokee, Muscogee (Creek), Choctaw, Chickasaw, and Seminole:
• cultivated large towns and ceremonial centers
• practiced diplomacy with European powers
• adapted new technologies while maintaining governance systems

Despite treaties and legal resistance, U.S. removal policies forcibly displaced many Southeast Nations in the 19th century.
`,
    view: { center: [34, -85], zoom: 5 },
    layers: { regions: true, trails: true, tribes: true, places: true },
    sources: [],
  },

  {
    id: "great-plains",
    title: "Great Plains Nations",
    image: {
      src: commonsFilePath("Bison herd.jpg"),
      alt: "A herd of American bison on open grassland.",
      credit: "USDA Agricultural Research Service (via Wikimedia Commons)",
      license: "Public domain (US government work)",
      href: commonsFilePage("Bison herd.jpg"),
    },
    body: `
The Great Plains were shaped by mobility, trade, and environmental knowledge.

Plains Nations developed lifeways closely tied to:
• bison economies
• seasonal movement
• kinship networks across large territories

Contrary to stereotypes, Plains cultures were not static.
They adapted rapidly to horses, trade, and shifting political realities—while facing increasing pressure from U.S. expansion.
`,
    view: { center: [44, -100], zoom: 4.5 },
    layers: { regions: true, trails: false, tribes: true, places: false },
    highlight: { regionIds: ["plains"] },
    sources: [],
  },

  {
    id: "southwest",
    title: "Southwest: Continuity and Adaptation",
    image: {
      src: commonsFilePath("Chaco Canyon Chetro Ketl great kiva plaza NPS.jpg"),
      alt: "Great kiva plaza at Chaco Canyon (Chetro Ketl), an important ancestral Puebloan site.",
      credit: "National Park Service (via Wikimedia Commons)",
      license: "Public domain (US federal government work)",
      href: commonsFilePage("Chaco Canyon Chetro Ketl great kiva plaza NPS.jpg"),
    },
    body: `
Indigenous Nations of the Southwest developed some of the longest continuously inhabited communities in North America.

This region includes:
• Pueblo societies with deep agricultural knowledge
• Diné (Navajo) and Apache Nations with complex migration and adaptation histories
• advanced irrigation, architecture, and land stewardship

Spanish colonization brought violence, forced labor, and mission systems—but Indigenous communities endured and adapted.
`,
    view: { center: [35, -109], zoom: 5 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    highlight: { regionIds: ["southwest"] },
    sources: [],
  },

  {
    id: "california",
    title: "California: Diversity and Survival",
    image: {
      src: commonsFilePath("California tribes & languages at contact.png"),
      alt: "Map of California tribal areas and languages at the time of European contact.",
      credit: "Wikimedia Commons contributor (see file page)",
      license: "License varies (verify on file page)",
      href: commonsFilePage("California tribes & languages at contact.png"),
    },
    body: `
California contained one of the greatest concentrations of Indigenous linguistic and cultural diversity in the world.

Before colonization:
• hundreds of Nations and language groups lived across diverse environments
• complex land management practices sustained ecosystems

Colonization, Gold Rush violence, and state-sponsored campaigns caused catastrophic population loss.
Yet California Native Nations persist, revitalize languages, and assert sovereignty today.
`,
    view: { center: [37, -120], zoom: 5 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    highlight: { regionIds: ["california"] },
    sources: [],
  },

  {
    id: "pacific-northwest",
    title: "Pacific Northwest",
    image: {
      src: commonsFilePath("Pacific Northwest Totem Poles.jpg"),
      alt: "Totem poles associated with Indigenous peoples of the Pacific Northwest.",
      credit: "Gary Todd (via Wikimedia Commons)",
      license: "CC0 (public domain dedication)",
      href: commonsFilePage("Pacific Northwest Totem Poles.jpg"),
    },
    body: `
The Pacific Northwest supported large, permanent villages sustained by rich river and coastal ecosystems.

Distinctive features included:
• complex social structures
• monumental art traditions
• economies centered on salmon and maritime resources

Colonization disrupted these systems through land seizure, bans on ceremony, and environmental destruction—yet cultural continuity remains strong.
`,
    view: { center: [47, -123], zoom: 5 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    sources: [],
  },

  {
    id: "great-basin",
    title: "Great Basin and Plateau",
    image: {
      src: commonsFilePath("Big Rocks petroglyphs.jpg"),
      alt: "Petroglyphs carved into rock in the Great Basin region.",
      credit: "Bureau of Land Management (via Wikimedia Commons)",
      license: "Public domain (US government work)",
      href: commonsFilePage("Big Rocks petroglyphs.jpg"),
    },
    body: `
Indigenous Nations of the Great Basin and Plateau regions developed lifeways finely tuned to arid and mountainous environments.

These societies emphasized:
• seasonal movement
• ecological knowledge
• trade between regions

U.S. expansion and reservation policies fragmented these systems, but Nations continue to maintain ties to homelands.
`,
    view: { center: [40, -115], zoom: 5 },
    layers: { regions: true, trails: false, tribes: true, places: false },
    sources: [],
  },

  {
    id: "policies",
    title: "U.S. Policy and Its Consequences",
    image: {
      src: commonsFilePath("Native American boarding school-school gardens.jpg"),
      alt: "Historic photo associated with a Native American boarding school (students outdoors).",
      credit: "Wikimedia Commons (historic photo; see file page)",
      license: "Public domain (pre-1930 publication; verify on file page)",
      href: commonsFilePage("Native American boarding school-school gardens.jpg"),
    },
    body: `
From the 19th to the 20th century, U.S. policy toward Indigenous Nations included:
• removal
• allotment
• boarding schools
• termination
• relocation to urban centers

These policies aimed to dismantle sovereignty and assimilate Indigenous Peoples.
Their impacts continue to shape communities today.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { regions: true, trails: true, tribes: true, places: false },
    sources: [],
  },

  {
    id: "living-nations",
    title: "Living Nations Today",
    image: {
      src: commonsFilePath("National Pow Wow 2005 Straight Dancer.jpg"),
      alt: "A straight dancer at the National Pow Wow (2005).",
      credit: "Smithsonian Institution (via Wikimedia Commons)",
      license: "Public domain (US federal government work)",
      href: commonsFilePage("National Pow Wow 2005 Straight Dancer.jpg"),
    },
    body: `
Indigenous Nations are not historical artifacts—they are living political entities.

Today, Nations:
• govern lands and citizens
• revitalize languages and traditions
• advocate for environmental protection
• pursue economic development on their own terms

This map can only gesture toward that reality.
Real understanding comes from listening to Nation voices.
`,
    view: { center: [39.5, -98.35], zoom: 4.1 },
    layers: { regions: true, trails: false, tribes: true, places: false },
    sources: [],
  },

  {
    id: "continuing",
    title: "Continuing the Story",
    image: {
      src: commonsFilePath("Indigenous American Nations, 16th century - 2022 edition.jpg"),
      alt: "Map showing approximate locations of Indigenous nations in what is now the United States during the 1500s (labeled where possible).",
      credit: "Wikimedia Commons (see file page)",
      license: "License varies (verify on file page)",
      href: commonsFilePage("Indigenous American Nations, 16th century - 2022 edition.jpg"),
    },
    body: `
This map is unfinished by design.

Next expansions could include:
• Nation-specific chapters
• treaty maps by era
• language family layers
• timelines aligned with regions
• direct links to Nation websites and Native-led archives

History does not end.
Responsibility does not end.
Learning does not end.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    sources: [],
  },
];
