// Class to store coordinates
class Coordinate {
  constructor(lat, lon) {
    this.lat = lat;
    this.lon = lon;
  }
}

// Class to store player/member information
class Member {
  constructor(PDGA_ID, name, lat, lon, address, distance) {
    this.PDGA_ID = PDGA_ID;
    this.name = name;
    this.coordinates = new Coordinate(lat, lon);
    this.address = address;
    this.distance = distance;
  }
}

// Class to store event information
class Event {
  constructor(eventData) {
    this.id = eventData.EVENT_ID;
    this.lat = eventData.EVENT_LATITUDE;
    this.lon = eventData.EVENT_LONGITUDE;
    this.name = eventData.EVENT_NAME;
  }

  // Return event location as a Coordinate object
  getCoordinates() {
    return new Coordinate(this.lat, this.lon);
  }
}

// Class to manage events, members, and distance calculations
class EventManager {
  constructor(eventData, eventResultData, memberData) {
    this.events = eventData.map(event => new Event(event));
    this.eventResults = eventResultData;
    this.members = memberData;
  }

  // Find and return event by ID
  getEventById(eventID) {
    return this.events.find(event => event.id === eventID);
  }

  // Get the name of an event
  getEventName(eventID) {
    const event = this.getEventById(eventID);
    return event ? event.name : null;
  }

  // Find all members who attended a specific event
  getMembersForEvent(eventID) {
    const event = this.getEventById(eventID);
    if (!event) return [];

    const membersAtEvent = [];

    this.eventResults.forEach(result => {
      if (result.EVENT_ID == eventID) {
        const memberInfo = this.members.find(member => member.PDGA_NUMBER == result.PDGA_NUMBER);
        if (memberInfo) {
          const distance = EventManager.calculateDistance(
            event.getCoordinates(),
            new Coordinate(memberInfo.MEMBER_LAT, memberInfo.MEMBER_LON),
            true
          );

          membersAtEvent.push(new Member(
            memberInfo.PDGA_NUMBER,
            memberInfo.MEMBER_FULL_NAME,
            memberInfo.MEMBER_LAT,
            memberInfo.MEMBER_LON,
            memberInfo.MEMBER_ADDRESS_FORMATTED,
            Number(distance.toFixed(4))
          ));
        }
      }
    });

    return membersAtEvent;
  }

  // Calculate distance between two coordinates using Haversine formula
  static calculateDistance(locationOne, locationTwo, isMiles = true) {
    const toRad = angle => (angle * Math.PI) / 180;
    const R = isMiles ? 3959 : 6371;
    const phi1 = toRad(locationOne.lat);
    const phi2 = toRad(locationTwo.lat);
    const deltaPhi = toRad(locationTwo.lat - locationOne.lat);
    const deltaLambda = toRad(locationTwo.lon - locationOne.lon);
    const a = Math.sin(deltaPhi / 2) ** 2 + Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2;
    const c = 2 * Math.asin(Math.sqrt(a));
    return R * c;
  }

  // Get average travel distance of all players
  static getAverageDistance(members) {
    const total = members.reduce((sum, m) => sum + m.distance, 0);
    return (total / members.length).toFixed(2);
  }

  // Get longest distance traveled
  static getMaxDistance(members) {
    return Math.max(...members.map(m => m.distance)).toFixed(2);
  }

  // Get shortest distance traveled
  static getMinDistance(members) {
    return Math.min(...members.map(m => m.distance)).toFixed(2);
  }
}

// Main application class
class EventApp {
  constructor() {
    this.totalPlayersText = document.querySelector("#totalPlayers");
    this.eventDropdown = document.querySelector("#eventDropdown");
    this.avgDistanceText = document.querySelector("#avgTravelDist");
    this.maxDistanceText = document.querySelector("#maxTravelDist");
    this.minDistanceText = document.querySelector("#minTravelDist");
    this.eventChart = document.querySelector("#eventChart");

    this.eventManager = null;
    this.chartBuilder = new ChartBuilder(this.eventChart);
    this.chartBuilder.render([]);

    this.init();
  }

