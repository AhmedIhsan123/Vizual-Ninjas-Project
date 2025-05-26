import { eventList, playerList } from "../../script.js";
import { hideAllEventsExcept, showAllEventsExcept, eventMarkers, map } from "./event-page-map.js";

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
    if (searchRef.value != "") {
        const event = eventList.find(event => event.EVENT_NAME == searchRef.value);
        for (const id in eventMarkers) {
            if (id != event.EVENT_ID) {
                eventMarkers[id].addTo(map);
            }
        }
        hideAllEventsExcept(event);
    }
})

