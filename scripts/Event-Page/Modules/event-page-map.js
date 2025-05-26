import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
const map = L.map('mapid').setView([45.5, -98.35], 4);
const eventMarkers = [];
const memberMarkers = [];
const drawnLines = [];
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
            // Show a popup with the events name
            marker.openPopup();

            // Hide all other event pins
            hideAllEventPins(event);

            // Draw all the member pins
            await drawMemberPins(event);
        });

        // Add an event listner for when the popup is closed
        marker.on('popupclose', function (e) {
            // Show all the event pins
            showAllEventPins(event);

            // Hide member pins
            hideAllMemberPins();
        });
    });
}

// A method that hides all event pins with an exception
function hideAllEventPins(e) {
    // Traverse all events
    eventList.forEach(event => {
        // Remove all pins expect for the selected event
        if (event != e) {
            // Remove all the pins by their event ID
            map.removeLayer(eventMarkers[event.EVENT_ID]);
        }
    });
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

async function drawMemberPins(event) {
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
        // drawLine([latLng, [event.EVENT_LATITUDE, event.EVENT_LONGITUDE]]);
    });
}

function hideAllMemberPins() {
    for (const pdgaid in memberMarkers) {
        map.removeLayer(memberMarkers[pdgaid]);
        delete memberMarkers[pdgaid];
    }
}