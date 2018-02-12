    var config = {
        apiKey: "AIzaSyCmOt5ExgjOM8Rp9lBR0sX_t38_rS_nSJs",
        authDomain: "buzzedqc.firebaseapp.com",
        databaseURL: "https://buzzedqc.firebaseio.com",
        projectId: "buzzedqc",
        storageBucket: "buzzedqc.appspot.com",
        messagingSenderId: "51574204769"
        };
    firebase.initializeApp(config);
    
    $(document).on('click',".reviewBeer",function(){
        $('#myModal').modal('show');
        $("#reviewThisBeer").text($(this).beerName);
    });

    var database = firebase.database();
    var beerName = "";
    var beerRating = "";
    var beerReview = "";

    $(document).on("click","#modalSubmit", function() {

        event.preventDefault();

        beerName = $("#reviewThisBeer").text();
        beerRating = $("#user-rating").val().trim();
        beerReview = $("#user-review").val().trim();

        beerRating.val("");
        beerReview.val("");

        database.ref().push ({
            dbbeerName: beerName,
            dbbeerRating: beerRating,
            dbbeerReview: beerReview
        });
        $("myModal").modal('hide');
    });

    
