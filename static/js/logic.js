// Store API endpoint as a query url
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(queryUrl).then(function (data) {
  createFeatures(data.features);
});

  
function createMap(earthquakes) {
  
    // Create the tile layer that will be the background of our map.
    let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });


    // Create a baseMaps object to hold the streetmap layer.
    let baseMaps = {
      "Street Map": streetmap
    };

    // Create an overlayMaps object to hold the bikeStations layer.
    let overlayMaps = {
      "Earthquakes": earthquakes
    };

    // Create the map object with options.
    let map = L.map("map", {
      center: [40.73, -74.0059],
      zoom: 5,
      layers: [streetmap, earthquakes]
    });

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map); 

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 50, 70, 90],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
};

legend.addTo(map);
}

function createFeatures(response) {

  function createMarkers(feature, layer) {
    // console.log(feature);
    layer.bindPopup("<h3> Magnitude: " + feature.properties.mag + "</h3><hr><h3> Location: " + feature.properties.place + "</h3><hr><h3> Depth: " + feature.geometry.coordinates[2] + "</h3>");
  }

  let earthquakes = L.geoJson(response, {
    style: function(feature) {
      console.log(feature);
        return {
        	color: getColor(feature.geometry.coordinates[2]),
          weight: 1.5,
          radius: feature.properties.mag * 5,
        	fillOpacity: 0.50
        };
    },
    pointToLayer: function(feature, latlng) {
        return new L.CircleMarker(latlng, {
        });
    },
    onEachFeature: createMarkers
});

  createMap(earthquakes);

}

function getColor(d) {
  return d > 90 ? '#800026' :
         d > 70  ? '#FC4E2A' :
         d > 50   ? '#FD8D3C' :
         d > 30   ? '#FEB24C' :
         d > 10   ? '#FED976' :
                    '#33cc33';
}