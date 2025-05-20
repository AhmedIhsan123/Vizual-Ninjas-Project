// Map Initialization
const mockEvents = [
    { name: "Spring Open", tier: "A-Tier", country: "USA", state: "CO", lat: 39.7392, lng: -104.9903 },
    { name: "West Coast Classic", tier: "A-Tier", country: "USA", state: "CA", lat: 34.0522, lng: -118.2437 },
    { name: "Maple Hill Throwdown", tier: "B-Tier", country: "USA", state: "MA", lat: 42.3601, lng: -71.0589 },
    { name: "Great Lakes Invitational", tier: "C-Tier", country: "USA", state: "MI", lat: 42.2808, lng: -83.7430 },
    { name: "Canadian Open", tier: "A-Tier", country: "Canada", state: "ON", lat: 43.6532, lng: -79.3832 }
];

// const map = L.map('mapid').setView([39.5, -98.35], 4);
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; OpenStreetMap contributors',
// }).addTo(map);

function updateMap(filteredEvents) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    filteredEvents.forEach(event => {
        L.marker([event.lat, event.lng])
            .addTo(map)
            .bindPopup(`${event.name} in ${event.state}, ${event.country}`);
    });
}

// Filter Controls
const searchInput = document.getElementById("eventSearch");
const dropdown = document.getElementById("eventDropdown");
const tierFilter = document.getElementById("tierFilter");
const countryFilter = document.getElementById("countryFilter");
const stateFilter = document.getElementById("stateFilter");

function filterEvents() {
    const searchTerm = searchInput.value.toLowerCase();
    return mockEvents.filter(event =>
        (!tierFilter.value || event.tier === tierFilter.value) &&
        (!countryFilter.value || event.country === countryFilter.value) &&
        (!stateFilter.value || event.state === stateFilter.value) &&
        event.name.toLowerCase().includes(searchTerm)
    );
}

function showDropdown() {
    const filtered = filterEvents();
    dropdown.innerHTML = '';

    if (filtered.length === 0) {
        dropdown.innerHTML = '<div>No matching events</div>';
    } else {
        filtered.forEach(event => {
            const div = document.createElement('div');
            div.textContent = event.name;
            div.onclick = () => {
                searchInput.value = event.name;
                dropdown.classList.add("hidden");
                document.getElementById("selectedEventName").textContent = event.name;
                updateMap([event]);
                // You could load players here by event ID
                renderCharts(mockTopPlayersData, mockPlayersByState);
                updateTopPlayers(mockTopPlayersData);
            };
            dropdown.appendChild(div);
        });
    }

    dropdown.classList.remove("hidden");
}

// Dropdown listeners
searchInput.addEventListener('focus', showDropdown);
searchInput.addEventListener('input', showDropdown);
[tierFilter, countryFilter, stateFilter].forEach(f => f.addEventListener('change', showDropdown));
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) dropdown.classList.add("hidden");
});

// Top Players
function updateTopPlayers(players) {
    const topList = document.getElementById("topPlayersList");
    topList.innerHTML = "";

    const medals = ["🥇", "🥈", "🥉"];

    players
        .sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE)
        .slice(0, 3)
        .forEach((p, i) => {
            const li = document.createElement("li");
            const icon = medals[i] || "";
            const dist = p.distanceKm ? `${Math.round(p.distanceKm)} km` : "–";
            li.textContent = `${icon} ${p.name} – ${dist}`;
            topList.appendChild(li);
        });
}

// Chart Rendering
function renderCharts(topPlayers, playersByState) {
    if (!document.getElementById("chartDistance") || !document.getElementById("chartStates")) return;

    new Chart(document.getElementById("chartDistance").getContext("2d"), {
        type: 'bar',
        data: {
            labels: topPlayers.map(p => p.name),
            datasets: [{
                label: "Distance (km)",
                data: topPlayers.map(p => Math.round(p.distanceKm)),
                backgroundColor: '#4e88ff'
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: {
                x: { ticks: { color: '#fff' }, title: { text: "Distance (km)", display: true, color: '#fff' } },
                y: { ticks: { color: '#fff' } }
            }
        }
    });

    new Chart(document.getElementById("chartStates").getContext("2d"), {
        type: 'bar',
        data: {
            labels: Object.keys(playersByState),
            datasets: [{
                label: "Players",
                data: Object.values(playersByState),
                backgroundColor: '#ffa64e'
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: {
                x: { ticks: { color: '#fff' }, title: { text: "State", display: true, color: '#fff' } },
                y: { ticks: { color: '#fff' }, beginAtZero: true }
            }
        }
    });
}

// Collapse utility
function toggleCollapse(id) {
    const content = document.getElementById(id);
    content.classList.toggle("collapsed");
}

// Mock Data
const mockTopPlayersData = [
    { name: "Emily Chen", EVENT_PLACE: 1, distanceKm: 902 },
    { name: "Marcus Lee", EVENT_PLACE: 2, distanceKm: 120 },
    { name: "Jade Kim", EVENT_PLACE: 3, distanceKm: 450 },
    { name: "Nina Patel", EVENT_PLACE: 4, distanceKm: 770 },
    { name: "Leo Diaz", EVENT_PLACE: 5, distanceKm: 310 }
];

const mockPlayersByState = {
    CA: 12,
    CO: 8,
    TX: 5,
    WA: 3,
    FL: 2
};

// Initial render
renderCharts(mockTopPlayersData, mockPlayersByState);
updateTopPlayers(mockTopPlayersData);
