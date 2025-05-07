// src/services/trafficService.ts

/**
 * Geoapify Route Matrix API
 * Toont actuele files tussen Amersfoort en grote steden in Nederland
 */

// Gebruik je eigen API-sleutel van Geoapify
const GEOAPIFY_API_KEY = "645fa37d585e4025a598c70db1093c9c";

export interface TrafficIncident {
    id: string;
    roads: string[];
    description: string;
    delayMinutes: number;
    start: { lat: number; lon: number };
    end: { lat: number; lon: number };
}

// Amersfoort coördinaten
const AMERSFOORT = { lat: 52.1561, lon: 5.3878 };

// Belangrijke steden in Nederland met bijbehorende hoofdwegen vanaf Amersfoort
const MAJOR_CITIES = [
    { name: "Amsterdam", lat: 52.3676, lon: 4.9041, roads: ["A1"] },
    { name: "Utrecht", lat: 52.0907, lon: 5.1214, roads: ["A28"] },
    { name: "Rotterdam", lat: 51.9244, lon: 4.4777, roads: ["A28", "A12", "A20"] },
    { name: "Den Haag", lat: 52.0705, lon: 4.3007, roads: ["A28", "A12"] },
    { name: "Eindhoven", lat: 51.4416, lon: 5.4697, roads: ["A28", "A27", "A2"] },
    { name: "Arnhem", lat: 51.9851, lon: 5.8987, roads: ["A1", "A30"] },
    { name: "Zwolle", lat: 52.5168, lon: 6.0830, roads: ["A28"] }
];

export const fetchTrafficIncidents = async (): Promise<TrafficIncident[]> => {
    try {
        console.log("🛣️ Ophalen verkeersincidenten met Route Matrix API...");

        // Voorbereiden van de data voor de Route Matrix API
        const sources = [{
            location: [AMERSFOORT.lon, AMERSFOORT.lat]
        }];

        const targets = MAJOR_CITIES.map(city => ({
            location: [city.lon, city.lat]
        }));

        // Route Matrix API aanroepen
        const url = `https://api.geoapify.com/v1/routematrix?apiKey=${GEOAPIFY_API_KEY}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mode: 'drive',
                sources: sources,
                targets: targets,
                options: {
                    traffic: 'approximated' // Verkeersgegevens meenemen
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Geoapify API gaf status ${response.status}`);
        }

        const data = await response.json();
        console.log("Ontvangen data:", data);

        const incidents: TrafficIncident[] = [];

        // Verwerk de resultaten
        if (data && data.sources_to_targets && data.sources_to_targets.length > 0) {
            const results = data.sources_to_targets[0]; // Resultaten van Amersfoort naar alle steden

            // Voor elke bestemming, bereken de vertraging
            results.forEach((result: any, index: number) => {
                const city = MAJOR_CITIES[index];

                // Controleer of er reistijdgegevens zijn
                if (result && result.time !== undefined) {
                    const timeWithTraffic = result.time; // reistijd met verkeer in seconden
                    const timeWithoutTraffic = result.time_without_traffic || timeWithTraffic * 0.8; // schatting indien niet beschikbaar

                    // Bereken vertraging in minuten
                    const delaySeconds = timeWithTraffic - timeWithoutTraffic;
                    const delayMinutes = Math.max(0, Math.round(delaySeconds / 60));

                    // Maak beschrijving op basis van vertraging
                    let description = "";
                    if (delayMinutes > 15) {
                        description = `Zware file richting ${city.name}`;
                    } else if (delayMinutes > 5) {
                        description = `File richting ${city.name}`;
                    } else if (delayMinutes > 0) {
                        description = `Lichte vertraging richting ${city.name}`;
                    } else {
                        description = `Geen files richting ${city.name}`;
                    }

                    // Voeg incident toe
                    incidents.push({
                        id: `route-${city.name}`,
                        roads: city.roads,
                        description: description,
                        delayMinutes: delayMinutes,
                        start: AMERSFOORT,
                        end: { lat: city.lat, lon: city.lon }
                    });
                }
            });
        }

        // Sorteer incidenten op vertraging (langste vertraging eerst)
        return incidents.sort((a, b) => b.delayMinutes - a.delayMinutes);
    } catch (error) {
        console.error("Fout bij ophalen verkeersincidenten:", error);
        return [];
    }
};