// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Retrieve the data from the geoJson file  (Perform a GET request to the query URL)
d3.json(queryUrl, function (data) {
    // Once we get a response, send the data.features object to the createFeatures function
    console.log(data);
    createFeatures(data.features);
});

// Choose a color based on the depth of the earthquake
function getColor(d) {
    return d > 90 ? '#fb2511' :
            d > 70 ? '#f5611dd0' :
            d > 50 ? '#fab566' :
            d > 30 ? '#ecd708' :
            d > 10 ? '#ffff00f8' :
                    '#7cfc00';
}

function createFeatures(featuresData) {
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3> ${feature.properties.place} </h3> <hr> 
                        <h4> Time:  ${new Date(feature.properties.time)} </h4>
                        <h4>  Magnitude:   ${feature.properties.mag}
                        </h4> <h4>  Depth:   ${feature.geometry.coordinates[2]} </h4>`);
    }

    // Show the circle marksers at the coordinates where earthquakes affected
    function showCircles(feature, latlng) {
        console.log(feature.geometry.coordinates[2]);
        return new L.CircleMarker(latlng, {
            radius: feature.properties.mag * 3,
            stroke: true,
            weight: 0.5,
            color: "#121312d0",
            fillColor: getColor(feature.geometry.coordinates[2]),
            fillOpacity: 0.85
        });
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(featuresData, {
        onEachFeature: onEachFeature,
        pointToLayer: showCircles
    });
    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

// Function to create a map with the different base layers and two different datasets (earthquake and tectonic plates)
function createMap(earthquakes) {
    // Define streetmap layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    });

    // Define Greyscale/Light Base Layer
    var greyscalemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "light-v10",
        accessToken: API_KEY
    });

    // Define Outdoor Base Layer
    var outdoormap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "outdoors-v11",
        accessToken: API_KEY
    });

    // Define Statllite Base Layer
    var satellitemap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-v9",
        accessToken: API_KEY
    });

    var MtbMap = L.tileLayer('http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &amp; USGS'
    });

    var queryUrl_1 = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
    var plates = new L.LayerGroup()
    d3.json(queryUrl_1, function (data) {
        console.log(data);
        L.geoJSON(data, {
            color: "#e34a33",
            weight: 2
        }).addTo(plates);
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Satellite": satellitemap,
        "Street Map": streetmap,
        "Outdoors": outdoormap,
        "Grayscale": greyscalemap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes, plates
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map-id", {
        center: [37.09, -95.71],
        zoom: 5,
        layers: [streetmap, earthquakes]
    });

    // Create a layer control,  Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    // ===============  Legend  ====================================================================
    // Define the legend element
    var legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (map) {
        div = L.DomUtil.create('div', 'info legend'),
            depthrange = [-10, 10, 30, 50, 70, 90]

        // loop through te depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(depthrange[i] + 1) + '"></i> ' +
                depthrange[i] + (depthrange[i + 1] ? '&ndash;' + depthrange[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
    //===============================================================================================
}