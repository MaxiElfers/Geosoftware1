function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else { 
        document.getElementById("InputButton").value = "Geolocation is not supported by this browser.";
    }
}

function showPosition(position) {
    document.getElementById("InputButton").value = position.coords.longitude + " " + position.coords.latitude;
}