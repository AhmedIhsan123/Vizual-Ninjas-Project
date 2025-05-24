// event-stats.js

const totalPlayersRef = document.querySelector("#total-players");
const averageDistanceRef = document.querySelector("#average-distance");
const greaterThanRef = document.querySelector("#greater-than");
const lessThanRef = document.querySelector("#less-than");
const outOfStateRef = document.querySelector("#out-of-state");
const inStateRef = document.querySelector("#in-state");
const maxRef = document.querySelector("#max-dist");
const minRef = document.querySelector("#min-dist");

export function fillCards(event) {
    totalPlayersRef.innerHTML = `${event.TOTAL_MEMBERS} Players`;
    averageDistanceRef.innerHTML = `${event.AVG_TRAVEL_DISTANCE_MILES} Miles`;
    outOfStateRef.innerHTML = `${event.MEMBERS_OUT_OF_STATE} Out of State`;
    inStateRef.innerHTML = `${event.MEMBERS_IN_STATE} In State`;
    maxRef.innerHTML = `${getMax(event)} Miles`;
    minRef.innerHTML = `${Math.min(...event.MEMBERS.map(m => m.AVG_TRAVEL_DISTANCE_MILES))} Miles`;
}

function getMax(event) {
    let max = 0;
    event.forEach(element => {
        if (element.AVG_TRAVEL_DISTANCE_MILES > max) {
            max = element.AVG_TRAVEL_DISTANCE_MILES;
        }
    });

    return max;
}