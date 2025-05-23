// Import statements
import { fetchData } from "../utils.js";
import { initList } from "./Modules/event-list.js";
import { buildEventChart } from "./Modules/filters-chart.js";
import { initMap } from "./Modules/map.js";
import { updateFilters } from "./Modules/filters-chart.js";
import { populateCards } from "./Modules/event-cards.js";

// Global list to store event data
export const eventList = [];

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data from the server and populate the event list
    await fetchData("./PHP/events.php").then(data => {
        // Store the event data in the global list
        eventList.push(...data);
    })

    // Build the event chart
    await buildEventChart();

    // Build the table of events
    await initList();

    // Generate the map
    initMap();

    // Update the filters
    updateFilters();

    console.log(eventList);

    // Update the cards seciton
    populateCards();
});
/* -------- INITIALIZATION END  -------- */

