import { fetchData } from "./utils.js";
export async function initMap() {
    // Create a map instance
    // Set the initial view to a specific location and zoom level
    const map = L.map('mapid2').setView([39.5, -98.35], 4);

    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Fetch data from the server
    fetchData("./PHP/events.php").then(data => {
        // Loop through the data and add markers to the map
        data.forEach(event => {
            const marker = L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE]).addTo(map);
            marker.bindPopup(`
                <strong>${event.EVENT_NAME}</strong><br>
                ${event.COUNTRY_ID}, ${event.EVENT_STATE_ID}<br>
                ${event.EVENT_TIER_ID}<br>
                ${event.DATE_EVENT_END}
            `);
        });
    });
}

export function goToLocation(lat, lon, zoomLevel) {
    map.setView([lat, lon], zoomLevel);
}
