import { eventList, playerList } from "../../script.js";
import { goToEvent } from "./event-page-map.js";
import { fillCards } from "./event-stats.js";

// DOM references
const searchRef = document.querySelector("#event-search");
const suggestionBox = document.querySelector("#event-suggestions"); // Custom container (ul/div)

// Initialize search
export function initSearch() {
    searchRef.addEventListener("input", function () {
        const input = searchRef.value.toLowerCase();
        suggestionBox.innerHTML = "";

        if (input.length === 0) return;

        const matches = eventList
            .map(event => event.EVENT_NAME)
            .filter(name => name.toLowerCase().includes(input))
            .slice(0, 5);

        matches.forEach(name => {
            const li = document.createElement("li");
            li.textContent = name;
            li.classList.add("suggestion-item");
            li.addEventListener("click", () => {
                searchRef.value = name;
                suggestionBox.innerHTML = "";
                const eventData = eventList.find(e => e.EVENT_NAME === name);
                if (eventData) {
                    goToEvent(eventData);
                    fillCards(eventData);
                }
            });
            suggestionBox.appendChild(li);
        });
    });

    // Optional: hide suggestions if clicked outside
    document.addEventListener("click", (e) => {
        if (!searchRef.contains(e.target) && !suggestionBox.contains(e.target)) {
            suggestionBox.innerHTML = "";
        }
    });
}
