// Haversine Distance Formula
function haversineDistance(lat1, lon1, lat2, lon2) {
    const toRad = deg => deg * Math.PI / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Global State
let members = [], events = [], results = [];
let activeIndex = -1;
let currentFiltered = [];

// Load data
async function loadData() {
    const [m, e, r] = await Promise.all([
        fetch('data/member.json').then(res => res.json()),
        fetch('data/event.json').then(res => res.json()),
        fetch('data/event_result.json').then(res => res.json())
    ]);
    members = m;
    events = e;
    populateFilterDropdowns(events);
    results = r;
    populateSearchDropdown();
    selectFirstEventOnce();
}

function getPlayersForEvent(eventName) {
    const selectedEvent = events.find(e => e.EVENT_NAME === eventName);
    if (!selectedEvent) return [];

    const { EVENT_ID, EVENT_LATITUDE, EVENT_LONGITUDE } = selectedEvent;

    return results
        .filter(r => r.EVENT_ID === EVENT_ID)
        .map(r => {
            const member = members.find(m => m.PDGA_NUMBER === r.PDGA_NUMBER);
            if (!member) return null;
            const distanceKm = haversineDistance(
                member.MEMBER_LAT, member.MEMBER_LON,
                EVENT_LATITUDE, EVENT_LONGITUDE
            );
            return {
                name: member.MEMBER_FULL_NAME,
                state: member.MEMBER_STATE_PROV,
                distanceKm,
                EVENT_PLACE: r.EVENT_PLACE
            };
        })
        .filter(p => p);
}

function groupByState(players) {
    const counts = {};
    players.forEach(p => {
        counts[p.state] = (counts[p.state] || 0) + 1;
    });
    return counts;
}

// DOM elements
const searchInput = document.getElementById("eventSearch");
const dropdown = document.getElementById("eventDropdown");
const tierFilter = document.getElementById("tierFilter");
const countryFilter = document.getElementById("countryFilter");
const stateFilter = document.getElementById("stateFilter");
const selectedEventEl = document.getElementById("selectedEventName");
const totalPlayersEl = document.getElementById("totalPlayers");
const avgDistanceEl = document.getElementById("avgDistance");
const over1000El = document.getElementById("over1000");
const under100El = document.getElementById("under100");

const map = L.map('mapid').setView([39.5, -98.35], 4);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
}).addTo(map);

function updateMap(lat, lon) {
    map.eachLayer(layer => {
        if (layer instanceof L.Marker) map.removeLayer(layer);
    });
    L.marker([lat, lon]).addTo(map);
}

function updateTopPlayers(players) {
    const topList = document.getElementById("topPlayersList");
    topList.innerHTML = "";
    players
        .sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE)
        .slice(0, 3)
        .forEach((p, i) => {
            const li = document.createElement("li");
            const medals = ["🥇", "🥈", "🥉"];
            li.textContent = `${medals[i] || ""} ${p.name} – ${Math.round(p.distanceKm)} km`;
            topList.appendChild(li);
        });
}

function renderCharts(topPlayers, playersByState) {
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
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: {
                x: { ticks: { color: '#fff' }, title: { text: "Distance", display: true, color: '#fff' } },
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
            plugins: { legend: { labels: { color: '#fff' } } },
            scales: {
                x: { ticks: { color: '#fff' } },
                y: { ticks: { color: '#fff' }, beginAtZero: true }
            }
        }
    });
}

function updateStats(players) {
    const total = players.length;
    const avg = players.reduce((sum, p) => sum + p.distanceKm, 0) / total || 0;
    const over1000 = players.filter(p => p.distanceKm > 1000).length;
    const under100 = players.filter(p => p.distanceKm < 100).length;

    totalPlayersEl.textContent = total;
    avgDistanceEl.textContent = `${avg.toFixed(1)} km`;
    over1000El.textContent = over1000;
    under100El.textContent = under100;
}

