$(document).ready(function () {
    // hide submit button
    hideSubmitButton();

    // define the event listener for form submit
    listenForFormSubmission();

    googleMapsCompareCall();
});

function displaySubmitButton() {
    $('#grabdistances').show();
}

function hideSubmitButton() {
    $('#grabdistances').hide();
}

function listenForFormSubmission() {
    $('#nl-form').on('submit', function(event) {
        event.preventDefault();

        // process form data
        formValues = getFormValues();

        // create style mappings, filter beers, and update dom
        createStyleMap();
    });
}

function createStyleMap() {
    styleMappings = {
        ale: [],
        lager: [],
        hybrid: [],
        meadorcider: [],
        malternative: []
    };

    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/styles?&key=5af286e1c4f9a3ef861a52f7771d63d8";
    $.ajax({
        url: queryURL,
        method: "GET",
        cache: true
    }).done(function (response) {
        var data = response.data;
        for (var j = 0; j < data.length; j++) {
            var currentStyle = data[j];
            var categoryName = currentStyle.category.name;
            var styleId = currentStyle.id;
            if (categoryName.match(styleSearchRegex.ale)) {
                styleMappings['ale'].push(styleId);
            } else if (categoryName.match(styleSearchRegex.lager)) {
                styleMappings['lager'].push(styleId);
            } else if (categoryName.match(styleSearchRegex.hybrid)) {
                styleMappings['hybrid'].push(styleId);
            } else if (categoryName.match(styleSearchRegex.meadorcider)) {
                styleMappings['meadorcider'].push(styleId);
            } else if (categoryName.match(styleSearchRegex.malternative)) {
                styleMappings['malternative'].push(styleId);
            }
        }

        // get style filter based on from data
        var style = '';
        if (formValues.beerStyle === 'Random') {
            style = getRandomStyleMapping();
        } else {
            style = formValues.beerStyle;
        }
        var styleFilter = getStyleFilter(style, 4);

        // create filtered list of beers that match user preference
        sortBeersByUserChoice(formValues, styleFilter);

        // update dom with breweries
        setBreweryListener();
        setBeerListener();
    });
}

function getRandomStyleMapping() {
    var styleCount = Object.keys(styleSearchRegex).length;
    var randomStyleIndex = Math.floor(Math.random() * styleCount);
    return Object.keys(styleSearchRegex)[randomStyleIndex];
}

function getStyleFilter(style) {
    return styleRange = styleMappings[style];
}

function sortBeersByUserChoice(formValues) {
    var styleFilter = getStyleFilter(formValues.beerStyle, 5);
    
    // iterate through all brewery id's in the filtered list
    for (var breweryId in beerMappingUnfiltered) {
        // get list of beers for this brewery
        var unfilteredBeerList = beerMappingUnfiltered[breweryId];
        for (var k = 0; k < unfilteredBeerList.length; k++) {
            var currentBeer = unfilteredBeerList[k];

            // perform filtering logic
            if (styleFilter.indexOf(currentBeer.styleId) > -1) {
                // the beer is in the right style
                if (currentBeer.isOrganic === formValues.isOrganic) {
                    // the beer organic value is set correctly
                    if (currentBeer.glasswareId !== undefined) {
                        
                        // if glass type is standard, just set it to the id for a pint
                        if (formValues.glassType === '0') {
                            formValues.glassType = 5;
                        } 
                        
                        if (currentBeer.glasswareId === parseInt(formValues.glassType)) {
                            // the beer class is correct
                            if (formValues.abvContent === "-5") {
                                if (currentBeer.abv <= 5.0) {
                                    if (beerMappingFiltered[breweryId] === undefined) {
                                        beerMappingFiltered[breweryId] = [];
                                    }
                                    beerMappingFiltered[breweryId].push(currentBeer);
                                }
                            } else if (formValues.abvContent === "8") {
                                if (currentBeer.abv >= 8.0) {
                                    if (beerMappingFiltered[breweryId] === undefined) {
                                        beerMappingFiltered[breweryId] = [];
                                    }
                                    beerMappingFiltered[breweryId].push(currentBeer);
                                }
                            } else if (formValues.abvContent === "5,8") {
                                if (currentBeer.abv > 5.0 && currentBeer.abv < 8.0) {
                                    if (beerMappingFiltered[breweryId] === undefined) {
                                        beerMappingFiltered[breweryId] = [];
                                    }
                                    beerMappingFiltered[breweryId].push(currentBeer);
                                }
                            }
                        }
                    }
                }
            }

        }
    }
}


