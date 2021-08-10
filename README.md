# leaflet-challenge

Visualizing Data with Leaflet

The USGS provides earthquake data in a number of different formats, updated every 5 minutes. 

 We can pick a data set to visualize the USGS GeoJSON Feed page (https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php). When click on a data set, for example "All Earthquakes from the Past 7 Days", we will be given a JSON representation of that data. We will use the URL of this JSON to pull in the data for our visualization.

Step 1: 

We will b creating a map using Leaflet that plots all of the earthquakes from your data set based on their longitude and latitude.

Our data markers should reflect the magnitude of the earthquake by their size and and depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger and earthquakes with greater depth should appear darker in color. The depth of the earth can be found as the third coordinate for each earthquake.

Include popups that provide additional information about the earthquake when a marker is clicked.

. Create a legend that will provide context for your map data.

Our visualization should look something like the map above.

Step 2:

The USGS wants us to plot a second data set on our map to illustrate the relationship between tectonic plates and seismic activity. We will need to pull in a second data set and visualize it alongside your original set of data. Data on tectonic plates can be found at https://github.com/fraxen/tectonicplates.

In this step, we will:

. Plot a second data set on our map.

. Add a number of base maps to choose from as well as separate out our two different data sets into overlays that can be turned on and off independently.

. Add layer controls to our map.
