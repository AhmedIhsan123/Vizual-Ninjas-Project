/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
/* -------- GLOBAL VARIABLES END -------- */

/* -------- INITIALIZATION -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Set the correct possible filters for the dropdowns
    updateFilters();



});

//* -------- EVENT LISTENERS START -------- */
// Event listener for the apply filters button
countryDropdown.addEventListener("change", async () => {
    const selectedCountry = countryDropdown.value;
    const url = `./PHP/handlers/getProvince.php?country=${selectedCountry}`;
    const states = await fetchData(url);
    console.log(states);

    // Clear existing options in state dropdown
    if (!states) return;

    // Clear existing options in state dropdown
    stateDropdown.innerHTML = '<option value="">Any</option>';

    // Populate state dropdown with new options
    states.states.forEach(state => {
        const option = document.createElement('option');
        option.value = state['state_id'];
        option.textContent = state['state_name'];
        stateDropdown.appendChild(option);
    });
});

// Event listener for the apply filters button
applyFiltersButton.addEventListener("click", async () => {
    // Get the selected values from the dropdowns and inputs
    const selectedTier = tierDropdown.value;
    const selectedCountry = countryDropdown.value;
    const selectedState = stateDropdown.value;
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    // Construct the URL with the selected filters
    let url = `./PHP/events.php?tier=${selectedTier}&country=${selectedCountry}&state=${selectedState}&start_date=${startDate}&end_date=${endDate}`;

    // Fetch data based on the selected filters
    const data = await fetchData(url);
    console.log(data);
});


//* -------- EVENT LISTENERS END -------- */

/* -------- FUNCTIONS START -------- */
// Method to fetch data through url and return the data found
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        return await response.json();
    } catch (error) {
        return console.error("Fetch error: ", error);
    }
}

// Method to update the filters dropdowns
async function updateFilters() {
    // Fetch filters data from the server
    const filters = await fetchData('./PHP/handlers/getFilters.php');

    // No data to update
    if (!filters) return;

    // Clear existing options in dropdowns
    tierDropdown.innerHTML = '<option value="">Any</option>';
    countryDropdown.innerHTML = '<option value="">Any</option>';
    stateDropdown.innerHTML = '<option value="">Any</option>';

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
/* -------- FUNCTIONS END -------- */