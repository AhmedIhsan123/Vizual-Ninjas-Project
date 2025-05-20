import { fetchData } from "../../utils.js";
import { goToLocation } from "../../map.js";

export async function initList() {
    // List of events
    let eventList = [];


    // Fetch data from the server and populate the table
    fetchData("./PHP/events.php").then(data => {
        const tableBody = document.querySelector("#event-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Populate the table with data
        data.forEach(event => {
            eventList.push(event); // Store the event in the list
            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="clickable" value="${event.EVENT_NAME}">${event.EVENT_ID}</td>
            <td class="clickable" value="${event.EVENT_NAME}>${event.EVENT_NAME}</td>
            <td class="clickable" value="${event.EVENT_NAME}>${event.COUNTRY_ID}</td>
            <td class="clickable" value="${event.EVENT_NAME}>${event.EVENT_STATE_ID}</td>
            <td class="clickable" value="${event.EVENT_NAME}>${event.EVENT_TIER_ID}</td>
            <td class="clickable" value="${event.EVENT_NAME}>${event.DATE_EVENT_END}</td>
        `;
            tableBody.appendChild(row);
        });
    });

    // Add event listener for search input
    document.getElementById("event-search").addEventListener("input", function () {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll("#event-table tbody tr");

        rows.forEach(row => {
            const text = row.innerText.toLowerCase();
            row.style.display = text.includes(filter) ? "" : "none";
        });
    });

    // Add event listener for table rows
    const tableRows = document.querySelectorAll(".clickable");
    tableRows.addEventListener("click", function () {
        eventList.forEach(event => {
            if (event.EVENT_NAME == this.value) {
                const lat = event.EVENT_LATITUDE;
                const lon = event.EVENT_LONGITUDE;
                const zoomLevel = 8;
                goToLocation(lat, lon, zoomLevel);
            }
        });
    })
}
