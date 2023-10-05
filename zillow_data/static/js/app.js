d3.csv("ZILLOW-DATA.csv", function(data) {
    console.log(data);
});

function init() {
    var dropDown = d3.select("#ZILLOW-DATA.csv");
//JSON data
    d3.csv.then(function (data) {
        var sampleId = data.names;
        sampleId.forEach((sample) => {
            dropDown.append("option").text(sample).property("value", sample)
        });
        var initSample = sampleId[0];
        buildDemo(initSample);
        buildCharts(initSample);
    });
};

// create charts 
function buildCharts() {
    d3.csv.then(function (data) {
        var allSamples = data.csv;
        var sampleInfo = allSamples.filter(row => row.id == sample);
        var sampleValues = sampleInfo[0].sample_values;
        var sampleValuesSlice = sampleValues.slice(0,10).reverse();
        var otuIds = sampleInfo[0].otu_ids;
        var otuIdsSlice = otuIds.slice(0,10).reverse();
        var otuLabels = sampleInfo[0].otu_labels;
        var otuLabelsSlice = otuLabels.slice(0,10).reverse();
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        var wash = metaDataSample[0].wfreq;

        // scatter/bubble
        var bubble = {
            x: otuIds,
            y: sampleValues,
            mode: "markers",
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: "Earth"
            },
            text: otuIds
        };
        var data_bubble = [bubble];
        var layout = {
            showlegend: false
        };

        Plotly.newPlot("bubble", data_bubble, layout);

        // gauge chart
    });
};

function buildDemo(sample) {
    var demo = d3.select("#ZILLOW-DATA.csv");
    d3.json(csv).then(function (data) {
        var metaData = data.metadata;
        var metaDataSample = metaData.filter(row => row.id == sample);
        demo.selectAll("region_id").remove();
        metaDataSample.forEach((row) => {
            for (const [key, value] of Object.entries(row)) {
                demo.append("region_id").text(`${key}: ${value}`);
            };
        });
    });
};

// 
function optionChanged(sample) {
    buildDemo(sample);
    buildCharts(sample);
};

init();