  // Load data and set up dropdown and event listener
  async init() {
    try {
      const [eventResults, events, members] = await Promise.all([
        this.loadJSON("./Data/JSON/EVENT_RESULT.json"),
        this.loadJSON("./Data/JSON/EVENT.json"),
        this.loadJSON("./Data/JSON/MEMBER.json")
      ]);

      this.eventManager = new EventManager(events, eventResults, members);
      this.populateDropdown(events);

      this.eventDropdown.addEventListener("change", () => {
        this.runSearch(Number(this.eventDropdown.value));
      });

    } catch (err) {
      console.error("Error loading data:", err);
    }
  }

  // Load JSON data from a file
  async loadJSON(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Failed to load ${path}`);
    return await response.json();
  }

  // Fill dropdown menu with event options
  populateDropdown(events) {
    events.forEach((event, index) => {
      const option = document.createElement("option");
      option.value = event.EVENT_ID;
      option.text = `Event #${index + 1}: ${event.EVENT_ID}`;
      this.eventDropdown.appendChild(option);
    });
  }

  // Update UI and chart when an event is selected
  runSearch(eventID) {
    const members = this.eventManager.getMembersForEvent(eventID);
    const selectedEvent = this.eventManager.getEventById(eventID);
    console.log(selectedEvent);

    this.totalPlayersText.textContent = members.length;
    this.avgDistanceText.textContent = EventManager.getAverageDistance(members) + " mi";
    this.maxDistanceText.textContent = EventManager.getMaxDistance(members) + " mi";
    this.minDistanceText.textContent = EventManager.getMinDistance(members) + " mi";

    this.chartBuilder.render(members, selectedEvent.name);
  }
}

// Chart handler class for building and displaying the chart
class ChartBuilder {
  constructor(canvas) {
    this.canvas = canvas;
    this.chart = null;
  }

  static randomColor() {
    return `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)}, 0.6)`;
  }

  buildChartData(members) {
    return {
      labels: members.map(m => m.name),
      datasets: [{
        label: "Travel Distance (mi)",
        data: members.map(m => m.distance),
        backgroundColor: "#006400",
      }]
    };
  }

  buildChartOptions(eventName) {
    return {
      responsive: true,
      animation: {
        duration: 1600,
        easing: 'easeOutExpo',
      },
      plugins: {
        title: {
          display: true,
          text: `Player Travel Distance to the ${eventName} Event`,
          font: {
            size: 25,
          },
          color: "black"
        },
        tooltip: {
          callbacks: {
            label: ctx => `${ctx.dataset.label}: ${ctx.raw} mi`
          }
        },
        legend: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: 'Miles Traveled' }
        },
        x: {
          type: 'category',
          title: { display: true, text: 'Players' },
          ticks: {
            autoSkip: false,
            maxRotation: 90,
            minRotation: 90,
            font: { size: 12 }
          }
        }
      }
    };
  }

  // Render the bar chart with data and annotations
  render(members, eventName) {
    const data = this.buildChartData(members);
    const options = this.buildChartOptions(eventName);

    const avg = parseFloat(EventManager.getAverageDistance(members));
    const min = parseFloat(EventManager.getMinDistance(members));
    const max = parseFloat(EventManager.getMaxDistance(members));

    options.plugins.annotation = {
      annotations: {
        averageLine: {
          type: 'line',
          yMin: avg,
          yMax: avg,
          borderColor: 'orange',
          borderWidth: 1,
          label: {
            content: `Avg: ${avg} mi`,
            enabled: true,
            position: 'end',
            backgroundColor: 'rgba(255,165,0,0.8)'
          }
        },
        minLine: {
          type: 'line',
          yMin: min,
          yMax: min,
          borderColor: 'green',
          borderWidth: 1,
          label: {
            content: `Min: ${min} mi`,
            enabled: true,
            position: 'end',
            backgroundColor: 'rgba(0,128,0,0.8)'
          }
        },
        maxLine: {
          type: 'line',
          yMin: max,
          yMax: max,
          borderColor: 'red',
          borderWidth: 1,
          label: {
            content: `Max: ${max} mi`,
            enabled: true,
            position: 'end',
            backgroundColor: 'rgba(255,0,0,0.8)'
          }
        }
      }
    };

    if (this.chart) this.chart.destroy();

    this.chart = new Chart(this.canvas, {
      type: "bar",
      data,
      options,
    });
  }
}

Chart.register(window['chartjs-plugin-annotation']); // <-- register plugin globally!

// Start the app once the page loads
document.addEventListener("DOMContentLoaded", () => {
  new EventApp();
});