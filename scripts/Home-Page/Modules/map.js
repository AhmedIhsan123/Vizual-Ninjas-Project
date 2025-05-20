import { fetchData } from "../../utils.js";
import { eventList } from "../home-script.js";

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
            Event Tier: <strong>${event.EVENT_TIER_ID}</strong><br>
            End Date: <strong>${event.DATE_EVENT_END}</strong><br>
            <br>
            <em>It seems ${event.MEMBERS_OUT_OF_STATE} members came from out of state, while only ${event.MEMBERS_IN_STATE} were coming from in-state. This suggests that members are ${event.MEMBERS_OUT_OF_STATE > event.MEMBERS_IN_STATE ? "more likely" : "less likely"} to attend events in this area.</em>`);
            // Store marker by a unique key (e.g., event ID or name)
            markers[event.EVENT_NAME] = marker;

            // Add click behavior
            marker.on('click', () => {
                map.flyTo(latLng, 13, {
                    animate: true,
                    duration: 1.5
                });

                // Wait until the animation ends to open popup
                map.once('moveend', () => {
                    marker.openPopup();
                });
            });
        });
    });

    // Add event listener for table rows
    const tableRows = document.querySelectorAll("#event-table tbody tr");

    // Add click event to each row
    tableRows.forEach(row => {
        row.addEventListener("click", function () {
            console.log("Clicked row:", this);
            const eventId = this.querySelector("td").innerText;
            const event = eventList.find(e => e.EVENT_ID == eventId);
            if (event) {
                goToEvent(event.EVENT_NAME, 10);
            }
        });
    });

    // Add click event to each marker
    function goToEvent(name) {
        const marker = markers[name];
        if (!marker) return;

        const latLng = marker.getLatLng();
        map.flyTo(latLng, 14, { duration: 1.25 });

        // Wait until the map finishes moving before showing popup
        map.once('moveend', () => {
            marker.openPopup();
        });
    }
}
