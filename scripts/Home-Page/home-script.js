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

    const map = L.map('mapid').setView([39.5, -98.35], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    function updateMap(filteredEvents) {
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) map.removeLayer(layer);
        });
    }
});
/* -------- INITIALIZATION END  -------- */