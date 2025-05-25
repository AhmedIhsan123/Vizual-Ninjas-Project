import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
const map = L.map('mapid').setView([45.5, -98.35], 4);
const eventMarkers = [];
const memberMarkers = [];
const currentDrawnLines = [];
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

// Initialize the map
export async function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Call a function that draws all event pins
    await drawEventPins();
    console.log("Pins added!");
}

// A function that draws all the event pins
export async function drawEventPins() {
    // Clear all pins from markers list
    for (const eventid in eventMarkers) {
        map.removeLayer(eventMarkers[eventid]);
    }

    // Add pins to list
    eventList.forEach(event => {
        // Store coordinates in a constant
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

        // Add the pin to the map
        const marker = L.marker(latLng).addTo(map);

        // Store the marker in an associative array (Key - eventID)
        eventMarkers[event.EVENT_ID] = marker;

        // Bind a popup to the marker
        marker.bindPopup(`<strong>${event.EVENT_NAME}</strong>`);

        // Add onclick events to marker
        marker.on("click", async () => {
            // Draw member pins
            await drawMemberPins(event.EVENT_ID);

            // Fly to the pin once clicked
            map.flyTo(marker.getLatLng(), 8, {
                animate: true,
                duration: 1.0
            });

            // Show a popup with the events name
            marker.openPopup();

            // Call a function that hides all other event pins
            hideAllEventPins(event);
        });

        // Add an event listner for when the popup is closed
        marker.on('popupclose', function (e) {
            // Redraw all the events
            drawEventPins();

            // Remove all the member pins
            hideAllMemberPins();
        });
    });

    // Make the camera fit to pins
    const bounds = L.latLngBounds(Object.values(eventMarkers).map(m => m.getLatLng()));
    map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 16,
        duration: 1.0
    });
}

// A method that removes all the event pins expect the one to ignore
export function hideAllEventPins(eventIdToIgnore) {
    // Traverse the list of event markers
    for (const id in eventMarkers) {
        // Remove all pins that are not the selected event
        if (id != eventIdToIgnore) {
            map.removeLayer(eventMarkers[id]);
        }
    }
}

// A function that draws all the members pins that went to a cetain event
export async function drawMemberPins(event) {
    // Fetch all the members attending the evnt
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);

    // Clear all pins from markers list
    for (const pdgaid in memberMarkers) {
        map.removeLayer(memberMarkers[pdgaid]);
    }

    // For each member coming to the event
    members.forEach(member => {
        // Store coordinates in a constant
        const latLng = [member.MEMBER_LAT, member.MEMBER_LON];

        // Add the pin to the map
        const marker = L.marker(latLng, { icon: redIcon }).addTo(map);

        // Store the marker in an associative array (Key - PDGAID)
        memberMarkers[member.PDGA_NUMBER] = marker;

        // Draw line
        drawLine([latLng, [event.EVENT_LATITUDE, event.EVENT_LONGITUDE]]);
    });
}

function drawLine(latlngs) {
    // Store a line in a constant
    const animatedLine = L.polyline(latlngs, {
        dashArray: '10, 20',
        weight: 5,
        color: "red",
    }).addTo(map);
}

// Method to hide all member pins
export function hideAllMemberPins() {
    // Traverse the list of member markers
    for (const pdgaid in memberMarkers) {
        // Remove all pins
        map.removeLayer(memberMarkers[pdgaid]);
    }
}