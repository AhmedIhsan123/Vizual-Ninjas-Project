import { eventList, playerList } from "../../script.js";
import { goToEvent } from "./event-page-map.js";
import { fillCards } from "./event-stats.js";

// Local variables
const searchRef = document.querySelector("#event-search");
const optionsRef = document.querySelector("#event-list");

// Set datalist
export function initSearch() {
    console.log(22);
    eventList.forEach(event => {
        console.log(event)
        optionsRef.innerHTML += `<option value="${event.EVENT_NAME}">`;
    });
}
