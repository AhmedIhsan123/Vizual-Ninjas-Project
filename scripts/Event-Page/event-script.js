/* --------------- IMPORTS --------------- */
import { fetchData } from "../../utils.js";
import { initEventStats } from "./Modules/event-filters.js";


/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data from the server and populate the event list
    await fetchData("./PHP/events.php").then(data => {
        // Store the event data in the global list
        eventList.push(...data);
    })

    // Build the event stats
    await initEventStats();
});






/* --------------- ORIGINAL CODE --------------- */
// // Initial Data Fetch and Render on Page Load
// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const [eventsResponse, resultsResponse, membersResponse] = await Promise.all([
//             fetch('data/events.json'),
//             fetch('data/event_results.json'),
//             fetch('data/members.json')
//         ]);

//         allEvents = await eventsResponse.json();
//         allEventResults = await resultsResponse.json();
//         allMembers = await membersResponse.json();

//         populateFilterDropdowns();
//         filterAndRender(); // Initial render with all data
//     } catch (error) {
//         console.error("Error loading data:", error);
//         // Display an error message to the user
//         alert("Failed to load event data. Please try again later.");
//     }
// });

// // Event Listeners
// searchInput.addEventListener('input', filterAndRender);

// // Listen for selection from datalist or direct input
// searchInput.addEventListener('change', (e) => {
//     const selectedEvent = allEvents.find(event => event.EVENT_NAME === e.target.value);
//     if (selectedEvent) {
//         // If a specific event is selected, filter everything down to that event
//         // This simulates selecting a single event from the dropdown
//         tierFilter.value = selectedEvent.EVENT_TIER_ID;
//         countryFilter.value = selectedEvent.COUNTRY_ID;
//         stateFilter.value = selectedEvent.EVENT_STATE_ID;
//         filterAndRender(); // Re-render with selected event's filters
//     } else {
//         // If input doesn't match an event name (e.g., cleared, or typing a general search)
//         filterAndRender();
//     }
// });


// [tierFilter, countryFilter, stateFilter].forEach(filter => {
//     filter.addEventListener('change', filterAndRender);
// });
// resetButton.addEventListener('click', resetFilters);