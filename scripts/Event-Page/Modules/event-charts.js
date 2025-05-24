// event-charts.js
import { fetchData } from "../../utils.js";

let chartDistanceInstance = null;
let chartStatesInstance = null;

// Helper function to calculate Haversine distance
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function updateChartsAndStats(events) {
    const allMembers = await fetchData("./PHP/handlers/getMembers.php"); // You'll need to create this PHP file
    const allEventResults = await fetchData("./PHP/handlers/getEventResults.php"); // And this one

    if (!allMembers || !allEventResults || !events) return;

    const currentEventPlayers = [];
    const playersByState = {};

    allEventResults.forEach(result => {
        const member = allMembers.find(m => m.PDGA_NUMBER === result.PDGA_NUMBER);
        const event = events.find(e => e.EVENT_ID === result.EVENT_ID);

        if (member && event) {
            const distanceKm = haversineDistance(
                member.MEMBER_LAT, member.MEMBER_LON,
                event.EVENT_LATITUDE, event.EVENT_LONGITUDE
            );

            currentEventPlayers.push({
                name: member.MEMBER_FULL_NAME,
                EVENT_PLACE: result.EVENT_PLACE,
                distanceKm: distanceKm,
                state: member.MEMBER_STATE_PROV,
                country: member.COUNTRY_ID
            });

            playersByState[member.MEMBER_STATE_PROV] = (playersByState[member.MEMBER_STATE_PROV] || 0) + 1;
        }
    });

    // Sort players by event place to get top players
    const topPlayers = currentEventPlayers.sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE);

    updateStats(currentEventPlayers, events[0]); // Assuming stats are for the first event
    updateTopPlayers(topPlayers);
    renderCharts(topPlayers, playersByState);
}

