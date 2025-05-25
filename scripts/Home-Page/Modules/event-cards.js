import { eventList } from "../home-script.js";
import { updateMap } from "../../Event-Page/Modules/event-map.js";

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
    const parentRef = document.getElementById("event-cards-container");
    const cardRef = document.createElement("div");
    const cardTitleRef = document.createElement("p");
    const cardTierRef = document.createElement("p");
    const cardTotalRef = document.createElement("p");
    const cardDistanceRef = document.createElement("p");
    const btnRef = document.createElement("button");

    cardTitleRef.innerHTML = `<strong>${eventTitle}</strong>`;
    cardTierRef.innerHTML = `Tier: <strong>${eventTierID}</strong>`;
    cardTotalRef.innerHTML = `Players Attending: <strong>${eventTotal}</strong>`;
    cardDistanceRef.innerHTML = `Average Travel Distance: <strong>${eventTravelDistance}</strong>`;
    btnRef.textContent = "View Details";


    btnRef.classList.add("button");
    btnRef.value = eventID;
    cardRef.classList.add("event-card");
    cardRef.append(cardTitleRef, cardTierRef, cardTotalRef, cardDistanceRef, btnRef);
    parentRef.appendChild(cardRef);


    // Add event listner for each button to direct to the event-viewer page
    btnRef.addEventListener("click", function () {
        window.location.href = "https://aabualhawa.greenriverdev.com/SDEV280/Statmando-Project/event-page.html";
        updateMap(event);
    })
}