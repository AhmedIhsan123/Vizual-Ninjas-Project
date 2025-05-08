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
    updateFilters();
});

// Method to set chart options based on the data
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

async function updateFilters() {
    const filters = await fetchData('./PHP/handlers/getFilters.php');
    console.log(filters);
}