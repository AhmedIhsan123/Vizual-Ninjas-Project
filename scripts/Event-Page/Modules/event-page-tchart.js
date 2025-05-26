import { currentMembers } from "./event-page-map.js";
const chartTitle = document.querySelector("#chart1 h3");
let tchart = null;

export function buildTChart() {
    // If the chart already exists, destroy it
    if (tchart) {
        tchart.destroy();
    }
    // Sort members by distance traveled (ascending) and take top 25
    const topMembers = [...currentMembers]
        .sort((a, b) => b.DISTANCE_TRAVELED_MILES - a.DISTANCE_TRAVELED_MILES)
        .slice(0, 25);

    // Update the chart title with the event player count
    chartTitle.textContent = `Top ${topMembers.length} Players by Distance Traveled`;

    // Create the chart using Chart.js
    const ctx = document.getElementById("chartDistance").getContext("2d");

    // Create a new chart instance
    tchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topMembers.map(member => member.MEMBER_FULL_NAME),
            datasets: [{
                label: 'Distance to Event',
                data: topMembers.map(member => member.DISTANCE_TRAVELED_MILES),
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintaineAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                title: {
                    color: '#fff'
                },
                tooltip: {
                    bodyColor: '#fff',
                    titleColor: '#fff'
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#fff',
                        maxRotation: 90,
                        minRotation: 90
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#fff'
                    }
                }
            }
        }
    });

    tchart.update();
}