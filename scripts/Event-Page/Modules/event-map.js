import { fillCards } from "./event-stats.js";
import { fetchData } from "../../utils.js";

// Map Initialization
const map = L.map('mapid').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let memberLayerGroup = L.layerGroup().addTo(map); // Member markers
let eventLayerGroup = L.layerGroup().addTo(map);  // Event marker

export function updateMap(eventsToDisplay) {
    eventLayerGroup.clearLayers();

    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    eventsToDisplay.forEach(event => {
        const marker = L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE])
            .bindPopup(`${event.EVENT_NAME} in ${event.EVENT_CITY}, ${event.EVENT_STATE_ID}, ${event.COUNTRY_ID}`);
        eventLayerGroup.addLayer(marker);
    });

    // If only one event is filtered, zoom to it
    if (eventsToDisplay.length === 1) {
        map.flyTo([eventsToDisplay[0].EVENT_LATITUDE, eventsToDisplay[0].EVENT_LONGITUDE], 8);
        fillCards(eventsToDisplay[0]);
    } else if (eventsToDisplay.length > 1) {
        // If multiple events, fit bounds around them
        const group = new L.featureGroup(eventsToDisplay.map(event =>
            L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE])
        ));
        map.flyToBounds(group.getBounds(), { padding: L.point(50, 50) });
    } else {
        // If no events, reset view to initial
        map.setView([39.5, -98.35], 4);
    }
}

// Adds markers for the members on the map for selected event
export async function showMembersOnMap(eventId) {
    memberLayerGroup.clearLayers();

    let url = `../../PHP/getMembers.php?event_id=${eventId}`;
    const members = await fetchData(url);
    
    members.forEach(member => {
        if (member.MEMBER_LAT && member.MEMBER_LON) {
            const marker = L.circleMarker([member.MEMBER_LAT, member.MEMBER_LON], {
                radius: 6,
                color: "blue",
                fillColor: "blue",
                fillOpacity: 0.7
            }).bindPopup(`${member.MEMBER_FULL_NAME}<br>${member.MEMBER_CITY}, ${member.MEMBER_STATE_PROV}`);
            memberLayerGroup.addLayer(marker);
        }
    });
}