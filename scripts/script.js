import { fetchData } from "./utils.js";

// Global program variables
export const eventList = await fetchData("./PHP/handlers/events.php");
export const playersList = await fetchData("./PHP/handlers/getMembers.php");

// Fetch all events and players
console.log("Events: " + eventList);
console.log("Players: " + playersList);