function getFormValues() {
    var formValues = {};
    formValues.beerStyle = $("#beerStyle").val();
    formValues.glassType = $("#glassType").val();
    formValues.isOrganic = $("#isOrganic").val();
    formValues.abvContent = $("#abvContent").val();
    return formValues;
}

//breweryDB API
var beerMappingFiltered = {

};
var beerMappingUnfiltered = {

}
var breweriesSortedByDistance = [];

var formData = {};

var styleMappings = {};
var styleSearchRegex = {
    ale: /ale/i,
    lager: /lager/i,
    hybrid: /hybrid/i,
    meadorcider: /cider/i,
    malternative: /malternative/i
};

var breweryInfo = {};

function breweryCall() {
    var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {
        for (var i = 0; i < response.data.length; i++) {
            var breweryId = response.data[i].brewery.id;
            beerMappingUnfiltered[breweryId] = [];
            breweryInfo[breweryId] = [];

            
            breweryInfo[breweryId].longitude = response.data[i].longitude;
            breweryInfo[breweryId].latitude = response.data[i].latitude;
            breweryInfo[breweryId].address = response.data[i].streetAddress;
            breweryInfo[breweryId].name = response.data[i].brewery.name;
            if(response.data[i].brewery.images){    
                breweryInfo[breweryId].image = response.data[i].brewery.images.icon;
            }else {
                breweryInfo[breweryId].image = "assets/images/no-image.png";
            }
            beerCall();
        }

        displaySubmitButton();

        // make beer call
      
    });
}

function beerCall() {
    //beer api call
    for (var brewd in beerMappingUnfiltered) {
        var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + brewd + "/beers?&key=5af286e1c4f9a3ef861a52f7771d63d8";
        $.ajax({
            url: queryURL2,
            method: "GET",
            breweryId: brewd,
            cache: true
        }).done(function (secondResponse) {            
            if (secondResponse.data) {
                for (var j = 0; j < secondResponse.data.length; j++) {
                    beerMappingUnfiltered[this.breweryId].push(secondResponse.data[j]);
                }
            } else {
                delete beerMappingUnfiltered[this.breweryId];
            }
        });
    }
    displaySubmitButton();
}

function googleMapsCompareCall() {
    // GOOGLE MAP DISTANCE MATRIX API
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
                    breweriesSortedByDistance = [];
                    var breweryDistance = secondResponse.rows[0];
                    for (var i = 0; i < breweryDistance.elements.length; i++) {
                        var compareObj = {};
                        compareObj.breweryId = response.data[i].breweryId;
                        compareObj.breweryName = response.data[i].brewery.name;
                        compareObj.timeValue = breweryDistance.elements[i].duration.value;
                        compareObj.minutesAway = breweryDistance.elements[i].duration.text;
                        breweriesSortedByDistance.push(compareObj);
                    }
                    var compare = function (a, b) {
                        if (a.timeValue < b.timeValue) {
                            return -1;
                        } else if (a.timeValue > b.timeValue) {
                            return 1;
                        } else {
                            return 0;
                        }
                    }
                    breweriesSortedByDistance.sort(compare);
                    
                    // now that we have location get all of the brewery info and metadata
                    breweryCall();
                })
            });
        });
    }
}

function googleMapsMapCall(latitude, longitude) {
    //GOOGLE MAP IMAGE AND DIRECTION API

    // var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var userOrigin = pos.lat + "," + pos.lng;
            // $.ajax({
            //     url: queryURL,
            //     method: "GET"
            // }).done(function (response) {
                var uluru = { lat: latitude , lng: longitude };
                var map = new google.maps.Map(document.getElementById('map-itself'), {
                    zoom: 15,
                    center: uluru
                });
                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map
                });
                var queryURL2 = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/directions/json?origin=" +
                    userOrigin + "&destination=" +
                    latitude + "," + longitude +
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

                });
            });
        }
    }


