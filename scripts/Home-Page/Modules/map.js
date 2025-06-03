import { eventList } from "../../script.js";

// Make markers and map accessible outside
let markers = {};
let map;

export async function initMap() {

    map = L.map('events-map').setView([45.5, -98.35], 4);
    markers = {}; // reset global markers

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    eventList.forEach(event => {
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
        const marker = L.marker(latLng).addTo(map);
        marker.bindPopup(`
            <strong>${event.EVENT_NAME}</strong><br>
            ${event.COUNTRY_ID}, ${event.EVENT_STATE_ID}<br>
            Event Tier: <strong>${event.EVENT_TIER_ID}</strong><br>
            End Date: <strong>${event.DATE_EVENT_END}</strong><br>
            Average Distance Traveled to Event: <strong>${event.AVG_TRAVEL_DISTANCE_MILES} miles</strong><br>
            <br>
            <em>It seems <strong>${event.MEMBERS_OUT_OF_STATE}</strong> members came from out of state, while <strong>${event.MEMBERS_IN_STATE}</strong> were coming from in-state. This suggests that members from <strong>${event.MEMBERS_OUT_OF_STATE > event.MEMBERS_IN_STATE ? "out of state" : "in state"}</strong> are <strong>more likely</strong> to attend events in this area.</em>
            <br>
            <a href="https://aabualhawa.greenriverdev.com/SDEV280/Statmando-Project/event-page.html?id=${event.EVENT_ID}">View Details</a>`);
        markers[event.EVENT_NAME] = marker;

        marker.on('click', () => {
            map.flyTo(latLng, 13, { animate: true, duration: 1.5 });
            map.once('moveend', () => {
                marker.openPopup();
                updateMapLabel(event);
            });
        });
    });

    // Add event listener for table rows
    const tableRows = document.querySelectorAll(".table-content tbody tr");

    // Add click event to each row
    tableRows.forEach(row => {
        row.addEventListener("click", function () {
            const eventId = this.querySelector("td").innerText;
            focusOnEvent(eventId);
        });
    });
}

// Export this so chart can use it
export function focusOnEvent(eventId) {
    const event = eventList.find(e => e.EVENT_ID == eventId);
    if (!event) return;

    const marker = markers[event.EVENT_NAME];
    if (!marker) return;

    const latLng = marker.getLatLng();
    map.flyTo(latLng, 14, { duration: 1.25 });
    map.once('moveend', () => {
        marker.openPopup();
        updateMapLabel(event);
    });
}

export function updateMapLabel(event) {
    const labelElement = document.getElementById('map-event-label');
    if (labelElement) {
        labelElement.innerHTML = `${event.EVENT_NAME}`;
    }
}