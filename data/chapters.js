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
This map is a guided overview of Indigenous histories across what is now the United States. There is no single Indigenous history—only many distinct Nations, languages, and relationships to land.

A few grounding principles:
• Indigenous Nations are sovereign political communities with their own laws, languages, and governance.
• Maps and datasets simplify; lived histories and Nation voices do not.
• Self-identification and Nation-led sources matter more than any outside catalog.

Use the Stories button (or the panel header on mobile) to read while the map stays visible. Scroll or use Prev/Next to move through chapters. Each one highlights patterns and invites further learning from Native-led archives and Nation websites.
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
Indigenous Peoples have lived on and cared for these lands since time immemorial. Many Nations hold Creation teachings that root identity, responsibility, and relationship in specific places.

Archaeology and genetics describe human presence in the Americas stretching back at least 15,000–20,000 years, with ongoing discovery and debate. These scientific models reconstruct patterns from material evidence; Indigenous teachings describe relationship and duty. Neither replaces the other.

The green dots on the map mark approximate locations of federally recognized tribal headquarters today—living Nations continuing ancient presence in contemporary form.
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
The Northeast Woodlands supported dense populations long before European contact. Nations developed sophisticated political systems, agriculture (especially the Three Sisters), diplomacy, and far-reaching trade networks.

The Haudenosaunee (Iroquois Confederacy) created a long-lasting Great Law of Peace with matrilineal clan governance and longhouse communities. Wampum belts recorded treaties and history. Coastal and riverine Nations maintained complex seasonal economies.

European arrival brought disease, land seizure, and warfare that disrupted these systems. Yet many Northeast Nations maintain continuous governance, language revitalization, and treaty rights today.
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
The Southeast was home to large, complex Indigenous societies with deep agricultural traditions, town centers, and ceremonial earthworks. Nations including the Cherokee, Muscogee (Creek), Choctaw, Chickasaw, and Seminole practiced diplomacy with European powers, adopted new technologies, and maintained sophisticated governance.

Despite treaties and legal victories (such as Worcester v. Georgia), the Indian Removal Act of 1830 and subsequent forced marches—the Trails of Tears—displaced tens of thousands. Thousands died from disease, exposure, and violence. The red routes on the map approximate some of these forced removal paths.

Many Southeast Nations rebuilt governments in Indian Territory (now Oklahoma) and continue as sovereign Nations today.
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
The Great Plains were shaped by mobility, trade, and deep environmental knowledge. Plains Nations developed lifeways centered on bison economies, seasonal movement, and extensive kinship and trade networks stretching from the Rocky Mountains to the Mississippi.

Contrary to stereotypes, these cultures were dynamic. The introduction of horses transformed mobility and power; trade in European goods and inter-tribal alliances shifted constantly. U.S. expansion, railroad construction, and deliberate campaigns to destroy bison herds brought catastrophic change.

Nations such as the Lakota, Dakota, Nakota, Cheyenne, Arapaho, Comanche, and others continue to assert treaty rights, protect sacred sites, and revitalize languages and ceremonies.
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
Indigenous Nations of the Southwest developed some of the longest continuously inhabited communities in North America. Ancestral Puebloan peoples built great houses, road systems, and kivas at places such as Chaco Canyon and Mesa Verde. Living Pueblo communities (including Taos, Acoma, and Zuni) maintain continuous occupation and agricultural traditions.

Diné (Navajo) and Apache Nations adapted to the region through complex migration histories, pastoralism, and resistance. Spanish colonization introduced missions, forced labor, and violence, yet communities endured, adapted, and in many cases reclaimed lands and governance.

Today these Nations lead in language immersion, water rights advocacy, and cultural continuity.
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
California contained one of the greatest concentrations of Indigenous linguistic and cultural diversity in the world—hundreds of Nations and language groups across mountains, deserts, coasts, and valleys. Complex land management (including controlled burning) sustained ecosystems for millennia.

Spanish missions, Mexican ranchos, and the Gold Rush brought catastrophic violence, enslavement, and disease. California’s state government explicitly sponsored campaigns against Native people in the mid-1800s. Population losses were among the most severe on the continent.