function setBeerListener() {
    $(document).on("click", ".clicker", function () {
        $("#beers-appear-here").empty();
        var recommendedBeers = beerMappingFiltered[$(this).attr("data-id")];
        var allBeers = beerMappingUnfiltered[$(this).attr("data-id")];
        var breweryLatitude = breweryInfo[$(this).attr("data-id")].latitude;
        var breweryLongitude = breweryInfo[$(this).attr("data-id")].longitude;
        var beerMenu = $("<div>");
        var recommendedHeading = $("<p>").html("<strong>Recommended Beers: </strong>");
        var recommendedBeerList = $("<ol>");
        if(recommendedBeers.length < 5){ 
            for (var i = 0; i < recommendedBeers.length; i++) {
                var beerName = recommendedBeers[i].name;
                var beerStyle = recommendedBeers[i].style.name;
                var listBeer = $("<li>").html("Beer Name: " + beerName + "<br>Beer Style: " + beerStyle)
                                .addClass("reviewBeer");
                recommendedBeerList.append(listBeer);
            }
        } else {
            for (var i = 0; i < 5; i++) {
                var beerName = recommendedBeers[i].name;
                var beerStyle = recommendedBeers[i].style.name;
                var listBeer = $("<li>").html("Beer Name: " + beerName + "<br>Beer Style: " + beerStyle)
                                .addClass("reviewBeer");
                recommendedBeerList.append(listBeer);
            }
        }    
        var fullHeading = $("<p>").html("<strong>Full Beer Menu: </strong>");
        var fullBeerList = $("<ol>");
        if(allBeers.length < 10){
            for (var j = 0; j < allBeers.length; j++) {
                var beerName = allBeers[j].name;
                var beerStyle = allBeers[j].style.name;
                var listBeer = $("<li>").html("Beer Name: " + beerName + "<br>Beer Style: " + beerStyle)
                            .addClass("reviewBeer");
                fullBeerList.append(listBeer);
            }
        } else {
            for (var j = 0; j < 10; j++) {
                var beerName = allBeers[j].name;
                var beerStyle = allBeers[j].style.name;
                var listBeer = $("<li>").html("Beer Name: " + beerName + "<br>Beer Style: " + beerStyle)
                            .addClass("reviewBeer");
                fullBeerList.append(listBeer);
            }
        }
        beerMenu.append(recommendedHeading)
            .append(recommendedBeerList)
            .append(fullHeading)
            .append(fullBeerList);
        $("#beers-appear-here").append(beerMenu);
        googleMapsMapCall(breweryLatitude, breweryLongitude);

    });
}

function setBreweryListener() {
    var breweryLimit = 5;
    if (Object.keys(beerMappingFiltered).length < 5) {
        breweryLimit = Object.keys(beerMappingFiltered).length;
    }

    var closestBreweries = [];
    var breweryCount = 0;
    while (breweryCount < breweryLimit) {
        for (var j = 0; j < breweriesSortedByDistance.length; j++) {
            var nextClosestBrewery = breweriesSortedByDistance[j];
            // iterate through each filtered brewery to determine if the next closest brewery is in the filtered list
            for (var filteredBrewId in beerMappingFiltered) {
                // if this brewery is in the filtered list push the list of all the beers onto the five closests array
                if (filteredBrewId === nextClosestBrewery.breweryId) {
                    var breweryObj = {
                        breweryId: filteredBrewId,
                        beers: beerMappingFiltered[filteredBrewId],
                        // image: breweryInfo[breweryId].image,
                        // name: breweryInfo[breweryId].name
                    };
                    closestBreweries.push(breweryObj);
                    breweryCount++;
                    break;
                }
            }
        }
    }
    console.log(breweryInfo);
    console.log(closestBreweries);
    var attachBreweries = $("<div>");
    for (var i = 0; i < closestBreweries.length; i++) {
        // populate to dom
        var newDiv = $("<div class='clicker divider'>")
                     .attr("data-id", closestBreweries[i].breweryId);
        var publishedName = breweryInfo[closestBreweries[i].breweryId].name;
        var infoForBrewery = $("<p>").text(publishedName)
        var imageSource = breweryInfo[closestBreweries[i].breweryId].image;
        // var minutesAway = brewe 
        var breweryImage = $("<img>")
        var horizontalRow = $("<hr>");
        breweryImage.attr("src", imageSource);

        newDiv.append(infoForBrewery);
        newDiv.append(breweryImage);
        newDiv.append(horizontalRow);
        attachBreweries.append(newDiv);
        
    
    }
    $("#brewerys-appear-here").append(attachBreweries);

    
    // for (var k = 0; k < 5; k++) {
    //     for (var breweryId in beerMappingFiltered) {
    //         var currentBeer = beerMappingFiltered[breweryId];          //Shortens the chaining required
    //         if (breweriesSortedByDistance[k] === beerMappingFiltered[breweryId]) {
    //             var newDiv = $("<div class=clicker divider>");
    //             var infoForBrewery = $("<p>").text(breweryInfo[breweryId].name);
    //             var breweryImage = $("<img>")

    //             breweryImage.attr("src=", breweryInfo[breweryId].image);

    //             newDiv.prepend(infoForBrewery);
    //             newDiv.prepend(breweryImage);

    //             $("#brewerys-appear-here").append(newDiv);
                
    //         }
    //     }
    // }
}

