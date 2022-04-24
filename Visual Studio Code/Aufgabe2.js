let distanceArray = cities;

// only for design purpose to hide the button after clicking it
function hide(){
    document.getElementById("ErsterButton").style.display = "none";
}

// only for design purpose to show the return button after clicking the "show" button
function show(){
    document.getElementById("ReturnButton").style.display = "block";
}

function distanceCalculation(){
// calculating the distances and storing them in an array
for(var i = 0; i < cities.length; i++){
    var write = distance(cities[i]);
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