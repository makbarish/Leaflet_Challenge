(async function () {

  var queryUrl_earthquake = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

   // Perform a GET request to the query URL
  d3.json(queryUrl_earthquake, function (data) {
    createFeatures(data.features);
    console.log(data.features)
  });

  function createFeatures(earthquakeData) {

    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Define function to create the circle radius based on the magnitude
    function radiusSize(magnitude) {
      return magnitude * 20000;
    }

    // Define function to set the circle color based on the magnitude
    function circleColor(magnitude) {
      if (magnitude < 1) {
        return "#ccff33"
      }
      else if (magnitude < 2) {
        return "#ffff33"
      }
      else if (magnitude < 3) {
        return "#ffcc33"
      }
      else if (magnitude < 4) {
        return "#ff9933"
      }
      else if (magnitude < 5) {
        return "#ff6633"
      }
      else {
        return "#ff3333"
      }
    }

    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(earthquakeData, {
      pointToLayer: function (earthquakeData, latlng) {
        return L.circle(latlng, {
          radius: radiusSize(earthquakeData.properties.mag),
          color: circleColor(earthquakeData.properties.mag),
          fillOpacity: 1
        });
      },
      onEachFeature: onEachFeature
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
  }

  function createMap(earthquakes) {

    var Satellite = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
    });
    
    var Grayscale = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })

    var topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });

    // Create the tectonic palte layer
    var tectonic_plates = new L.LayerGroup();

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
      "Satellite": Satellite,
      "Grayscale": Grayscale,
      "Topographic": topo
      
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
      "Tectonic Plates": tectonic_plates,
      "Earthquakes": earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
      center: [
        37.09, -95.71
      ],
      zoom: 4,
      layers: [Satellite, earthquakes, tectonic_plates]
    });

    // Create a layer control, pass in our baseMaps and overlayMaps, and add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);

    // Query to retrieve the tectonic plates data
    var queryUrl_tectonic = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json";
    // Create the tectonic paltes and add them to the tectonic paltes layer
    d3.json(queryUrl_tectonic, function (data) {
      L.geoJSON(data, {
        style: function () {
          return { color: "red", fillOpacity: 100 }
        }
      }).addTo(tectonic_plates)
    })

    // color function to be used when creating the legend
    function getColor(d) {
      return d > 5 ? '#ff3333' :
        d > 4 ? '#ff6633' :
          d > 3 ? '#ff9933' :
            d > 2 ? '#ffcc33' :
              d > 1 ? '#ffff33' :
                '#ccff33';
    }

    // Add legend to the map
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

      var div = L.DomUtil.create('div', 'info legend'),
        mags = [0, 1, 2, 3, 4, 5],
        labels = [];

      // loop through our density intervals and generate a label with a colored for each interval
      for (var i = 0; i < mags.length; i++) {
        div.innerHTML +=
          '<i style="background:' + getColor(mags[i] + 1) + '"></i> ' +
          mags[i] + (mags[i + 1] ? '&ndash;' + mags[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(myMap);
  }
})();