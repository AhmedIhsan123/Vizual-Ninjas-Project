import { fetchData } from "./utils.js";
import { eventList } from "./Modules/event-list.js";

export async function initMap() {
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
                goToLocation(event.EVENT_LATITUDE, event.EVENT_LONGITUDE, 8);
            }
        });
    });
}

function goToLocation(lat, lon, zoomLevel) {
    map.setView([lat, lon], zoomLevel);
}
