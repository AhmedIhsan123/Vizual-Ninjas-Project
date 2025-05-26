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
export async function initMap(startSelect, event) {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Create markers for all the events
    createEventMarkers();

    if (startSelect) {
        selectEvent(event);
    } else {
        addAllEventMarkers();
    }
}

function createEventMarkers() {
    // For every event
    eventList.forEach(currentEvent => {
        // Store the cooridnates of the current event
        const coordinates = [currentEvent.EVENT_LATITUDE, currentEvent.EVENT_LONGITUDE];

        // Store the marker in a constant
        const eventMarker = L.marker(coordinates);

        // Store the marker in an array of markers
        eventMarkers[currentEvent.EVENT_ID] = eventMarker;
    });
}

function selectEvent(event) {

}

function addAllEventMarkers() {
    // For each marker in the event markers array
    for (const id in eventMarkers) {
        eventMarkers[id].addTo(map);
    }
}