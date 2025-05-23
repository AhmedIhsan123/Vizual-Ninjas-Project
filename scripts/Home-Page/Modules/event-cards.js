import { eventList } from "../home-script.js";

export function populateCards() {
    // Get the top 10 most popular events and store them in a list
    const sortdEvents = eventList.sort((a, b) => b.TOTAL_MEMBERS - a.TOTAL_MEMBERS).slice(0, 10);


    // For each event, create a card
    sortdEvents.forEach(event => {
        createCard(event.EVENT_NAME, event.EVENT_TIER_ID, event.TOTAL_MEMBERS, event.AVG_TRAVEL_DISTANCE_MILES);
    });
}

// Helper function to create a card
function createCard(eventTitle, eventTierID, eventTotal, eventTravelDistance) {
    const parentRef = document.getElementById("event-cards-container");
    const cardRef = document.createElement("div");
    const cardTitleRef = document.createElement("p");
    const cardTierRef = document.createElement("p");
    const cardTotalRef = document.createElement("p");
    const cardDistanceRef = document.createElement("p");

    cardTitleRef.textContent = eventTitle;
    cardTierRef.textContent = `Tier ${eventTierID}`;
    cardTotalRef.textContent = `Players Attending: ${eventTotal}`;
    cardDistanceRef.textContent = `Average Travel Distance: ${eventTravelDistance}`;

    cardRef.appendChild(cardTitleRef, cardTierRef, cardTotalRef, cardDistanceRef);
    parentRef.appendChild(cardRef);

}