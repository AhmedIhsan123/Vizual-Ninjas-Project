import { eventList } from "../home-script.js";

export function populateCards() {
    const sortdEvents = eventList.sort((a, b) => b.TOTAL_MEMBERS - a.TOTAL_MEMBERS).slice(0, 10);

    console.log(sortdEvents);

}