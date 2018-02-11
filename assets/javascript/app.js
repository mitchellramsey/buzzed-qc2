$(document).ready(function () {
    googleMapsCompareCall();
});

function loadBeerPreferences() {
    // set listener for form submission
    listenForFormSubmission();

    /* on click of brewery img, 
     * update the dom to show beers that meet our search criteria as featured,
     * followed by all the unfiltered objs
     */
    setBeerListener();
}


function listenForFormSubmission() {
    $('#nl-form').on('submit', function(event) {
        event.preventDefault();

        // process form data
        formValues = getFormValues();

        // create style mappings spa
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

        breweryCall();
        beerCall();
        // create filtered list of beers that match user preference
        sortBeersByUserChoice(formValues, styleFilter);

        // update dom with breweries
        setBreweryListener();
    });
}

function getRandomStyleMapping() {
    var styleCount = Object.keys(styleSearchRegex).length;
    var randomStyleIndex = Math.floor(Math.random() * styleCount);
    return Object.keys(styleSearchRegex)[randomStyleIndex];
}

function getStyleFilter(style, rangeCount) {
    var styleRange = styleMappings[style];
    var smallerRange = [];

    if (rangeCount > styleRange.length) {
        rangeCount = styleRange.length;
    }

    if (rangeCount < styleRange.length) {
        for (var i = 0; i < rangeCount; i++) {
            var styleIndex = Math.floor(Math.random() * styleRange.length);
            smallerRange.push(styleRange[styleIndex]);
        }
    } else {
        smallerRange = styleRange;
    }
    return smallerRange;
}

function sortBeersByUserChoice(formValues) {
    for (var breweryId in object) {
        for (var k = 0; k < beerMappingUnfiltered[breweryId[k]]; k++) {
            var currentBeer = beerMappingUnfiltered[breweryId][k];          //Shortens the chaining required
            if (currentBeer.isOrganic === formValues.isNonorganic) {         //checks if the beer is organic or not
                if (currentBeer.glass !== undefined) {
                    if (formValues.glassType = currentBeer.glass.name) {
                        if (formValues.abvContent === "-5") {                         //checks if the beer is less than or equal to 5% abv
                            if (currentBeer.abv <= 5.0) {
                                if (styleFilter.indexOf(currentBeer)) {
                                    beerMappingFiltered.push(currentBeer);
                                }
                            }
                        } else if (formValues.abvContent === "8") {               //checks if the beer is greater than or equal to 8%
                            if (currentBeer.abv >= 8.0) {
                                if (styleFilter.indexOf(currentBeer)) {
                                    beerMappingFiltered.push(currentBeer);
                                }
                            }
                        } else {
                            if (currentBeer.abv > 5.0 && currentBeer.abv < 8.0) {    //if the beer is greater then 5% and less than 8%
                                if (styleFilter.indexOf(currentBeer)) {
                                    beerMappingFiltered.push(currentBeer);
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
    formValues.isNonorganic = $("#isNonorganic").val();
    formValues.abvContent = $("#abvContent").val();
    return formValues;
}

//breweryDB API
var queryURL = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/locations?locality=charlotte&key=5af286e1c4f9a3ef861a52f7771d63d8";
var idBrewery;
var styleFilter = getStyleFilter(formValues.beerStyles, 4);
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
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function (response) {

        console.log(response);
        // console.log(breweriesSortedByDistance);

        for (var i = 0; i < response.data.length; i++) {
            var breweryId = response.data[i].brewery.id;
            beerMappingUnfiltered[breweryId] = [];

            /*
                breweryinfo[breweryId]['longituted'] = response.data[i].location.longitude;
                breweryinfo[breweryId]['latitued'] = response.data[i].location.longitude;
                breweryinfo[breweryId]['image'] = response.data[i].location.longitude;
                breweryinfo[breweryId]['name'] = response.data[i].location.longitude;
                breweryinfo[breweryId]['icon'] = response.data[i].location.longitude;
            */
        }
        console.log(beerMapping);
    });
}

function beerCall() {
    //beer api call
    for (var breweryId in object) {
        var queryURL2 = "https://cors-anywhere.herokuapp.com/http://api.brewerydb.com/v2/brewery/" + breweryId + "/beers?&key=5af286e1c4f9a3ef861a52f7771d63d8";
        $.ajax({
            url: queryURL2,
            method: "GET",
            cache: true
        }).done(function (secondResponse) {
            console.log(secondResponse);
            for (var j = 0; j < secondResponse.data.length; j++) {
                beerMappingUnfiltered[breweryId].push(secondResponse.data[j]);
            }
        });
    }

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
                    breweriesSortedByDistance = [];
                    var breweryDistance = secondResponse.rows[0];
                    for (var i = 0; i < breweryDistance.elements.length; i++) {
                        var compareObj = {};
                        compareObj.breweryId = response.data[i].breweryId;
                        compareObj.breweryName = response.data[i].brewery.name;
                        compareObj.timeValue = breweryDistance.elements[i].duration.value;
                        compareObj.minutesAway = breweryDistance.elements[i].duration.text;
                        breweriesSortedByDistance.push(compareObj);
                        // console.log(breweriesSortedByDistance);
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
                    console.log(breweriesSortedByDistance);
                })

                // now that we have all the breweries sorted by distance; update dom
                loadBeerPreferences();
            });
        });
    }
}
function googleMapsMapCall() {
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

                });
            });
        });
    }
}

function setBeerListener() {
    $(document).on("click", ".clicker", function () {
        $("#beers-appear-here").empty();
        var recommendedBeers = beerMappingFiltered[breweryId];
        var allBeers = beerMappingUnfiltered[breweryId];
        var beerMenu = $("<div>");
        var recommendedHeading = $("<p>").html("<strong>Recommended Beers: </strong>");
        var recommendedBeerList = $("<ol>");
        for (var i = 0; i < recommendedBeers.length; i++) {
            var beerName = recommendedBeers[i].name;
            var beerStyle = recommendedBeers[i].style.name;
            var listBeer = $("<li>").text("Beer Name: " + beerName + " Beer Style: " + beerStyle);
            recommendedBeerList.append(listBeer);
        }
        var fullHeading = $("<p>").html("<strong>Full Beer Menu: </strong>");
        var fullBeerList = $("<ol>");
        for (var j = 0; j < allBeers.length; j++) {
            var beerName = allBeers[j].name;
            var beerStyle = allBeers[j].style.name;
            var listBeer = $("<li>").text("Beer Name: " + beerName + " Beer Style: " + beerStyle);
            fullBeerList.append(listBeer);
        }
        beerMenu.append(recommendedHeading)
            .append(recommendedBeerList)
            .append(fullHeading)
            .append(fullBeerList);
        $("#beers-appear-here").append(beerMenu);


    });
}

function setBreweryListener() {


    for (var k = 0; k < 5; k++) {
        for (var breweryId in object) {
            var currentBeer = beerMappingFiltered[breweryId];          //Shortens the chaining required
            if (breweriesSortedByDistance[k] === beerMappingFiltered[breweryId]) {
                var newDiv = $("<div class=clicker divider>");
                var infoForBrewery = $("<p>").text(breweryInfo[breweryId].name);
                var breweryImage = $("<img>")

                breweryImage.attr("src=", breweryInfo[breweryId].image);

                newDiv.prepend(infoForBrewery);
                newDiv.prepend(breweryImage);

                $("#brewerys-appear-here").append(newDiv);
                


            }
        }
    }
}