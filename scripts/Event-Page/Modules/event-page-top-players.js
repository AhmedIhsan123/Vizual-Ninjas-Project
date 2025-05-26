import { currentMembers } from "./event-page-map.js";

// Local variables
const parentDivRef = document.getElementById("#top-players");

export function updateTopPlayers() {
    // Get all the distinct divisons
    const division = [...new Set(currentMembers.map(member => member.DIVISION_ID))];
    console.log("Divisions: ", division);
}
