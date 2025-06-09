import { fetchData } from "../../utils.js";

// event-stats.js
const totalPlayersRef = document.querySelector("#total-players-text");
const averageDistanceRef = document.querySelector("#average-distance-text");
const moreThanRef = document.querySelector("#over-1000-miles-text");
const lessThanRef = document.querySelector("#under-500-miles-text");
const outOfStateRef = document.querySelector("#out-of-state-text");
const inStateRef = document.querySelector("#in-state-text");
const maxDistanceRef = document.querySelector("#max-distance-text");
const minDistanceRef = document.querySelector("#min-distance-text");
const selectedEventNameRef = document.querySelector("#selected-event-name");

let members = [];

export async function fillCards(event) {
    // Get the members at the selected event
    const returnedList = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);
    members = returnedList;

    // Set the text of the stats section
    totalPlayersRef.innerHTML = `${event.TOTAL_MEMBERS} Players`;
    averageDistanceRef.innerHTML = `${event.AVG_TRAVEL_DISTANCE_MILES} mi`;
    moreThanRef.innerHTML = `${getNumPlayers(event, true)} Players`;
    lessThanRef.innerHTML = `${getNumPlayers(event, false)} Players`;
    moreThanRef.innerHTML = `${getNumPlayers(members, true)} Players`;
    lessThanRef.innerHTML = `${getNumPlayers(members, false)} Players`;
    outOfStateRef.innerHTML = `${event.MEMBERS_OUT_OF_STATE} Players`;
    inStateRef.innerHTML = `${event.MEMBERS_IN_STATE} Players`;
    maxDistanceRef.innerHTML = `${getMinMax(members, false)} mi`;
    minDistanceRef.innerHTML = `${getMinMax(members, true)} mi`;
    selectedEventNameRef.textContent = event.EVENT_NAME;
}

// Function to help get the min or max travel distance of a list of players
function getMinMax(arr, isMin) {
    // Track
    let tracker = arr[0].DISTANCE_TRAVELED_MILES;

    for (let i = 0; i < arr.length; i++) {
        if (isMin) {
            if (arr[i].DISTANCE_TRAVELED_MILES < tracker) {
                tracker = arr[i].DISTANCE_TRAVELED_MILES;
            }
        } else {
            if (arr[i].DISTANCE_TRAVELED_MILES > tracker) {
                tracker = arr[i].DISTANCE_TRAVELED_MILES;
            }
        }
    }

    // Return tracker
    return tracker;
}

// Function to get number of members in a certain mile range
function getNumPlayers(arr, isGreater) {
    // Track count
    let count = 0;

    for (let i = 0; i < arr.length; i++) {

        if (isGreater) {
            if (Number(arr[i].DISTANCE_TRAVELED_MILES) > 1000) {
                count++;
            }
        } else {
            if (Number(arr[i].DISTANCE_TRAVELED_MILES) < 500) {
                count++;
            }
        }
    }

    // Return the count
    return count;
}