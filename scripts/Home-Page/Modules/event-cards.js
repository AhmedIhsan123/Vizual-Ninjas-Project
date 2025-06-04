import { eventList } from "../../script.js";

/**
 * Populates the sidebar with a limited number of the most popular event cards.
 */
export function populateCards() {
    // Sorts the 'eventList' in descending order based on 'TOTAL_MEMBERS'
    // and then slices the array to get only the top 6 most popular events.
    const sortdEvents = eventList.sort((a, b) => b.TOTAL_MEMBERS - a.TOTAL_MEMBERS).slice(0, 6);

    // Iterates over each of the top 6 sorted events.
    sortdEvents.forEach(event => {
        // Calls the helper function 'createCard' for each event,
        // passing relevant event data to construct and display the card.
        createCard(event.EVENT_NAME, event.EVENT_TIER_ID, event.TOTAL_MEMBERS, event.AVG_TRAVEL_DISTANCE_MILES, event.EVENT_ID, event);
    });
}

/**
 * A helper function to dynamically create and append an event card to the DOM.
 * @param {string} eventTitle - The name of the event.
 * @param {string} eventTierID - The tier ID of the event.
 * @param {number} eventTotal - The total number of members attending the event.
 * @param {number} eventTravelDistance - The average travel distance to the event in miles.
 * @param {string} eventID - The unique ID of the event.
 * @param {object} event - The full event object (passed for potential future use, though specific properties are extracted).
 */
function createCard(eventTitle, eventTierID, eventTotal, eventTravelDistance, eventID, event) {
    // Get a reference to the parent container where the new cards will be appended.
    const parentRef = document.querySelector(".sidebar-content");

    // Create new DOM elements for the card and its content.
    const cardRef = document.createElement("div");
    const cardTitleRef = document.createElement("p");
    const cardTierRef = document.createElement("p");
    const cardTotalRef = document.createElement("p");
    const cardDistanceRef = document.createElement("p");
    const btnRef = document.createElement("a"); // Create an anchor tag for the "View Details" button.

    // Set the inner HTML/text content for each card element using the provided event data.
    cardTitleRef.innerHTML = `<strong>${eventTitle}</strong>`;
    cardTierRef.innerHTML = `Tier: <strong>${eventTierID}</strong>`;
    cardTotalRef.innerHTML = `Players Attending: <strong>${eventTotal}</strong>`;
    cardDistanceRef.innerHTML = `Average Travel Distance: <strong>${eventTravelDistance}</strong>`;
    btnRef.textContent = "View Details"; // Set the text for the button.

    // Add necessary classes and attributes to the created elements.
    btnRef.classList.add("button");        // Adds a CSS class 'button' for styling.
    btnRef.value = eventID;                // Assigns the event ID to the button's value attribute (useful for JavaScript handling).
    btnRef.href = `event-page.html?id=${eventID}`; // Sets the href attribute to link to the event details page.
    cardRef.classList.add("event-card");  // Adds a CSS class 'event-card' for styling the main card container.

    // Append all the content elements to the main card div.
    cardRef.append(cardTitleRef, cardTierRef, cardTotalRef, cardDistanceRef, btnRef);
    
    // Append the completed card to its parent container in the DOM.
    parentRef.appendChild(cardRef);
}