import { eventList, playerList } from "../../script.js";
import { hideAllEventPins, drawMemberPins, eventMarkers } from "./event-page-map.js";

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
        if (event) {
            // Hide all other event pins
            console.log(event);
            eventMarkers[event.EVENT_ID].closePopup();
            hideAllEventPins(event);

            // Draw all the member pins
            drawMemberPins(event);
        }
    }
})