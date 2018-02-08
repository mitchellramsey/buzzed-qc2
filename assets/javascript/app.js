
//breweryDB API

var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
var idBrewery;

var breweryLocation = {
    var: lat[],
    var: lng[],
    var: brewID[]
};
var userChoice = "";

var beerStyle = "";
var beerABVHigh = 0;
var beerABVLow = 0;
var beerGlass = "";
var beerOrganic = "N"

$.ajax({
    url: queryURL,
    method: "GET"
}).done(function (response) {
    //Breweries can be find in the response object. All brewery info is found in response.data. The brewery id is programmed below to 
    //help retrieve all beers at a defined brewery based on its location in an array. To retrieve all beers at all breweries, we will
    //need to use a for loop. Some helpful object locations are defined below
    //Brewery Hours of Operation: response.data[i].hoursOfOperation
    //Latitude: response.data[i].latitude
    //Longitude: response.data[i].longitude
    //Street Address: response.data[i].streetAddress
    //City: response.data[i].locality
    //Zip Code: response.data[i].postalCode
    //Brewery Name: response.data[i].brewery.name
    //Established Date: response.data[i].brewery.established
    //Icon Image: response.data[i].brewery.image.icon
    console.log(response);
    // console.log(response.data[0].breweryId);
    idBrewery = response.data[3].breweryId;
    for (var k = 0; k < response.data.length; k++) {
        location.lat[k].push(response.data[k].latitude);
        location.lng[k].push(response.data[k].longitude);
        location.brewID[k].push(response.data[k].longitude);
    }

});

//beer api call
$(document).on("click", ".clicker", function () {
    var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + idBrewery + "/beers?&key=5af286e1c4f9a3ef861a52f7771d63d8";
    $.ajax({
        url: queryURL2,
        method: "GET",
        cache: true
    }).done(function (secondResponse) {
        console.log(secondResponse);
        function makeBeerDiv() {
            var newDiv = $("<div class='output'>");

            // glass? - ale by ID - 
            for (var j = 0; j < secondResponse.data.length; j++) {
                if (secondResponse.data[i].available.id === 1) {
                    if (secondResponse.data[i].isOrganic === beerOrganic) {
                        if (secondResponse.data[i].abv < beerABVHigh && secondResponse.data[i].abv > beerABVLow) {
                            if (secondResponse.data[i].style.id === || secondResponse.data[i].style.id === ) {


                                var p = $("<p>").text(secondResponse.data[i].name);
                                newDiv.prepend(p);
                            }
                        }
                    }
                }
            }

            $("#beers-appear-here").prepend(newDiv);

        }
    });
});

// GOOGLE MAP DISTANCE MATRIX API
var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };



        var userOrigin = pos.lat + "," + pos.lng;
        $("#grabdistances").on("click", function () {
            $.ajax({
                url: queryURL,
                method: "GET"
            }).done(function (response) {
                console.log(response);
                // var userOrigin = navigator.geolocation.getCurrentPosition(showPosition);
                var queryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" +
                    userOrigin + "&destinations=";
                for (var i = 0; i < response.data.length; i++) {
                    queryURL2 += response.data[i].latitude + "," + response.data[i].longitude + "|";
                }
                queryURL2 += "&key=AIzaSyAnRWisQlYkpJKLrO9kPx0nK1I6J-_tSVo";
                $.ajax({
                    url: queryURL2,
                    method: "GET"
                }).done(function (secondResponse) {
                    console.log(secondResponse);
                })

            });

        });
    });
}

//GOOGLE MAP IMAGE AND DIRECTION API

var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (position) {
        var pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };
        var userOrigin = pos.lat + "," + pos.lng;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function (response) {
            var uluru = { lat: response.data[0].latitude, lng: response.data[0].longitude };
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: uluru
            });
            var marker = new google.maps.Marker({
                position: uluru,
                map: map
            });
            var queryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" +
                userOrigin + "&destination=" +
                response.data[0].latitude + "," + response.data[0].longitude +
                "&key=AIzaSyAnRWisQlYkpJKLrO9kPx0nK1I6J-_tSVo";
            $.ajax({
                url: queryURL2,
                method: "GET"
            }).done(function (secondResponse) {
                console.log(secondResponse);
                var directions = $("<ol>");
                for (var i = 0; i < secondResponse.routes[0].legs[0].steps.length; i++) {
                    var newStep = $("<li>").html(secondResponse.routes[0].legs[0].steps[i].html_instructions);
                    directions.append(newStep);
                }
                $("#directions").append(directions);
            })
        });
    });
}

//function to make a new div in the "brewery-appear-here" div on the page
function makeBreweryDiv() {
    for (var i = 0; i < response.data.length; i++) {
        var breweryId = response.data[i].brewery.id;
        var newDiv = $("<div class='output clicker'>");
        var newSpan = $("<span>");

        var p = $("<p>").text(response.data[i].brewery.name);
        var breweryImage = $("<img>");
        beerImage.attr("src", response.data[i].brewery.images.squareMedium);
        beerImage.attr("alt", "brewery image");

        newSpan.prepend(p);
        newSpan.prepend(beerImage);

        // newDiv.prepend();
        newDiv.prepend(newSpan);

        $("#brewery-appear-here").prepend(newDiv);

    }
}