Yet California Native Nations persist. Many have achieved federal recognition, revitalize languages, protect sacred sites, and assert sovereignty through courts, legislation, and cultural practice.
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
The Pacific Northwest supported large, permanent villages sustained by rich river and coastal ecosystems, especially salmon. Distinctive features included complex social structures, potlatch economies, monumental art (totem poles, canoes, weaving), and highly developed legal and ceremonial systems.

Colonization disrupted these systems through land seizure, bans on ceremony and potlatch (Canada and U.S.), residential schools, and environmental destruction. Yet cultural continuity remains exceptionally strong: many Nations have revitalized languages, restored potlatch, and lead in fisheries co-management and environmental protection.
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
Indigenous Nations of the Great Basin and Plateau developed lifeways finely tuned to arid and mountainous environments. Seasonal movement, detailed ecological knowledge, and extensive trade networks (including with coastal and Plains peoples) sustained communities for thousands of years. Petroglyphs and rock art mark long-term presence and ceremony.

U.S. expansion, mining, and reservation policies fragmented these systems. Nations continue to maintain ties to homelands, protect water and sacred sites, and revitalize languages despite limited land bases.
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
From the late 18th through the 20th century, U.S. policy toward Indigenous Nations included successive eras of treaty-making, removal, allotment (Dawes Act), boarding schools, termination, and urban relocation.

These policies aimed to dismantle sovereignty, break up communal lands, suppress languages and ceremonies, and assimilate Indigenous Peoples. Boarding schools removed children from families and cultures; termination sought to end the federal trust relationship with specific Nations.

The impacts continue: language loss, land fragmentation, health disparities, and intergenerational trauma. At the same time, Nations have used courts, legislation (including the Indian Self-Determination Act), and cultural revitalization to reassert sovereignty and rebuild.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { regions: true, trails: true, tribes: true, places: false },
    sources: [],
  },

  {
    id: "treaties",
    title: "Treaties and Ongoing Obligations",
    image: {
      src: commonsFilePath("Wampum belt.jpg"),
      alt: "Example of a wampum belt used to record agreements.",
      credit: "Wikimedia Commons (see file page)",
      license: "License varies (verify on file page)",
      href: commonsFilePage("Wampum belt.jpg"),
    },
    body: `
Treaties between Indigenous Nations and the United States are the supreme law of the land under the U.S. Constitution. Hundreds of treaties reserved specific rights—hunting, fishing, gathering, water, and self-governance—in exchange for land cessions.

Many treaties were coerced, poorly translated, or later violated by the United States. Courts have repeatedly affirmed that reserved rights remain in force unless explicitly abrogated. Modern Nations continue to litigate and negotiate under these treaty obligations (fishing rights in the Northwest, water rights in the Southwest, hunting rights on the Plains, and more).

Understanding treaties is essential: they are not historical relics but living legal instruments that shape land, resources, and jurisdiction today.
`,
    view: { center: [39.5, -98.35], zoom: 4.2 },
    layers: { regions: true, trails: false, tribes: true, places: false },
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
Indigenous Nations are not historical artifacts—they are living political entities with governments, citizens, lands, and economies.

Today Nations:
• exercise sovereignty over reservations, trust lands, and citizens
• revitalize languages through immersion schools and community programs
• protect sacred sites and water through litigation and co-management
• develop businesses, energy projects, and cultural tourism on their own terms
• participate in national and international Indigenous movements

The green points on the map mark federally recognized tribal headquarters. This map can only gesture toward contemporary reality. Real understanding comes from listening to Nation voices, visiting tribal museums, and reading Native-authored histories.
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

Possible next expansions include Nation-specific chapters, treaty maps by era, language family layers, timelines, and direct links to Nation websites and Native-led archives.

History does not end. Responsibility does not end. Learning does not end. Start with the Nations whose lands you live on or visit—listen to their own accounts first.
`,
    view: { center: [39.5, -98.35], zoom: 4 },
    layers: { regions: true, trails: false, tribes: true, places: true },
    sources: [],
  },
];
