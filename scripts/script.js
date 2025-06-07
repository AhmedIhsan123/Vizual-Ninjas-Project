import { fetchData } from "./utils.js";

// Global program variables
export const eventList = await fetchData("./PHP/events.php");
export const playerList = await fetchData("./PHP/handlers/getMembers.php");