import { eventList } from "../../script.js";

// A export function to initialize the list table
export async function initList() {
    // Reference the table we are trying to fill
    const tableBody = document.querySelector(".table-content tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    // Populate the table with data
    eventList.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>
            <td>${event.EVENT_TIER_ID}</td>
            <td>${event.DATE_EVENT_END}</td>
        `;
        tableBody.appendChild(row);
    });

    // Add event listener for search input
    document.getElementById("event-search").addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll(".table-content tbody tr");

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });
}
