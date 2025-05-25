import { initMap } from "./Modules/event-page-map.js";
import { fillCards } from "./Modules/event-stats.js";
import { eventList, playerList } from "../script.js";
import { goToEvent } from "./Modules/event-page-map.js";

const params = new URLSearchParams(window.location.search);
const eventName = params.get("name");

// Init the map
initMap();

// Update page
fillCards(eventList.find(event => event.EVENT_NAME == eventName));
goToEvent(eventList.find(event => event.EVENT_NAME == eventName));
