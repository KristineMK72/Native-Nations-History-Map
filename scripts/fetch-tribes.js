import fs from "fs";
import path from "path";

const DATA_URL = "https://native-land.ca/wp-content/uploads/2018/10/indigenousTerritories.json";
const OUTPUT_PATH = path.join("data", "tribes.js");

async function fetchAndProcess() {
    console.log("Fetching Indigenous Territories data...");
    try {
        const res = await fetch(DATA_URL);
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        const geojson = await res.json();

        const processedTribes = geojson.features
            .map(feature => {
                const name = feature.properties?.Name || feature.properties?.name;
                if (!name) return null;

                const coords = feature.geometry.coordinates;
                const type = feature.geometry.type;
                let latSum = 0, lngSum = 0, count = 0;

                // Helper to process a single Polygon ring
                const processRing = (ring) => {
                    ring.forEach(([lng, lat]) => {
                        latSum += lat;
                        lngSum += lng;
                        count++;
                    });
                };

                if (type === "Polygon") {
                    processRing(coords[0]);
                } else if (type === "MultiPolygon") {
                    coords.forEach(polygon => processRing(polygon[0]));
                }

                if (count === 0) return null;

                return {
                    name,
                    lat: parseFloat((latSum / count).toFixed(5)),
                    lng: parseFloat((lngSum / count).toFixed(5)),
                    state: "",
                    link: "https://native-land.ca/"
                };
            })
            .filter(t => t !== null)
            .sort((a, b) => a.name.localeCompare(b.name));

        // Ensure directory exists
        if (!fs.existsSync("data")) fs.mkdirSync("data");

        const fileContent = `export const TRIBES = ${JSON.stringify(processedTribes, null, 2)};`;
        fs.writeFileSync(OUTPUT_PATH, fileContent);

        console.log(`✅ Success! Wrote ${processedTribes.length} tribes to ${OUTPUT_PATH}`);
    } catch (error) {
        console.error("❌ Failed to process data:", error.message);
    }
}

fetchAndProcess();
