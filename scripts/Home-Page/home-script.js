import { buildEventChart, updateFilters } from "./Modules/filters-chart.js";
import { initList } from "./Modules/event-list.js";

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Set the correct possible filters for the dropdowns
    updateFilters();

    // Build the initial event chart
    buildEventChart();

    // Initialize the event list
    initList();
});
/* -------- INITIALIZATION END  -------- */