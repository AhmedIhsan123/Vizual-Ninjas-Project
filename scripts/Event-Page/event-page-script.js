import { initMap } from "./Modules/event-page-map.js";
import { initSearch } from "./Modules/event-search.js";

const params = new URLSearchParams(window.location.search);
const eventName = params.get("name");

// Init the map
await initMap();

// Init the search bar
initSearch();
