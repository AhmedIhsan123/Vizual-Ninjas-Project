import { eventList } from "../home-script.js";

export function populateCards() {
    const sortdEvents = eventList.sort((a, b) => a.TOTAL_MEMBERS - b.TOTAL_MEMBERS);

    console.log(sortdEvents);

}