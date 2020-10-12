// Get the link of the geojson dataset of earthquakes happened in the past 7 days
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Read the data from the geoJson file
d3.json(queryUrl, function (data) {

    // Define the initial map object
    var myMap = L.map("map-id", {
        center: [37.09, -95.71],
        zoom: 5
    });

    // Adding street tile layer as the base map layer
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
    }).addTo(myMap);

    // Create new pointers for the clustered markers
    var markers = new L.MarkerClusterGroup();

    // Get the locations where the earthquakes happened
    var location = data.features;

    // Add each of the locations to the markers layer
    for (i=0; i<location.length; i++ ){
        console.log(location[i])      
        if (location[i].geometry.type == "Point") {  
            // console.log(`loc---  ${location[i].geometry.coordinates[1]}  ${location[i].geometry.coordinates[0]}   `);      
            markers.addLayer(L.marker([location[i].geometry.coordinates[1], location[i].geometry.coordinates[0]]));
        }
    }
    console.log(markers)
    // Add the markers to the map.
    myMap.addLayer(markers);    
})
