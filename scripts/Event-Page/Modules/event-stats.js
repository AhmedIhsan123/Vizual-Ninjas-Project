// event-stats.js
const totalPlayersRef = document.querySelector("#total-players");
const averageDistanceRef = document.querySelector("#average-distance");
const outOfStateRef = document.querySelector("#out-of-state");
const inStateRef = document.querySelector("#in-state");

export function fillCards(event) {
    totalPlayersRef.innerHTML = `${event.TOTAL_MEMBERS} Players`;
    averageDistanceRef.innerHTML = `${event.AVG_TRAVEL_DISTANCE_MILES} Miles`;
    outOfStateRef.innerHTML = `${event.MEMBERS_OUT_OF_STATE} Players`;
    inStateRef.innerHTML = `${event.MEMBERS_IN_STATE} Players`;
    maxRef.innerHTML = `${getMax(event)} Miles`;
    minRef.innerHTML = `${Math.min(...event.MEMBERS.map(m => m.AVG_TRAVEL_DISTANCE_MILES))} Miles`;
}
