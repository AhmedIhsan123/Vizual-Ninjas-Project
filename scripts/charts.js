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
        // const ctx = document.getElementById(this.canvasId).getContext('2d');
        

        // // Create the chart using Chart.js
        // this.chart = new Chart(ctx, {
        //     type: this.chartType, // Type of the chart (line, bar, etc.)
        //     data: this.data, // Data to be displayed
        //     options: this.options // Configuration options for the chart
        // });

        // return this.chart;

        const canvas = document.getElementById(this.canvasId);
    if (!canvas) {
        console.error(`Canvas with ID "${this.canvasId}" not found.`);
        return;
    }

    const ctx = canvas.getContext('2d');

    // Destroy existing chart on this canvas if one exists
    if (ChartBuilder.chartInstances[this.canvasId]) {
        ChartBuilder.chartInstances[this.canvasId].destroy();
    }

    const newChart = new Chart(ctx, {
        type: this.chartType,
        data: this.data,
        options: this.options
    });

    ChartBuilder.chartInstances[this.canvasId] = newChart;

    return newChart;
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
