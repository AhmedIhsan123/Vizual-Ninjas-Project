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
searchEvent.addEventListener("input", async () => {
    const filter = searchEvent.value.toLowerCase();
    const url = "./PHP/handlers/events.php";
    const events = await fetchData(url);

    if (!events) return;

    const filteredEvents = events.filter(event =>
        event.EVENT_NAME.toLowerCase().includes(filter)
    );
    updateMap(filteredEvents);
});

tierDropdown.addEventListener("change", async () => {
    const tier = tierDropdown.value;
    const country = countryDropdown.value;
    const state = stateDropdown.value;
    await filterAndShowEvents(tier, country, state);
});

countryDropdown.addEventListener("change", async () => {
    const tier = tierDropdown.value;
    const country = countryDropdown.value;
    const state = stateDropdown.value;
    await filterAndShowEvents(tier, country, state);
});

stateDropdown.addEventListener("change", async () => {
    const tier = tierDropdown.value;
    const country = countryDropdown.value;
    const state = stateDropdown.value;
    await filterAndShowEvents(tier, country, state);
});

resetFiltersButton.addEventListener("click", async () => {
    tierDropdown.value = "";
    countryDropdown.value = "";
    stateDropdown.value = "";
    searchEvent.value = "";
    await filterAndShowEvents("", "", "");  // Show all events
});

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

    // Populate State Filter (initially empty)
    stateDropdown.innerHTML = '<option value="">All States</option>';
}

async function filterAndShowEvents(tier, country, state) {
    let url = './PHP/handlers/events.php?';
    if (tier) url += `tier=${tier}&`;
    if (country) url += `country=${country}&`;
    if (state) url += `state=${state}&`;

    // Remove the trailing ampersand if it exists
    if (url.endsWith('&')) {
        url = url.slice(0, url.length - 1);
    }

    const events = await fetchData(url);
    if (events) {
        updateMap(events);
    }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", async () => {
    await populateFilterDropdowns();
    await filterAndShowEvents();
});