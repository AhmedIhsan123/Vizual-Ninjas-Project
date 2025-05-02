export default class ChartBuilder {
    constructor(canvasId, chartType, data, options) {
        this.canvasId = canvasId;
        this.chartType = chartType;
        this.data = data;
        this.options = options || {};
        this.chart = null;
    }

    // Method to create the chart
    build() {
        const ctx = document.getElementById(this.canvasId).getContext('2d');

        // Create the chart using Chart.js
        this.chart = new Chart(ctx, {
            type: this.chartType, // Type of the chart (line, bar, etc.)
            data: this.data, // Data to be displayed
            options: this.options // Configuration options for the chart
        });

        return this.chart;
    }

    // 
    buildOptions() {
        return {
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

    // Method to destroy the chart
    destroy() {
        this.chart.destroy();
    }
}
