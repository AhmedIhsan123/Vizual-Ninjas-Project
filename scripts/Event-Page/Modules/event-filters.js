//test

/* --------------- IMPORTS --------------- */
import { fetchData } from "../../utils.js";
import { updateMap } from "./event-map.js";

/* --------------- GLOBAL VARIABLES --------------- */
const applyFiltersEventButton = document.querySelector("#apply-filters-event"); // NEW BUTTON REFERENCE
const resetFiltersButton = document.querySelector("#reset-filters");
const tierDropdown = document.querySelector("#tierFilter");
const countryDropdown = document.querySelector("#countryFilter");
const stateDropdown = document.querySelector("#stateFilter");
const searchEvent = document.querySelector("#event-search");
const eventListRef = document.querySelector("#event-list");
const selectedEventNameElement = document.getElementById("selectedEventName");

let filterData = null; // Store the filter data here
let allEventsCache = []; // Cache for all events to populate datalist

/* --------------- FUNCTIONS --------------- */

/**
 * Fetches filter data (tiers, countries, states) from the server.
 * Caches the data to prevent multiple fetches on subsequent calls.
 * @returns {Object|null} Filter data or null if fetch fails.
 */
async function getFilterData() {
    if (!filterData) { // Only fetch if filterData is null
        filterData = await fetchData("./PHP/handlers/getFilters.php");
    }
    return filterData;
}

/**
 * Populates the tier, country, and state dropdowns with data.
 * Prevents re-populating if already done.
 */
async function populateFilterDropdowns() {
    const data = await getFilterData(); // Ensure filter data is fetched

    if (!data) return;

    // Populate Tier Filter if not already populated
    if (tierDropdown.options.length <= 1) {
        tierDropdown.innerHTML = '<option value="">All Tiers</option>';
        data.tiers.forEach(tier => {
            const option = document.createElement('option');
            option.value = tier;
            option.textContent = tier;
            tierDropdown.appendChild(option);
        });
    }

    // Populate Country Filter if not already populated
    if (countryDropdown.options.length <= 1) {
        countryDropdown.innerHTML = '<option value="">All Countries</option>';
        data.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country;
            option.textContent = country;
            countryDropdown.appendChild(option);
        });
    }

    // Populate State Filter (initially, might be repopulated on country change)
    // This check is for initial load only. Country change listener handles subsequent state population.
    if (stateDropdown.options.length <= 1 && data.states) {
        stateDropdown.innerHTML = '<option value="">All States</option>';
        data.states.forEach(state => {
            const option = document.createElement('option');
            option.value = state['state_id'];
            option.textContent = state['state_name'];
            stateDropdown.appendChild(option);
        });
    }
}

/**
 * Fetches all events initially and populates the datalist for the event search input.
 * This is done once on initial load to provide suggestions.
 */
async function cacheAllEventsAndPopulateDatalist() {
    if (allEventsCache.length === 0) { // Only fetch if cache is empty
        allEventsCache = await fetchData("./PHP/events.php");
    }
    if (!allEventsCache) return;

    // Initially populate datalist with all event names
    eventListRef.innerHTML = "";
    allEventsCache.forEach(event => {
        const option = document.createElement("option");
        option.value = event.EVENT_NAME;
        eventListRef.appendChild(option);
    });
}

/**
 * Updates the datalist suggestions based on the current search input.
 * This is a client-side filter for suggestions, not for the main data display.
 */
function updateSearchDatalistSuggestions() {
    const searchTerm = searchEvent.value.toLowerCase();
    eventListRef.innerHTML = ""; // Clear existing options

    const filteredSuggestions = allEventsCache.filter(event =>
        event.EVENT_NAME.toLowerCase().includes(searchTerm)
    );

    filteredSuggestions.forEach(event => {
        const option = document.createElement("option");
        option.value = event.EVENT_NAME;
        eventListRef.appendChild(option);
    });
}

/**
 * Main function to initialize event statistics, map, and charts based on current filters.
 * This function is called when the page loads, "Apply Filters" is clicked, or "Reset Filters" is clicked.
 */
export async function initEventStats() {
    // Ensure filters and datalist are populated (only fetches from server once)
    await populateFilterDropdowns();
    await cacheAllEventsAndPopulateDatalist(); // Ensure all events are cached for datalist

    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const searchedEventName = searchEvent.value.toLowerCase();

    // Construct URL for fetching filtered events
    let url = `./PHP/events.php?`;
    if (selectedTier) url += `tier=${selectedTier}&`;
    if (selectedCountry) url += `country=${selectedCountry}&`;
    if (selectedState) url += `state=${selectedState}&`;

    // Remove trailing '&' if any
    if (url.endsWith('&')) {
        url = url.slice(0, -1);
    }

    const events = await fetchData(url);
    if (!events) {
        // Clear map, stats, charts if no events are returned or fetch fails
        updateMap([]);
        updateChartsAndStats([]);
        selectedEventNameElement.textContent = 'No Events Found';
        return;
    }

    // Filter events further by search term if necessary (client-side filtering for datalist)
    const filteredEvents = events.filter(event =>
        event.EVENT_NAME.toLowerCase().includes(searchedEventName)
    );

    // Update the map with the filtered events
    updateMap(filteredEvents);

    // Update charts and stats with the filtered events
    let eventForStats = null;
    if (filteredEvents.length === 1 && filteredEvents[0].EVENT_NAME.toLowerCase() === searchedEventName) {
        eventForStats = filteredEvents[0];
        selectedEventNameElement.textContent = eventForStats.EVENT_NAME;
    } else {
        selectedEventNameElement.textContent = 'All Events';
    }
}

/**
 * Public function to trigger filter updates.
 * (Currently just calls populateFilterDropdowns, but can be extended)
 */
export async function updateFilters() {
    await populateFilterDropdowns();
}

/* --------------- EVENT LISTENERS --------------- */

// Listener for Country dropdown change: fetches new states (does NOT trigger full data update yet)
countryDropdown.addEventListener("change", async () => {
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);

    if (!states) {
        stateDropdown.innerHTML = '<option value="">All States</option>'; // Clear if fetch fails
        return;
    }

    stateDropdown.innerHTML = '<option value="">All States</option>';
    states.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state['state_id'];
        option.textContent = state['state_name'];
        stateDropdown.appendChild(option);
    });
    // Do NOT call initEventStats() here. It will be called by the "Apply Filters" button.
});

// Listener for Search input (typing) - only updates datalist suggestions
searchEvent.addEventListener("input", () => {
    updateSearchDatalistSuggestions();
});

// Listener for Apply Filters button click - this triggers the main data fetch and updates
applyFiltersEventButton.addEventListener("click", () => {
    initEventStats(); // Re-fetch events and update all components
});

// Listeners for Tier and State dropdown changes - these do NOT trigger full data update yet
[tierDropdown, stateDropdown].forEach(dropdown => {
    dropdown.addEventListener("change", () => {
        // Do nothing here, initEventStats() will be called by the "Apply Filters" button.
    });
});

// Listener for Reset Filters button
resetFiltersButton.addEventListener("click", () => {
    tierDropdown.value = "";
    countryDropdown.value = "";
    stateDropdown.value = "";
    searchEvent.value = "";
    initEventStats(); // Re-fetch events and update all components after reset
});