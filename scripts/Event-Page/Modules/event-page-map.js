import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
// Set the initial view to a specific location and zoom level
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
export function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add event markers
    addEventMarkers();
}

// A function that adds all the event pins to the map
export function addEventMarkers() {
    eventList.forEach(event => {
        // Store the events coordinates
        const coordinate = [event.EVENT_LATITIUDE, event.EVENT_LONGITUDE];

        // Store the marker instance
        const marker = L.marker(coordinate);

        // Bind the popup to the marker
        marker.bindPopup(`<strong>${event.EVENT_NAME}</strong>`);

        // Add event listner for popup opened
        marker.on("popupopen", function () {
            hideAllEventsExcept(event);
        });

        // Add event listner for popup closed
        marker.on("popupclose", function () {
            showAllEvents(event);
        });

        // Add marker to list of markers
        map.addLayer(marker); // Adds it to the map
        eventMarkers[event.EVENT_ID] = marker;
    });
}

export function hideAllEventsExcept(event) {
    // For every marker in the markers list
    for (const id in eventMarkers) {
        // Hide all the event pins except for exception
        if (id != event.EVENT_ID) {
            // Remove layer (hide pin)
            map.removeLayer(eventMarkers[id]);
        }
    }
}

export function showAllEvents(event) {
    // For every marker in the markers list
    for (const id in eventMarkers) {
        // Hide all the event pins except for exception
        if (id != event.EVENT_ID) {
            // Remove layer (hide pin)
            map.addLayer(eventMarkers[id]);
        }
    }
}