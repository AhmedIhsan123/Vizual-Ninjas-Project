/* -------- GLOBAL VARIABLES START -------- */
const tierDropdown = document.querySelector("#tier");
const countryDropdown = document.querySelector("#country");
const stateDropdown = document.querySelector("#state");
const startDateInput = document.querySelector("#start-date");
const endDateInput = document.querySelector("#end-date");
const applyFiltersButton = document.querySelector("#apply-filters");
const chartUtils = new ChartUtilities();
/* -------- GLOBAL VARIABLES END -------- */

/* -------- CLASS DEFINITIONS -------- */
class ChartUtilities {
    constructor() { }

    // Method to set chart options based on the data
    async fetchData(url) {
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
}


/* -------- INITIALIZATION -------- */
document.addEventListener("DOMContentLoaded", async () => {
    updateFilters();
});

async function updateFilters() {
    const filters = await chartUtils.fetchData('./PHP/handlers/getFilters.php');
    console.log(filters);
}