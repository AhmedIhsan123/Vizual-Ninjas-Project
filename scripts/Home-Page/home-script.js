import { initList } from "./Modules/event-list.js";
import { buildEventChart } from "./Modules/filters-chart.js";
import { initMap } from "./Modules/map.js";
import { updateFilters } from "./Modules/filters-chart.js";
import { populateCards } from "./Modules/event-cards.js";

console.log(22);

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Build the event chart
    await buildEventChart();

    // Build the table of events
    await initList();

    // Generate the map
    initMap();

    // Update the filters
    updateFilters();

    // Update the cards seciton
    populateCards();
});
/* -------- INITIALIZATION END  -------- */
