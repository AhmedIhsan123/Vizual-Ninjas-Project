import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
const map = L.map('mapid').setView([45.5, -98.35], 4);
export let eventMarkers = [];
export let memberMarkers = [];
export let drawnLines = [];
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

    storeEventPins();
}

export function storeEventPins() {
    eventList.forEach(event => {
        // Store coordinates in a constant
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

        // Add the pin to the map
        const marker = L.marker(latLng);

        // Store the marker in an associative array (Key - eventID)
        eventMarkers[event.EVENT_ID] = marker;

        // Bind a popup to the marker
        marker.bindPopup(`<strong>${event.EVENT_NAME}</strong>`);

        // Add onclick events to marker
        marker.on("click", async () => {
        });

        // Add an event listner for when the popup is closed
        marker.on('popupclose', function () {
            for (const eventid in eventMarkers) {
                if (eventid != event.EVENT_ID) {
                    displayPin(eventid);
                }
            }
        });
    });
}

export function displayPin(eventID) {
    // Add the pin to the map
    eventMarkers[eventID].addTo(map);
    // eventMarkers[eventID].openPopup();
}
