import ChartBuilder from "./charts.js";

// Global element variables
const tierDropRef = document.querySelector("#tier");
const countryDropRef = document.querySelector("#country");
const stateDropRef = document.querySelector("#state");
const startDateRef = document.querySelector("#startDate");
const endDateRef = document.querySelector("#endDate");
const applyBtnRef = document.querySelector("#applyFilters");
const clearBtnRef = document.querySelector("#clearFilters");

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
        // Variables to track annotation information
        const averages = yData.map(point => point.y);
        const minValue = Math.min(...averages);
        const maxValue = Math.max(...averages);
        const avgValue = averages.reduce((sum, value) => sum + value, 0) / averages.length;

        // Return the combined data
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
    // Create a new EventApp to handle data
    const app = new EventApp();
    // Construct a new chartbuilder
    const eventChart = new ChartBuilder('eventChart', 'bar', [], app.setChartOptions('Undefined', 'Undefined', 'Undefined', null, []));

    // Build an empty chart to start the site
    eventChart.build();

    // Populate filter dropdowns
    app.setFiltersUI();

    // Clicking on Apply Filters
    applyBtnRef.addEventListener('click', function () {
        // Store the filters in an object to construct the URL later
        const filters = {
            tier: tierDropRef.value,
            country: countryDropRef.value,
            state: stateDropRef.value,
            startDate: startDateRef.value,
            endDate: endDateRef.value
        };

            // Checks if a filter is selected and dynamically adds it to the chart 
            let filterParts = [];
            if (filters.tier) filterParts.push(`Tier "${filters.tier}"`);
            if (filters.country) filterParts.push(`Country "${filters.country}"`);
            if (filters.state) filterParts.push(`State "${filters.state}"`);
            if (filters.startDate) filterParts.push(`Start Date "${filters.startDate}"`)
            if (filters.endDate) filterParts.push(`End Date "${filters.endDate}"`)
            // if (filters.startDate && filters.endDate) {
            //     filterParts.push(`from ${filters.startDate} to ${filters.endDate}`);
            // }

            let title = "Average Distance Traveled Per Event";
            if (filterParts.length > 0) {
                title += " (by " + filterParts.join(', ') + ")";
            }

        // URL to fetch
        let url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}&start_date=${filters.startDate}&end_date=${filters.endDate}`;

        // Fetch the URL
        app.fetchData(url).then(data => {
            // Variables to store options
            const xLabels = data.map(event => event.EVENT_NAME);
            // Data information for y axis
            const yData = data.map(event => ({
                x: event.EVENT_NAME,
                y: event.AVG_TRAVEL_DISTANCE_MILES,
                osCount: event.MEMBERS_OUT_OF_STATE,
                isCount: event.MEMBERS_IN_STATE
            }));
            
            // Variable to store the combined data
            const { chartData, options } = app.setChartOptions(title, 'Events', 'Average Distance Traveled in Miles', xLabels, yData);

            // Update the data and options of new chart
            eventChart.updateData(chartData);
            eventChart.updateOptions(options);
        });
    });

    // Clicking on Clear Filters
    clearBtnRef.addEventListener("click", function () {
        // Resets the filter values
        tierDropRef.value = "";
        countryDropRef.value = "";
        stateDropRef.value = "";
        startDateRef.value = "";
        endDateRef.value = "";

        // Clears the chart
        const emptyChart = app.setChartOptions('', '', '', null, []);
        eventChart.updateData(emptyChart.chartData);
        eventChart.updateOptions(emptyChart.options);
    });
});

// When country dropdown changes, update state options
countryDropRef.addEventListener("change", function () {
    app.fetchData(`./PHP/handlers/getProvince.php?country=${countryDropRef.value}`).then(data => {
        if (!data.states) return;

        // Clear the state dropdown options
        while (stateDropRef.children.length > 1) {
            stateDropRef.removeChild(stateDropRef.lastChild);
        }

        // Add new state dropdown options
        data.states.forEach(element => {
            app.addDropdownElement(element['state_id'], element['state_name'], stateDropRef);
        });
    });
});
