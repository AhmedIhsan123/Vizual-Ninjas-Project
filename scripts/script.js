import ChartBuilder from "./charts.js";



async function getEventAverages() {
    try {
        const response = await fetch('PHP/api.php?action=get_event_averages');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return [];
    }
}

// Store result into a variable
let eventData = [];
getEventAverages().then(data => {
    // Sample data for a Bar Chart
    const chartData = {
        labels: data.map(event => event.EVENT_NAME),
        datasets: [{
            label: 'Events',
            data: data.map(event => event.avg_distance_miles),
            backgroundColor: 'green',
            borderWidth: 1
        }]
    };

    // Options for the chart (can be customized)
    const options = {
        responsive: true,
        scales: {
            x: {
                ticks: {
                    // Rotate the tick labels by 90 degrees
                    maxRotation: 90,
                    minRotation: 90
                },
                type: 'logarithmic'
            }
        },
        plugins: {
            legend: {
                display: false
            }
        }
    };

    // Create an instance of the ChartBuilder class
    const chartBuilder = new ChartBuilder('eventChart', 'bar', chartData, options);

    // Build the chart
    chartBuilder.build();
});

