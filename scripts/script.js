import { fetchData } from "./utils.js";

// Get references to the hamburger icon and the navigation links container
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links-container');
const navLinks = document.querySelectorAll('.navigation-link'); // Get all individual navigation links

/**
 * Toggles the 'active' class on the hamburger icon and the navigation links container.
 * This function is called when the hamburger icon is clicked.
 */
function toggleMenu() {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
}

/**
 * Closes the mobile menu by removing the 'active' class from the hamburger icon
 * and the navigation links container.
 * This function is called when a navigation link is clicked.
 */
function closeMenu() {
    hamburger.classList.remove('active');
    navLinksContainer.classList.remove('active');
}

// Add event listener to the hamburger icon to toggle the menu
if (hamburger) {
    hamburger.addEventListener('click', toggleMenu);
}

// Add event listeners to each navigation link to close the menu when clicked
if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
}

// Global program variables
export const eventList = await fetchData("./PHP/events.php");
export const playerList = await fetchData("./PHP/handlers/getMembers.php");