/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
/* -------- GLOBAL VARIABLES END -------- */

/* -------- UTILITY FUNCTIONS START -------- */
const fetchData = async (url) => {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error("Error fetching data:", error);
        return [];
    }
};

const buildURL = (baseURL, params) => {
    const query = new URLSearchParams(params).toString();
    return `${baseURL}?${query}`;
};
/* -------- UTILITY FUNCTIONS END -------- */

/* -------- CHART MANAGER CLASS START -------- */
class ChartManager {
    constructor(canvasID, chartType = "bar") {
        this.chart = null;
        this.chartType = chartType;
        this.canvasID = canvasID;
    }

    async initialize(url) {
        const data = await fetchData(url);
        const chartData = this.formatChartData(data);
        const chartOptions = this.getDefaultOptions();
        console.log(chartData, chartOptions);
        console.log(data);
        this.buildChart(chartData, chartOptions);
    }

    formatChartData(data) {
        return {
            labels: data.map(event => event.EVENT_NAME),
            datasets: [{
                label: "Event Data",
                data: data.map(event => event.AVG_TRAVEL_DISTANCE_MILES),
                backgroundColor: "rgba(132, 192, 75, 0.2)",
                borderColor: "rgb(75, 192, 120)",
                borderWidth: 1,
            }]
        };
    }

    getDefaultOptions() {
        return {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: "Event Names",
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90,
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: "Average Travel Distance (Miles)",
                    },
                },
            },
        };
    }

    buildChart(data, options) {
        const ctx = document.getElementById(this.canvasID).getContext("2d");
        if (this.chart) this.chart.destroy(); // Destroy existing chart if any
        this.chart = new Chart(ctx, {
            type: this.chartType,
            data: data,
            options: options,
        });
    }
}
/* -------- CHART MANAGER CLASS END -------- */

/* -------- EVENT HANDLERS START -------- */
const handleApplyFilters = () => {
    const params = {
        tier: tierDropdown.value,
        country: countryDropdown.value,
        state: stateDropdown.value,
        start_date: startDateInput.value,
        end_date: endDateInput.value,
    };

    const url = buildURL("./PHP/events.php", params);
    console.log(params, url);

    eventChartManager.initialize(url);
};
/* -------- EVENT HANDLERS END -------- */

/* -------- PROGRAM START -------- */
document.addEventListener("DOMContentLoaded", () => {
    const defaultParams = {
        tier: tierDropdown.value,
        country: countryDropdown.value,
        state: stateDropdown.value,
        start_date: startDateInput.value,
        end_date: endDateInput.value,
    };

    const defaultURL = buildURL("./PHP/events.php", defaultParams);
    window.eventChartManager = new ChartManager("event-chart");
    eventChartManager.initialize(defaultURL);

    applyFiltersButton.addEventListener("click", handleApplyFilters);
});
/* -------- PROGRAM END -------- */

// When country dropdown changes, update state options
countryDropdown.addEventListener("change", function () {
    fetchData(`./PHP/handlers/getProvince.php?country=${countryDropdown.value}`).then(data => {
        if (!data.states) return;

        // Clear the state dropdown options
        while (stateDropdown.children.length > 1) {
            stateDropdown.removeChild(stateDropdown.lastChild);
        }

        // Add new state dropdown options
        data.states.forEach(element => {
            const option = document.createElement("option");
            option.value = element['state_id'];
            option.textContent = element['state_name'];
            stateDropdown.appendChild(option);
        });
    });
});