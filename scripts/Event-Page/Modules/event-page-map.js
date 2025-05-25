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
    for (const pin in eventMarkers) {
        map.removeLayer(eventMarkers[pin]);
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
        marker.bindPop(`<strong>${event.EVENT_NAME}</strong>`);

        // Add onclick events to marker
        marker.on("click", () => {
            // Fly to the pin once clicked
            map.flyTo(marker.getLatLng(), 8, {
                animate: true,
                duration: 1.0
            });

            // Show a popup with the events name
            marker.openPopup();

            // Call a function that hides all other event pins
            hideAllEventPins(event.EVENT_ID);
        });
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