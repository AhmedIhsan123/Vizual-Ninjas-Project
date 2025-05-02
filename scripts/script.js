import ChartBuilder from "./charts.js";

// Event application class
class EventApp {
    // Default constructor
    constructor() { };

    // Method to fetch data through url and return the data found
    async fetchData(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Fetch error:', error);
            return [];
        }
    }
}

// Once the DOM content has loaded
document.addEventListener("DOMContentLoaded", () => {
    // Create an app variable to store the application class
    const app = new EventApp();
    buildEventAverageDistance();

    // Function to build the evnt average disance graph
    function buildEventAverageDistance() {
        // Fetch data for average event travel distance
        app.fetchData('PHP/api.php?action=get_event_averages').then(data => {
            const chartData = {
                labels: data.map(event => event.EVENT_NAME),
                datasets: [{
                    data: data.map(event => event.avg_distance_miles),
                    backgroundColor: 'green',
                    borderWidth: 1
                }]
            };

            const eventChart = new ChartBuilder('eventChart', 'bar', chartData, this.buildOptions());
            eventChart.build();
        });
    }
})
