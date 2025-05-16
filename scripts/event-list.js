window.fetchData("./PHP/events.php").then(data => {
    const table = document.getElementById("event-table");
    table.innerHTML = ""; // Clear existing rows

    data.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>
            <td>${event.DATE_EVENT_END}</td>
            <td>${event.EVENT_COUNTRY_ID}</td>
            <td>${event.EVENT_TIER_ID}</td>
        `;
        table.appendChild(row);
    });
});