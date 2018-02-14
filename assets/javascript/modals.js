    var config = {
        apiKey: "AIzaSyCmOt5ExgjOM8Rp9lBR0sX_t38_rS_nSJs",
        authDomain: "buzzedqc.firebaseapp.com",
        databaseURL: "https://buzzedqc.firebaseio.com",
        projectId: "buzzedqc",
        storageBucket: "buzzedqc.appspot.com",
        messagingSenderId: "51574204769"
        };
    firebase.initializeApp(config);
    var database = firebase.database();
    var beerName = "";
    var beerRating = "";
    var beerReview = "";
    
    $(document).on('click',".reviewBeer",function(){
        $('#myModal').modal('show');
        $("#reviewThisBeer").text($(this).attr("data-id"));
        database.ref($(this).attr("data-id")).on("child_added", function(snapshot) {
            var beerInfo = snapshot.val();
            var mrReview = beerInfo.dbbeerRating;
            var mrComment = beerInfo.dbbeerReview;

            $("#mostRecentReview").text(mrReview);
            $("#mostRecentComment").text(mrComment);
        }) 

       

    });

    var database = firebase.database();
    var beerName = "";
    var beerRating = "";
    var beerReview = "";

    $(document).on("click","#modalSubmit", function() {
        $("#reviewForm").submit(function() {
            event.preventDefault();

            beerName = $("#reviewThisBeer").text();
            beerRating = $("#user-rating").val().trim();
            beerReview = $("#user-review").val().trim();


    
            database.ref(beerName).push ({
                dbbeerName: beerName,
                dbbeerRating: beerRating,
                dbbeerReview: beerReview
            });
            $('#myModal').modal('hide');
        });
    });

    
