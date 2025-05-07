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
     * This method simply constructs a chart, DOES NOT BUILD IT
     * @param {string} chart 
     * @returns - ChartBuilder object
     */
    constructChart(chart) {
        // Construct chart based on name
        switch (chart) {
            case "event":
                // Store URL in a constant
                const URL = `./PHP/events.php?tier=${tierDropdown.value}&country=${countryDropdown.value}&state=${stateDropdown.value}&start_date=${dateStartSelect.value}&${dateEndSelect.value}`;

                // Store data in a constant
                const fetchResult = this.fetchData(URL);
                let xLabels, yData;
                console.log(fetchResult);


                fetchResult.then(data => {
                    // Store x labels
                    xLabels = data.map(event => event.EVENT_NAME);

                    // Data information for y axis
                    yData = data.map(event => ({
                        x: event.EVENT_NAME,
                        y: event.AVG_TRAVEL_DISTANCE_MILES,
                        osCount: event.MEMBERS_OUT_OF_STATE,
                        isCount: event.MEMBERS_IN_STATE
                    }));
                });
                return new ChartBuilder('event-chart', 'bar', { xLabels, yData });
            default:
                return null;
        }
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
document.addEventListener("DOMContentLoaded", () => {
    // Construct a event manager to handle events logic
    const chartManager = new ChartManager();
    const chartReference = chartManager.constructChart("event");
    chartReference.build();
});






















