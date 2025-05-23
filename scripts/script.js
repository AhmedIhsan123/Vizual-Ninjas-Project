// Global data variables
let allEvents = [];
let allEventResults = [];
let allMembers = [];

// Map Initialization
const map = L.map('mapid').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

function updateMap(eventsToDisplay) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    eventsToDisplay.forEach(event => {
        L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE])
            .addTo(map)
            .bindPopup(`${event.EVENT_NAME} in ${event.EVENT_CITY}, ${event.EVENT_STATE_ID}, ${event.COUNTRY_ID}`);
    });

    // If only one event is filtered, zoom to it
    if (eventsToDisplay.length === 1) {
        map.flyTo([eventsToDisplay[0].EVENT_LATITUDE, eventsToDisplay[0].EVENT_LONGITUDE], 8);
    } else if (eventsToDisplay.length > 1) {
        // If multiple events, fit bounds around them
        const group = new L.featureGroup(eventsToDisplay.map(event =>
            L.marker([event.EVENT_LATITUDE, event.EVENT_LONGITUDE])
        ));
        map.flyToBounds(group.getBounds(), { padding: L.point(50, 50) });
    } else {
        // If no events, reset view to initial
        map.setView([39.5, -98.35], 4);
    }
}

// Haversine formula to calculate distance between two lat/lon points in km
function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Filter Controls
const searchInput = document.getElementById("event");
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

// Orchestrates all filtering and rendering
function filterAndRender() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedTier = tierFilter.value;
    const selectedCountry = countryFilter.value;
    const selectedState = stateFilter.value;

    const filteredEvents = allEvents.filter(event =>
        event.EVENT_NAME.toLowerCase().includes(searchTerm) &&
        (!selectedTier || event.EVENT_TIER_ID === selectedTier) &&
        (!selectedCountry || event.COUNTRY_ID === selectedCountry) &&
        (!selectedState || event.EVENT_STATE_ID === selectedState)
    );

    updateMap(filteredEvents);

    // Update the datalist suggestions based on current search/filters
    eventDatalist.innerHTML = '';
    filteredEvents.forEach(event => {
        const option = document.createElement('option');
        option.value = event.EVENT_NAME;
        eventDatalist.appendChild(option);
    });

    // Determine currently displayed event for stats and charts
    let currentEventPlayers = [];
    let playersByState = {};
    let selectedEvent = null;

    if (filteredEvents.length === 1 && searchInput.value === filteredEvents[0].EVENT_NAME) {
        selectedEvent = filteredEvents[0];
        selectedEventNameElement.textContent = selectedEvent.EVENT_NAME;

        // Get results for the selected event
        const resultsForSelectedEvent = allEventResults.filter(result => result.EVENT_ID === selectedEvent.EVENT_ID);

        // Join results with member data and calculate distance
        currentEventPlayers = resultsForSelectedEvent.map(result => {
            const member = allMembers.find(m => m.PDGA_NUMBER === result.PDGA_NUMBER);
            if (member) {
                const distanceKm = haversineDistance(
                    member.MEMBER_LAT, member.MEMBER_LON,
                    selectedEvent.EVENT_LATITUDE, selectedEvent.EVENT_LONGITUDE
                );
                // Accumulate players by state for this event
                playersByState[member.MEMBER_STATE_PROV] = (playersByState[member.MEMBER_STATE_PROV] || 0) + 1;

                return {
                    name: member.MEMBER_FULL_NAME,
                    EVENT_PLACE: result.EVENT_PLACE,
                    distanceKm: distanceKm,
                    state: member.MEMBER_STATE_PROV,
                    country: member.COUNTRY_ID
                };
            }
            return null;
        }).filter(Boolean); // Remove any nulls if member not found

    } else {
        selectedEventNameElement.textContent = 'All Events';
        // When "All Events" are shown, we need to aggregate data
        // For simplicity, we'll aggregate top players and states from ALL event results.
        // In a real app, this might be a complex aggregation or pre-calculated summary.

        const allCombinedPlayers = [];
        const tempPlayersByState = {};

        allEventResults.forEach(result => {
            const member = allMembers.find(m => m.PDGA_NUMBER === result.PDGA_NUMBER);
            const event = allEvents.find(e => e.EVENT_ID === result.EVENT_ID);

            if (member && event) {
                 // For overall stats, we'll use a simplified distance, e.g., to a central point,
                 // or just omit it if the context is for individual events.
                 // For now, let's calculate distance to *their* event for combined view.
                const distanceKm = haversineDistance(
                    member.MEMBER_LAT, member.MEMBER_LON,
                    event.EVENT_LATITUDE, event.EVENT_LONGITUDE
                );

                allCombinedPlayers.push({
                    name: member.MEMBER_FULL_NAME,
                    EVENT_PLACE: result.EVENT_PLACE,
                    distanceKm: distanceKm,
                    state: member.MEMBER_STATE_PROV,
                    country: member.COUNTRY_ID
                });
                tempPlayersByState[member.MEMBER_STATE_PROV] = (tempPlayersByState[member.MEMBER_STATE_PROV] || 0) + 1;
            }
        });
        currentEventPlayers = allCombinedPlayers;
        playersByState = tempPlayersByState;
    }

    // Sort players by event place to get top players
    const topPlayers = currentEventPlayers.sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE);

    updateStats(currentEventPlayers, playersByState, selectedEvent);
    updateTopPlayers(topPlayers);
    renderCharts(topPlayers, playersByState);
}

