import { eventList } from "../../script.js";

/**
 * Initializes the list table by populating it with event data and setting up a search function.
 */
export async function initList() {
    // Get a reference to the table body where event rows will be inserted.
    const tableBody = document.querySelector(".table-content tbody");
    tableBody.innerHTML = ""; // Clears any existing rows in the table body to prepare for new data.

    // Populate the table with data from the 'eventList'.
    eventList.forEach(event => {
        const row = document.createElement("tr"); // Creates a new table row element for each event.
        // Sets the inner HTML of the row with event details, creating table data cells.
        row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>
            <td>${event.EVENT_TIER_ID}</td>
            <td>${event.DATE_EVENT_END}</td>
        `;
        tableBody.appendChild(row); // Appends the newly created row to the table body.
    });

    // Add an event listener to the search input field for real-time filtering.
    document.getElementById("event-search").addEventListener("input", function () {
        // Get the current value of the search input and convert it to lowercase for case-insensitive matching.
        const filter = this.value.toLowerCase();
        // Select all table rows within the table body.
        const rows = document.querySelectorAll(".table-content tbody tr");

        // Iterate over each row and check if its text content includes the filter.
        rows.forEach(row => {
            const text = row.innerText.toLowerCase(); // Get the full text content of the row and convert to lowercase.
            // If the row's text includes the filter, display the row; otherwise, hide it.
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });
}