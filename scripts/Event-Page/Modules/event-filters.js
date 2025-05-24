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

/* --------------- FUNCTIONS --------------- */
async function populateFilterDropdowns() {
    const filterData = await fetchData("./PHP/handlers/getFilters.php");

    if (!filterData) return;  // Exit if fetch fails

    // Populate Tier Filter
    tierDropdown.innerHTML = '<option value="">All Tiers</option>';
    filterData.tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier;
        option.textContent = tier;
        tierDropdown.appendChild(option);
    });

    // Populate Country Filter
    countryDropdown.innerHTML = '<option value="">All Countries</option>';
    filterData.countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryDropdown.appendChild(option);
    });

    // Populate State Filter (initially, before country selection)
    stateDropdown.innerHTML = '<option value="">All States</option>';
    filterData.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state.state_id;
        option.textContent = state.state_name;
        stateDropdown.appendChild(option);
    });
}

async function populateEventSearch() {
    const events = await fetchData("./PHP/events.php"); // Fetch all events initially
    if (!events) return;

    eventListRef.innerHTML = ""; // Clear existing options
    events.forEach(event => {
        const option = document.createElement("option");
        option.value = event.EVENT_NAME;
        eventListRef.appendChild(option);
    });
}

export async function initEventStats() {
    await populateEventSearch(); // Populate event search
    await populateFilterDropdowns(); // Populate filters

    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const searchedEvent = searchEvent.value.toLowerCase();

    let url = `./PHP/events.php?tier=<span class="math-inline">\{selectedTier\}&country\=</span>{selectedCountry}&state=${selectedState}`;

    const events = await fetchData(url);
    if (!events) return;

    const filteredEvents = events.filter(event =>
        event.EVENT_NAME.toLowerCase().includes(searchedEvent)
    );

    updateMap(filteredEvents);
    //  updateChartsAndStats(filteredEvents); //  Need to implement this
}

export async function updateFilters() {
    await populateFilterDropdowns();
}

/* --------------- EVENT LISTENERS --------------- */

countryDropdown.addEventListener("change", async () => {
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);

    if (!states) return;

    stateDropdown.innerHTML = '<option value="">All States</option>';

    states.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state['state_id'];
        option.textContent = state['state_name'];
        stateDropdown.appendChild(option);
    });

    initEventStats(); // Re-fetch events when country changes
});

searchEvent.addEventListener("input", () => {
    initEventStats();
});

[tierDropdown, countryDropdown, stateDropdown].forEach(dropdown => {
    dropdown.addEventListener("change", () => {
        initEventStats();
    });
});

resetFiltersButton.addEventListener("click", () => {
    tierDropdown.value = "";
    countryDropdown.value = "";
    stateDropdown.value = "";
    searchEvent.value = "";
    initEventStats(); // Re-fetch events after reset
});


/* --------------- ORIGINAL CODE --------------- */
/*
// Global data variables
let allEvents = [];
let allEventResults = [];
let allMembers = [];

function resetFilters() {
    searchInput.value = '';
    tierFilter.value = '';
    countryFilter.value = '';
    stateFilter.value = '';
    filterAndRender(); // Re-render all data
}

// Filter Controls
const searchInput = document.getElementById("event-search");
const eventDatalist = document.getElementById("events");
const tierFilter = document.getElementById("tierFilter");
const countryFilter = document.getElementById("countryFilter");
const stateFilter = document.getElementById("stateFilter");
const resetButton = document.getElementById("reset-filters");
const selectedEventNameElement = document.getElementById("selectedEventName");

// Global Chart Instances to allow destruction
let chartDistanceInstance = null;
let chartStatesInstance = null;

function populateFilterDropdowns() {
    const tiers = [...new Set(allEvents.map(event => event.EVENT_TIER_ID))].sort();
    const countries = [...new Set(allEvents.map(event => event.COUNTRY_ID))].sort();
    const states = [...new Set(allEvents.map(event => event.EVENT_STATE_ID))].sort();

    tierFilter.innerHTML = '<option value="">All Tiers</option>';
    tiers.forEach(tier => {
        const option = document.createElement('option');
        option.value = tier;
        option.textContent = tier;
        tierFilter.appendChild(option);
    });

    countryFilter.innerHTML = '<option value="">All Countries</option>';
    countries.forEach(country => {
        const option = document.createElement('option');
        option.value = country;
        option.textContent = country;
        countryFilter.appendChild(option);
    });

    stateFilter.innerHTML = '<option value="">All States</option>';
    states.forEach(state => {
        const option = document.createElement('option');
        option.value = state;
        option.textContent = state;
        stateFilter.appendChild(option);
    });
}
*/