/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
let eventChart = null; // Placeholder for the chart instance
/* -------- GLOBAL VARIABLES END -------- */

/* -------- INITIALIZATION -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Set the correct possible filters for the dropdowns
    updateFilters();

    // Build the initial event chart
    buildEventChart();
});

//* -------- EVENT LISTENERS START -------- */
// Event listener for the apply filters button
countryDropdown.addEventListener("change", async () => {
    // Fetch states based on the selected country
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);
    console.log(states);

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

//* -------- EVENT LISTENERS END -------- */

/* -------- FUNCTIONS START -------- */
// Method to fetch data through url and return the data found
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return await response.json();
    } catch (error) {
        return console.error("Fetch error: ", error);
    }
}

// Method to update the filters dropdowns
async function updateFilters() {
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
async function buildEventChart() {
    // Get the selected values from the dropdowns and inputs
    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Construct the URL with the selected filters
    let url = `./PHP/events.php?tier=${selectedTier}&country=${selectedCountry}&state=${selectedState}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data based on the selected filters
    const data = await fetchData(url);
    let chartData = { labels: [], datasets: [{ label: "Average Player Distance Traveled ", data: [] }] };

    // Check if data is empty
    if (!data || data.length === 0) {
        const ctx = document.getElementById("event-chart").getContext("2d");
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clear the canvas
        ctx.fillText("No data available for the selected filters.", 10, 50); // Display a message
        return;
    }

    // Prepare the data for the chart
    data.forEach(event => {
        chartData.labels.push(event.EVENT_NAME);
        chartData.datasets[0].data.push({
            x: event.EVENT_NAME,
            y: event.AVG_TRAVEL_DISTANCE_MILES,
            osCount: event.MEMBERS_OUT_OF_STATE,
            isCount: event.MEMBERS_IN_STATE
        });
        chartData.datasets[0].backgroundColor = "green";
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
    let title = "Average Distance Traveled Per Event";

    // Edit the title based on selected filters
    title += selectedTier ? ` - Tier: ${selectedTier}` : "";
    title += selectedCountry ? ` - Country: ${selectedCountry}` : "";
    title += selectedState ? ` - State: ${selectedState}` : "";
    title += startDate ? ` - Start Date: ${startDate}` : "";
    title += endDate ? ` - End Date: ${endDate}` : "";

    // Create the chart instance
    eventChart = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Events",
                    },
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90,
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Average Distance Traveled in Miles",
                    },
                    beginAtZero: true,
                },
            },
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 18,
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
    eventChart.update();
}
/* -------- FUNCTIONS END -------- */