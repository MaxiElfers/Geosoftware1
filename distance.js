function distance(number){
    let R = 6371e3; // mean radius of the earth
    const lat1 = point[0] * Math.PI/180; // is constant because we only compare with one point
    let lat2 = number[0] * Math.PI/180; //
    let latRechner = (number[0] - point[0]) * Math.PI/180;
    let lonRechner = (number[1] - point[1]) * Math.PI/180;

    let a = Math.sin(latRechner/2) * Math.sin(latRechner/2) +
            Math.cos(lat1) * Math.cos(lat2) *
            Math.sin(lonRechner/2) * Math.sin(lonRechner/2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    let d = R * c;
    return d; // returns the distance in metres
}