import ChartBuilder from "./charts.js";

// Global element variables
const tierDropRef = document.querySelector("#tier");
const countryDropRef = document.querySelector("#country");
const stateDropRef = document.querySelector("#state");
const applyBtnRef = document.querySelector("#applyFilters");

let inStateCount = 0;
let outStateCount = 0;

// Event application class
class EventApp {
    // Default constructor
    constructor() { }

    // Method to update all filters
    setFiltersUI() {
        // Make API call to database
        this.fetchData('./PHP/handlers/getFilters.php').then(data => {
            // Add tiers dropdown information
            data.tiers.forEach(element => {
                this.addDropdownElement(element, element, tierDropRef);
            });

            // Add countries to country dropdown
            data.countries.forEach(element => {
                this.addDropdownElement(element, element, countryDropRef);
            });

            // Add states to state dropdown
            data.states.forEach(element => {
                this.addDropdownElement(element['state_id'], element['state_name'], stateDropRef);
            });
        });
    }

    // Method to add elements to a dropdown
    addDropdownElement(value, text, parent) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        parent.appendChild(option);
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
    setChartOptions(graphTitle, xTitle, yTitle, xData, yData, osCount, isCount) {
        if (!Array.isArray(yData) || yData.length === 0) {
            console.error("Invalid or empty yData passed to chart options.");
            return {
                chartData: {
                    labels: [],
                    datasets: []
                },
                options: {}
            };
        }

        // Calculates the min, max, and average
        const minValue = Math.min(...yData);
        const maxValue = Math.max(...yData);
        const avgValue = yData.reduce((sum, value) => sum + value, 0) / yData.length;

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
                                const point = context.raw;
                                return `Average Distance: ${point.y.toFixed(2)}, OS: ${point.osCount}, IS: ${point.isCount}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            // Min value annotation
                            min: {
                                type: 'line',
                                yMin: minValue,
                                yMax: minValue,
                                borderColor: 'green',
                                borderWidth: 2,
                                label: {
                                    enabled: true,
                                    content: `Min: ${minValue.toFixed(2)} mi`,
                                    position: 'start'
                                }
                            },
                            // Max value annotation
                            max: {
                                type: 'line',
                                yMin: maxValue,
                                yMax: maxValue,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: {
                                    enabled: true,
                                    content: `Max: ${maxValue.toFixed(2)} mi`,
                                    position: 'start'
                                }
                            },
                            // Average value annotation
                            avg: {
                                type: 'line',
                                yMin: avgValue,
                                yMax: avgValue,
                                borderColor: 'yellow',
                                borderWidth: 2,
                                label: {
                                    enabled: true,
                                    content: `Avg: ${avgValue.toFixed(2)} mi`,
                                    position: 'start'
                                }
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
    const eventChart = new ChartBuilder('eventChart', 'bar', [], app.setChartOptions('Undefined', 'Undefined', 'Undefined', null, null));

    // Build the chart
    eventChart.build();

    // Update our filter UI
    app.setFiltersUI();

    // When apply filters is clicked
    applyBtnRef.addEventListener('click', function () {
        const filters = {
            tier: tierDropRef.value,
            country: countryDropRef.value,
            state: stateDropRef.value,
            startDate: document.querySelector("#startDate").value,
            endDate: document.querySelector("#endDate").value
        };

        // Create URL to fetch
        let url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}`;

        // Adds dates if given
        if (filters.startDate) {
            url += `&start_date=${encodeURIComponent(filters.startDate)}`;
        }
        if (filters.endDate) {
            url += `&end_date=${encodeURIComponent(filters.endDate)}`;
        }

        // Fetch data for average event travel distance
        app.fetchData(url).then(data => {
            const xData = data.map(event => event.EVENT_NAME);
            const yData = data.map(event => event.avg_distance_miles);
            
            // Create a variable to store information about graph
            const { chartData, options } = app.setChartOptions('Average Distance Traveled Per Event', 'Events', 'Average Distance Traveled in Miles', data.map(event => event.EVENT_NAME), data.map(event => event.avg_distance_miles));

            // Update data/options
            eventChart.updateData(chartData);
            eventChart.updateOptions(options);
        });
    })

    // When country dropdown changes
    countryDropRef.addEventListener("change", function () {
        app.fetchData(`./PHP/handlers/getProvince.php?country=${countryDropRef.value}`).then(data => {
            // Remove all state options
            for (let i = stateDropRef.children.length - 1; i > 0; i--) {
                stateDropRef.removeChild(stateDropRef.children[i]);
            }

            // Add states to state dropdown
            data.states.forEach(element => {
                app.addDropdownElement(element['state_id'], element['state_name'], stateDropRef);
            });
        });
    });
});