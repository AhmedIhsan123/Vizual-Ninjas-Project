/* --------------- IMPORTS --------------- */
import { fetchData } from "../../utils.js";
import { updateMap } from "./event-map.js";

/* --------------- GLOBAL VARIABLES --------------- */
const resetFiltersButton = document.querySelector("#reset-filters");
const tierDropdown = document.querySelector("#tierFilter");
const countryDropdown = document.querySelector("#countryFilter");
const stateDropdown = document.querySelector("#stateFilter");
const searchEvent = document.querySelector("#event-search");
const eventListRef = document.querySelector("#event-list");

/* --------------- EVENT LISTENERS --------------- */
countryDropdown.addEventListener("change", async () => {
    // Fetch states based on the selected country
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);

    // Clear existing options in state dropdown
    if (!states) return;

    // Clear existing options in state dropdown
    stateDropdown.innerHTML = '<option value="">All States</option>';

    // Populate state dropdown with new options
    states.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state['state_id'];
        option.textContent = state['state_name'];
        stateDropdown.appendChild(option);
    });
});

// Reacts to selecting an event from the search bar
searchEvent.addEventListener("input", () => {
    initEventStats();
});

// Auto Change/Event listener to apply filters
[tierDropdown, countryDropdown, stateDropdown].forEach(dropdown => {
    dropdown.addEventListener("change", () => {
        initEventStats();
    });
});


// Event listener for the reset filters button
resetFiltersButton.addEventListener("click", async () => {
    // Reset all dropdowns and inputs to default values
    tierDropdown.value = "";
    countryDropdown.value = "";
    stateDropdown.value = "";
    searchEvent.value = "";
    eventListRef.innerHTML = "";

    // Rebuild the filters and chart
    await updateFilters();
    initEventStats();
});

/* --------------- FUNCTIONS --------------- */
// Method to update the filters dropdowns
export async function updateFilters() {
    // Fetch filters data from the server
    const filters = await fetchData('./PHP/handlers/getFilters.php');

    console.log(filters);

    // No data to update
    if (!filters) return;

    // Clear existing options in dropdowns
    tierDropdown.innerHTML = '<option value="">All Tiers</option>';
    countryDropdown.innerHTML = '<option value="">All Countries</option>';
    stateDropdown.innerHTML = '<option value="">All States</option>';

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

// Method to initialize the stats
export async function initEventStats() {
    // Get the selected values from the dropdowns and inputs
    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const searchedEvent = searchEvent.value.toLowerCase();

    // Construct the URL with the selected filters
    let url = `./PHP/events.php?tier=${selectedTier}&country=${selectedCountry}&state=${selectedState}`;

    // Fetch data based on the selected filters
    const data = await fetchData(url);

    const filteredEvents = data.filter(event =>
        event.EVENT_NAME &&
        (!searchedEvent || event.EVENT_NAME.toLowerCase().includes(searchedEvent))
    );

    console.log("Filtered Events:", filteredEvents);

    // Populate the event list with the filtered data
    eventListRef.innerHTML = ""; // Clear previous options
    filteredEvents.forEach(event => {
        const option = document.createElement("option");
        option.value = event.EVENT_NAME;
        eventListRef.appendChild(option);
    });

    // Update the map with the filtered events
    updateMap(filteredEvents);
}