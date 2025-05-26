import { currentMembers } from "./event-page-map.js";

const uniqueDivisions = ["OPEN", "AM1", "AM2", "AM3"];
const openReference = document.getElementById("OPEN-top-players");
const am1Reference = document.getElementById("AM1-top-players");
const am2Reference = document.getElementById("AM2-top-players");
const am3Reference = document.getElementById("AM3-top-players");


export function updateTopPlayers() {
    getTopPlayersByDivision(currentMembers, "OPEN").forEach(player => {
        openReference.innerHTML += `<li>${player.PLAYER_NAME} - ${player.EVENT_PLACE}</li>`;
    });
    getTopPlayersByDivision(currentMembers, "AM1").forEach(player => {
        am1Reference.innerHTML += `<li>${player.PLAYER_NAME} - ${player.EVENT_PLACE}</li>`;
    });
    getTopPlayersByDivision(currentMembers, "AM2").forEach(player => {
        am2Reference.innerHTML += `<li>${player.PLAYER_NAME} - ${player.EVENT_PLACE}</li>`;
    });
    getTopPlayersByDivision(currentMembers, "AM3").forEach(player => {
        am3Reference.innerHTML += `<li>${player.PLAYER_NAME} - ${player.EVENT_PLACE}</li>`;
    });
}

console.log(getTopPlayersByDivision(currentMembers, "OPEN"));

function getTopPlayersByDivision(players, division) {
    return players
        .filter(player => player.DIVISION === division)
        .sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE)
        .slice(0, 3); // Get top 3 players
}