import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
// Set the initial view to a specific location and zoom level
const map = L.map('mapid').setView([45.5, -98.35], 4);
const eventMarkers = [];
const memberMarkers = [];
const currentDrawnLines = [];
const eventSvgIcon = `
  <div class="lucide-marker">
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30"
      viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2"
      stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 11c0 4.418 7 11 7 11s7-6.582 7-11a7 7 0 1 0-14 0Z"/>
      <circle cx="12" cy="11" r="3"/>
    </svg>
  </div>
`;

// Initialize the map
export function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Loop through the data and add markers to the map
    eventList.forEach(event => {
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
        const eventIcon = L.divIcon({
            html: eventSvgIcon,
            className: "",
            iconSize: [30, 30],
            iconAnchor: [15, 30]
        });
        const marker = L.marker(latLng, { icon: eventIcon }).addTo(map);
        marker.bindPopup(`
            <strong>${event.EVENT_NAME}</strong><br>
            ${event.COUNTRY_ID}, ${event.EVENT_STATE_ID}<br>
            Event Tier: <strong>${event.EVENT_TIER_ID}</strong><br>
            End Date: <strong>${event.DATE_EVENT_END}</strong><br>
            Average Distance Traveled to Event: <strong>${event.AVG_TRAVEL_DISTANCE_MILES} miles</strong><br>
            <br>
            <em>It seems <strong>${event.MEMBERS_OUT_OF_STATE}</strong> members came from out of state, while only <strong>${event.MEMBERS_IN_STATE}</strong> were coming from in-state. This suggests that members are <strong>${event.MEMBERS_OUT_OF_STATE > event.MEMBERS_IN_STATE ? "more likely" : "less likely"}</strong> to attend events in this area.</em>`);
        // Store marker by a unique key (e.g., event ID or name)
        eventMarkers[event.EVENT_NAME] = marker;

        // Add click behavior
        marker.on('click', () => {
            goToEvent(event);
            fillCards(eventList.find(events => events.EVENT_NAME == event.EVENT_NAME));
            drawMembers(event);


            // Wait until the animation ends to open popup
            map.once('moveend', () => {
                marker.openPopup();
            });
        });
    });
}

// Add click event to each marker
export function goToEvent(event) {
    const marker = eventMarkers[event.EVENT_NAME];
    marker.openPopup();
    drawMembers(event);
}

export async function drawMembers(event) {
    // Fetch all the members coming to event
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);
    const eventLatLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

    if (currentDrawnLines.length > 0) {
        currentDrawnLines.forEach(line => {
            map.removeLayer(line);
        });
    }

    if (memberMarkers.length > 0) {
        memberMarkers.forEach(marker => {
            map.removeLayer(marker);
        })
    }

    members.forEach(member => {
        const latLng = [member.MEMBER_LAT, member.MEMBER_LON];
        const marker = L.marker(latLng).addTo(map);

        // Store marker by a unique key (e.g., event ID or name)
        memberMarkers.push(marker);

        const line = L.polyline(
            [latLng, eventLatLng],
            { color: "red", weight: 2, dashArray: "5, 5" }
        ).addTo(map);
        currentDrawnLines.push(line);
    })
}