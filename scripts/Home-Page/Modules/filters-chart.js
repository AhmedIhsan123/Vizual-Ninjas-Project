// Import statements
import { fetchData } from "../../utils.js";
import { eventList } from "../home-script.js";

/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
const resetFiltersButton = document.querySelector("#reset-filters");
let eventChart = null; // Placeholder for the chart instance
/* -------- GLOBAL VARIABLES END -------- */

//* -------- EVENT LISTENERS START -------- */
// Event listener for the apply filters button
countryDropdown.addEventListener("change", async () => {
    // Fetch states based on the selected country
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);

    // Clear existing options in state dropdown
    if (!states) return;

    // Clear existing options in state dropdown
    stateDropdown.innerHTML = '<option value="">Any</option>';

    // Populate state dropdown with new options
    states.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state['state_id'];
        option.textContent = state['state_name'];
        stateDropdown.appendChild(option);
    });
});

// Event listener for the apply filters button
applyFiltersButton.addEventListener("click", async () => {
    buildEventChart();
});

// Event listener for the reset filters button
resetFiltersButton.addEventListener("click", async () => {
    // Reset all dropdowns and inputs to default values
    tierDropdown.value = "";
    countryDropdown.value = "";
    stateDropdown.value = "";
    startDateInput.value = "";
    endDateInput.value = "";

    // Rebuild the filters and chart
    await updateFilters();
    buildEventChart();
});
//* -------- EVENT LISTENERS END -------- */

/* -------- FUNCTIONS START -------- */
// Method to update the filters dropdowns
export async function updateFilters() {
    // Fetch filters data from the server
    const filters = await fetchData('./PHP/handlers/getFilters.php');

    // No data to update
    if (!filters) return;

    // Clear existing options in dropdowns
    tierDropdown.innerHTML = '<option value="">Any</option>';
    countryDropdown.innerHTML = '<option value="">Any</option>';
    stateDropdown.innerHTML = '<option value="">Any</option>';

    // Populate tier dropdown
    filters.tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier;
        option.textContent = tier;
        tierDropdown.appendChild(option);
    });

    // Populate country dropdown
    filters.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });

    // Populate state dropdown
    filters.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.state_id;
        option.textContent = state.state_name;
        stateDropdown.appendChild(option);
    });
}

// Method to build the event chart based on selected filters
export async function buildEventChart() {
    // Get the selected values from the dropdowns and inputs
    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const xTitle = "Event Names";
    const yTitle = "Average Distance Traveled by Members";

    // Construct the URL with the selected filters
    let url = `./PHP/events.php?tier=${selectedTier}&country=${selectedCountry}&state=${selectedState}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data based on the selected filters
    const data = await fetchData(url);
    let chartData = { labels: [], datasets: [{ label: "Average Player Distance Traveled ", data: [] }] };

    // Check if data is empty
    if (!data || data.length === 0) {
        const ctx = document.getElementById("event-chart").getContext("2d");

        // Destroy the previous chart instance if it exists
        if (eventChart) {
            eventChart.destroy();
            eventChart = null;
        }

        // Clear the chart canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Return early if no data is found
        return;
    }

    // Prepare the data for the chart
    const filteredEvents = [];
    data.forEach(event => {
        filteredEvents.push(event);
        chartData.labels.push(event.EVENT_NAME);
        chartData.datasets[0].data.push({
            x: event.EVENT_NAME,
            y: event.AVG_TRAVEL_DISTANCE_MILES,
            osCount: event.MEMBERS_OUT_OF_STATE,
            isCount: event.MEMBERS_IN_STATE
        });
        chartData.datasets[0].backgroundColor = "#999";
    });

    // Create the chart using Chart.js
    const ctx = document.getElementById("event-chart").getContext("2d");

    // Destroy the previous chart instance if it exists
    if (eventChart) {
        eventChart.destroy();
    }

    // Variables to track annotation information
    const averages = chartData.datasets[0].data.map(point => point.y);
    const minValue = Math.min(...averages);
    const maxValue = Math.max(...averages);
    const avgValue = averages.reduce((sum, value) => sum + value, 0) / averages.length;

    // Set overview data
    updateOverview(minValue, maxValue, avgValue.toFixed(2), filteredEvents);

    // Create the chart title based on selected filters
    let parts = [];

    // Tier
    if (tierDropdown.value && tierDropdown.value !== "Any") {
        parts.push(`${tierDropdown.value} Tier`);
    }

    // Location
    if (selectedState && selectedState !== "Any") {
        parts.push(`Events in ${stateDropdown.options[stateDropdown.selectedIndex].text}`);
    } else if (selectedCountry && selectedCountry !== "Any") {
        parts.push(`Events in ${selectedCountry}`);
    } else {
        parts.push("Events");
    }

    // Date range
    if (startDate && endDate) {
        parts.push(`From ${(startDate)} To ${(endDate)}`);
    } else if (startDate) {
        parts.push(`Since ${(startDate)}`);
    } else if (endDate) {
        parts.push(`Up To ${(endDate)}`);
    }

    // Join the parts to create the title
    const graphTitle = parts.join(" ");

    // Create the chart instance
    eventChart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        color: "white",
                        display: true,
                        text: xTitle,
                        font: {
                            size: 20,
                            family: "Poppins, sans-serif"
                        },
                        margin: 10
                    },
                    ticks: {
                        color: "white",
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90,
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)"
                    }
                },
                y: {
                    title: {
                        display: true,
                        color: "white",
                        text: yTitle,
                        font: {
                            size: 18,
                            family: "Poppins, sans-serif"
                        }
                    },
                    ticks: {
                        color: "white"
                    },
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)"
                    },
                    beginAtZero: true,
                },
            },
            onClick: (e, elements) => {
                const chartElement = elements[0];
                const datasetIndex = chartElement.datasetIndex;
                const dataIndex = chartElement.index;
                const label = eventChart.data.labels[dataIndex];
                const value = eventChart.data.datasets[datasetIndex].data[dataIndex];

                alert(`Clicked on ${label} with value ${value}`);
            },
            plugins: {
                title: {
                    display: true,
                    text: graphTitle,
                    color: "white",
                    font: {
                        size: 20,
                        family: "Poppins, sans-serif"
                    },
                },
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            const avgValue = tooltipItem.raw.y;
                            const osCount = tooltipItem.raw.osCount;
                            const isCount = tooltipItem.raw.isCount;
                            return `Avg: ${avgValue.toFixed(2)} mi, Out of State: ${osCount}, In State: ${isCount}`;
                        },
                    },
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
            },
        },
    });
    updateFilters();
    eventChart.update();
}
/* -------- FUNCTIONS END -------- */
// Method to update the overview section with calculated values
function updateOverview(minMiles, maxMiles, avgMiles, events) {
    const overviewContainer = document.querySelector(".details-content");
    overviewContainer.innerHTML = ""; // Clear existing content
    let max = events[0].TOTAL_MEMBERS;
    let popularEvent = "";
    events.forEach(event => {
        if (event.TOTAL_MEMBERS > max) {
            max = event.TOTAL_MEMBERS;
            popularEvent = event.EVENT_NAME;
        }
    })

    overviewContainer.innerHTML = `
        <h2>Overview</h2>
        <p>Total Events: ${events.length}</p>
        <p>Average Distance Traveled: ${avgMiles} miles</p>
        <p>Maximum Distance Traveled to Event: ${maxMiles} miles</p>
        <p>Minimum Distance Traveled by Members: ${minMiles} miles</p>
        <br>
        <p>Most Popular Event: ${popularEvent}</p>`
}