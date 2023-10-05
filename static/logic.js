cityData = "http://127.0.0.1:5000/api/v1.0/city_data";

var region_id = "9999";
var indicator_id = "Z1BR" ;
var roomNumber = "1"
var searchedLocation = "New York, NY"
var myCoordinates = [40.73, -74.0059]

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

L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(my_map);




//Define a function that will get us a color value for our marker
function getColor(value) {
    return chroma.scale(['violet', 'blue', 'teal','green', 'lightgreen','yellow', 'orange', 'red']).domain([5000, 1000000])(value).hex();
}


let search = {"lat":40.73, "lon":-74.0059};
let cityMarkers = [];
let cityIDs = [];
let cityCoords = [];
let cityNames = [];


cities = d3.json(cityData).then(function(data){
    for (i=0; i < data.length; i++){
        point = data[i]
        lat = point.coordinates[0]
        lon = point.coordinates[1]
        if (lat > (search.lat - 0.4) && lat < (search.lat + 0.4) && lon > (search.lon - 0.4) && lon < (search.lon + 0.4)){
        cityIDs.push(point.id)
        cityCoords.push({"lat":lat, "lon":lon});
        cityNames.push(point.name)
        };
    };   

    for (let i=0; i < cityIDs.length; i++) {
        region_id = cityIDs[i]
        url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/Z1BR`
        sales_data = d3.json(url).then(function (data){
            data.reverse()
            try{
                markerColor = getColor(data[1].value)
                housingPrices = data[1].value
                let newMarker = L.circleMarker([cityCoords[i].lat,cityCoords[i].lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                newMarker.addTo(markerGroup);
                newMarker.bindPopup("<h2>"+cityNames[i]+"</h2> <p> Average Home Value (1 BR): $"+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
            } catch (TypeError){
                console.log("No data found for this region")
            }
        });
    };
});









function searchLocation() {
    d3.select(".error-message").text("")
    let dropdown = d3.select("#selDataset");
    let roomNumber = dropdown.property("value");

    var city = d3.select("#cityInput").property("value")
    var state = d3.select("#stateInput").property("value")
    searchedLocation = `${city}, ${state}`
    myCoordinates = []
    coordinateSearch = `http://127.0.0.1:5000/api/v1.0/data/coordinates/${searchedLocation}`
    d3.json(coordinateSearch).then(function(data){
        console.log(data)
        if (data.length > 0){
            myCoordinates.push(data[0].lat);
            myCoordinates.push(data[0].lon);
        } else {
            d3.select(".error-message").text("Sorry, we don't have any data about that city. Please try again.")
        };
    });


    
    cities = d3.json(cityData).then(function(data){
        cityIDs = [];
        cityCoords = [];
        cityNames = [];
    
        for (i=0; i < data.length; i++){
            point = data[i]
            lat = point.coordinates[0]
            lon = point.coordinates[1]
            if (lat > (myCoordinates[0] - 0.4) && lat < (myCoordinates[0] + 0.4) && lon > (myCoordinates[1] - 0.4) && lon < (myCoordinates[1] + 0.4)){
            cityIDs.push(point.id)
            cityCoords.push({"lat":lat, "lon":lon});
            cityNames.push(point.name)
            };
        };  
        
        for (let i=0; i < cityIDs.length; i++) {
            region_id = cityIDs[i]
            url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
            sales_data = d3.json(url).then(function (data){
                data.reverse()
                try{
                    markerColor = getColor(data[1].value)
                    housingPrices = data[1].value
                    let newMarker = L.circleMarker([cityCoords[i].lat,cityCoords[i].lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                    newMarker.addTo(markerGroup);
                    newMarker.bindPopup("<h2>"+cityNames[i]+`</h2> <p> Average Home Value (${roomNumber}BR): $`+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
                } catch (TypeError){
                    console.log("No data found for this region")
                }
        });


        };
    
    my_map.setView([myCoordinates[0], myCoordinates[1]], 10);

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


//Define what should happen when a selection on the drop-down is made
function updateLeaflet() {
    let dropdown = d3.select("#selDataset");
    let roomNumber = dropdown.property("value");

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


    cities = d3.json(cityData).then(function(data){
        cityIDs = [];
        cityCoords = [];
        cityNames = [];
    
        for (i=0; i < data.length; i++){
            point = data[i]
            lat = point.coordinates[0]
            lon = point.coordinates[1]
            if (lat > (myCoordinates[0] - 0.4) && lat < (myCoordinates[0] + 0.4) && lon > (myCoordinates[1] - 0.4) && lon < (myCoordinates[1] + 0.4)){
            cityIDs.push(point.id)
            cityCoords.push({"lat":lat, "lon":lon});
            cityNames.push(point.name)
            };
            
        };  

        console.log(cityCoords)
        
        for (let i=0; i < cityIDs.length; i++) {
            region_id = cityIDs[i]
            url = `http://127.0.0.1:5000/api/v1.0/data_by/${region_id}/${indicator_id}`
            sales_data = d3.json(url).then(function (data){
                data.reverse()
                try{
                    markerColor = getColor(data[1].value)
                    housingPrices = data[1].value
                    let newMarker = L.circleMarker([cityCoords[i].lat,cityCoords[i].lon], {color : markerColor, fillOpacity:0.8, opacity: 0});
                    newMarker.addTo(markerGroup);
                    newMarker.bindPopup("<h2>"+cityNames[i]+`</h2> <p> Average Home Value (${roomNumber} BR): $`+Math.round(data[1].value) +"<br> Last Updated: "+data[1].date+"</p>");
                } catch (TypeError){
                    console.log("No data found for this region")
                }
        });
        
        };
    });  
    
};

let info = L.control({
    position: "bottomright"
});

info.onAdd = function() {
    let div = L.DomUtil.create("div", "legend");
    return div;
};

info.addTo(my_map)

document.querySelector(".legend").innerHTML = [
    "<h3 style = 'font-size: 12pt'> Average Home Value</h3>",
    "<div class = 'legend-content'>",
    "<div class='color-bar-scale'></div>",
    "<div class = 'labels-container'>",
    "<span class='label'>$5,000</span>",
    "<span class='label'>$502,500</span>",
    "<span class='label'>$1,000,000+</span></div></div>"
  ].join(" ")