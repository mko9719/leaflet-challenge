url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
api_key = "pk.eyJ1IjoibW9sbHk5NzE5IiwiYSI6ImNrZ2U4c292eTE4a2gydG1pYTR2M21lNGEifQ.blkrzS0Fa1polPqHhzdx3A"

//Create grey map
var grey_map_scale = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 20,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: api_key});
var satelite_map = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 20,
    zoomOffset: -1,
    id: "mapbox/satellite-v9",
    accessToken: api_key});
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    mapZoom: 20,
    zoomOffset: -1,
    id: "mapbox/outdoors-v11",
    accessToken: api_key});
var myMap = L.map("map", {
    center: [42.99,-97.4], 
    zoom: 2,
    layers: [grey_map_scale, satelite_map, outdoors]
});
grey_map_scale.addTo(myMap);

//Base Map
var baseMaps = {
    GreyMap: grey_map_scale,
    Satellite: satelite_map,
    Outdoor: outdoors
};
// Overlays Maps
var techtonicplates = new L.LayerGroup();
var earthquakes_data = new L.LayerGroup();
var Overlays = {
    "Techtonic Plates": techtonicplates,
    "Earthquakes": earthquakes_data
};

//Add Control Layer
L.control.layers(baseMaps, Overlays).addTo(myMap);
d3.json(url, function(geo_data){
    function Circle(feature){
    return {fillOpacity: 0.5, 
    opacity: 0.8,
    color: "black",
    stroke: true,
    fillColor: fillcolor(feature.geometry.coordinates[2]),
    radius: findRadius(feature.properties.mag),
    weight: 0.9
    }
    }
        function fillcolor(depth)
        {
        if (depth > 90) return "slategrey";
        else if (depth >70) return "wheat";
        else if (depth >50) return "darktan";
        else if (depth >30) return "orange";
        else if (depth >10) return "red";
        else return "darkred";
        }
    function findRadius (magnitude){
        if (magnitude == 0) return 1;
        else return magnitude*4;
        }
    L.geoJson(geo_data, {
        pointToLayer: function(feature, latlong){
            return L.circleMarker(latlong);
        },
        style: Circle,
        onEachFeature: function(feature, layer){
            layer.bindPopup("Location"+feature.properties.place+"<br>"+"Magnitude"+feature.properties.mag+"<br>"+"Date"+new Date(feature.properties.time))
        }
    }) .addTo(earthquakes_data);
    earthquakes_data.addTo(myMap);
    plates_url = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
    d3.json(plates_url, function(techtonicData){
        L.geoJson(techtonicData, {
            color: "blue",
            weight: 1
        }).addTo(techtonicplates)
        techtonicplates.addTo(myMap);
    });
    var Legend = L.control({postion: "bottomleft"});

    // Adding Legend Details
    Legend.onAdd = function(){
        var div = L.DomUtil.create("div", "info legend");
        var depth = [-10,10,30,50,70,90];
        var colors = ["lightgreen","greenyellow","yellow","orange","red","darkred"];
        for (var i=0; i<depth.length; i++)
        {  div.innerHTML += "<i style='background:" + colors[i] + "'></i>" + 
            depth[i] + (depth[i+1] ? "&ndash;" + depth[i+1] + "<br>": "+");
        }
        return div;
    };
    Legend.addTo(myMap);


});


