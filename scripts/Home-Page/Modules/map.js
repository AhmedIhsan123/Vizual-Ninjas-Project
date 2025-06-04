import { eventList } from "../../script.js";

let markers = {}; // An object to store Leaflet marker instances, keyed by event name.
let map;          // A variable to hold the Leaflet map instance.

/**
 * Initializes the Leaflet map and populates it with markers for each event.
 * Sets up popups and click interactions for the markers.
 */
export async function initMap() {
    // Create the map and set its initial view to a central U.S. location with a zoom level of 4.
    map = L.map('events-map').setView([45.5, -98.35], 4);
    markers = {}; // Reset the global markers object to ensure a clean slate on re-initialization.

    // Add a tile layer to the map from OpenStreetMap. This provides the visual base of the map.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors', // Attribution required by OpenStreetMap.
    }).addTo(map);

    // Iterate over each event in the 'eventList' to create and add markers to the map.
    eventList.forEach(event => {
        const latLng = [event.EVENT_LATITUDE, event.EVENT_LONGITUDE]; // Get the latitude and longitude for the event.
        const marker = L.marker(latLng).addTo(map); // Create a new marker and add it to the map.
        
        // Bind a popup to the marker with detailed event information.
        marker.bindPopup(`
            <strong>${event.EVENT_NAME}</strong><br>
            ${event.COUNTRY_ID}, ${event.EVENT_STATE_ID}<br>
            Event Tier: <strong>${event.EVENT_TIER_ID}</strong><br>
            End Date: <strong>${event.DATE_EVENT_END}</strong><br>
            Average Distance Traveled to Event: <strong>${event.AVG_TRAVEL_DISTANCE_MILES} miles</strong><br>
            <br>
            <em>It seems <strong>${event.MEMBERS_OUT_OF_STATE}</strong> members came from out of state, while <strong>${event.MEMBERS_IN_STATE}</strong> were coming from in-state. This suggests that members from <strong>${event.MEMBERS_OUT_OF_STATE > event.MEMBERS_IN_STATE ? "out of state" : "in state"}</strong> are <strong>more likely</strong> to attend events in this area.</em>
            <br>
            <a class="button" href="https://aabualhawa.greenriverdev.com/SDEV280/Statmando-Project/event-page.html?id=${event.EVENT_ID}">View Details</a>`);
        
        markers[event.EVENT_NAME] = marker; // Store the marker in the 'markers' object, using the event name as the key.

        // Add a click event listener to each marker.
        marker.on('click', () => {
            // When a marker is clicked, fly to its location with a smooth animation.
            map.flyTo(latLng, 13, { animate: true, duration: 1.5 });
            
            // After the map finishes moving, open the marker's popup and update the map label.
            map.once('moveend', () => {
                marker.openPopup();       // Open the associated popup.
                updateMapLabel(event);    // Update a display label with the event's name.
            });
        });
    });

    // Add event listener for table rows to allow interaction from a data table.
    const tableRows = document.querySelectorAll(".table-content tbody tr");

    // Add a click event to each table row.
    tableRows.forEach(row => {
        row.addEventListener("click", function () {
            // Get the event ID from the first cell of the clicked row.
            const eventId = this.querySelector("td").innerText;
            focusOnEvent(eventId); // Call 'focusOnEvent' to center the map on the corresponding marker.
        });
    });
}

/**
 * Centers the map on a specific event's marker and opens its popup.
 * This function is exported so it can be used by other modules, like a chart.
 * @param {string} eventId - The ID of the event to focus on.
 */
export function focusOnEvent(eventId) {
    // Find the event object in 'eventList' that matches the given eventId.
    const event = eventList.find(e => e.EVENT_ID == eventId);
    if (!event) return; // If no event is found, exit the function.

    // Get the marker associated with the found event name.
    const marker = markers[event.EVENT_NAME];
    if (!marker) return; // If no marker is found, exit the function.

    const latLng = marker.getLatLng(); // Get the latitude and longitude of the marker.
    
    // Fly to the marker's location with a closer zoom level (14) and a smooth animation.
    map.flyTo(latLng, 14, { duration: 1.25 });
    
    // After the map finishes moving, open the marker's popup and update the map label.
    map.once('moveend', () => {
        marker.openPopup();       // Open the associated popup.
        updateMapLabel(event);    // Update a display label with the event's name.
    });
}

/**
 * Updates a specific HTML element with the name of the given event.
 * @param {object} event - The event object containing the EVENT_NAME.
 */
export function updateMapLabel(event) {
    const labelElement = document.getElementById('map-event-label'); // Get the HTML element by its ID.
    if (labelElement) { // Check if the element exists.
        labelElement.innerHTML = `${event.EVENT_NAME}`; // Set the inner HTML of the element to the event's name.
    }
}