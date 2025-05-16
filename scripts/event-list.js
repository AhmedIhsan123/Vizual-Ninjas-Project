window.fetchData("./PHP/events.php").then(data => {
    const table = document.getElementById("event-table");
    table.innerHTML = ""; // Clear existing rows

    data.forEach(event => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${event.eventName}</td>
            <td>${event.eventDate}</td>
            <td>${event.eventLocation}</td>
            <td>${event.eventDescription}</td>
        `;
        table.appendChild(row);
    });
});