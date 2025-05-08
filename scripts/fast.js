/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier-dropdown");
const countryDropdown = document.querySelector("#country-dropdown");
const stateDropdown = document.querySelector("#state-dropdown");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
/* -------- GLOBAL VARIABLES END -------- */

/* -------- CLASSES START -------- */
class ChartManager {
    constructor(canvasID) {
        this.chart = null;
        this.chartData = null;
        this.chartOptions = null;
        this.chartType = "bar"; // Default chart type
        this.canvasId = canvasID; // Default canvas ID
        this.init();
    }

    init() {
        // Initialize the chart with default data and options
        this.chartData = this.getDefaultData();
        this.chartOptions = this.getDefaultOptions();
        this.buildChart(this.canvasId, this.chartType, this.chartData, this.chartOptions);
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