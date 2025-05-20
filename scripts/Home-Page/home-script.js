// Global list to store event data
const eventList = [];

/* -------- INITIALIZATION  -------- */
document.addEventListener("DOMContentLoaded", async () => {
    // Fetch data from the server and populate the event list
    await fetchData("./PHP/events.php").then(data => {
        // Store the event data in the global list
        eventList.push(...data);
    })

    console.loog("Events: ", eventList)


});
/* -------- INITIALIZATION END  -------- */

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