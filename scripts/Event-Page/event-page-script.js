import { initMap } from "./Modules/event-page-map.js";
import { initSearch } from "./Modules/event-search.js";
import { eventList } from "../script.js";
import { hideAllEventPins, drawMemberPins } from "./Modules/event-page-map.js";

const params = new URLSearchParams(window.location.search);
const eventID = params.get("id");

// Init the map
await initMap();

if (eventID) {
    const event = eventList.find(event => event.EVENT_ID == eventID);
    if (event) {
        // Hide all other event pins
        hideAllEventPins(event);

        // Draw all the member pins
        drawMemberPins(event);
    }

}
// Init the search bar
initSearch();
