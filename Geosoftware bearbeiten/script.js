/**
 * Lösung zur Aufgabe 4, Geosoft 1, SoSe 2022
 * @author {Maximilian Elfers} matr.Nr.: {515622}
 */

//declaration of global variables
var meinStandort;
let distanceArray = [];
let distanceArrayShort = [];
let bushalteStellen;
let abfahrten;
let aktBushalte;
let meinStandortMarker;
let allBushalte = [];

//list of all EventListeners
document.getElementById("ReturnButton").addEventListener("click", function(){window.location.reload()});
document.getElementById("ReturnButton2").addEventListener("click", function(){window.location.reload()});
document.getElementById("YourLocation").addEventListener("click",function(){getLocation()});
document.getElementById("SubmitButton").addEventListener("click",function(){loadBushalteStellenPromises(); displayStandortMap(); hide("SubmitButton"); show("GoButtonDiv"); hide("InputDiv"), show("ReturnButton2"); show("ZoomDiv")});
document.getElementById("GoButton").addEventListener("click",function(){distance(); displayAllBushalte(); hide("GoButtonDiv"); show("ReturnButton"); hide("ReturnButton2")});
document.getElementById("ZoomButton").addEventListener("click", function(){showMeinStandort(); hide("ZoomDiv"); show("DefaultDiv")})
document.getElementById("DefaultButton").addEventListener("click", function(){showDefault(); show("ZoomDiv"); hide("DefaultDiv")});

/**
 * Is the function to calculate all distances between a given bushalte Stellen 
 * and a given standort class
 */

function distance(){
    for(var i = 0; i < bushalteStellen.features.length; i++){
        aktBushalte = new Bushalte(bushalteStellen.features[i].properties.richtung, bushalteStellen.features[i].properties.lbez, bushalteStellen.features[i].geometry.coordinates[0], bushalteStellen.features[i].geometry.coordinates[1], bushalteStellen.features[i].properties.nr);
        var write = distanceCalculation(aktBushalte, meinStandort);
        distanceArray[i] = {
            distance: write,
            name: aktBushalte.lbez,
            richtung: aktBushalte.richtung,
            nr: aktBushalte.nr
        }
    }

    distanceArray.sort(function(a, b){return a.distance - b.distance}); // sorting the array

    // this is only for visualisation purposes 
    for(var i = 0; i < distanceArray.length; i++){
        distanceArray[i] = "<br><br>" + distanceArray[i].distance + " Meter: " + distanceArray[i].name + " (" + distanceArray[i].richtung + ")" + " (" + distanceArray[i].nr + ")";
    }
}

/**
 * Calculates the distances between a given bushalte class and a given standort class
 * @param {class} bushalte - class of bushalte stellen 
 * @param {class} standort - class of a standort
 * @returns {number} Distance in metres 
 */
 function distanceCalculation(bushalte, standort){
    let R = 6371e3; // mean radius of the earth
    const lat1 = standort.lat * Math.PI/180; // is constant because we only compare with one point
    let lat2 = bushalte.lat * Math.PI/180; 
    let latRechner = (bushalte.lat - standort.lat) * Math.PI/180;
    let lonRechner = (bushalte.long - standort.long) * Math.PI/180;

    let a = Math.sin(latRechner/2) * Math.sin(latRechner/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(lonRechner/2) * Math.sin(lonRechner/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c;
    
    return d; // returns the distance in metres
}

/**
 * Displayes the complete version of the Array of the stops
 */
let displayKomplett = () => document.getElementById('content').innerHTML = distanceArray;

/**
 * Hides the given Element (only for design purpose)
 * @param {string} button - The button, that should ne hidden
 */
let hide = (button) => document.getElementById(button).style.display = "none";

/**
 * Shows the given Element (only for design purpose)
 * @param {string} button - The button, that should be shown
 */
let show = (button) => document.getElementById(button).style.display = "block";

/**
 * Gets the geolocation of the device the website is used on
 */
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        document.getElementById("InputButton").value = "Geolocation is not supported by this browser.";
    }
}

/**
 * Takes the longitude and latitude of the device and builds an JSON document with them
 * @param {any} position
 */
function showPosition(position) {
    meinStandort = new Standort("Mein Standort", position.coords.longitude, position.coords.latitude);
    document.getElementById("InputButton").value = "Mein Standort";
}

/**
 * Creates an fetch to get the "haltestellen"
 */
