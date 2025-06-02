import { eventList } from "../../script.js";

export let name = "";

// Function to populate the cards on the page
export function populateCards() {
    // Get the top 10 most popular events and store them in a list
    const sortdEvents = eventList.sort((a, b) => b.TOTAL_MEMBERS - a.TOTAL_MEMBERS).slice(0, 6);

    // For each event, create a card
    sortdEvents.forEach(event => {
        createCard(event.EVENT_NAME, event.EVENT_TIER_ID, event.TOTAL_MEMBERS, event.AVG_TRAVEL_DISTANCE_MILES, event.EVENT_ID, event);
    });
}

// Helper function to create a card
function createCard(eventTitle, eventTierID, eventTotal, eventTravelDistance, eventID, event) {
    // Get reference to card elements
    const parentRef = document.querySelector(".sidebar-content");
    const cardRef = document.createElement("div");
    const cardTitleRef = document.createElement("p");
    const cardTierRef = document.createElement("p");
    const cardTotalRef = document.createElement("p");
    const cardDistanceRef = document.createElement("p");
    const btnRef = document.createElement("a");

    // Set the inner html of each card element
    cardTitleRef.innerHTML = `<strong>${eventTitle}</strong>`;
    cardTierRef.innerHTML = `Tier: <strong>${eventTierID}</strong>`;
    cardTotalRef.innerHTML = `Players Attending: <strong>${eventTotal}</strong>`;
    cardDistanceRef.innerHTML = `Average Travel Distance: <strong>${eventTravelDistance}</strong>`;
    btnRef.textContent = "View Details";

    // Add class, or listners, or anything needed to the references
    btnRef.classList.add("button");
    btnRef.value = eventID;
    btnRef.href = `event-page.html?id=${eventID}`;
    cardRef.classList.add("event-card");
    cardRef.append(cardTitleRef, cardTierRef, cardTotalRef, cardDistanceRef, btnRef);
    parentRef.appendChild(cardRef);
}