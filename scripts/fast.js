import ChartBuilder from "./charts.js";

// Global element references
const elements = {
    tier: document.querySelector("#tier"),
    country: document.querySelector("#country"),
    state: document.querySelector("#state"),
    applyBtn: document.querySelector("#applyFilters"),
    startDate: document.querySelector("#startDate"),
    endDate: document.querySelector("#endDate")
};

// Event application class
class EventApp {
    constructor() { }

    // Fetch data from a given URL
    async fetchData(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Fetch error:', error);
            return null;
        }
    }

    // Populate dropdowns dynamically
    async setFiltersUI() {
        const data = await this.fetchData('./PHP/handlers/getFilters.php');
        if (!data) return;

        this.populateDropdown(elements.tier, data.tiers);
        this.populateDropdown(elements.country, data.countries);
        this.populateDropdown(elements.state, data.states, 'state_id', 'state_name');
    }

    // Populate a dropdown with given data
    populateDropdown(dropdown, data, valueKey = null, textKey = null) {
        if (!dropdown || !data) return;
        data.forEach(item => {
            const option = document.createElement('option');
            option.value = valueKey ? item[valueKey] : item;
            option.textContent = textKey ? item[textKey] : item;
            dropdown.appendChild(option);
        });
    }

    // Generate chart options dynamically
    setChartOptions(title, xTitle, yTitle, xData, yData) {
        const values = yData.map(point => point.y);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const avgValue = values.reduce((sum, value) => sum + value, 0) / values.length;

        return {
            chartData: {
                labels: xData,
                datasets: [{
                    data: yData,
                    backgroundColor: 'green',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: { title: { display: true, text: xTitle, font: { size: 16 } } },
                    y: { title: { display: true, text: yTitle, font: { size: 16 } }, ticks: { beginAtZero: true, callback: value => value + ' mi' } }
                },
                plugins: {
                    title: { display: true, text: title, font: { size: 20, weight: 'bold' }, padding: { top: 10, bottom: 20 } },
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: context => {
                                const { y, osCount, isCount } = context.raw || {};
                                return `Avg Distance: ${y?.toFixed(2) ?? 'N/A'} mi, OS: ${osCount ?? 'N/A'}, IS: ${isCount ?? 'N/A'}`;
                            }
                        }
                    },
                    annotation: {
                        annotations: {
                            min: { type: 'line', yMin: minValue, yMax: minValue, borderColor: 'green', borderWidth: 2, label: { content: `Min: ${minValue.toFixed(2)} mi` } },
                            max: { type: 'line', yMin: maxValue, yMax: maxValue, borderColor: 'red', borderWidth: 2, label: { content: `Max: ${maxValue.toFixed(2)} mi` } },
                            avg: { type: 'line', yMin: avgValue, yMax: avgValue, borderColor: 'yellow', borderWidth: 2, label: { content: `Avg: ${avgValue.toFixed(2)} mi` } }
                        }
                    }
                }
            }
        };
    }
}

// Initialize app once DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    const app = new EventApp();
    const eventChart = new ChartBuilder('eventChart', 'bar', [], app.setChartOptions('Undefined', 'Undefined', 'Undefined', [], []));

    eventChart.build();
    app.setFiltersUI();

    elements.applyBtn.addEventListener('click', async () => {
        const filters = {
            tier: elements.tier.value,
            country: elements.country.value,
            state: elements.state.value,
            startDate: elements.startDate.value,
            endDate: elements.endDate.value
        };

        const url = `./PHP/events.php?tier=${filters.tier}&country=${filters.country}&state=${filters.state}&start_date=${filters.startDate}&end_date=${filters.endDate}`;
        const data = await app.fetchData(url);
        if (!data) return;

        const xLabels = data.map(event => event.EVENT_NAME);
        const yData = data.map(event => ({
            x: event.EVENT_NAME,
            y: event.AVG_TRAVEL_DISTANCE_MILES,
            osCount: event.MEMBERS_OUT_OF_STATE,
            isCount: event.MEMBERS_IN_STATE
        }));

        const { chartData, options } = app.setChartOptions('Avg Distance Traveled Per Event', 'Events', 'Avg Distance Traveled in Miles', xLabels, yData);
        eventChart.updateData(chartData);
        eventChart.updateOptions(options);
    });

    elements.country.addEventListener("change", async () => {
        const data = await app.fetchData(`./PHP/handlers/getProvince.php?country=${elements.country.value}`);
        if (!data?.states) return;

        elements.state.innerHTML = '<option value="">Select State</option>';
        app.populateDropdown(elements.state, data.states, 'state_id', 'state_name');
    });
});
