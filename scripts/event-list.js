window.fetchData("./PHP/events.php").then(data => {
    const tableBody = document.querySelector("#event-table tbody");
    tableBody.innerHTML = ""; // Clear existing rows

    console.log(data);

    data.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>
            <td>${event.COUNTRY_ID}</td>
            <td>${event.EVENT_STATE_ID}</td>
            <td>${event.EVENT_TIER_ID}</td>
            <td>${event.AVG_TRAVEL_DISTANCE_MILES}</td>
            <td>${event.DATE_EVENT_END}</td>
        `;
        tableBody.appendChild(row);
    });
});

document.getElementById("event-search").addEventListener("input", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#event-table tbody tr");

    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(filter) ? "" : "none";
    });
});
