export default class ChartBuilder {

    constructor(canvasId, chartType, data) {
        this.canvasId = canvasId;
        this.chartType = chartType;
        this.data = data;
        this.options = {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'xTitle',
                        font: { size: 16 }
                    },
                    ticks: {
                        maxRotation: 90,
                        minRotation: 90
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'yTitle',
                        font: { size: 16 }
                    },
                    ticks: {
                        beginAtZero: true,
                        callback: value => value + ' mi'
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: 'graphTitle',
                    position: 'top',
                    font: { size: 20, weight: 'bold' },
                    padding: { top: 10, bottom: 20 },
                    color: '#333'
                },
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => {
                            const point = context.raw;
                            return `Average Distance: ${0} mi, OS: ${0}, IS: ${0}`;
                        }
                    }
                },
                annotation: {
                    annotations: {
                        min: {
                            type: 'line',
                            yMin: 0, // EDIT THIS
                            yMax: 0, // EDIT THIS
                            borderColor: 'green',
                            borderWidth: 2,
                            label: { enabled: true, content: `Min: ${0} mi`, position: 'start' }
                        },
                        max: {
                            type: 'line',
                            yMin: 0, // EDIT THIS
                            yMax: 0, // EDIT THIS
                            borderColor: 'red',
                            borderWidth: 2,
                            label: { enabled: true, content: `Max: ${0} mi`, position: 'start' }
                        },
                        avg: {
                            type: 'line',
                            yMin: 0, // EDIT THIS
                            yMax: 0, // EDIT THIS
                            borderColor: 'yellow',
                            borderWidth: 2,
                            label: { enabled: true, content: `Avg: ${0} mi`, position: 'start' }
                        }
                    }
                }
            }
        };
        this.chart = null;
    }

    // Method to create the chart
    build() {
        // Create chart ctx
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        // Create the chart using Chart.js
        this.chart = new Chart(ctx, {
            type: this.chartType, // Type of the chart (line, bar, etc.)
            data: this.data, // Data to be displayed
            options: this.options // Configuration options for the chart
        });

        console.log(this.data);

        return this.chart;
    }

    // Method to update the chart data
    updateData(newData) {
        this.chart.data = newData;
        this.chart.update();
    }

    // Method to update the chart options
    updateOptions(newOptions) {
        this.chart.options = newOptions;
        this.chart.update();
    }
}
