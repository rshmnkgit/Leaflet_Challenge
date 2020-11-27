# Earthquake Data Visualization

The USGS is responsible for providing scientific data about natural hazards, the health of our ecosystems and environment; and the impacts of climate and land-use change. Their scientists develop new methods and tools to supply timely, relevant, and useful information about the Earth and its processes.

## Objective
To visualize the earthquake data which can be used to better educate the public and other government organizations (and hopefully secure more funding..) on issues facing our planet.

## Leaflet Step 1
#### Data Source
'All Earthquakes from the Past 7 Days' from the USGS GeoJSON Feed page.

#### Visualization 
- A map using Leaflet that plots all of the earthquakes from the data set based on their longitude and latitude. 
- The data markers reflect the magnitude of the earthquake by their size and and depth of the earth quake by color. 
- Earthquakes with higher magnitudes appear larger and earthquakes with greater depth appear darker incolor.

## Leaflet Step 2
#### Data Source
Data on tectonic plates from the page https://github.com/fraxen/tectonicplates

#### Visualization 
- Added a number of base maps to choose from as well as separate out the two different data sets into overlays that can be turned on and off independently.
- Added layer controls to the map.


## To run the program:
- Download the files to the local folder.
- Provide the Mapbox API KEY in the config file.

#### Sequence
1.  Open the index file in Leaflet Step 1 with the live server

2.  Leaflet Step 2
    
- Open the index file with live server to display the multilayer map which plots the earthqauke information and the tectonic plates.
- Open the index file with cluster.js plugged in. This displayes the earthquake locations as clustered markers.
- Open the index file with heatmap.js plugged in. This displayes the earthquake location and intensity heatmap.

