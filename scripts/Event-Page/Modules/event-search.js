import { eventList, playerList } from "../../script";
import { goToEvent } from "./event-page-map";
import { fillCards } from "./event-stats";

// Local variables
const searchRef = document.querySelector("#event-search");
const optionsRef = document.querySelector("#event-list");

// Set datalist
eventList.forEach(event => {
    optionsRef.innerHTML += `<option value="${event.EVENT_NAME}">`;
});