function renderCharts(topPlayers, playersByState) {
    if (chartDistanceInstance) {
        chartDistanceInstance.destroy();
    }
    if (chartStatesInstance) {
        chartStatesInstance.destroy();
    }

    const chartDistanceCtx = document.getElementById("chartDistance")?.getContext("2d");
    const chartStatesCtx = document.getElementById("chartStates")?.getContext("2d");

    if (!chartDistanceCtx || !chartStatesCtx) return;

    chartDistanceInstance = new Chart(chartDistanceCtx, {
        type: 'bar',
        data: {
            labels: topPlayers.slice(0, 25).map(p => p.name),
            datasets: [{
                label: "Distance (mi)",
                data: topPlayers.slice(0, 25).map(p => Math.round(p.distanceKm * 0.621371)),
                backgroundColor: '#4e88ff'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: {
                legend: { labels: { color: '#fff' } },
                tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} mi` } }
            },
            scales: {
                x: {
                    ticks: { color: '#fff' },
                    title: { text: "Distance (mi)", display: true, color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                y: {
                    ticks: { color: '#fff' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });

    chartStatesInstance = new Chart(chartStatesCtx, {
        type: 'pie',
        data: {
            labels: Object.keys(playersByState),
            datasets: [{
                label: "Players",
                data: Object.values(playersByState),
                backgroundColor: ['#ff6b6b', '#ffa07a', '#ffefd5', '#b0e0e6', '#6495ed', '#cba3ff'] // Example colors
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top', labels: { color: '#fff' } },
                title: { display: true, text: 'Players by State', color: '#fff' }
            }
        }
    });
}

function updateStats(playersData, selectedEvent) {
    if (!selectedEvent) return;

    const totalPlayers = playersData.length;
    let avgDistance = 0;
    let greaterThan1000 = 0;
    let greaterThan100 = 0;
    let maxDistance = 0;
    let minDistance = Infinity;
    let outOfStatePlayers = 0;
    let inStatePlayers = 0;

    if (totalPlayers > 0) {
        let totalDistance = 0;
        playersData.forEach(p => {
            totalDistance += p.distanceKm;
            if (p.distanceKm > 1609.34) greaterThan1000++;
            if (p.distanceKm > 160.934) greaterThan100++;
            if (p.distanceKm > maxDistance) maxDistance = p.distanceKm;
            if (p.distanceKm < minDistance) minDistance = p.distanceKm;

            if (p.state !== selectedEvent.EVENT_STATE_ID) {
                outOfStatePlayers++;
            } else {
                inStatePlayers++;
            }
        });
        avgDistance = totalDistance / totalPlayers;
    }

    document.getElementById("total-players").textContent = totalPlayers.toLocaleString();
    document.getElementById("average-distance").textContent = isNaN(avgDistance) ? '--' : `${Math.round(avgDistance * 0.621371)} mi`;
    document.getElementById("greater-than").textContent = greaterThan1000.toLocaleString();
    document.getElementById("less-than").textContent = greaterThan100.toLocaleString();
    document.getElementById("out-of-state").textContent = outOfStatePlayers.toLocaleString();
    document.getElementById("in-state").textContent = inStatePlayers.toLocaleString();
    document.getElementById("max").textContent = (isFinite(maxDistance) && maxDistance > 0) ? `${Math.round(maxDistance * 0.621371).toLocaleString()} mi` : '--';
    document.getElementById("min").textContent = (isFinite(minDistance) && minDistance > 0) ? `${Math.round(minDistance * 0.621371).toLocaleString()} mi` : '--';

}

function updateTopPlayers(players) {
    const topList = document.getElementById("topPlayersList");
    if (!topList) return;

    topList.innerHTML = "";

    const medals = ["ðŸ¥‡", "ðŸ¥ˆ", "ðŸ¥‰"];

    players.slice(0, 3).forEach((p, i) => {
        const li = document.createElement("li");
        li.textContent = `${medals[i] || ""} ${p.name} (Place: ${p.EVENT_PLACE})`;
        topList.appendChild(li);
    });
}



// /* --------------- ORIGINAL CODE --------------- */
// // Global data variables
// let allEvents = [];
// let allEventResults = [];
// let allMembers = [];

// function renderCharts(topPlayers, playersByState) {
//     // Destroy existing chart instances before creating new ones
//     if (chartDistanceInstance) {
//         chartDistanceInstance.destroy();
//     }
//     if (chartStatesInstance) {
//         chartStatesInstance.destroy();
//     }

//     const chartDistanceCtx = document.getElementById("chartDistance")?.getContext("2d");
//     const chartStatesCtx = document.getElementById("chartStates")?.getContext("2d");

//     if (!chartDistanceCtx || !chartStatesCtx) return;

//     chartDistanceInstance = new Chart(chartDistanceCtx, {
//         type: 'bar',
//         data: {
//             labels: topPlayers.slice(0, 25).map(p => p.name), // Limit to top 25 for chart
//             datasets: [{
//                 label: "Distance (mi)",
//                 data: topPlayers.slice(0, 25).map(p => Math.round(p.distanceKm * 0.621371)), // km to miles
//                 backgroundColor: '#4e88ff'
//             }]
//         },
//         options: {
//             indexAxis: 'y',
//             responsive: true,
//             plugins: {
//                 legend: { labels: { color: '#fff' } },
//                 tooltip: { callbacks: { label: (context) => `${context.dataset.label}: ${context.raw.toLocaleString()} mi` } }
//             },
//             scales: {
//                 x: {
//                     ticks: { color: '#fff' },
//                     title: { text: "Distance (mi)", display: true, color: '#fff' },
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' }
//                 },
//                 y: {
//                     ticks: { color: '#fff' },
//                     grid: { color: 'rgba(255, 255, 255, 0.1)' }
//                 }
//             }
//         }
//     });

//     chartStatesInstance = new Chart(chartStatesCtx, {
//         type: 'pie', // Changed to pie chart
//         data: {
//             labels: Object.keys(playersByState),
//             datasets: [{
//                 label: "Players",
//                 data: Object.values(playersByState),
//                 // Using an array of colors for pie chart segments
//                 backgroundColor: [
//                     '#4e88ff', '#ffa64e', '#8c564b', '#e377c2', '#7f7f7f',
//                     '#bcbd22', '#17becf', '#aec7e8', '#ffbb78', '#98df8a'
//                 ],
//                 hoverOffset: 4 // Adds a slight hover effect
//             }]
//         },
//         options: {
//             responsive: true,
//             plugins: {
//                 legend: {
//                     position: 'right', // Position legend to the right for better readability
//                     labels: { color: '#fff' }
//                 },
//                 tooltip: {
//                     callbacks: {
//                         label: (context) => {
//                             const label = context.label || '';
//                             const value = context.raw;
//                             const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
//                             const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
//                             return `${label}: ${value} (${percentage}%)`;
//                         }
//                     }
//                 }
//             }
//         }
//     });
// }

// // Haversine formula to calculate distance between two lat/lon points in km
// function haversineDistance(lat1, lon1, lat2, lon2) {
//     const R = 6371; // Radius of Earth in kilometers
//     const dLat = (lat2 - lat1) * Math.PI / 180;
//     const dLon = (lon2 - lon1) * Math.PI / 180;
//     const a =
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     return R * c; // Distance in kilometers
// }

// // Orchestrates all filtering and rendering
// function filterAndRender() {
//     const searchTerm = searchInput.value.toLowerCase();
//     const selectedTier = tierFilter.value;
//     const selectedCountry = countryFilter.value;
//     const selectedState = stateFilter.value;

//     const filteredEvents = allEvents.filter(event =>
//         event.EVENT_NAME.toLowerCase().includes(searchTerm) &&
//         (!selectedTier || event.EVENT_TIER_ID === selectedTier) &&
//         (!selectedCountry || event.COUNTRY_ID === selectedCountry) &&
//         (!selectedState || event.EVENT_STATE_ID === selectedState)
//     );

//     updateMap(filteredEvents);

//     // Update the datalist suggestions based on current search/filters
//     eventDatalist.innerHTML = '';
//     filteredEvents.forEach(event => {
//         const option = document.createElement('option');
//         option.value = event.EVENT_NAME;
//         eventDatalist.appendChild(option);
//     });

//     // Determine currently displayed event for stats and charts
//     let currentEventPlayers = [];
//     let playersByState = {};
//     let selectedEvent = null;

//     if (filteredEvents.length === 1 && searchInput.value === filteredEvents[0].EVENT_NAME) {
//         selectedEvent = filteredEvents[0];
//         selectedEventNameElement.textContent = selectedEvent.EVENT_NAME;

//         // Get results for the selected event
//         const resultsForSelectedEvent = allEventResults.filter(result => result.EVENT_ID === selectedEvent.EVENT_ID);

//         // Join results with member data and calculate distance
//         currentEventPlayers = resultsForSelectedEvent.map(result => {
//             const member = allMembers.find(m => m.PDGA_NUMBER === result.PDGA_NUMBER);
//             if (member) {
//                 const distanceKm = haversineDistance(
//                     member.MEMBER_LAT, member.MEMBER_LON,
//                     selectedEvent.EVENT_LATITUDE, selectedEvent.EVENT_LONGITUDE
//                 );
//                 // Accumulate players by state for this event
//                 playersByState[member.MEMBER_STATE_PROV] = (playersByState[member.MEMBER_STATE_PROV] || 0) + 1;

//                 return {
//                     name: member.MEMBER_FULL_NAME,
//                     EVENT_PLACE: result.EVENT_PLACE,
//                     distanceKm: distanceKm,
//                     state: member.MEMBER_STATE_PROV,
//                     country: member.COUNTRY_ID
//                 };
//             }
//             return null;
//         }).filter(Boolean); // Remove any nulls if member not found

//     } else {
//         selectedEventNameElement.textContent = 'All Events';

//         const allCombinedPlayers = [];
//         const tempPlayersByState = {};

//         allEventResults.forEach(result => {
//             const member = allMembers.find(m => m.PDGA_NUMBER === result.PDGA_NUMBER);
//             const event = allEvents.find(e => e.EVENT_ID === result.EVENT_ID);

//             if (member && event) {
//                 const distanceKm = haversineDistance(
//                     member.MEMBER_LAT, member.MEMBER_LON,
//                     event.EVENT_LATITUDE, event.EVENT_LONGITUDE
//                 );

//                 allCombinedPlayers.push({
//                     name: member.MEMBER_FULL_NAME,
//                     EVENT_PLACE: result.EVENT_PLACE,
//                     distanceKm: distanceKm,
//                     state: member.MEMBER_STATE_PROV,
//                     country: member.COUNTRY_ID
//                 });
//                 tempPlayersByState[member.MEMBER_STATE_PROV] = (tempPlayersByState[member.MEMBER_STATE_PROV] || 0) + 1;
//             }
//         });
//         currentEventPlayers = allCombinedPlayers;
//         playersByState = tempPlayersByState;
//     }

//     // Sort players by event place to get top players
//     const topPlayers = currentEventPlayers.sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE);

//     updateStats(currentEventPlayers, playersByState, selectedEvent);
//     updateTopPlayers(topPlayers);
//     renderCharts(topPlayers, playersByState);
// }