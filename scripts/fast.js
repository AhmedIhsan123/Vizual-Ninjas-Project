/* -------- GLOBAL VARIABLES -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");

/* -------- UTILITY FUNCTIONS -------- */
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

/* -------- CHART MANAGER CLASS -------- */
class ChartManager {
    constructor(canvasID, chartType = "bar") {
        this.chart = null;
        this.chartType = chartType;
        this.canvasID = canvasID;
    }

    async initialize(url) {
        const data = await fetchData(url);
        const chartData = this.formatChartData(data);
        const chartOptions = this.getDefaultOptions(data);
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
                extraData: data.map(event => ({
                    inState: event.MEMBERS_IN_STATE,
                    outState: event.MEMBERS_OUT_OF_STATE
                }))
            }]
        };
    }

    getDefaultOptions(data) {
        const avg = data.reduce((sum, event) => sum + event.AVG_TRAVEL_DISTANCE_MILES, 0) / data.length;
        const max = Math.max(...data.map(event => event.AVG_TRAVEL_DISTANCE_MILES));
        const min = Math.min(...data.map(event => event.AVG_TRAVEL_DISTANCE_MILES));

        return {
            responsive: true,
            plugins: {
                tooltip: {
                    callbacks: {
                        afterLabel: (tooltipItem) => {
                            const extraData = tooltipItem.dataset.extraData[tooltipItem.dataIndex];
                            return [
                                `In-State Players: ${extraData.inState}`,
                                `Out-of-State Players: ${extraData.outState}`
                            ];
                        }
                    }
                },
                annotation: {
                    annotations: {
                        avgLine: {
                            type: 'line',
                            yMin: avg,
                            yMax: avg,
                            borderColor: 'blue',
                            borderWidth: 2,
                            label: {
                                content: 'Average',
                                enabled: true,
                                position: 'end'
                            }
                        },
                        maxLine: {
                            type: 'line',
                            yMin: max,
                            yMax: max,
                            borderColor: 'green',
                            borderWidth: 2,
                            label: {
                                content: 'Max',
                                enabled: true,
                                position: 'end'
                            }
                        },
                        minLine: {
                            type: 'line',
                            yMin: min,
                            yMax: min,
                            borderColor: 'red',
                            borderWidth: 2,
                            label: {
                                content: 'Min',
                                enabled: true,
                                position: 'end'
                            }
                        }
                    }
                }
            },
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

/* -------- EVENT HANDLERS -------- */
const handleApplyFilters = () => {
    const params = {
        tier: tierDropdown.value,
        country: countryDropdown.value,
        state: stateDropdown.value,
        start_date: startDateInput.value,
        end_date: endDateInput.value,
    };

    const url = buildURL("./PHP/events.php", params);
    eventChartManager.initialize(url);
};

const handleCountryChange = () => {
    const url = `./PHP/handlers/getProvince.php?country=${countryDropdown.value}`;
    fetchData(url).then(data => {
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
};

/* -------- INITIALIZATION -------- */
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
    countryDropdown.addEventListener("change", handleCountryChange);
});
