import { currentMembers } from "./event-page-map.js";

// Local variables
const parentDivRef = document.getElementById("top-players");

export function updateTopPlayers() {
    // Get all the distinct divisons
    const division = [...new Set(currentMembers.map(member => member.DIVISION_ID))];

    // For each divison, create a div
    division.forEach(div => {
        // Get the members in this division
        const membersInDivision = currentMembers.filter(member => member.DIVISION_ID === div);

        // Sort the members by score
        membersInDivision.sort((a, b) => a.EVENT_PLACE - b.EVENT_PLACE);

        // Create a div for the division
        const divisionDiv = document.createElement("div");
        divisionDiv.className = "division";
        divisionDiv.innerHTML = `<h3>Division ${div}</h3>`;

        // Create a list for the top players
        const topPlayersList = document.createElement("ul");

        // Add the top 5 players to the list
        membersInDivision.slice(0, 3).forEach(member => {
            const playerItem = document.createElement("li");
            playerItem.textContent = `${member.MEMBER_FULL_NAME} - ${member.EVENT_PLACE}`;
            topPlayersList.appendChild(playerItem);
        });

        // Append the list to the division div
        divisionDiv.append(topPlayersList);

        // Append the division div to the parent div
        parentDivRef.append(divisionDiv);
    });
}
