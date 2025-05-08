/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
/* -------- GLOBAL VARIABLES END -------- */

/* -------- CLASSES START -------- */
class ChartManager {
    // Class to manage the chart
    // Constructor to initialize the chart with default values
    // and set up the canvas ID
    constructor(canvasID) {
        this.chart = null;
        this.chartData = null;
        this.chartOptions = null;
        this.chartType = "bar"; // Default chart type
        this.canvasID = canvasID; // Default canvas ID
        this.init();
    }

    // Method to initialize the chart
    init() {
        // Set up the chart with default data and options
        const URL = `./PHP/events.php?tier=${tierDropdown.value}&country=${countryDropdown.value}&state=${stateDropdown.value}&start_date=${startDateInput.value}&end_date=${endDateInput.value}`;

        // Fetch data from the server and build the chart
        fetchData(URL).then((data) => {
            this.chartData = {
                labels: data.EVENT_NAME,
                datasets: [{
                    label: "Event Data",
                    data: data.map(event => event.AVG_TRAVEL_DISTANCE_MILES),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                }]
            };
            this.chartOptions = this.getDefaultOptions();
            this.buildChart(this.chartData, this.chartOptions);
        });
    }

    // Method to update the chart data and options
    buildChart(data, options) {
        const ctx = document.getElementById(this.canvasID).getContext("2d");
        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: data,
            options: options,
        });
    }

    // Method to build the chart
    getDefaultData() {
        return {
            labels: [],
            datasets: [
                {
                    label: "Default Dataset",
                    data: [],
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                },
            ],
        };
    }

    // Method to build the chart
    getDefaultOptions() {
        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "X Axis",
                    },
                },
                y: {
                    title: {
                        display: true,
                        text: "Y Axis",
                    },
                },
            },
        };
    }
}
/* -------- CLASSES END -------- */

/* -------- FUNCTIONS START -------- */
async function fetchData(URL) {
    try {
        const response = await fetch(URL);
        return await response.json();
    } catch (error) {
        return console.error('Error fetching data:', error);
    }
}
/* -------- FUNCTIONS END -------- */

/* -------- PROGRAM START -------- */
document.addEventListener("DOMContentLoaded", () => {
    const eventManager = new ChartManager("event-chart");


})