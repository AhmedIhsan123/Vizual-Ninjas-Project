// Import statements
import { fetchData } from "../../utils.js";

// A export function to initialize the list table
export async function initList() {
    // Fetch data from the server and populate the table
    await fetchData("./PHP/events.php").then(data => {
        const tableBody = document.querySelector("#event-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Populate the table with data
        data.forEach(event => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>
            <td>${event.COUNTRY_ID}</td>
            <td>${event.EVENT_STATE_ID}</td>
            <td>${event.EVENT_TIER_ID}</td>
            <td>${event.DATE_EVENT_END}</td>
        `;
            tableBody.appendChild(row);
        });
    });
}
