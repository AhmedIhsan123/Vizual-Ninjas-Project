import { initMap } from "./Modules/event-page-map.js";
import {eventMarkers } from "./Modules/event-page-map.js";

const params = new URLSearchParams(window.location.search);
const eventID = params.get("id");

// Init the map
await initMap();

// Open the popup for the selected event
if (eventID) {
    eventMarkers[eventID].openPopup();
}
