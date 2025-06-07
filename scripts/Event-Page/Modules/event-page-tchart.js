import { currentMembers } from "./event-page-map.js";
const chartTitle = document.querySelector(".chart-one-container h3");
let tchart = null;
let stateChart = null;

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
    const ctx = document.getElementById("top-25-chart-id").getContext("2d");

    // Create a new chart instance
    tchart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: topMembers.map(member => member.MEMBER_FULL_NAME),
            datasets: [{
                label: 'Miles from Event',
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

    // --- Pie chart for states ---
    if (stateChart) {
        stateChart.destroy();
    }

    // Count members per state
    const stateCounts = {};
    currentMembers.forEach(member => {
        const state = member.STATE_NAME || "Unknown";
        stateCounts[state] = (stateCounts[state] || 0) + 1;
    });

    const stateLabels = Object.keys(stateCounts);
    const stateData = Object.values(stateCounts);

    // Generate colors for each state
    const colors = stateLabels.map((_, i) =>
        `hsl(${(i * 360 / stateLabels.length)}, 70%, 60%)`
    );

    const stateCtx = document.getElementById("states-chart-id").getContext("2d");
    stateChart = new Chart(stateCtx, {
        type: 'pie',
        data: {
            labels: stateLabels,
            datasets: [{
                label: 'Players by State',
                data: stateData,
                backgroundColor: colors,
                borderColor: '#222',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    bodyColor: '#fff',
                    titleColor: '#fff',
                    callbacks: {
                        label: function (context) {
                            // context.parsed is the value for this slice (number of players)
                            return `Players: ${context.parsed}`;
                        }
                    }
                }
            }
        }
    });
}