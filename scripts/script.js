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
    constructor() { }

    // Method to update all filters
    setFiltersUI() {
        this.fetchData('./PHP/handlers/getFilters.php').then(data => {
            if (!data) return;

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
        }).catch(error => console.error('Error fetching filters:', error));
    }

    // Method to add elements to a dropdown
    addDropdownElement(value, text, parent) {
        if (!parent) return;
        const option = document.createElement('option');
        option.value = value;
        option.textContent = text;
        parent.appendChild(option);
    }

    // Method to fetch data through url and return the data found
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }

    // Method to set chart options safely
    setChartOptions(graphTitle, xTitle, yTitle, xData, yData) {
        if (!Array.isArray(yData) || yData.length === 0) {
            console.error("Invalid or empty yData passed to chart options.");
            return { chartData: { labels: [], datasets: [] }, options: {} };
        }

        const yValues = yData.map(point => point.y);
        const minValue = Math.min(...yValues);
        const maxValue = Math.max(...yValues);
        const avgValue = yValues.reduce((sum, value) => sum + value, 0) / yValues.length;

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
                            font: { size: 16 }
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
                            font: { size: 16 }
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
                        text: graphTitle,
                        position: 'top',
                        font: { size: 20, weight: 'bold' },
                        padding: { top: 10, bottom: 20 },
                        color: '#333'
                    },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const point = context.raw;

                                console.log(point);

                                // Ensure point exists before accessing properties
                                const avgDistance = point?.y?.toFixed(2) ?? 'N/A';
                                const osCount = point?.osCount ?? 'N/A';
                                const isCount = point?.isCount ?? 'N/A';

                                return `Average Distance: ${avgDistance} mi, OS: ${osCount}, IS: ${isCount}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            min: {
                                type: 'line',
                                yMin: minValue,
                                yMax: minValue,
                                borderColor: 'green',
                                borderWidth: 2,
                                label: { enabled: true, content: `Min: ${minValue.toFixed(2)} mi`, position: 'start' }
                            },
                            max: {
                                type: 'line',
                                yMin: maxValue,
                                yMax: maxValue,
                                borderColor: 'red',
                                borderWidth: 2,
                                label: { enabled: true, content: `Max: ${maxValue.toFixed(2)} mi`, position: 'start' }
                            },
                            avg: {
                                type: 'line',
                                yMin: avgValue,
                                yMax: avgValue,
                                borderColor: 'yellow',
                                borderWidth: 2,
                                label: { enabled: true, content: `Avg: ${avgValue.toFixed(2)} mi`, position: 'start' }
                            }
                        }
                    }
                }
            }
        };
    }
}

// Initialize app once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const app = new EventApp();
    const eventChart = new ChartBuilder('eventChart', 'bar', [], app.setChartOptions('Undefined', 'Undefined', 'Undefined', null, []));

    eventChart.build();
    app.setFiltersUI();

    applyBtnRef.addEventListener('click', function () {
        const filters = { tier: tierDropRef.value, country: countryDropRef.value, state: stateDropRef.value, startDate: document.querySelector("#startDate").value, endDate: document.querySelector("#endDate").value };

        // URL to fetch
        let url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}`;

        // Adds dates if given
        if (filters.startDate) {
            url += `&start_date=${encodeURIComponent(filters.startDate)}`;
        }
        if (filters.endDate) {
            url += `&end_date=${encodeURIComponent(filters.endDate)}`;
        }

        app.fetchData(url).then(data => {
            const xLabels = data.map(event => event.EVENT_NAME);
            const yData = data.map(event => ({
                x: event.EVENT_NAME,
                y: event.AVG_TRAVEL_DISTANCE_MILES,
                osCount: event.MEMBERS_OUT_OF_STATE,
                isCount: event.MEMBERS_IN_STATE
            }));

            console.log(yData);

            const { chartData, options } = app.setChartOptions('Average Distance Traveled Per Event', 'Events', 'Average Distance Traveled in Miles', xLabels, yData);

            eventChart.updateData(chartData);
            eventChart.updateOptions(options);
        });
    });
});

// When country dropdown changes, update state options
countryDropRef.addEventListener("change", function () {
    app.fetchData(`./PHP/handlers/getProvince.php?country=${countryDropRef.value}`).then(data => {
        if (!data.states) return;

        while (stateDropRef.children.length > 1) {
            stateDropRef.removeChild(stateDropRef.lastChild);
        }

        data.states.forEach(element => {
            app.addDropdownElement(element['state_id'], element['state_name'], stateDropRef);
        });
    });
});
