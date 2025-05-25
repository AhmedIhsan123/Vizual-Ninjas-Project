import { initMap } from "./Modules/event-page-map.js";
import { fillCards } from "./Modules/event-stats.js";
import { eventList, playerList } from "../script.js";
import { goToEvent } from "./Modules/event-page-map.js";
import { initSearch } from "./Modules/event-search.js";

const params = new URLSearchParams(window.location.search);
const eventName = params.get("name");

// Init the map
initMap();

// Update page
const match = eventList.find(event => event.EVENT_NAME == eventName);
if (match) {
    fillCards(match);
    goToEvent(match);
} else { console.log(match) }

// Init the search bar
initSearch();
