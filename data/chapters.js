// /data/chapters.js
export const CHAPTERS = [
  {
    id: "begin",
    title: "Introduction",
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
