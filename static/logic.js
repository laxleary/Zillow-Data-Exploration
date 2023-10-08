// Set up a preliminary url for finding city names, coordinates, etc.
cityData = "http://127.0.0.1:5000/api/v1.0/city_data";


//Create a default location for our original map
var region_id = "9999";
var indicator_id = "Z1BR" ;
var roomNumber = "1"
var searchedLocation = "New York, NY"
var myCoordinates = [40.73, -74.0059]
var plotlyName = "New York, NY"



//Name a variable for our map for later calls
let my_map = Object;

// Create the map with our layers.
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
	attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

let baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topo
    };

let markerGroup = new L.LayerGroup()

let overlayMaps = {
    "Home Values": markerGroup
};

my_map = L.map("map", {
    center: [40.73, -74.0059],
    zoom: 9.5,
    layers: [streetmap,
        markerGroup]
});

//Create a control for turning off and on/switching layers
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(my_map);


//Define a function that will get us a color value for our marker based on home values
function getColor(value) {
    return chroma.scale(['violet', 'blue', 'teal','green', 'lightgreen','yellow', 'orange', 'red']).domain([5000, 1000000])(value).hex();
}


//Set up lists for our sets of information
let search = {"lat":40.73, "lon":-74.0059};
let cityDicts = [];
var backupCoords = [];

defaultURL = "http://127.0.0.1:5000/api/v1.0/data_by/9999/Z1BR"
let city_Z1BR = [];

