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
    totalPlayersRef.innerHTML = `${event.TOTAL_MEMBERS} Players`;
    averageDistanceRef.innerHTML = `${event.AVG_TRAVEL_DISTANCE_MILES} Miles`;
    outOfStateRef.innerHTML = `${event.MEMBERS_OUT_OF_STATE} Out of State`;
    inStateRef.innerHTML = `${event.MEMBERS_IN_STATE} In State`;
    maxRef.innerHTML = `${Math.max(...event(obj => obj.AVG_TRAVEL_DISTANCE_MILES))} Miles`;
    minRef.innerHTML = `${Math.min(...event(obj => obj.AVG_TRAVEL_DISTANCE_MILES))} Miles`;
}
