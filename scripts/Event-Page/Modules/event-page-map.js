import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";

// Initialize Leaflet map centered on the US
const map = L.map('mapid').setView([45.5, -98.35], 4);

// Arrays to store event and member markers
const eventMarkers = [];
const memberMarkers = [];
let drawnLines = [];

// Custom red marker icon for events
const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

/**
 * Initializes the map and adds event markers.
 * @param {boolean} startSelect - Whether to select a specific event on load.
 * @param {object} event - The event to select if startSelect is true.
 */
export async function initMap(startSelect, event) {
    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Create markers for all events
    createEventMarkers();

    // Show all markers or select a specific event
    if (startSelect) {
        selectEvent(event);
    } else {
        addAllEventMarkers();
    }
}

/**
 * Creates markers for each event and sets up their popups and click handlers.
 */
function createEventMarkers() {
    eventList.forEach(currentEvent => {
        const coordinates = [currentEvent.EVENT_LATITUDE, currentEvent.EVENT_LONGITUDE];
        const eventMarker = L.marker(coordinates);

        // Store marker by event ID
        eventMarkers[currentEvent.EVENT_ID] = eventMarker;

        // Bind popup with event name
        eventMarker.bindPopup(`<strong>${currentEvent.EVENT_NAME}</strong>`);

        // Show all other events when popup closes
        eventMarker.on("popupclose", function () {
            showAllEventsExcept(currentEvent);
        });

        // Focus on this event when marker is clicked
        eventMarker.on("click", function () {
            selectEvent(currentEvent);
        });
    });
}

/**
 * Selects a specific event by hiding all other event markers.
 * @param {object} event - The event to select.
 */
function selectEvent(event) {
    hideAllEventsExcept(event);
}

/**
 * Adds all event markers to the map.
 */
function addAllEventMarkers() {
    for (const id in eventMarkers) {
        eventMarkers[id].addTo(map);
    }
}

/**
 * Hides all event markers except the specified event.
 * @param {object} event - The event to keep visible.
 */
function hideAllEventsExcept(event) {
    for (const id in eventMarkers) {
        if (event.EVENT_ID != id) {
            map.removeLayer(eventMarkers[id]);
        }
    }
}

/**
 * Shows all event markers except the specified event.
 * @param {object} event - The event to keep hidden.
 */
function showAllEventsExcept(event) {
    for (const id in eventMarkers) {
        if (event.EVENT_ID != id) {
            eventMarkers[id].addTo(map);
        }
    }
}