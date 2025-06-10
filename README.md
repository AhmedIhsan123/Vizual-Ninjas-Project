# Event Travel Distance Tool

## Summary

**What does this web application do?**  
This web app is an interactive dashboard that visualizes and analyzes statistics of disc golf events, emphasizing players’ travel distance to those events.

---

## Working Features

### Home Page

- **Live Event Filtering:**
  - Tier
  - Country
  - State
  - Start/End Date
  - Min/Max Players
  - Min/Max Average Distance

![Event Filtering UI](./readme_images/image1.png)

- **Dynamic Bar Chart** of Events  
![Bar Chart of Events](./readme_images/image2.png)

- **Map of Events** with On-Click Information  
![Events Map](./readme_images/image3.png)

- **Statistics Overview**  
![Statistics Overview](./readme_images/image4.png)

### Event Page

- **Event Statistics:**
  - Total Players
  - Average Distance of Players to an Event
  - Players Outside 1000 Miles
  - Players Within 500 Miles
  - In and Out of State Players
  - Minimum and Maximum Player Distance Traveled
  - Top Players

![Event Stats](./readme_images/image5.png)

- **Bar Chart** showcasing furthest player travel distance  
![Bar Chart - Furthest Travel](./readme_images/image6.png)

- **Pie Chart** showcasing number of players per state  
![Pie Chart by State](./readme_images/image7.png)

- **Map** with player and event pins with lines to visualize outreach  
![Player Outreach Map](./readme_images/image8.png)

---

## Partially Working Features

- **Player Location Accuracy**  
  While the web app can calculate distances, it cannot ensure the players' addresses are fully accurate or up to date, potentially causing skewed data.

![Accuracy Note](./readme_images/image9.png)

---

## Potential Implementations

- Event Page Filters  
- Event Page Search Bar

---

## Architecture

### Tech Stack

**Frontend:**

- HTML
- CSS
- JavaScript  
  - Libraries:
    - Chart.js
    - Leaflet.js

**Backend:**

- PHP
- MySQL

![Architecture Overview](./readme_images/image10.png)

---

## Setup Instructions

### 1. Fork the Repository

### 2. Configure PHP Database Connection

- Adjust the database connection file path to your `db.php`
- Currently set to:  
  `/home/aabualha/db.php`

### 3. Deployment Options

#### Option 1: Local (Using cPanel or Web Hosting Tool)

1. Upload the project folder to cPanel  
2. Navigate to **File Manager**  
3. Click on **public_html**  
4. Click **Upload** and select the project folder

![cPanel Upload](./readme_images/image11.png)

#### Option 2: Live Website with Domain (Using cPanel Git Version Control)

1. Go to **Git Version Control**
2. Click on **Create**
3. Ensure **Clone a Repository** is enabled
4. Enter:
   - **Clone URL** for the forked repository
   - **Repository Path** as `public_html`
   - **Repo Display Name**
5. Click **Create**

![Git Setup](./readme_images/image12.png)

---

## Common Tasks

### Updating the Live Website

1. Make and commit code changes  
2. In cPanel, go to **Git Version Control**
3. Click **Manage** on the repo  
4. Go to the **Pull or Deploy** tab  
5. Click **Update from Remote**

![Update from Remote](./readme_images/image13.png)

### Restarting the Project

- Use `Ctrl + Shift + R` to clear browser cache  
  *(Required to see the latest changes)*

![Browser Cache Reset](./readme_images/image14.png)

---

## Status / Backlog

### Not Yet Implemented

- **Address Conversion / Geocoding**  
  (Web app does not convert addresses to latitude/longitude for distance calculations)

- **Filter by Event Concentration**  
  (Filter events by how local/national they are)

- **Player Deficiency Display**  
  (Show events with fewer players than expected, based on local player density or traffic)

![Backlog Feature](./readme_images/image15.png)

---

## Contact

For questions or support, please contact:

- **Allen:** [allen.resulidze@gmail.com](mailto:allen.resulidze@gmail.com)  
- **Hosea:** [h.nacanaynay@gmail.com](mailto:h.nacanaynay@gmail.com)  
- **Ahmed:** [Alhawar0001@gmail.com](mailto:Alhawar0001@gmail.com)  
- **Kevin:** Email and/or phone (not listed)

![Contact Info](./readme_images/image16.png)
