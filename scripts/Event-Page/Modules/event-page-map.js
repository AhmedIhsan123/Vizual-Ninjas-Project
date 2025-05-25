import { eventList } from "../../script.js";
import { fetchData } from "../../utils.js";
import { fillCards } from "./event-stats.js";
// Local Variables
// Set the initial view to a specific location and zoom level
const map = L.map('mapid').setView([45.5, -98.35], 4);
let eventMarkers = [];
let memberMarkers = [];
let currentDrawnLines = [];

// Initialize the map
export function initMap() {
    // Add a tile layer to the map (OpenStreetMap tiles)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Loop through the data and add markers to the map
    eventList.forEach(event => {
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
        const marker = L.marker(latLng).addTo(map);
        marker.bindPopup(`<strong>${event.EVENT_NAME}</strong><br>`);
        // Store marker by a unique key (e.g., event ID or name)
        eventMarkers[event.EVENT_NAME] = marker;

        // Add click behavior
        marker.on('click', () => {
            for (const name in eventMarkers) {
                if (name != event.EVENT_NAME) {
                    map.removeLayer(eventMarkers[name]);
                }
            }
            goToEvent(event);
            fillCards(eventList.find(events => events.EVENT_NAME == event.EVENT_NAME));
        });

        marker.on('popupclose', function (e) {
            for (const name in eventMarkers) {
                eventMarkers[name].addTo(map);
            }
            currentDrawnLines.forEach(line => {
                map.removeLayer(line);
            });
            memberMarkers.forEach(marker => {
                map.removeLayer(marker);
            })
        });

    });
}

// Add click event to each marker
export function goToEvent(event) {
    const marker = eventMarkers[event.EVENT_NAME];
    marker.openPopup();
    drawMembers(event);
}

export async function drawMembers(event) {
    // Fetch all the members coming to event
    const members = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);
    const eventLatLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE];
    const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    for (const name in eventMarkers) {
        if (name != event.EVENT_NAME) {
            map.removeLayer(eventMarkers[name]);
        }
    }

    if (currentDrawnLines.length > 0) {
        currentDrawnLines.forEach(line => {
            map.removeLayer(line);
        });
    }

    if (memberMarkers.length > 0) {
        memberMarkers.forEach(marker => {
            map.removeLayer(marker);
        })
    }

    members.forEach(member => {
        const latLng = [member.MEMBER_LAT, member.MEMBER_LON];
        const marker = L.marker(latLng, { icon: redIcon }).addTo(map);

        // Store marker by a unique key (e.g., event ID or name)
        memberMarkers.push(marker);

        const line = L.polyline(
            [latLng, eventLatLng],
            { color: "red", weight: 2, dashArray: "5, 5" }
        ).addTo(map);
        currentDrawnLines.push(line);
    })
}