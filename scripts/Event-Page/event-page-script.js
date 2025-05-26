import { initMap } from "./Modules/event-page-map.js";
import { eventList } from "../script.js";

const params = new URLSearchParams(window.location.search);
const eventID = params.get("id");

// Init the map
await initMap();