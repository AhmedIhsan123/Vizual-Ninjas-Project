import { fetchData } from "./utils.js";
import { eventList } from "./Home-Page/Modules/event-list.js"

export async function initMap() {
    // Set the initial view to a specific location and zoom level
    const map = L.map('mapid2').setView([39.5, -98.35], 4);
    const markers = [];

    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Fetch data from the server
    await fetchData("./PHP/events.php").then(data => {
        // Loop through the data and add markers to the map
        data.forEach(event => {
            const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

            const marker = L.marker(latLng).addTo(map);
            marker.bindPopup(`
            <strong>${event.EVENT_NAME}</strong><br>
            ${event.COUNTRY_ID}, ${event.EVENT_STATE_ID}<br>
            ${event.EVENT_TIER_ID}<br>
            ${event.DATE_EVENT_END}`);
            // Store marker by a unique key (e.g., event ID or name)
            markers[event.EVENT_NAME] = marker;
        });
    });

    // Add event listener for table rows
    const tableRows = document.querySelectorAll("#event-table tbody tr");
    console.log("Table rows:", tableRows);
    tableRows.forEach(row => {
        console.log(row)
        row.addEventListener("click", function () {
            console.log("Clicked row:", this);
            const eventId = this.querySelector("td").innerText;
            const event = eventList.find(e => e.EVENT_ID == eventId);
            if (event) {
                goToEvent(event.EVENT_NAME, 10);
            }
        });
    });

    function goToEvent(name) {
        const marker = markers[name];
        if (!marker) return;

        const latLng = marker.getLatLng();
        map.flyTo(latLng, 14, { duration: 1.5 });

        // Wait until the map finishes moving before showing popup
        map.once('moveend', () => {
            marker.openPopup();
        });
    }
}
