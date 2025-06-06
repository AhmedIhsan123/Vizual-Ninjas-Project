import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
import { updateTopPlayers } from "./event-page-top-players.js";
import { buildTChart } from "./event-page-tchart.js";
// Local Variables
// Set the initial view to a specific location and zoom level
const map = L.map('players-map').setView([45.5, -98.35], 4);
export let currentMembers = [];
export const eventMarkers = [];
let memberMarkers = [];
let currentDrawnLines = [];
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

    // Add event markers
    addEventMarkers();
}

// A function that adds all the event pins to the map
export function addEventMarkers() {
    eventList.forEach(event => {
        // Store the events coordinates
        const coordinate = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];

        // Store the marker instance
        const marker = L.marker(coordinate);

        // Bind the popup to the marker
        marker.bindPopup(`<strong>${event.EVENT_NAME}</strong>`);

        // Add event listner for popup opened
        marker.on("popupopen", async () => {
            hideAllEventsExcept(event);
            await plotMemberPins(event); // Show the members attending event
            fillCards(event);
            updateTopPlayers(); // Update the top players for the event
            buildTChart(); // Build the chart for the event
            // Make the camera fit to pins
            const bounds = L.latLngBounds(Object.values(memberMarkers).map(m => m.getLatLng()));
            map.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 16,
                duration: 1.0
            });
        });

        // Add event listner for popup closed
        marker.on("popupclose", function () {
            showAllEvents(event);
            hideMemberPins();
            hideMemberLines();
            // Make the camera fit to pins
            const bounds = L.latLngBounds(Object.values(eventMarkers).map(m => m.getLatLng()));
            map.flyToBounds(bounds, {
                padding: [50, 50],
                maxZoom: 16,
                duration: 1.0
            });
        });

        // Add marker to list of markers
        map.addLayer(marker); // Adds it to the map
        eventMarkers[event.EVENT_ID] = marker;
    });
}

// This method removes all the pins except the one selected
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

// This method shows all the pins except the one selected because its already showing
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

export async function plotMemberPins(event) {
    // Fetch the list of members attending the event
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);

    members.forEach(member => {
        // Store the members coordinate
        const coordinate = [member.MEMBER_LAT, member.MEMBER_LON];

        // Store the member pin
        const marker = L.marker(coordinate, { icon: redIcon });

        // Draw a line from member to event
        drawLine([[event.EVENT_LATITUDE, event.EVENT_LONGITUDE], [member.MEMBER_LAT, member.MEMBER_LON]]);

        // Add the pin to the map and store the marker
        map.addLayer(marker);
        memberMarkers[member.PDGA_NUMBER] = marker;
        currentMembers.push(member);
    });
}

export function hideMemberPins() {
    // For every pin in the array
    for (const id in memberMarkers) {
        // Remove the member pins
        map.removeLayer(memberMarkers[id]);
    }

    // Reset the array
    memberMarkers = [];
    currentMembers = [];
}

export function hideMemberLines() {
    // For every line in the lines array
    currentDrawnLines.forEach(line => {
        map.removeLayer(line);
    });

    // Reset the array
    currentDrawnLines = [];
}

export function drawLine(coordinate) {
    // Store line drawn
    const line = L.polyline(coordinate, {
        color: 'red',
        weight: 4,
        opacity: 0.8,
        dashArray: '2, 5', // dash-dot style
        dashOffset: '5'
    });

    // Add the line to the list of lines
    map.addLayer(line);
    currentDrawnLines.push(line);
}