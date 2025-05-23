import { fillCards } from "./event-stats";
// Map Initialization
const map = L.map('mapid').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

export function updateMap(eventsToDisplay) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    eventsToDisplay.forEach(event => {
        L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE])
            .addTo(map)
            .bindPopup(`${event.EVENT_NAME} in ${event.EVENT_CITY}, ${event.EVENT_STATE_ID}, ${event.COUNTRY_ID}`);
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
