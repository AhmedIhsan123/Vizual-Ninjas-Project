import ChartBuilder from "./charts.js";

const filters = {
    tier: 1,              // Example tier
    country: 'US',        // Example country
    state: 'MA',  // Example state
    start_date: '04-29-2025',  // Example start date
    end_date: '09-21-2025'      // Example end date
};

// Event application class
class EventApp {
    // Default constructor
    constructor() { }

    // Method to fetch data through url and return the data found
    async fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }
}

/*
// Once the DOM content has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create an app variable to store the application class
    const app = new EventApp();
    buildEventAverageDistance();
    buildTierAverageDistance();

    // Function to build the event average distance per tier graph
    function buildEventAverageDistance() {
        // Fetch data for average event travel distance
        app.fetchData('PHP/api.php?action=get_event_averages').then(data => {
            const { chartData, options } = {
                chartData: {
                    labels: data.map(event => event.EVENT_NAME),
                    datasets: [{
                        data: data.map(event => event.avg_distance_miles),
                        backgroundColor: 'green',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Events',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                maxRotation: 90,
                                minRotation: 90
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Average Distance in Miles',
                                font: {
                                    size: 16
                                }
                            },
                            ticks: {
                                beginAtZero: true,
                                callback: value => value + ' mi'
                            }
                        }
                    },
                    plugins: {
                        title: {
                            display: true,
                            text: 'Average Distance Traveled Per Event', // Title text
                            position: 'top', // Ensure title is at the top
                            font: {
                                size: 20,
                                weight: 'bold'
                            },
                            padding: {
                                top: 10,
                                bottom: 20
                            },
                            color: '#333' // Optional: customize title color
                        },
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const value = context.raw;
                                    return 'Average Distance: ' + value.toFixed(2) + ' mi';
                                }
                            }
                        }
                    }
                }
            };

            // Create chart builder
            const eventChart = new ChartBuilder('eventChart', 'bar', chartData, options);

            // Build the chart
            eventChart.build();
        });
    }*/

const app = new EventApp();
const queryStr = new URLSearchParams(filters.toString());
const url = `/PHP/handlers/event.php?${queryStr}`;
const x = await app.fetchData(url);
console.log(x);

// Function to build the tier average distance 
function buildTierAverageDistance() {
    // Fetch data for average event travel distance
    app.fetchData('PHP/api.php?action=get_tier_averages').then(data => {
        const { chartData, options } = {
            chartData: {
                // labels: data.map(event => event.EVENT_NAME),
                labels: data.map(event => event.EVENT_TIER_ID),
                datasets: [{
                    data: data.map(event => event.avg_distance_miles),
                    backgroundColor: 'green',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Events',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            maxRotation: 90,
                            minRotation: 90
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Average Distance in Miles',
                            font: {
                                size: 16
                            }
                        },
                        ticks: {
                            beginAtZero: true,
                            callback: value => value + ' mi'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Average Distance Traveled Per Tier', // Title text
                        position: 'top', // Ensure title is at the top
                        font: {
                            size: 20,
                            weight: 'bold'
                        },
                        padding: {
                            top: 10,
                            bottom: 20
                        },
                        color: '#333' // Optional: customize title color
                    },
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const value = context.raw;
                                return 'Average Distance: ' + value.toFixed(2) + ' mi';
                            }
                        }
                    }
                }
            }
        };

        // Create chart builder
        const eventChart = new ChartBuilder('tierChart', 'bar', chartData, options);

        // Build the chart
        eventChart.build();
    });
}
