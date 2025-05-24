// event-stats.js

const totalPlayersRef = document.querySelector("#total-players");
const averageDistanceRef = document.querySelector("#average-distance");
const greaterThanRef = document.querySelector("#greater-than");
const lessThanRef = document.querySelector("#less-than");
const outOfStateRef = document.querySelector("#out-of-state");
const inStateRef = document.querySelector("#in-state");
const maxRef = document.querySelector("#max");
const minRef = document.querySelector("#min");

export function fillCards(event) {
    totalPlayersRef.textContent = event ? event.TOTAL_MEMBERS.toLocaleString() : "N/A";
}

export function updateStats(playersData, selectedEvent) {
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
            if (p.distanceKm > 1609.34) greaterThan1000++; // Convert km to miles (>1000 miles)
            if (p.distanceKm > 160.934) greaterThan100++; // Convert km to miles (>100 miles)
            if (p.distanceKm > maxDistance) maxDistance = p.distanceKm;
            if (p.distanceKm < minDistance) minDistance = p.distanceKm;

            if (selectedEvent && p.state !== selectedEvent.EVENT_STATE_ID) {
                outOfStatePlayers++;
            } else if (selectedEvent && p.state === selectedEvent.EVENT_STATE_ID) {
                inStatePlayers++;
            }
        });
        avgDistance = totalDistance / totalPlayers;
    } else {
        minDistance = 0; // Reset min distance if no players
    }

    totalPlayersRef.textContent = totalPlayers.toLocaleString();
    averageDistanceRef.textContent = isNaN(avgDistance) ? "N/A" : `${Math.round(avgDistance * 0.621371)} mi`;
    greaterThanRef.textContent = greaterThan1000.toLocaleString();
    lessThanRef.textContent = greaterThan100.toLocaleString();
    outOfStateRef.textContent = outOfStatePlayers.toLocaleString();
    inStateRef.textContent = inStatePlayers.toLocaleString();
    maxRef.textContent = isFinite(maxDistance) && maxDistance > 0 ? `${Math.round(maxDistance * 0.621371).toLocaleString()} mi` : "N/A";
    minRef.textContent = isFinite(minDistance) && minDistance > 0 ? `${Math.round(minDistance * 0.621371).toLocaleString()} mi` : "N/A";
}



/* --------------- ORIGINAL CODE --------------- */
// export function updateStats(playersData, selectedEvent) {
//     const totalPlayers = playersData.length;
//     let avgDistance = 0;
//     let greaterThan1000 = 0;
//     let greaterThan100 = 0;
//     let maxDistance = 0;
//     let minDistance = Infinity;
//     let outOfStatePlayers = 0;
//     let inStatePlayers = 0;

//     if (totalPlayers > 0) {
//         let totalDistance = 0;
//         playersData.forEach(p => {
//             totalDistance += p.distanceKm;
//             if (p.distanceKm > 1609.34) greaterThan1000++; // Convert km to miles (>1000 miles is ~1609.34 km)
//             if (p.distanceKm > 160.934) greaterThan100++; // Convert km to miles (>100 miles is ~160.934 km)
//             if (p.distanceKm > maxDistance) maxDistance = p.distanceKm;
//             if (p.distanceKm < minDistance) minDistance = p.distanceKm;

//             if (selectedEvent && p.state !== selectedEvent.EVENT_STATE_ID) {
//                 outOfStatePlayers++;
//             } else if (selectedEvent && p.state === selectedEvent.EVENT_STATE_ID) {
//                 inStatePlayers++;
//             }
//         });
//         avgDistance = totalDistance / totalPlayers;

//         if (!selectedEvent) {

//             inStatePlayers = totalPlayers;
//             outOfStatePlayers = 0;
//         }

//     } else {
//         minDistance = 0; // Reset min distance if no players
//     }

//     document.getElementById("total-players").textContent = totalPlayers.toLocaleString();
//     document.getElementById("average-distance").textContent = isNaN(avgDistance) ? '--' : `${Math.round(avgDistance * 0.621371)} mi`; // km to miles
//     document.getElementById("greater-than").textContent = greaterThan1000.toLocaleString();
//     document.getElementById("less-than").textContent = greaterThan100.toLocaleString();
//     document.getElementById("out-of-state").textContent = outOfStatePlayers.toLocaleString();
//     document.getElementById("in-state").textContent = inStatePlayers.toLocaleString();
//     document.getElementById("max").textContent = (isFinite(maxDistance) && maxDistance > 0) ? `${Math.round(maxDistance * 0.621371).toLocaleString()} mi` : '--';
//     document.getElementById("min").textContent = (isFinite(minDistance) && minDistance > 0) ? `${Math.round(minDistance * 0.621371).toLocaleString()} mi` : '--';
// }

// export function updateTopPlayers(players) {
//     const topList = document.getElementById("topPlayersList");
//     topList.innerHTML = "";

//     const medals = ["ðŸ¥‡", "ðŸ¥ˆ", "ðŸ¥‰"];

//     // Changed to slice(0, 3) to show only top 3
//     players
//         .slice(0, 3)
//         .forEach((p, i) => {
//             const li = document.createElement("li");
//             const icon = medals[i] || `${i + 1} â€“`;
//             li.textContent = `${icon} ${p.name}`;
//             topList.appendChild(li);
//         });
// }