function updateStats(playersData, statesData, selectedEvent) {
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
            if (p.distanceKm > 1609.34) greaterThan1000++; // Convert km to miles (>1000 miles is ~1609.34 km)
            if (p.distanceKm > 160.934) greaterThan100++; // Convert km to miles (>100 miles is ~160.934 km)
            if (p.distanceKm > maxDistance) maxDistance = p.distanceKm;
            if (p.distanceKm < minDistance) minDistance = p.distanceKm;

            if (selectedEvent && p.state !== selectedEvent.EVENT_STATE_ID) {
                outOfStatePlayers++;
            } else if (selectedEvent && p.state === selectedEvent.EVENT_STATE_ID) {
                inStatePlayers++;
            }
        });
        avgDistance = totalDistance / totalPlayers;

        // If no specific event is selected, calculate out/in state based on the players' home states
        // relative to *where they played their event* (this can get complex for "All Events")
        // For simplicity for "All Events" view, we might leave these as "--" or define a specific logic.
        if (!selectedEvent) {
             // For "All Events", in-state/out-of-state is ambiguous without a reference event.
             // We'll set them to total if no event is selected.
            inStatePlayers = totalPlayers;
            outOfStatePlayers = 0;
        }

    } else {
        minDistance = 0; // Reset min distance if no players
    }


    document.getElementById("total-players").textContent = totalPlayers.toLocaleString();
    document.getElementById("average-distance").textContent = isNaN(avgDistance) ? '--' : `${Math.round(avgDistance * 0.621371)} mi`; // km to miles
    document.getElementById("greater-than").textContent = greaterThan1000.toLocaleString();
    document.getElementById("less-than").textContent = greaterThan100.toLocaleString();
    document.getElementById("out-of-state").textContent = outOfStatePlayers.toLocaleString();
    document.getElementById("in-state").textContent = inStatePlayers.toLocaleString();
    document.getElementById("max").textContent = (isFinite(maxDistance) && maxDistance > 0) ? `${Math.round(maxDistance * 0.621371).toLocaleString()} mi` : '--';
    document.getElementById("min").textContent = (isFinite(minDistance) && minDistance > 0) ? `${Math.round(minDistance * 0.621371).toLocaleString()} mi` : '--';
}


function updateTopPlayers(players) {
    const topList = document.getElementById("topPlayersList");
    topList.innerHTML = "";

    const medals = ["🥇", "🥈", "🥉"];

    // Changed to slice(0, 3) to show only top 3
    players
        .slice(0, 3)
        .forEach((p, i) => {
            const li = document.createElement("li");
            const icon = medals[i] || `${i + 1} –`;
            li.textContent = `${icon} ${p.name}`;
            topList.appendChild(li);
        });
}


function renderCharts(topPlayers, playersByState) {
    // Destroy existing chart instances before creating new ones
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
            labels: topPlayers.slice(0, 25).map(p => p.name), // Limit to top 25 for chart
            datasets: [{
                label: "Distance (mi)",
                data: topPlayers.slice(0, 25).map(p => Math.round(p.distanceKm * 0.621371)), // km to miles
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
        type: 'pie', // Changed to pie chart
        data: {
            labels: Object.keys(playersByState),
            datasets: [{
                label: "Players",
                data: Object.values(playersByState),
                // Using an array of colors for pie chart segments
                backgroundColor: [
                    '#4e88ff', '#ffa64e', '#8c564b', '#e377c2', '#7f7f7f',
                    '#bcbd22', '#17becf', '#aec7e8', '#ffbb78', '#98df8a'
                ],
                hoverOffset: 4 // Adds a slight hover effect
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'right', // Position legend to the right for better readability
                    labels: { color: '#fff' }
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

function resetFilters() {
    searchInput.value = '';
    tierFilter.value = '';
    countryFilter.value = '';
    stateFilter.value = '';
    filterAndRender(); // Re-render all data
}

// Initial Data Fetch and Render on Page Load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const [eventsResponse, resultsResponse, membersResponse] = await Promise.all([
            fetch('data/events.json'),
            fetch('data/event_results.json'),
            fetch('data/members.json')
        ]);

        allEvents = await eventsResponse.json();
        allEventResults = await resultsResponse.json();
        allMembers = await membersResponse.json();

        populateFilterDropdowns();
        filterAndRender(); // Initial render with all data
    } catch (error) {
        console.error("Error loading data:", error);
        // Display an error message to the user
        alert("Failed to load event data. Please try again later.");
    }
});

// Event Listeners
searchInput.addEventListener('input', filterAndRender);

// Listen for selection from datalist or direct input
searchInput.addEventListener('change', (e) => {
    const selectedEvent = allEvents.find(event => event.EVENT_NAME === e.target.value);
    if (selectedEvent) {
        // If a specific event is selected, filter everything down to that event
        // This simulates selecting a single event from the dropdown
        tierFilter.value = selectedEvent.EVENT_TIER_ID;
        countryFilter.value = selectedEvent.COUNTRY_ID;
        stateFilter.value = selectedEvent.EVENT_STATE_ID;
        filterAndRender(); // Re-render with selected event's filters
    } else {
        // If input doesn't match an event name (e.g., cleared, or typing a general search)
        filterAndRender();
    }
});


[tierFilter, countryFilter, stateFilter].forEach(filter => {
    filter.addEventListener('change', filterAndRender);
});
resetButton.addEventListener('click', resetFilters);