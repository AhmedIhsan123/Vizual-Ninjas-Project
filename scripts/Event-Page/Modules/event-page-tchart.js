import { currentMembers } from "./event-page-map";
const chartRef = document.querySelector("#chartDistance");

export function tchart() {
    // If the chart already exists, destroy it
    if (chartRef.chart) {
        chartRef.chart.destroy();
    }

    // Create a new chart instance
    chartRef.chart = new Chart(chartRef, {
        type: 'bar',
        data: {
            labels: currentMembers.map(member => member.MEMBER_NAME),
            datasets: [{
                label: 'Distance to Event',
                data: currentMembers.map(member => member.DISTANCE_TO_EVENT),
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
}