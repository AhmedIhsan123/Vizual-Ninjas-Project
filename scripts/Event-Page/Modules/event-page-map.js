import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
const map = L.map('mapid').setView([45.5, -98.35], 4);
const eventMarkers = [];
const memberMarkers = [];
let drawnLines = [];
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

    // Make the camera fit to pins
    const bounds = L.latLngBounds(Object.values(eventMarkers).map(m => m.getLatLng()));
    map.flyToBounds(bounds, {
        padding: [25, 25],
        maxZoom: 14,
        duration: 1.0
    });
}

async function drawEventPins() {
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
            // Hide all other event pins
            hideAllEventPins(event);

            // Draw all the member pins
            await drawMemberPins(event);
        });

        // Add an event listner for when the popup is closed
        marker.on('popupclose', function (e) {
            // Show all the event pins
            showAllEventPins(event);

            // Make the camera fit to pins
            const bounds = L.latLngBounds(Object.values(eventMarkers).map(m => m.getLatLng()));
            map.flyToBounds(bounds, {
                padding: [25, 25],
                maxZoom: 14,
                duration: 1.0
            });

            // Hide member pins
            hideAllMemberPins();
        });
    });
}

// A method that hides all event pins with an exception
export function hideAllEventPins(e) {
    // Traverse all events
    eventList.forEach(event => {
        // Remove all pins expect for the selected event
        if (event != e) {
            // Remove all the pins by their event ID
            map.removeLayer(eventMarkers[event.EVENT_ID]);
        }
    });

    // Open the popup for the selected event
    eventMarkers[e.EVENT_ID].openPopup();

    // Update the stats
    fillCards(e);
}

// A method that shows all event pins with an exception
function showAllEventPins(e) {
    // Traverse all the events
    eventList.forEach(event => {
        // Check if the current event doesn't equal selected event
        if (event != e) {
            // Add all events except already showing event
            eventMarkers[event.EVENT_ID].addTo(map);
        }
    });
}

export async function drawMemberPins(event) {
    // Fetch all the members attending the evnt
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);

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

    // Make the camera fit to pins
    const bounds = L.latLngBounds(Object.values(memberMarkers).map(m => m.getLatLng()));
    map.flyToBounds(bounds, {
        padding: [50, 50],
        maxZoom: 20,
        duration: 1.0
    });
}

// A function that hides all the member pins/lines and deletes them
function hideAllMemberPins() {
    // Delete all the pins
    for (const pdgaid in memberMarkers) {
        map.removeLayer(memberMarkers[pdgaid]);
        delete memberMarkers[pdgaid];
    }

    // Delete and clear all the drawn lines
    drawnLines.forEach(line => {
        map.removeLayer(line);
    })
    drawnLines = [];
}

// A function that draws a line between two coordinates
function drawLine(latlngs) {
    // Store a line in a constant
    const animatedLine = L.polyline(latlngs, {
        dashArray: '10, 20',
        weight: 5,
        color: "red",
    }).addTo(map);

    // Add to array of lines
    drawnLines.push(animatedLine);
}