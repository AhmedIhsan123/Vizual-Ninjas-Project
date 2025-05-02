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

getEventAverages().then(data => {
    const chartData = {
        labels: data.map(event => event.EVENT_NAME),
        datasets: [{
            label: 'Events',
            data: data.map(event => event.avg_distance_miles),
            backgroundColor: 'green',
            borderWidth: 1
        }]
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Events',
                    font: {
                        size: 16
                    }
                },
                ticks: {
                    maxRotation: 90,
                    minRotation: 90
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Average Distance in Miles',
                    font: {
                        size: 16
                    }
                },
                ticks: {
                    beginAtZero: true,
                    callback: value => value.toFixed(2) + ' mi'
                }
            }
        },
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: context => {
                        const value = context.raw;
                        return 'Distance: ' + value.toFixed(2) + ' mi';
                    }
                }
            }
        }
    };

    const chartBuilder = new ChartBuilder('eventChart', 'bar', chartData, options);
    chartBuilder.build();
});
