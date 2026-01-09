// /data/places.js

function commonsFilePath(fileName) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}`;
}
function commonsFilePage(fileName) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(fileName)}`;
}

export const PLACES = [
  {
    name: "Cahokia Mounds",
    type: "Ancestral Site",
    lat: 38.6551,
    lng: -90.0618,
    image: {
      src: commonsFilePath("Cahokia Mounds.jpg"),
      alt: "Cahokia Mounds State Historic Site.",
      credit: "Prayitno / Wikimedia Commons",
      license: "CC BY 2.0 (see file page)",
      href: commonsFilePage("Cahokia Mounds.jpg"),
    },
    body: "The largest pre-Columbian settlement north of Mexico, a major center of the Mississippian culture.",
    sources: [{ label: "UNESCO World Heritage", href: "https://whc.unesco.org/en/list/198" }],
  }, //  [oai_citation:0‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ACahokia_Mounds.jpg?utm_source=chatgpt.com)

  // ✅ Added
  {
    name: "Ocmulgee Mounds (Macon, Georgia)",
    type: "Ancestral Site",
    lat: 32.8446,
    lng: -83.6030,
    image: {
      src: commonsFilePath("Mounds at Ocmulgee National Monument, Bibb County, GA, US.jpg"),
      alt: "Mounds at Ocmulgee (Ocmulgee Mounds National Historical Park area).",
      credit: "Judson McCranie / Wikimedia Commons",
      license: "CC BY-SA 3.0 (see file page)",
      href: commonsFilePage("Mounds at Ocmulgee National Monument, Bibb County, GA, US.jpg"),
    },
    body: "A major Mississippian-era ceremonial center with earthworks and long Indigenous history in the Southeast.",
    sources: [{ label: "Wikimedia Commons – Ocmulgee category", href: "https://commons.wikimedia.org/wiki/Category:Ocmulgee_Mounds_National_Historical_Park" }],
  }, //  [oai_citation:1‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AMounds_at_Ocmulgee_National_Monument%2C_Bibb_County%2C_GA%2C_US.jpg?utm_source=chatgpt.com)

  {
    name: "Beringia Land Bridge (Region)",
    type: "Origin / Context",
    lat: 64.0,
    lng: -168.0,
    image: {
      // Reuse the same Beringia map you already used in chapters
      src: commonsFilePath("Beringia-Map Bathymetry web72 final.png"),
      alt: "Map showing the ancient Beringia land bridge and surrounding bathymetry.",
      credit: "National Park Service (via Wikimedia Commons)",
      license: "Public domain (verify on file page)",
      href: commonsFilePage("Beringia-Map Bathymetry web72 final.png"),
    },
    body: "Beringia is discussed in some scientific models of early settlement; many Nations also hold distinct origin teachings tied to homelands.",
    sources: [{ label: "NPS – Bering Land Bridge", href: "https://www.nps.gov/bela/index.htm" }],
  },

  {
    name: "Wounded Knee",
    type: "Historical Event",
    lat: 43.1411,
    lng: -102.3619,
    image: {
      src: commonsFilePath("Wounded Knee.jpg"),
      alt: "Historic photo labeled 'Wounded Knee'.",
      credit: "US federal government (FSA/OWI) / Wikimedia Commons",
      license: "Public domain (see file page)",
      href: commonsFilePage("Wounded Knee.jpg"),
    },
    body: "Site of the 1890 massacre of Lakota people by the U.S. Army.",
    sources: [{ label: "Britannica", href: "https://www.britannica.com/event/Wounded-Knee-Massacre" }],
  }, //  [oai_citation:2‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AWounded_Knee.jpg?utm_source=chatgpt.com)

  {
    name: "Taos Pueblo",
    type: "Living Community / Landmark",
    lat: 36.4391,
    lng: -105.5455,
    image: {
      src: commonsFilePath("Taos Pueblo, NM.jpg"),
      alt: "Taos Pueblo buildings in New Mexico.",
      credit: "John Phelan / Wikimedia Commons",
      license: "Check file page",
      href: commonsFilePage("Taos Pueblo, NM.jpg"),
    },
    body: "One of the oldest continuously inhabited communities in the United States; living Pueblo community and UNESCO site.",
    sources: [{ label: "Pueblo of Taos", href: "https://taospueblo.com/" }],
  }, //  [oai_citation:3‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ATaos_Pueblo%2C_NM.jpg?utm_source=chatgpt.com)

  {
    name: "Chaco Culture National Historical Park",
    type: "Ancestral Site",
    lat: 36.059,
    lng: -107.965,
    image: {
      src: commonsFilePath("Chaco Canyon Chetro Ketl great kiva plaza NPS.jpg"),
      alt: "Great kiva plaza at Chaco Canyon (Chetro Ketl).",
      credit: "National Park Service / Wikimedia Commons",
      license: "Public domain (see file page)",
      href: commonsFilePage("Chaco Canyon Chetro Ketl great kiva plaza NPS.jpg"),
    },
    body: "Major center of Ancestral Puebloan history with great houses and road systems; culturally significant to many Pueblo Nations.",
    sources: [{ label: "NPS – Chaco Culture", href: "https://www.nps.gov/chcu/index.htm" }],
  }, //  [oai_citation:4‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AChaco_Canyon_Chetro_Ketl_great_kiva_plaza_NPS.jpg?utm_source=chatgpt.com)

  {
    name: "Mesa Verde (Region)",
    type: "Ancestral Site",
    lat: 37.23,
    lng: -108.46,
    image: {
      src: commonsFilePath("Mesa Verde Cliff Dwellings.jpg"),
      alt: "Cliff dwelling at Mesa Verde National Park.",
      credit: "Dwatsonfam / Wikimedia Commons",
      license: "Check file page",
      href: commonsFilePage("Mesa Verde Cliff Dwellings.jpg"),
    },
    body: "Cliff dwellings and ancestral sites associated with Ancestral Puebloan history; culturally significant to Pueblo Nations.",
    sources: [{ label: "NPS – Mesa Verde", href: "https://www.nps.gov/meve/index.htm" }],
  }, //  [oai_citation:5‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AMesa_Verde_Cliff_Dwellings.jpg?utm_source=chatgpt.com)

  {
    name: "Poverty Point",
    type: "Ancestral Site",
    lat: 32.639,
    lng: -91.409,
    image: {
      src: commonsFilePath("Poverty Point World Heritage Site.jpg"),
      alt: "Poverty Point World Heritage Site landscape.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Poverty Point World Heritage Site.jpg"),
    },
    body: "Monumental earthworks and mounds reflecting complex societies in the Lower Mississippi Valley.",
    sources: [{ label: "UNESCO – Poverty Point", href: "https://whc.unesco.org/en/list/1435" }],
  }, //  [oai_citation:6‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3APoverty_Point_World_Heritage_Site.jpg?utm_source=chatgpt.com)

  {
    name: "Serpent Mound (Ohio)",
    type: "Earthworks / Sacred Landscape",
    lat: 39.025,
    lng: -83.429,
    image: {
      src: commonsFilePath("Serpent Mound (aerial view).jpg"),
      alt: "Aerial view of the Great Serpent Mound in Ohio.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Serpent Mound (aerial view).jpg"),
    },
    body: "Effigy mound and sacred landscape; exact cultural attribution and dating are complex and debated in scholarship.",
    sources: [{ label: "Ohio History Connection", href: "https://www.ohiohistory.org/visit/browse-historical-sites/serpent-mound/" }],
  }, //  [oai_citation:7‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ASerpent_Mound_%28aerial_view%29.jpg?utm_source=chatgpt.com)

  {
    name: "Bear Paw Battlefield (Montana)",
    type: "Historical Event",
    lat: 48.56,
    lng: -109.86,
    image: {
      src: commonsFilePath("Bear Paw Battlefield.jpg"),
      alt: "Bear Paw Battlefield (Montana).",
      credit: "National Park Service / Wikimedia Commons",
      license: "Public domain (see file page)",
      href: commonsFilePage("Bear Paw Battlefield.jpg"),
    },
    body: "Associated with the 1877 Nez Perce (Nimiipuu) flight and surrender area; a painful and significant history.",
    sources: [{ label: "NPS – Nez Perce NHP", href: "https://www.nps.gov/nepe/index.htm" }],
  }, //  [oai_citation:8‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ABear_Paw_Battlefield.jpg?utm_source=chatgpt.com)

  {
    name: "Bosque Redondo Memorial (Fort Sumner area)",
    type: "Historical Event",
    lat: 34.47,
    lng: -104.25,
    image: {
      src: commonsFilePath("Bosque Redondo Memorial.jpg"),
      alt: "Bosque Redondo Memorial at Fort Sumner, New Mexico.",
      credit: "Pattie / Wikimedia Commons",
      license: "Check file page",
      href: commonsFilePage("Bosque Redondo Memorial.jpg"),
    },
    body: "Associated with the Diné (Navajo) Long Walk and incarceration at Bosque Redondo.",
    sources: [{ label: "NPS – Fort Sumner / Bosque Redondo", href: "https://www.nps.gov/places/fort-sumner-bosque-redondo.htm" }],
  }, //  [oai_citation:9‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ABosque_Redondo_Memorial.jpg?utm_source=chatgpt.com)

  {
    name: "Bdote / Fort Snelling area (Minnesota)",
    type: "Sacred Place / Historical Event",
    lat: 44.889,
    lng: -93.18,
    image: {
      src: commonsFilePath("Fort Snelling Historic Site, Fort Snelling, Minnesota.jpg"),
      alt: "Fort Snelling area near the confluence of the Minnesota and Mississippi Rivers.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Fort Snelling Historic Site, Fort Snelling, Minnesota.jpg"),
    },
    body: "Bdote (confluence area) is deeply significant to Dakota people; the Fort Snelling area is also tied to Dakota U.S. detention/exile history.",
    sources: [],
  }, //  [oai_citation:10‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AFort_Snelling_Historic_Site%2C_Fort_Snelling%2C_Minnesota.jpg?utm_source=chatgpt.com)

  {
    name: "Little Bighorn Battlefield (Montana)",
    type: "Historical Event",
    lat: 45.566,
    lng: -107.42,
    image: {
      src: commonsFilePath("Little Bighorn Battlefield National Monument.JPG"),
      alt: "View at Little Bighorn Battlefield National Monument.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Little Bighorn Battlefield National Monument.JPG"),
    },
    body: "Battlefield associated with the 1876 conflict involving Lakota, Northern Cheyenne, Arapaho, and the U.S. Army.",
    sources: [{ label: "NPS – Little Bighorn Battlefield", href: "https://www.nps.gov/libi/index.htm" }],
  }, //  [oai_citation:11‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ALittle_Bighorn_Battlefield_National_Monument.JPG?utm_source=chatgpt.com)

  {
    name: "Sand Creek (Colorado)",
    type: "Historical Event",
    lat: 38.455,
    lng: -102.323,
    image: {
      src: commonsFilePath("Sand Creek Massacre National Historic Site Visitor and Education Center.JPG"),
      alt: "Sand Creek Massacre National Historic Site visitor and education center.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Sand Creek Massacre National Historic Site Visitor and Education Center.JPG"),
    },
    body: "Site associated with the 1864 Sand Creek Massacre of Cheyenne and Arapaho people.",
    sources: [{ label: "NPS – Sand Creek Massacre NHS", href: "https://www.nps.gov/sand/index.htm" }],
  }, //  [oai_citation:12‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3ASand_Creek_Massacre_National_Historic_Site_Visitor_and_Education_Center.JPG?utm_source=chatgpt.com)

  {
    name: "Alcatraz Island",
    type: "Modern Indigenous Activism",
    lat: 37.8267,
    lng: -122.423,
    image: {
      src: commonsFilePath("Alcatraz Island - From Prison to Occupation.jpg"),
      alt: "Alcatraz Island image referencing prison history and 1969–1971 occupation.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("Alcatraz Island - From Prison to Occupation.jpg"),
    },
    body: "Site associated with the 1969–1971 Occupation of Alcatraz and a broader era of Indigenous activism.",
    sources: [{ label: "NPS – Alcatraz", href: "https://www.nps.gov/alca/index.htm" }],
  }, //  [oai_citation:13‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AAlcatraz_Island_-_From_Prison_to_Occupation.jpg?utm_source=chatgpt.com)

  {
    name: "Mission San Diego de Alcalá (San Diego)",
    type: "Colonial Mission System",
    lat: 32.784,
    lng: -117.106,
    image: {
      src: commonsFilePath("MISSION SAN DIEGO DE ALCALA, SAN DIEGO, CA.jpg"),
      alt: "Mission San Diego de Alcalá in San Diego, California.",
      credit: "Wikimedia Commons (see file page)",
      license: "Check file page",
      href: commonsFilePage("MISSION SAN DIEGO DE ALCALA, SAN DIEGO, CA.jpg"),
    },
    body: "One of the early missions in Alta California; mission history is intertwined with Indigenous labor, displacement, and cultural disruption.",
    sources: [],
  }, //  [oai_citation:14‡Wikimedia Commons](https://commons.wikimedia.org/wiki/File%3AMISSION_SAN_DIEGO_DE_ALCALA%2C_SAN_DIEGO%2C_CA.jpg?utm_source=chatgpt.com)
];
