import ChartBuilder from "./charts.js";

// Global element vairables
const tierDropRef = document.querySelector("#tier");
const countryDropRef = document.querySelector("#country");
const stateDropRef = document.querySelector("#state");
const applyBtnRef = document.querySelector("#applyFilters");

// Event application class
class EventApp {
    // Default constructor
    constructor() { }

    // Method to update all filters
    setFiltersUI() {
        // Make API call to database
        this.fetchData('./PHP/handlers/getFilters.php').then(data => {
            this.addElements(data.tiers, tierDropRef);
            this.addElements(data.countries, countryDropRef);
            this.addElements(data.states, stateDropRef);
        });
    }

    // Helper method to create elements
    addElements(data, parent) {
        data.forEach(element => {
            const option = document.createElement('option');
            option.value = element;
            option.textContent = element;
            parent.appendChild(option);
        });
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

    // Create chart builder
    const eventChart = new ChartBuilder('eventChart', 'bar', chartData, options);

    // Build the chart
    eventChart.build();

    // Update our filter UI
    app.setFiltersUI();

    // When apply flters is clicked
    applyBtnRef.addEventListener('click', function () {
        const filters = {
            tier: tierDropRef.value,
            country: countryDropRef.value,
            state: stateDropRef.value
        };

        // Create URL to fetch
        let url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}`;

        // Fetch data for average event travel distance
        app.fetchData(url).then(data => {
            // Create a variable to store information about graph
            const { chartData, options } = app.setChartOptions('Average Distance Traveled Per Event', 'Events', 'Average Distance Traveled in Miles', data.map(event => event.EVENT_NAME), data.map(event => event.avg_distance_miles));

            // Update data/options
            eventChart.updateData(chartData);
            eventChart.updateOptions(options);
        });
    })

    // When country dropdown changes
    countryDropRef.addEventListener("change", function () {
        console.log("Change!");
        app.fetchData(`./PHP/handlers/getProvince.php?country=${countryDropRef.value}`).then(data => {
            // Remove all states but first option
            for (let i = stateDropRef.children.length - 1; i > 0; i--) {
                stateDropRef.removeChild(stateDropRef.children[i]);
            }
            app.addElements(data.states, stateDropRef);
        });
    });
});

