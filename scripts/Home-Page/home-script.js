// Import statements
import { fetchData } from "../utils.js";
import { buildEventChart } from "./Modules/filters-chart.js";

// Global list to store event data
export const eventList = [];

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data from the server and populate the event list
    await fetchData("./PHP/events.php").then(data => {
        // Store the event data in the global list
        eventList.push(...data);
    })
    console.log("Events: ", eventList);
    // Build the event chart
    buildEventChart();
});
/* -------- INITIALIZATION END  -------- */

