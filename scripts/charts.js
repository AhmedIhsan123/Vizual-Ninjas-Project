export default class ChartBuilder {

    constructor(canvasId, chartType, data, options) {
        this.canvasId = canvasId;
        this.chartType = chartType;
        this.data = data;
        this.options = options;
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
