window.fetchData("./PHP/events.php").then(data => {
    const tableBody = document.querySelector("#event-table tbody");
    table.innerHTML = ""; // Clear existing rows

    console.log(data);

    data.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.EVENT_ID}</td>
            <td>${event.EVENT_NAME}</td>>
            <td>${event.EVENT_TIER_ID}</td>
        `;
        tableBody.appendChild(row);
    });
});