import ChartBuilder from "./charts.js";

// Event application class
class EventApp {
    // Default constructor
    constructor() {
        this.tierDropRef = document.querySelector("#tier");
        this.countryDropRef = document.querySelector("#country");
        this.stateDropRef = document.querySelector("#state");
        this.applyBtnRef = document.querySelector("#applyFilters");
    }


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

    // Method to update all filters
    setFiltersUI() {
        // Make API call to database
        this.fetchData('./PHP/handlers/get_all_available_filters.php').then(data => {
            console.log(data);
        });
    }

    // Method to help set chart options
    setChartOptions(graphTitle, xTitle, yTitle, xData, yData) {
        return {
            chartData: {
                labels: xData,
                datasets: [{
                    data: yData,
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
                            text: xTitle,
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
                            text: yTitle,
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
                        text: graphTitle, // Title text
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
    }
}

// Once the DOM content has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create an app variable to store the application class
    const app = new EventApp();
    const filters = {
        tier: "",
        country: "",
        state: ""
    };

    // Update our filter UI
    app.setFiltersUI();

    // Create URL to fetch
    let url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}`;

    // Fetch data for average event travel distance
    app.fetchData(url).then(data => {
        // Create a variable to store information about graph
        const { chartData, options } = app.setChartOptions('Average Distance Traveled Per Event', 'Events', 'Average Distance Traveled in Miles', data.map(event => event.EVENT_NAME), data.map(event => event.avg_distance_miles));

        // Create chart builder
        const eventChart = new ChartBuilder('eventChart', 'bar', chartData, options);

        // Build the chart
        eventChart.build();
    });
});