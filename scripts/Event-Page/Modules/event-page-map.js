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
export function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    storeEventPins();
    console.log(eventMarkers);
}

export function storeEventPins() {
    eventList.forEach(event => {
        const latlon = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
        const marker = L.marker(latlon);
        eventMarkers[event.EVENT_ID] = marker;
    });
}