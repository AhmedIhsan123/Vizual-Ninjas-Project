import { currentMembers } from "./event-page-map.js";
const chartRef = document.querySelector("#chartDistance");
let tchart = null;

export function tchart() {
    // If the chart already exists, destroy it
    if (tchart) {
        tchart.destroy();
    }
    // Create the chart using Chart.js
    const ctx = document.getElementById("chartDistance").getContext("2d");

    // Create a new chart instance
    tchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: currentMembers.map(member => member.MEMBER_NAME),
            datasets: [{
                label: 'Distance to Event',
                data: currentMembers.map(member => member.DISTANCE_TRAVELED_MILES),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    tchart.update();
}