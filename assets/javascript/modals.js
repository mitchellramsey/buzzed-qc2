
    var config = {
        apiKey: "AIzaSyCmOt5ExgjOM8Rp9lBR0sX_t38_rS_nSJs",
        authDomain: "buzzedqc.firebaseapp.com",
        databaseURL: "https://buzzedqc.firebaseio.com",
        projectId: "buzzedqc",
        storageBucket: "buzzedqc.appspot.com",
        messagingSenderId: "51574204769"
        };
    firebase.initializeApp(config);
    
    $("#reviewBeer").on('click',function(){
        $('#myModal').modal('show');
    });

<<<<<<< HEAD
    $("#")
=======
    var database = firebase.database();
    var beerName = "";
    var beerRating = "";
    var beerReview = "";

    
>>>>>>> 0710a7b9d35ab6d8c05c59ed47c031d7b99e80ed