function highlightMatch(text, term) {
    if (!term) return text;
    const regex = new RegExp(`(${term})`, "ig");
    return text.replace(regex, '<mark>$1</mark>');
}

function populateSearchDropdown() {
    dropdown.innerHTML = '';
    const tier = tierFilter.value;
    const country = countryFilter.value;
    const state = stateFilter.value;
    const search = searchInput.value.toLowerCase();

    const filtered = events.filter(event => {
        return (!tier || event.EVENT_TIER_ID === tier) &&
            (!country || event.COUNTRY_ID === country) &&
            (!state || event.EVENT_STATE_ID === state) &&
            event.EVENT_NAME.toLowerCase().includes(search);
    });

    currentFiltered = filtered;
    activeIndex = -1;

    if (filtered.length === 0) {
        dropdown.innerHTML = '<div>No matching events</div>';
    } else {
        filtered.forEach((event, index) => {
            const div = document.createElement('div');
            div.innerHTML = highlightMatch(event.EVENT_NAME, search);
            div.classList.add('dropdown-item');
            div.setAttribute('data-index', index);
            div.onclick = () => {
                selectEvent(event);
                dropdown.classList.add("hidden");
            };
            dropdown.appendChild(div);
        });
        dropdown.classList.remove("hidden");
    }
}

function selectEvent(event) {
    searchInput.value = event.EVENT_NAME;
    selectedEventEl.textContent = event.EVENT_NAME;
    const players = getPlayersForEvent(event.EVENT_NAME);
    updateStats(players);
    updateMap(event.EVENT_LATITUDE, event.EVENT_LONGITUDE);
    updateTopPlayers(players);
    renderCharts(players, groupByState(players));
}

function populateFilterDropdowns(events) {
    const tiers = getUniqueValues(events, 'EVENT_TIER_ID');
    const countries = getUniqueValues(events, 'COUNTRY_ID');
    const states = getUniqueValues(events, 'EVENT_STATE_ID');

    populateSelect(tierFilter, tiers, "All Tiers");
    populateSelect(countryFilter, countries, "All Countries");
    populateSelect(stateFilter, states, "All States");
}

function populateSelect(selectEl, values, defaultText) {
    selectEl.innerHTML = `<option value="">${defaultText}</option>`;
    values.forEach(val => {
        const opt = document.createElement('option');
        opt.value = val;
        opt.textContent = val;
        selectEl.appendChild(opt);
    });
}

function getUniqueValues(arr, key) {
    return [...new Set(arr.map(item => item[key]).filter(Boolean))].sort();
}

function selectFirstEventOnce() {
    const firstEvent = events[0];
    if (!firstEvent) return;
    selectEvent(firstEvent);
}

searchInput.addEventListener("input", populateSearchDropdown);
searchInput.addEventListener("focus", populateSearchDropdown);
searchInput.addEventListener("keydown", (e) => {
    const items = dropdown.querySelectorAll('.dropdown-item');
    if (e.key === "ArrowDown") {
        activeIndex = (activeIndex + 1) % items.length;
        e.preventDefault();
    } else if (e.key === "ArrowUp") {
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        e.preventDefault();
    } else if (e.key === "Enter") {
        if (currentFiltered[activeIndex]) {
            selectEvent(currentFiltered[activeIndex]);
            dropdown.classList.add("hidden");
        }
        e.preventDefault();
    } else if (e.key === "Escape") {
        dropdown.classList.add("hidden");
    }
    items.forEach((item, i) => {
        item.classList.toggle("active", i === activeIndex);
    });
});

[tierFilter, countryFilter, stateFilter].forEach(filter => {
    filter.addEventListener('change', populateSearchDropdown);
});

document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrapper')) dropdown.classList.add("hidden");
});

document.getElementById("reset-filters").addEventListener("click", () => {
    tierFilter.value = "";
    countryFilter.value = "";
    stateFilter.value = "";
    searchInput.value = "";
    populateSearchDropdown();
});

function toggleCollapse(id) {
    document.getElementById(id).classList.toggle("collapsed");
}

loadData();
