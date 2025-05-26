import { initMap } from "./Modules/event-page-map.js";
import { initSearch } from "./Modules/event-search.js";
import { eventList } from "../script.js";
import { displayPin } from "./Modules/event-page-map.js";

const params = new URLSearchParams(window.location.search);
const eventID = params.get("id");

// Init the map
await initMap();

// Init the search bar
initSearch();
