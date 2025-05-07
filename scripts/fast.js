import ChartBuilder from "./charts.js";

/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const dateStartSelect = document.querySelector("#start-date");
const dateEndSelect = document.querySelector("#end-date");
const chartsParent = document.querySelector(".visualizations");
/* -------- END OF GLOBAL VARIABLES -------- */

/* -------- CLASSES START -------- */
class Event {
    constructor(id, name, endDate, city, state, country, coordinates, tier) {
        this.eventID = id;
        this.eventName = name;
        this.eventEndDate = new Date(endDate); // Ensure it's a Date object
        this.eventCity = city;
        this.eventState = state;
        this.eventCountry = country;
        this.eventCoordinates = coordinates instanceof Coordinate ? coordinates : null; // Ensure it's a Coordinate object
        this.eventTier = tier;
    }
}

class ChartManager {
    constructor() { }

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
}

class Coordinate {
    constructor(longitude, latitude) {
        this.long = Number(longitude); // Ensure it's a number
        this.lat = Number(latitude); // Ensure it's a number
    }

    getCoordinates() {
        return {
            latitude: this.lat,
            longitude: this.long
        };
    }
}
/* -------- END OF CLASSES -------- */

/* -------- START OF PROGRAM -------- */
document.addEventListener("DOMContentLoaded", async () => {
    const chartManager = new ChartManager();

    const fetchEvents = async () => {
        const URL = `./PHP/events.php?tier=${tierDropdown.value}&country=${countryDropdown.value}&state=${stateDropdown.value}&start_date=${dateStartSelect.value}&end_date=${dateEndSelect.value}`;

        const data = await chartManager.fetchData(URL);

        if (!data || !data.EVENT_NAME || !data.AVG_TRAVEL_DISTANCE_MILES) {
            console.error("Invalid data format received:", data);
            return;
        }

        const chart = new ChartBuilder('event-chart', 'bar', {
            labels: data.EVENT_NAME,
            datasets: [{
                data: data.AVG_TRAVEL_DISTANCE_MILES,
                backgroundColor: 'green',
                borderWidth: 1
            }]
        },
            {
                options: {
                    responsive: true,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Event Name',
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
                                text: 'Average Distance Traveled in Miles',
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
                            text: 'Average Distance Traveled in Miles Per Event',
                            position: 'top',
                            font: { size: 20, weight: 'bold' },
                            padding: { top: 10, bottom: 20 },
                            color: '#333'
                        },
                        legend: { display: false },
                        tooltip: {
                            callbacks: {
                                label: context => {
                                    const index = context.dataIndex;
                                    return `Average Distance: ${context.raw} mi, OS: ${data.MEMBERS_IN_STATE[index]}, IS: ${data.MEMBERS_OUT_OF_STATE[index]}`;
                                }
                            }
                        },
                    }
                },
            });

        chart.build();
    };

    // Fetch events when dropdown values change
    [tierDropdown, countryDropdown, stateDropdown, dateStartSelect, dateEndSelect].forEach(dropdown => {
        dropdown.addEventListener("change", fetchEvents);
    });

    // Initial fetch
    fetchEvents();
});