// Make our API call to retrieve all of the cities near New York, NY for the default map
cities = d3.json(cityData).then(function(data){
    for (i=0; i < data.length; i++){
        point = data[i]
        lat = point.coordinates[0]
        lon = point.coordinates[1]
        if (lat > (search.lat - 0.4) && lat < (search.lat + 0.4) && lon > (search.lon - 0.4) && lon < (search.lon + 0.4)){
        cityDicts.push({"name":point.name, "id":point.id, "coords":{"lat":lat, "lon":lon}})
        };
    };

    //Create a line plot for the default city (New York, NY)
    d3.json(defaultURL).then(function (data){
        city_Z1BR[data.region_id]={};
        city_Z1BR[data.region_id]["date"]=[];
        city_Z1BR[data.region_id]["value"]=[];
        for (let j = 0; j < data.length; j++){
            city_Z1BR[data.region_id]["value"].push(data[j].value);
            var dateObject = new Date(data[j].date);
            var month = String(dateObject.getUTCMonth()+1).padStart(2,"0");
            var year = dateObject.getUTCFullYear();
            var formattedDate = `${month}-${year}`;
            city_Z1BR[data.region_id]["date"].push(formattedDate);
        };
        markerColor = getColor(city_Z1BR[data.region_id]["value"][city_Z1BR[data.region_id]["value"].length-1])
        trace1 = {
            x: city_Z1BR[data.region_id]["date"],
            y: city_Z1BR[data.region_id]["value"],
            mode: 'lines',
            line: {
                color: markerColor
            }
        };
        let chartData = [trace1];
        let layout = {
            title: `Average Values of 1 Bedroom Homes for New York, NY`,
            xaxis: {
               title: "Date"
              },
            yaxis: {
                title: "Average Home Value"
            },
            margin: {
                b: 100
            }
        };
        Plotly.newPlot("line", chartData, layout)
    });

    //Put New York, NY at the top of the search so that if we change room number, we don't lose our searched city
    option = d3.select("#selDataset2").append("option");
    option.text("New York, NY")

    //Sort our city dictionaries based on name
    cityDicts = cityDicts.sort(function(a,b){
        if (a.name<b.name){
            return -1;
        }
        else if (a.name > b.name){
            return 1;
        }
        else {return 0};
    });

    //For each city within our desired coordinate limits, grab the most current data
    for (let i=0; i < cityDicts.length; i++) {
        if (cityDicts[i].name != "New York, NY"){
            let option =d3.select("#selDataset2").append("option");
            option.text(cityDicts[i].name);
        };
        region_id = cityDicts[i].id
        url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/Z1BR`
        sales_data = d3.json(url).then(function (data){
            data.reverse()
            // Some cities have missing data. This try-catch avoids issues with this by skipping such cities
            try{
                markerColor = getColor(data[1].value)
                housingPrices = data[1].value
                let newMarker = L.circleMarker([cityDicts[i].coords.lat,cityDicts[i].coords.lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                newMarker.addTo(markerGroup);
                newMarker.bindPopup("<h2>"+cityDicts[i].name+"</h2> <p> Average Home Value (1 BR): $"+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
            } catch (TypeError){
                console.log("No data found for this region")
            }
        });
    };
    //Store our old coordinates to prevent errors if non-existent cities are searched
    backupCoords = [search.lat, search.lon]
});

//Create a function that responds to the search bar
function searchLocation() {
    d3.select(".error-message").text("")
    let dropdown = d3.select("#selDataset");
    let roomNumber = dropdown.property("value");

    var city = d3.select("#cityInput").property("value")
    var state = d3.select("#stateInput").property("value")
    searchedLocation = `${city}, ${state}`
    myCoordinates = []

    //This endpoint allows us to search coordinates by city, state name
    coordinateSearch = `http://127.0.0.1:5000/api/v1.0/data/coordinates/${searchedLocation}`
    d3.json(coordinateSearch).then(function(data){

        //Catch the case where a city is searched that we do not have data for
        if (data.length > 0){
            myCoordinates.push(data[0].lat);
            myCoordinates.push(data[0].lon);
            plotlyName = searchedLocation
        } else {
            d3.select(".error-message").text("Sorry, we don't have any data about that city. Please try again.")
            myCoordinates = backupCoords
        };
    });

    //Call the API to retrieve the city data 
    cities = d3.json(cityData).then(function(data){
        cityDicts =[]
        //clear the dropdown options for new ones
        document.getElementById("selDataset2").innerHTML="";
        
        //Keep only cities within the desired radius, fetch their metadata
        for (i=0; i < data.length; i++){
            point = data[i]
            lat = point.coordinates[0]
            lon = point.coordinates[1]
            if (lat > (myCoordinates[0] - 0.4) && lat < (myCoordinates[0] + 0.4) && lon > (myCoordinates[1] - 0.4) && lon < (myCoordinates[1] + 0.4)){
                cityDicts.push({"name":point.name, "id":point.id, "coords":{"lat":lat, "lon":lon}})
                if (point.name == searchedLocation){
                    region_id = point.id;
                };
            };
        };  
       
        //Set up for the new Plotly
        newURL = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
        //Put searchedLocation at the top of the search so that if we change room number, we don't lose our searched city
        option = d3.select("#selDataset2").append("option");
        option.text(searchedLocation);
        
        //Create a line plot for the default city (searchedLocation)
        d3.json(newURL).then(function (data){
            city_Z1BR[data.region_id]={};
            city_Z1BR[data.region_id]["date"]=[];
            city_Z1BR[data.region_id]["value"]=[];
            for (let j = 0; j < data.length; j++){
                city_Z1BR[data.region_id]["value"].push(data[j].value);
                var dateObject = new Date(data[j].date);
                var month = String(dateObject.getUTCMonth()+1).padStart(2,"0");
                var year = dateObject.getUTCFullYear();
                var formattedDate = `${month}-${year}`;
                city_Z1BR[data.region_id]["date"].push(formattedDate);
            };
            markerColor = getColor(city_Z1BR[data.region_id]["value"][city_Z1BR[data.region_id]["value"].length-1])
            trace1 = {
                x: city_Z1BR[data.region_id]["date"],
                y: city_Z1BR[data.region_id]["value"], 
                mode: "lines", 
                line: {
                    color: markerColor
                }
            };
            let chartData = [trace1];
            let layout = {
                title: `Average Values of ${roomNumber} Homes for ${plotlyName}`,
                xaxis: {
                title: "Date"
                },
                yaxis: {
                    title: "Average Home Value"
                },
                margin: {
                    b: 100
                }
        
            };
            Plotly.newPlot("line", chartData, layout)
        });

    //Sort our city dictionaries based on name
    cityDicts = cityDicts.sort(function(a,b){
        if (a.name<b.name){
            return -1;
        }
        else if (a.name > b.name){
            return 1;
        }
        else {return 0};
    });


        //For the cities we kept, find the home value data
        for (let i=0; i < cityDicts.length; i++) {
            region_id = cityDicts[i].id
            if (cityDicts[i].name != searchedLocation){
                let option =d3.select("#selDataset2").append("option");
                option.text(cityDicts[i].name)
            };
            url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
            sales_data = d3.json(url).then(function (data){
                data.reverse()

                //Again, catch any cities for which we do not have data
                try{
                    markerColor = getColor(data[1].value)
                    housingPrices = data[1].value
                    let newMarker = L.circleMarker([cityDicts[i].coords.lat,cityDicts[i].coords.lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                    newMarker.addTo(markerGroup);
                    newMarker.bindPopup("<h2>"+cityDicts[i].name+`</h2> <p> Average Home Value (${roomNumber}BR): $`+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
                } catch (TypeError){
                    console.log("No data found for this region")
                }
        });


        };
    //Pan our map to our newly searched city (if we can), store these coordinates in case of error in a future search
    my_map.setView([myCoordinates[0], myCoordinates[1]], 10);
    backupCoords = myCoordinates

    });
};  
    




//Create drop-down menu options
houseSizes = ["1", "2", "3", "4", "5+"]
for (let i = 0; i < houseSizes.length; i++){
    let option =d3.select("#selDataset").append("option");
    option.text(houseSizes[i])
};

//Get a reference to the drop-down menu for selections
d3.selectAll("#selDataset").on("change", updateLeaflet);
d3.selectAll("#selDataset2").on("change", updatePlotly);

//Define what should happen when a selection on the drop-down is made
function updateLeaflet() {
    let dropdown = d3.select("#selDataset");
    roomNumber = dropdown.property("value");



    //Remove the previous set of markers.
    markerGroup.clearLayers()

    //Match the selection to the appropriate indicator
    if (roomNumber == "1"){
        indicator_id = "Z1BR"
    }
    else if (roomNumber == "2"){
        indicator_id = "Z2BR"
    }
    else if (roomNumber == "3"){
        indicator_id = "Z3BR"
    }
    else if (roomNumber == "4"){
        indicator_id = "Z4BR"
    }
    else if (roomNumber == "5+"){
        indicator_id = "Z5BR"
    };

    // Fetch the new data for the desired number of rooms
    cities = d3.json(cityData).then(function(data){
        cityDicts = []
    
        //Select only cities within the desired distance
        for (i=0; i < data.length; i++){
            point = data[i]
            lat = point.coordinates[0]
            lon = point.coordinates[1]
            if (lat > (myCoordinates[0] - 0.4) && lat < (myCoordinates[0] + 0.4) && lon > (myCoordinates[1] - 0.4) && lon < (myCoordinates[1] + 0.4)){
                cityDicts.push({"name":point.name, "id":point.id, "coords":{"lat":lat, "lon":lon}})
            };
            
        };  
        
        //Fetch the value data for the cities selected
        for (let i=0; i < cityDicts.length; i++) {
            region_id = cityDicts[i].id
            url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
            sales_data = d3.json(url).then(function (data){
                data.reverse()
                try{
                    markerColor = getColor(data[1].value)
                    housingPrices = data[1].value
                    let newMarker = L.circleMarker([cityDicts[i].coords.lat,cityDicts[i].coords.lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                    newMarker.addTo(markerGroup);
                    newMarker.bindPopup("<h2>"+cityDicts[i].name+`</h2> <p> Average Home Value (${roomNumber} BR): $`+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
                } catch (TypeError){
                    console.log("No data found for this region")
                }
        });
        
        };
    });  

    //Also update Plotly since the bedroom number has changed
    updatePlotly();
};

//Create a function to update Plotly when the dropdown option is selected
function updatePlotly() {
    let dropdown = d3.select("#selDataset2");
    let city = dropdown.property("value");
    plotlyName = city

    for (i = 0; i < cityDicts.length;i++){
        if (cityDicts[i].name == city){
            region_id = cityDicts[i].id;
        };
    }

    searchURL = url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
    
            //Create a line plot for the selected city
            d3.json(searchURL).then(function (data){
                city_Z1BR[data.region_id]={};
                city_Z1BR[data.region_id]["date"]=[];
                city_Z1BR[data.region_id]["value"]=[];
                for (let j = 0; j < data.length; j++){
                    city_Z1BR[data.region_id]["value"].push(data[j].value);
                    var dateObject = new Date(data[j].date);
                    var month = String(dateObject.getUTCMonth()+1).padStart(2,"0");
                    var year = dateObject.getUTCFullYear();
                    var formattedDate = `${month}-${year}`;
                    city_Z1BR[data.region_id]["date"].push(formattedDate);
                };
                markerColor = getColor(city_Z1BR[data.region_id]["value"][city_Z1BR[data.region_id]["value"].length-1])
                trace1 = {
                    x: city_Z1BR[data.region_id]["date"],
                    y: city_Z1BR[data.region_id]["value"], 
                    mode: "lines", 
                    line: {
                        color: markerColor
                    }
                };
                let chartData = [trace1];
                let layout = {
                    title: `Average Values of ${roomNumber} Bedroom Homes for ${plotlyName}`,
                    xaxis: {
                    title: "Date"
                    },
                    yaxis: {
                        title: "Average Home Value"
                    },
                    margin: {
                        b: 100
                    }
            
                };
                Plotly.newPlot("line", chartData, layout)
            });
};

//Create a legend
let info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(my_map)

//Fill in the legend with the color bar and values
document.querySelector(".legend").innerHTML = [
    "<h3 style = 'font-size: 12pt'> Average Home Value</h3>",
    "<div class = 'legend-content'>",
    "<div class='color-bar-scale'></div>",
    "<div class = 'labels-container'>",
    "<span class='label'>$5,000</span>",
    "<span class='label'>$502,500</span>",
    "<span class='label'>$1,000,000+</span></div></div>"
  ].join(" ")