import ChartBuilder from "./charts.js";

/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const dateStartSelect = document.querySelector("#start-date");
const dateEndSelect = document.querySelector("#end-date");
/* -------- END OF GLOBAL VARIABLES -------- */

/* -------- CLASSES START -------- */
/**
 * Developer - Ahmed Ihsan
 * Class - Event
 * Function - An event class will store information about events
 * */
class Event {
    /**
     * Developer - Ahmed Ihsan
     * Event parameterized constructor
     * @param {int} id - ID of the event
     * @param {string} name - Name of the event
     * @param {date} endDate - End date of the event
     * @param {string} city - City of the event
     * @param {string} state - State of the event
     * @param {string} country - Country of the event
     * @param {coordinate} coordinates - Coordinates of the event
     * @param {string} tier - Tier of the event
     */
    constructor(id, name, endDate, city, state, country, coordinates, tier) {
        this.eventID = id;
        this.eventName = name;
        this.eventEndDate = endDate;
        this.eventCity = city;
        this.eventState = state;
        this.eventCountry = country;
        this.eventCoordinates = coordinates;
        this.eventTier = tier;
    }
}

/**
 * Developer - Ahmed Ihsan
 * Class - ChartManager
 * Function - This class will manage all chart functionality (TBD)
 */
class ChartManager {
    // Default constructor
    constructor() { };

    /**
     * Developer - Ahmed Ihsan
     * This method simply fetches data from a URL
     * @param {string} url 
     * @returns - The data fetched from the URL
     */
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

    /**
     * Developer - Ahmed Ihsan
     * This method simply constructs a chart, ALSO BUILD IT
     * @param {string} chart 
     * @returns - ChartBuilder object
     */
    async constructChart(chart) {
        // Construct chart based on name
        switch (chart) {
            case "event":
                // Store URL in a constant
                const URL = `./PHP/events.php?tier=${tierDropdown.value}&country=${countryDropdown.value}&state=${stateDropdown.value}&start_date=${dateStartSelect.value}&${dateEndSelect.value}`;

                // Fetch the data
                const data = await this.fetchData(URL);

                // Store x labels
                const xLabels = data.map(event => event.EVENT_NAME);

                // Data information for y axis
                const yData = data.map(event => ({
                    x: event.EVENT_NAME,
                    y: event.AVG_TRAVEL_DISTANCE_MILES,
                    osCount: event.MEMBERS_OUT_OF_STATE,
                    isCount: event.MEMBERS_IN_STATE
                }));

                // Build chart
                const chart = new ChartBuilder('event-chart', 'bar',);

                // Variable to store the combined data
                const { chartData, options } = this.setChartOptions('Average Distance Traveled Per Event', 'Events', 'Average Distance Traveled in Miles', xLabels, yData);

                // Build chart
                chart.build()

                // Update the data and options of new chart
                chart.updateData(chartData);
                chart.updateOptions(options);

                // Return the chart
                return chart;
            default:
                return null;
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

/**
 * Developer - Ahmed Ihsan
 * Class - Coordinate
 * Function - A class that stores longitude and latitude coordinates
 * */
class Coordinate {
    /**
     * Developer - Ahmed Ihsan
     * A parameterized constructor for coordinate class
     * @param {int} longitude 
     * @param {int} latitude 
     */
    constructor(longitude, latitude) {
        this.long = longitude;
        this.lat = latitude;
    }

    /**
     * Developer - Ahmed Ihsan
     * Returns a coordinate object
     * @returns - coordinate object
     */
    getCoordinates() {
        return {
            latitude: this.lat,
            longitude: this.long
        }
    }
}
/* -------- END OF CLASSES -------- */



/* -------- START OF PRORGAM -------- */
/**
 * Developer - Ahmed Ihsan
 * This event listner will trigger when the DOM is loaded...(Start program).
 */
document.addEventListener("DOMContentLoaded", async () => {
    // Construct a event manager to handle events logic
    const chartManager = new ChartManager();
    const chartReference = await chartManager.constructChart("event");
});






















