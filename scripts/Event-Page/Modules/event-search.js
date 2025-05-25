import { eventList, playerList } from "../../script.js";
import { goToEvent } from "./event-page-map.js";
import { fillCards } from "./event-stats.js";

// Local variables
const searchRef = document.querySelector("#event-search");
const optionsRef = document.querySelector("#event-list");

// Set datalist
export function initSearch() {
    searchRef.addEventListener("input", function () {
        const input = searchRef.value.toLowerCase();
        optionsRef.innerHTML = "";

        if (input.length == 0) return;

        let events = [];
        eventList.forEach(event => {
            events.push(event.EVENT_NAME);
        });

        const matches = events.filter(event => event.toLowerCase().includes(input)).slice(0, 5);

        matches.forEach(match => {
            const li = document.createElement("li");
            li.textContent = match;
            li.addEventListener("click", () => {
                searchBar.value = match;
                suggestionsList.innerHTML = "";
            });
            suggestionsList.appendChild(li);
        });
    });

    document.addEventListener("click", (e) => {
        if (!searchRef.contains(e.target) && !optionsRef.contains(e.target)) {
            optionsRef.innerHTML = "";
        }
    });
}
