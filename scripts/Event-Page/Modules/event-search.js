import { eventList, playerList } from "../../script.js";
import { goToEvent } from "./event-page-map.js";
import { fillCards } from "./event-stats.js";

// Local variables
const searchRef = document.querySelector("#event-search");
const optionsRef = document.querySelector("#event-list");

// Set datalist
export function initSearch() {
    eventList.forEach(event => {
        optionsRef.innerHTML += `<option value="${event.EVENT_NAME}">`;
    });
}

searchRef.addEventListener("change", function () {
    // Update page
    const match = eventList.find(event => event.EVENT_NAME == searchRef.value);
    if (match) {
        fillCards(match);
        goToEvent(match);
    }
});