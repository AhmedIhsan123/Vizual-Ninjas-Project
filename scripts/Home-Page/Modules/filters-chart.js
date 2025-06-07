import { fetchData } from "../../utils.js"; // Imports the fetchData function from a utility module.
import { focusOnEvent } from "./map.js"; // Imports the focusOnEvent function from the map module.

/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country"); 
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date"); 
const endDateInput = document.querySelector("#end-date"); 
const maxPlayersInput = document.querySelector("#max-players");
const minPlayersInput = document.querySelector("#min-players"); 
const maxDistInput = document.querySelector("#max-dist");
const minDistInput = document.querySelector("#min-dist"); 
const resetFiltersButton = document.querySelector("#reset-filters"); 
let eventChart = null;
/* -------- GLOBAL VARIABLES END -------- */

//* -------- EVENT LISTENERS START -------- */
// Event listener for the country dropdown
countryDropdown.addEventListener("change", async () => {
    // Fetch states based on the selected country
    const selectedCountry = countryDropdown.value; // Gets the currently selected value from the country dropdown.
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`; // Constructs a URL to fetch states based on the selected country.
    const states = await fetchData(url); // Calls the fetchData function to retrieve state data from the constructed URL.

    // Clear existing options in state dropdown
    if (!states) return; // If no states are returned, exit the function.

    // Clear existing options in state dropdown
    stateDropdown.innerHTML = '<option value="">Any</option>'; // Resets the state dropdown to its default "Any" option.

    // Populate state dropdown with new options
    states.states.forEach(state => {
        const option = document.createElement('option'); // Creates a new option element.
        option.value = state['state_id']; // Sets the value of the option to the state ID.
        option.textContent = state['state_name']; // Sets the text displayed in the option to the state name.
        stateDropdown.appendChild(option); // Appends the new option to the state dropdown.
    });
});

// Event listener for filter changes
const listOfFilters = [tierDropdown, countryDropdown, stateDropdown, startDateInput, endDateInput]; // An array of filter elements.
listOfFilters.forEach(filter => {
    filter.addEventListener("change", function () {
        buildEventChart(); // Calls buildEventChart whenever any of the filters change.
    })
})

// Event listeners for number input elements
maxPlayersInput.addEventListener("input", function () {
    buildEventChart(); // Calls buildEventChart whenever the maxPlayersInput changes.
});
minPlayersInput.addEventListener("input", function () {
    buildEventChart(); // Calls buildEventChart whenever the minPlayersInput changes.
});
maxDistInput.addEventListener("input", function () {
    buildEventChart(); // Calls buildEventChart whenever the maxDistInput changes.
});
minDistInput.addEventListener("input", function () {
    buildEventChart(); // Calls buildEventChart whenever the minDistInput changes.
});

// Event listener for the reset filters button
resetFiltersButton.addEventListener("click", async () => {
    // Reset all dropdowns and inputs to default values
    tierDropdown.value = "";
    countryDropdown.value = ""; 
    stateDropdown.value = "";
    startDateInput.value = ""; 
    endDateInput.value = ""; 
    maxPlayersInput.value = ""; 
    minPlayersInput.value = ""; 
    maxDistInput.value = ""; 
    minDistInput.value = ""; 

    // Rebuild the filters and chart
    await updateFilters(); // Calls updateFilters to refresh the filter options.
    buildEventChart(); // Calls buildEventChart to rebuild the chart based on the reset filters.
});
//* -------- EVENT LISTENERS END -------- */

/* -------- FUNCTIONS START -------- */
// Method to update the filters dropdowns
export async function updateFilters() {
    // Fetch filters data from the server
    const filters = await fetchData('./PHP/handlers/getFilters.php'); // Fetches filter data from the server.

    // No data to update
    if (!filters) return; // If no filter data is returned, exit the function.

    // Clear existing options in dropdowns
    tierDropdown.innerHTML = '<option value="">Any</option>'; 
    countryDropdown.innerHTML = '<option value="">Any</option>'; 
    stateDropdown.innerHTML = '<option value="">Any</option>'; 

    // Populate tier dropdown
    filters.tiers.forEach(tier => {
        const option = document.createElement('option'); // Creates a new option element.
        option.value = tier; // Sets the value of the option to the tier.
        option.textContent = tier; // Sets the text displayed in the option to the tier.
        tierDropdown.appendChild(option); // Appends the new option to the tier dropdown.
    });

    // Populate country dropdown
    filters.countries.forEach(country => {
        const option = document.createElement('option'); // Creates a new option element.
        option.value = country; // Sets the value of the option to the country.
        option.textContent = country; // Sets the text displayed in the option to the country.
        countryDropdown.appendChild(option); // Appends the new option to the country dropdown.
    });

    // Populate state dropdown
    filters.states.forEach(state => {
        const option = document.createElement('option'); // Creates a new option element.
        option.value = state.state_id;  // Sets the value of the option to the state ID.
        option.textContent = state.state_name; // Sets the text displayed in the option.
        stateDropdown.appendChild(option); // Appends the new option to the state dropdown.
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
    const maxPlayers = maxPlayersInput.value; 
    const minPlayers = minPlayersInput.value; 
    const minDistance = minDistInput.value;
    const maxDistance = maxDistInput.value;
    const xTitle = "Event Names"; // Defines the x-axis title for the chart.
    const yTitle = "Average Distance Traveled"; // Defines the y-axis title for the chart.

    // Construct the URL with the selected filters
    let url = `./PHP/events.php?tier=${selectedTier}&country=${selectedCountry}&state=${selectedState}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data based on the selected filters
    const data = await fetchData(url); // Fetches event data from the constructed URL.
    let chartData = { labels: [], datasets: [{ label: "Average Player Distance Traveled ", data: [] }] }; // Initializes the data structure for the chart.

    // Check if data is empty
    if (!data || data.length === 0) {
        const ctx = document.getElementById("event-chart").getContext("2d"); // Gets the 2D rendering context for the chart canvas.

        // Destroy the previous chart instance if it exists
        if (eventChart) {
            eventChart.destroy(); // Destroys the existing chart instance.
            eventChart = null; // Sets the chart instance to null.
        }

        // Clear the chart canvas
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // Clears the chart canvas.

        // Return early if no data is found
        return; // Exits the function if no data is found.
    }

    // Prepare the data for the chart
    const filteredEvents = []; // Initializes an array to hold filtered event data.
    data.forEach(event => {
        const totalPlayers = event.TOTAL_MEMBERS; // Gets the total number of members for the event.
        const avgTravelDistance = event.AVG_TRAVEL_DISTANCE_MILES;
        const passesPlayerFilter = (!maxPlayers || totalPlayers <= parseFloat(maxPlayers)) && (!minPlayers || parseFloat(minPlayers) <= totalPlayers);
        const passesDistanceFilter = (!maxDistance || avgTravelDistance <= parseFloat(maxDistance)) && (!minDistance || parseFloat(minDistance) <= avgTravelDistance);
        // Checks if the event meets the player count criteria
        if(passesDistanceFilter && passesPlayerFilter) {
            filteredEvents.push(event); // Adds the event to the filtered events array.
            chartData.labels.push(event.EVENT_NAME); // Adds the event name to the chart labels.
            chartData.datasets[0].data.push({ // Adds the event data to the chart dataset.
                x: event.EVENT_NAME,
                y: event.AVG_TRAVEL_DISTANCE_MILES,
                osCount: event.MEMBERS_OUT_OF_STATE,
                isCount: event.MEMBERS_IN_STATE,
                id: event.EVENT_ID
            });
            chartData.datasets[0].backgroundColor = "#999"; // Sets the background color for the chart bars.
        }
    });

    // Create the chart using Chart.js
    const ctx = document.getElementById("event-chart").getContext("2d"); // Gets the 2D rendering context for the chart canvas.

    // Destroy the previous chart instance if it exists
    if (eventChart) {
        eventChart.destroy(); // Destroys the existing chart instance.
    }

    // Variables to track annotation information
    const averages = chartData.datasets[0].data.map(point => point.y); // Maps the y-values (average travel distance) for annotations.
    const minValue = averages.length > 0 ? Math.min(...averages) : 0; // Calculates the minimum average travel distance.
    const maxValue = averages.length > 0 ? Math.max(...averages) : 0; // Calculates the maximum average travel distance.
    const avgValue = averages.length > 0 ? averages.reduce((sum, value) => sum + value, 0) / averages.length : 0; // Calculates the average of average travel distances.

    // Set overview data
    updateOverview(minValue, maxValue, avgValue.toFixed(2), filteredEvents); // Calls a function to update an overview section with calculated values.

    // Create the chart title based on selected filters
    let parts = []; // Initializes an array to hold parts of the chart title.

    // Tier
    if (tierDropdown.value && tierDropdown.value !== "Any") {
        parts.push(`${tierDropdown.value} Tier`); // Adds the selected tier to the title.
    }

    // Location
    if (selectedState && selectedState !== "Any") {
        parts.push(`Events in ${stateDropdown.options[stateDropdown.selectedIndex].text}`); // Adds the selected state to the title.
    } else if (selectedCountry && selectedCountry !== "Any") {
        parts.push(`Events in ${selectedCountry}`); // Adds the selected country to the title.
    } else {
        parts.push("Events"); // Adds "Events" to the title if no specific location is selected.
    }

    // Date range
    if (startDate && endDate) {
        parts.push(`From ${(startDate)} To ${(endDate)}`); // Adds the date range to the title.
    } else if (startDate) {
        parts.push(`Since ${(startDate)}`); // Adds the start date to the title.
    } else if (endDate) {
        parts.push(`Up To ${(endDate)}`); // Adds the end date to the title.
    }

    // Distance range
    if (minDistance && maxDistance) {
        parts.push(`Between ${minDistance} and ${maxDistance} mi`);
    } else if (minDistance) {
        parts.push(`Over ${minDistance} mi`);
    } else if (maxDistance) {
        parts.push(`Under ${maxDistance} mi`);
    }

    // Join the parts to create the title
    const graphTitle = parts.join(" "); // Joins the parts of the title together.

    // Create the chart instance
    eventChart = new Chart(ctx, { // Creates a new chart instance using Chart.js.
        type: "bar", // Sets the chart type to bar.
        data: chartData, // Passes the prepared chart data.
        options: { // Defines various chart options.
            responsive: true, // Makes the chart responsive to container size changes.
            maintainAspectRatio: false, // Allows the chart to adjust its aspect ratio.
            scales: { // Defines the scales (axes) of the chart.
                x: { // Defines the x-axis.
                    title: { // Defines the x-axis title.
                        color: "white", // Sets the title color to white.
                        display: true, // Shows the title.
                        text: xTitle, // Sets the title text.
                        font: (ctx) => { // Sets the title font dynamically based on chart width.
                            const width = ctx.chart.width;
                            return {
                                family: "Poppins, sans-serif",
                                size: width < 400 ? 10 : width < 800 ? 12 : 13
                            };
                        },
                        margin: 10 // Sets the margin around the title.
                    },
                    ticks: { // Defines the x-axis ticks.
                        color: "white", // Sets the tick color to white.
                        autoSkip: false, // Prevents automatic skipping of ticks.
                        maxRotation: 90, // Sets the maximum rotation of tick labels.
                        minRotation: 90, // Sets the minimum rotation of tick labels.
                    },
                    grid: { // Defines the x-axis grid lines.
                        color: "rgba(255, 255, 255, 0.2)" // Sets the grid line color.
                    }
                },
                y: { // Defines the y-axis.
                    title: { // Defines the y-axis title.
                        display: true, // Shows the title.
                        color: "white", // Sets the title color to white.
                        text: yTitle, // Sets the title text.
                        font: (ctx) => { // Sets the title font dynamically based on chart width.
                            const width = ctx.chart.width;
                            return {
                                family: "Poppins, sans-serif",
                                size: width < 400 ? 10 : width < 800 ? 12 : 13
                            };
                        },
                    },
                    ticks: { // Defines the y-axis ticks.
                        color: "white" // Sets the tick color to white.
                    },
                    grid: { // Defines the y-axis grid lines.
                        color: "rgba(255, 255, 255, 0.2)" // Sets the grid line color.
                    },
                    beginAtZero: true, // Makes the y-axis start at zero.
                },
            },
            onClick: (e, elements) => { // Defines the behavior when a chart element is clicked.
                if (!elements.length) return; // If no elements are clicked, exit the function.

                const chartElement = elements[0]; // Gets the clicked chart element.
                const datasetIndex = chartElement.datasetIndex; // Gets the dataset index of the clicked element.
                const dataIndex = chartElement.index; // Gets the data index of the clicked element.
                const dataPoint = eventChart.data.datasets[datasetIndex].data[dataIndex]; // Gets the data point associated with the clicked element.
                const eventId = dataPoint.id; // Gets the event ID from the data point.

                focusOnEvent(eventId); // Calls the focusOnEvent function to highlight the corresponding event.
            },
            plugins: { // Defines chart plugins.
                title: { // Defines the chart title plugin.
                    display: true, // Shows the chart title.
                    text: graphTitle, // Sets the chart title text.
                    color: "white", // Sets the title color to white.
                    font: { // Sets the title font.
                        size: 20,
                        family: "Poppins, sans-serif"
                    },
                },
                legend: { // Defines the chart legend plugin.
                    display: false // Hides the legend.
                },
                tooltip: { // Defines the chart tooltip plugin.
                    callbacks: { // Defines tooltip callbacks.
                        label: function (tooltipItem) { // Defines the tooltip label.
                            const avgValue = tooltipItem.raw.y; // Gets the average travel distance from the tooltip item.
                            const osCount = tooltipItem.raw.osCount; // Gets the out-of-state member count.
                            const isCount = tooltipItem.raw.isCount; // Gets the in-state member count.
                            return `Avg: ${avgValue.toFixed(2)} mi, Out of State: ${osCount}, In State: ${isCount}`; // Returns the formatted tooltip label.
                        },
                    },
                },
                annotation: { // Defines the chart annotation plugin.
                    annotations: { // Defines the annotations.
                        min: { // Defines the minimum value annotation.
                            type: 'line', // Sets the annotation type to line.
                            yMin: minValue, // Sets the y-coordinate of the line.
                            yMax: minValue, // Sets the y-coordinate of the line.
                            borderColor: 'green', // Sets the line color to green.
                            borderWidth: 2,       // Sets the line width to 2 pixels.
                            label: { enabled: true, content: `Min: ${minValue.toFixed(2)} mi`, position: 'start' } // Displays a label with the minimum value at the start of the line.
                        },
                        max: { // Defines the maximum value annotation.
                            type: 'line',         // Sets the annotation type to line.
                            yMin: maxValue,       // Sets the y-coordinate of the line.
                            yMax: maxValue,       // Sets the y-coordinate of the line.
                            borderColor: 'red',   // Sets the line color to red.
                            borderWidth: 2,       // Sets the line width to 2 pixels.
                            label: { enabled: true, content: `Max: ${maxValue.toFixed(2)} mi`, position: 'start' } // Displays a label with the maximum value at the start of the line.
                        },
                        avg: { // Defines the average value annotation.
                            type: 'line',         // Sets the annotation type to line.
                            yMin: avgValue,       // Sets the y-coordinate of the line.
                            yMax: avgValue,       // Sets the y-coordinate of the line.
                            borderColor: 'yellow', // Sets the line color to yellow.
                            borderWidth: 2,       // Sets the line width to 2 pixels.
                            label: { enabled: true, content: `Avg: ${avgValue.toFixed(2)} mi`, position: 'start' } // Displays a label with the average value at the start of the line.
                        }
                    }
                }
            },
        },
    });
    eventChart.update(); // Updates the chart to reflect any changes in data or options.
}

/**
 * Method to update the overview section with calculated values related to event distances.
 * @param {number} minMiles - The minimum average distance traveled to an event.
 * @param {number} maxMiles - The maximum average distance traveled to an event.
 * @param {string} avgMiles - The average distance traveled to events (formatted as a string).
 * @param {Array} events - An array of filtered event objects.
 */
function updateOverview(minMiles, maxMiles, avgMiles, events) {
    const overviewContainer = document.querySelector(".overview-content"); // Selects the HTML element for the overview content.
    overviewContainer.innerHTML = ""; // Clears any existing content within the overview container.

    // Populates the overview container with dynamically generated HTML, displaying statistics.
    overviewContainer.innerHTML = `
        <h2>Overview</h2>
        <p>Total Events: <strong>${events.length}</strong></p>
        <p>Average Distance Traveled: <strong>${avgMiles} miles</strong></p>
        <p>Maximum Average Distance Traveled to Event: <strong>${maxMiles} miles</strong></p>
        <p>Minimum Average Distance Traveled to Event: <strong>${minMiles} miles</strong></p>`
}
/* -------- FUNCTIONS END -------- */