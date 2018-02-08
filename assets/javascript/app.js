
//breweryDB API

var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";

$.ajax({
  url: queryURL,
  method: "GET"
}).done(function(response) {
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
  var idBrewery = response.data[3].breweryId;
  var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + idBrewery + "/beers?&key=5af286e1c4f9a3ef861a52f7771d63d8";
  $.ajax({
    url: queryURL2,
    method: "GET"
  }).done(function(secondResponse) {
    console.log(secondResponse);
    //This second ajax call will retrieve all beers within a defined brewery from the idBrewery variable described above. 
    //We will be grabbing this information to display styles, placing them with like beers, displaying names, etc..
    //The following objection definitons will help below:
    // Availability: secondResponse.data[i].availableId...if this  value = 1, then it is available year-round. it will likely be helpful to nav
    //    navigate this route to speed up load times..plus who wants to read about beers that may or may not be available.
    // Alcohol Content: secondResponse.data[i].abv
    // Description: secondResponse.data[i].description
    // Beer Name: secondResponse.data[i].name
    // Comparing them by Styles: secondResponse.data[i].style.categoryId (this one is likely too broad)
    // Comparing them by Styles: secondResponse.data[i].style.shortName (I like this idea more, but who knows how many options we have)
  });
 
});
    // GOOGLE MAP DISTANCE MATRIX API
var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
    
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(function(position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

     
    
    var userOrigin = pos.lat + "," + pos.lng;
    $("#grabdistances").on("click", function() {
        $.ajax({
        url: queryURL,
        method: "GET"
        }).done(function(response) {
            console.log(response);
            // var userOrigin = navigator.geolocation.getCurrentPosition(showPosition);
            var queryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" +
                             userOrigin + "&destinations=";
            for(var i = 0; i < response.data.length; i++) {
                queryURL2 += response.data[i].latitude + "," + response.data[i].longitude + "|";
            }                          
            queryURL2 += "&key=AIzaSyAnRWisQlYkpJKLrO9kPx0nK1I6J-_tSVo";
            $.ajax({
                url: queryURL2,
                method: "GET"
            }).done(function(secondResponse) {
                console.log(secondResponse);
            })                
                            
        });
 
    });
  });
    }

    //GOOGLE MAP IMAGE AND DIRECTION API

    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
    if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
        var userOrigin = pos.lat + "," + pos.lng;
        $.ajax({
            url:queryURL,
            method: "GET"
        }).done(function(response){
          var uluru = {lat: response.data[0].latitude, lng: response.data[0].longitude};
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
              url:queryURL2,
              method: "GET"
          }).done(function(secondResponse){
              console.log(secondResponse);
              var directions = $("<ol>");
              for(var i = 0; i < secondResponse.routes[0].legs[0].steps.length; i++){
                  var newStep = $("<li>").html(secondResponse.routes[0].legs[0].steps[i].html_instructions);
                  directions.append(newStep);                
              }
              $("#directions").append(directions);
          })
        });
    });
    }