import { initMap } from "./Modules/event-page-map.js";
import { eventList } from "../script.js";
import { fillCards } from "./Modules/event-stats.js";
import { hideAllEventsExcept, plotMemberPins } from "./Modules/event-page-map.js";

const params = new URLSearchParams(window.location.search);
const eventID = params.get("id");

// Init the map
await initMap();

if (eventID) {
    const event = eventList.find(event => (event.EVENT_ID == eventID));
    hideAllEventsExcept(event);
    await plotMemberPins(event); // Show the members attending event
    fillCards(event);
}