function loadBushalteStellenPromises(){
fetch("https://rest.busradar.conterra.de/prod/haltestellen")
    .then(response => {
        let res = response.json() // return a Promise as a result
        res.then(data => { // get the data in the promise result
            bushalteStellen = data;
        })
    })
    .catch(error => console.log(error))
}
/**
 * Class Standort to create a objects which describes 
 * a Standort 
 */
class Standort{
    /**
     * Constructor for the standort class
     * @class 
     * @param {string} bez - the desciption 
     * @param {number} long - longitude
     * @param {number} lat - latitude
     */
    constructor(bez, long, lat)
    {
        this.bez = bez;
        this.long = long;
        this.lat = lat;
    }
    /**
     * get-Methode for the long and lat attribut
     * @returns coor - are coordiantes in longitude and latitude
     */
    getCoordinatesStan()
    {
        var coor = this.long + "," + this.lat;
        return coor;
    }
}

/**
 * Class Bushalte to create a objects which describes 
 * a bushaltestelle
 */
class Bushalte{
    /**
     * Constructor for the bushalte class
     * @class 
     * @param {string} richtung - the direction
     * @param {string} lbez - name of the stop 
     * @param {number} long - longitude
     * @param {number} lat - latitude
     */
    constructor(richtung, lbez, long, lat, nr)
    {
        this.richtung = richtung;
        this.lbez = lbez;
        this.long = long;
        this.lat = lat; 
        this.nr = nr;
    }
    /**
     * get-Methode for the long and lat attribut
     * @returns coor - are coordiantes in longitude and latitude
     */
    getCoordinatesBus()
    {
        var coor = this.long + "," + this.lat;
        return coor;
    }
}

// sets a new title for the Website
document.title = "Geosoftware Maxi Elfers";

// setting up and working with the map
var map = L.map('map').setView([51.96, 7.63], 12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var greenIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);
var drawControl = new L.Control.Draw({
    draw: {
        circlemarker: false,
        marker: false,
        circle: false,
        polyline: false,
        polygon: false,
    },
    edit: {
        featureGroup: drawnItems,
        remove: false,
        edit: false
    }
});
map.addControl(drawControl);

/**
 * handles the draw event for a rectangle to show only the marker, 
 * that are inside the polygon
 */
map.on(L.Draw.Event.CREATED, function (e) {
    for(var i = 0; i < allBushalte.length; i++){
        allBushalte[i].remove();
        var pt = turf.point([allBushalte[i]._latlng.lat, allBushalte[i]._latlng.lng]);
        var poly = turf.polygon([[
            [e.layer._latlngs[0][0].lat, e.layer._latlngs[0][0].lng],
            [e.layer._latlngs[0][1].lat, e.layer._latlngs[0][1].lng],
            [e.layer._latlngs[0][2].lat, e.layer._latlngs[0][2].lng],
            [e.layer._latlngs[0][3].lat, e.layer._latlngs[0][3].lng],
            [e.layer._latlngs[0][0].lat, e.layer._latlngs[0][0].lng]
        ]]);
        if(turf.booleanPointInPolygon(pt, poly)){
            allBushalte[i].addTo(map);
        }
    }
 });

/**
 * Displays the user location on the map
 */
function displayStandortMap(){
    meinStandortMarker = new L.marker([meinStandort.lat, meinStandort.long], {icon: greenIcon});
    meinStandortMarker.addTo(map);
    meinStandortMarker.bindPopup('Hier bist du!');
    meinStandortMarker.openPopup();
}

/**
 * Zooms on the user location
 */
function showMeinStandort(){
    meinStandortMarker.openPopup();
    map.flyTo([meinStandort.lat, meinStandort.long], 16);
}

/**
 * Zooms to the default view
 */
function showDefault(){
    meinStandortMarker.openPopup();
    map.flyTo([51.96, 7.63], 12);
}

/**
 * Displays all stops on the map and saves the marker in an Array
 */
function displayAllBushalte(){
    for(var i = 0; i < bushalteStellen.features.length; i++){
        aktBushalte = new Bushalte(bushalteStellen.features[i].properties.richtung, bushalteStellen.features[i].properties.lbez, bushalteStellen.features[i].geometry.coordinates[0], bushalteStellen.features[i].geometry.coordinates[1], bushalteStellen.features[i].properties.nr);
        var distance = distanceCalculation(aktBushalte, meinStandort);
        var marker = new L.marker([bushalteStellen.features[i].geometry.coordinates[1], bushalteStellen.features[i].geometry.coordinates[0]])
            .bindPopup(bushalteStellen.features[i].properties.lbez + "<br>" + "Entfernung zum Standort: " + distance + " Meter")
            .openPopup()
        allBushalte[i] = marker;
        marker.addTo(map);
    }
}

