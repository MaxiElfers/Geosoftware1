/**
 * Lösung zur Aufgabe 2, Geosoft 1, SoSe 2022
 * @author {Maximilian Elfers} matr.Nr.: {515622}
 */

//declaration of global variables
var input;
let distanceArray = [];
let distanceArrayJSON = [];

//list of all EventListeners
document.getElementById("ReturnButton").addEventListener("click",function(){window.location.reload()});
document.getElementById("ButtonStart").addEventListener("click",function(){distance(); hide("ButtonStart"); show("ReturnButton"); hide("InputDiv"); hide("Task2"); hide("SubmitButtonDiv"); hide("Task1")});
document.getElementById("YourLocation").addEventListener("click",getLocation);
document.getElementById("SubmitButton").addEventListener("click",function(){ValueInputtButton(); hide("SubmitButton"); show("GoButtonDiv"); hide("ErsterButton"); hide("Task1"); hide("InputDiv"); hide("Task2")});
document.getElementById("GoButton").addEventListener("click",function(){distanceJSON(); hide("ButtonStart"); hide("GoButtonDiv"); show("ReturnButton")});

/**
 * Parses the value of the Input Field to an JSON object
 */
var ValueInputtButton = () => input = JSON.parse(document.getElementById("InputButton").value);

/**
 * Is the function to get and sort the distances from one point to all the other given points
 * This function is for task 1.
 */
function distance(){
    // calculating the distances and storing them in an array
    for(var i = 0; i < cities.length; i++){
        var write = distanceCalculation(cities[i]);
        distanceArray[i] = write;
    }

    distanceArray.sort(function(a, b){return a - b}); // sorting the array 

    // this is only for visualisation purposes 
    for(var i = 0; i < distanceArray.length; i++){
        distanceArray[i] = "<br><br>" + distanceArray[i];
    }

    // writing the distances in the correct order on the web page
    document.getElementById('OutputLoesung').innerHTML = distanceArray + "<br><br>";
}

/**
 * Is the updatet function of distance, so it can work with JSON objects.
 * This function is for task 2.
 */
function distanceJSON(){
    for(var i = 0; i < poi.features.length; i++){
        var write = distanceCalculationJSON(poi.features[i], input);
        distanceArrayJSON[i] = write;
    }

    distanceArrayJSON.sort(function(a, b){return a - b}); // sorting the array

    // this is only for visualisation purposes 
    for(var i = 0; i < distanceArrayJSON.length; i++){
        distanceArrayJSON[i] = "<br><br>" + distanceArrayJSON[i];
    }

    // writing the distances in the correct order on the web page
    document.getElementById('OutputLoesung').innerHTML = distanceArrayJSON + "<br><br>";
}

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
    var newValue = '{"type": "Feature","properties": {"shape": "Marker","name": "Aktueller Standort","category": "default"},"geometry": {"type": "Point","coordinates": [' + position.coords.longitude + ',' + position.coords.latitude + ']}}';
    document.getElementById("InputButton").value = newValue;
}

/**
 * Calculates the Distance between the coordinates of the point "point" and the given "number"
 * This function is for task 1.
 * @param {array} number - is the point with which to calculate the distance to the array point
 * @returns {number} Distance in metres 
 */
function distanceCalculation(number){
    let R = 6371e3; // mean radius of the earth
    const lat1 = point[1] * Math.PI/180; // is constant because we only compare with one point
    let lat2 = number[1] * Math.PI/180; 
    let latRechner = (number[1] - point[1]) * Math.PI/180;
    let lonRechner = (number[0] - point[0]) * Math.PI/180;

    let a = Math.sin(latRechner/2) * Math.sin(latRechner/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(lonRechner/2) * Math.sin(lonRechner/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;
    return d; // returns the distance in metres
}

/**
 * Is the updated version of the distanceCalculation function, so it works with GeoJSON objects
 * This function is for task 2.
 * @param {JSON object} pois - are the features of the poi variable 
 * @param {JSON object} valuePoint - is the point to which the "poi features" are compared
 * @returns {number} Distance in metres 
 */
function distanceCalculationJSON(pois, valuePoint){
    let R = 6371e3; // mean radius of the earth
    const lat1 = valuePoint.geometry.coordinates[1] * Math.PI/180; // is constant because we only compare with one point
    let lat2 = pois.geometry.coordinates[1] * Math.PI/180; 
    let latRechner = (pois.geometry.coordinates[1] - valuePoint.geometry.coordinates[1]) * Math.PI/180;
    let lonRechner = (pois.geometry.coordinates[0] - valuePoint.geometry.coordinates[0]) * Math.PI/180;

    let a = Math.sin(latRechner/2) * Math.sin(latRechner/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(lonRechner/2) * Math.sin(lonRechner/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;
    return d; // returns the distance in metres
}

// sets a new title for the Website
document.title = "Geosoftware Maxi Elfers";