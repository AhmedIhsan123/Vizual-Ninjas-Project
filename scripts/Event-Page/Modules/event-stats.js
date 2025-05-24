import { fetchData } from "../../utils.js";

// event-stats.js
const totalPlayersRef = document.querySelector("#total-players");
const averageDistanceRef = document.querySelector("#average-distance");
const moreThanRef = document.querySelector("#more-than");
const lessThanRef = document.querySelector("#less-than");
const outOfStateRef = document.querySelector("#out-of-state");
const inStateRef = document.querySelector("#in-state");
const maxDistanceRef = document.querySelector("max-dist");
const minDistanceRef = document.querySelector("min-dist");

let members = [];

export async function fillCards(event) {
    // Get the members at the selected event
    const returnedList = await fetchData(`./PHP/handlers/getMembers.php?event_id=${event.EVENT_ID}`);
    members = returnedList;



    // Set the text of the stats section
    totalPlayersRef.innerHTML = `${event.TOTAL_MEMBERS} Players`;
    averageDistanceRef.innerHTML = `${event.AVG_TRAVEL_DISTANCE_MILES} Miles`;
    outOfStateRef.innerHTML = `${event.MEMBERS_OUT_OF_STATE} Players`;
    inStateRef.innerHTML = `${event.MEMBERS_IN_STATE} Players`;




}
