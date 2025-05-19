import { buildEventChart, updateFilters } from "./Modules/filters-chart.js";

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Set the correct possible filters for the dropdowns
    updateFilters();

    // Build the initial event chart
    buildEventChart();
});
/* -------- INITIALIZATION END  -------- */
