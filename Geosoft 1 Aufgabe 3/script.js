/**
 * Lösung zur Aufgabe 2, Geosoft 1, SoSe 2022
 * @author {Maximilian Elfers} matr.Nr.: {515622}
 */

//declaration of global variables
var meinStandort;
let distanceArray = [];
let distanceArrayShort = [];
let bushalteStellen;
let abfahrten;
let aktBushalte;

//list of all EventListeners
document.getElementById("ReturnButton").addEventListener("click", function(){window.location.reload()});
document.getElementById("ReturnButton2").addEventListener("click", function(){window.location.reload()});
document.getElementById("YourLocation").addEventListener("click",function(){getLocation()});
document.getElementById("SubmitButton").addEventListener("click",function(){loadBushalteStellen(); hide("SubmitButton"); show("GoButtonDiv"); hide("InputDiv"), show("ReturnButton2")});
document.getElementById("GoButton").addEventListener("click",function(){distance(); displayShort(); hide("GoButtonDiv"); show("ReturnButton"); show("ReturnButton2"); show("AbfahrtenDiv"), loadAbfahrten(), show("KompletteDiv")});
document.getElementById("AbfahrtenButton").addEventListener("click", function(){displayAbfahrten(), show("AbfahrtenText")})
document.getElementById("KomplettButton").addEventListener("click", function(){displayKomplett()})

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
    console.log(c);
    let d = R * c;
    
    return d; // returns the distance in metres
}

/**
 * Displayes the abfahrten from the API on the website
 */
 function displayAbfahrten(){
    var abfahrtenArray = [];
    for(var i = 0; i < abfahrten.length; i++){
        abfahrtenArray[i] = "Linie " + abfahrten[i].linienid + " Richtung: " + abfahrten[i].richtungstext + " In: " + abfahrten[i].abfahrtszeit + "<br><br>";
    }
    document.getElementById("AbfahrtenAusgabe").innerHTML = abfahrtenArray;
}

/**
 * Displayes the short version (10 stops) of the Array of the stops
 */
function displayShort(){
    for (var i = 0; i < 10; i++){
        distanceArrayShort[i] = distanceArray[i];
    }

    // writing the distances in the correct order on the web page
    document.getElementById('content').innerHTML = distanceArrayShort;
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
 * Creates an XHR to get the "haltestellen"
 */
function loadBushalteStellen(){
    var bhs = new XMLHttpRequest();
    bhs.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen", true);
    function statechangecallback() {
        if (bhs.status == "200" && bhs.readyState == 4) {
            bushalteStellen = bhs.responseText;
        }
    }    
    function loadcallback(){
        if (bhs.status == "200" && bhs.readyState == 4){
            bushalteStellen = JSON.parse(bushalteStellen);
        }
    }    
    function errorcallback(){
        if (bhs.status == "404" || bhs.status == "403" || bhs.readyState == 0){
            console.log(bhs.status)
        }
    }

    bhs.onload = loadcallback;
    bhs.onerror = errorcallback;
    bhs.onreadystatechange = statechangecallback;
    bhs.send();
}

/**
 * Creates an XHR to get the "haltestellen abfahrten" for a specific 
 * haltestelle
 */
 function loadAbfahrten(){
    var ab = new XMLHttpRequest();
    function statechangecallback() {
        if (ab.status == "200" && ab.readyState == 4) {
            abfahrten = ab.responseText;
        }
    }
    function loadcallback(){
        if (ab.status == "200" && ab.readyState == 4){
            abfahrten = JSON.parse(abfahrten);
        }
    }    
    function errorcallback(){
        if (ab.status == "404" || ab.status == "403" || ab.readyState == 0){
            console.log(ab.status)
        }
    }

    ab.onload = loadcallback;
    ab.onerror = errorcallback;
    ab.onreadystatechange = statechangecallback;
    ab.open("GET", "https://rest.busradar.conterra.de/prod/haltestellen/" + distanceArray[0][distanceArray[0].length-8] + distanceArray[0][distanceArray[0].length-7] + 
                distanceArray[0][distanceArray[0].length-6] + distanceArray[0][distanceArray[0].length-5] + distanceArray[0][distanceArray[0].length-4] + 
                distanceArray[0][distanceArray[0].length-3] + distanceArray[0][distanceArray[0].length-2] + "/abfahrten", true);
    ab.send();
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