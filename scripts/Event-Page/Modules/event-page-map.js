import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
// Set the initial view to a specific location and zoom level
const map = L.map('mapid').setView([45.5, -98.35], 4);
const eventMarkers = [];
const memberMarkers = [];

// Initialize the map
export function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Loop through the data and add markers to the map
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
            <em>It seems <strong>${event.MEMBERS_OUT_OF_STATE}</strong> members came from out of state, while only <strong>${event.MEMBERS_IN_STATE}</strong> were coming from in-state. This suggests that members are <strong>${event.MEMBERS_OUT_OF_STATE > event.MEMBERS_IN_STATE ? "more likely" : "less likely"}</strong> to attend events in this area.</em>`);
        // Store marker by a unique key (e.g., event ID or name)
        eventMarkers[event.EVENT_NAME] = marker;

        // Add click behavior
        marker.on('click', () => {
            map.flyTo(latLng, 13, {
                animate: true,
                duration: 1.5
            });
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
    const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
    const marker = eventMarkers[event.EVENT_NAME];
    map.flyTo(latLng, 13, {
        animate: true,
        duration: 1.5
    });

    // Wait until the animation ends to open popup
    map.once('moveend', () => {
        marker.openPopup();
        drawMembers(event);
    });
}

export async function drawMembers(event) {
    // Fetch all the members coming to event
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);
    const eventLatLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

    members.forEach(member => {
        const latLng = [member.MEMBER_LAT, member.MEMBER_LON];
        const marker = L.marker(latLng).addTo(map);
        // Store marker by a unique key (e.g., event ID or name)
        memberMarkers[member.MEMBER_FULL_NAME] = marker;
        console.log(memberMarkers)

        const line = L.polyline(
            [latLng, eventLatLng],
            { color: "red", weight: 2, dashArray: "5, 5" }
        ).addTo(map);
    })
}