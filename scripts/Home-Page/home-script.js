import { buildEventChart, updateFilters } from "./Modules/filters-chart.js";
import { initMap } from "../map.js";
import { initList } from "./Modules/event-list.js";

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Set the correct possible filters for the dropdowns
    updateFilters();

    // Build the initial event chart
    buildEventChart();

    // Initialize the event list
    initList();

    // Initialize the map
    initMap();
});
/* -------- INITIALIZATION END  -------- */