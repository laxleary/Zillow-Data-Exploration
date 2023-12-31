// Step 1: Load CSV Data
Plotly.d3.csv("Data-Import/Resource-CSVs/ZILLOW-REAL ESTATE.csv", function(data) {
    // Step 2: Extract data for years 2021, 2022, and 2023
    const data2021 = data.filter(d => (new Date(d.date)).getFullYear() === 2021);
    const data2022 = data.filter(d => (new Date(d.date)).getFullYear() === 2022);
    const data2023 = data.filter(d => (new Date(d.date)).getFullYear() === 2023);

    // Step 3: Extract x and y data for all years
    const xData2021 = data2021.map(d => d.region_id);
    const yData2021 = data2021.map(d => parseFloat(d.value.replace(/[^0-9.-]+/g,"")));

    const xData2022 = data2022.map(d => d.region_id);
    const yData2022 = data2022.map(d => parseFloat(d.value.replace(/[^0-9.-]+/g,"")));

    const xData2023 = data2023.map(d => d.region_id);
    const yData2023 = data2023.map(d => parseFloat(d.value.replace(/[^0-9.-]+/g,"")));

    // Step 4: Create Scatter Plots
    const trace2021 = {
        x: xData2021,
        y: yData2021,
        mode: 'markers',
        type: 'scatter',
        name: '2021 Data',
        marker: {color: 'green', size: 8},
    };

    const trace2022 = {
        x: xData2022,
        y: yData2022,
        mode: 'markers',
        type: 'scatter',
        name: '2022 Data',
        marker: {color: 'blue', size: 8}
    };

    const trace2023 = {
        x: xData2023,
        y: yData2023,
        mode: 'markers',
        type: 'scatter',
        name: '2023 Data',
        marker: {color: 'red', size: 8}
    };

    const layout = {
        title: 'Progression of Single Family Home Prices',
        xaxis: {title: 'Region ID', type: 'category', categoryorder: 'category ascending'},
        yaxis: {title: 'Property Value for Single Family Homes', tickformat: '$,.2f'},
        margin: { l: 100, r: 50, b: 100, t: 50, pad: 4 }, // Adjust left and right margins
        showlegend: true
    };

    Plotly.newPlot('scatter-plot', [trace2021, trace2022, trace2023], layout);
});

document.getElementById('trace1').addEventListener('change', function() {
    Plotly.restyle('scatter-plot', 'visible', this.checked ? true : 'legendonly', [0]);
});
  document.getElementById('trace2').addEventListener('change', function() {
    Plotly.restyle('scatter-plot', 'visible', this.checked ? true : 'legendonly', [1]);
});
  document.getElementById('trace3').addEventListener('change', function() {
    Plotly.restyle('scatter-plot', 'visible', this.checked ? true : 'legendonly', [2]);
});
