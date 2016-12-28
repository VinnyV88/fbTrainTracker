$(document).ready(function() {

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyBjDHf1eKfv0kChZBSeuGjmFAdw7xAS5bg",
        authDomain: "traintracker-d4450.firebaseapp.com",
        databaseURL: "https://traintracker-d4450.firebaseio.com",
        storageBucket: "traintracker-d4450.appspot.com",
        messagingSenderId: "757248156355"
    };
    firebase.initializeApp(config);

  var databaseRef = firebase.database();




/**
 * Initializes the app.
 */
// var initApp = function() {


//   document.getElementById('sign-in-with-redirect').addEventListener(
//       'click', signInWithRedirect);
//   document.getElementById('sign-in-with-popup').addEventListener(
//       'click', signInWithPopup);
//   document.getElementById('sign-out').addEventListener('click', function() {
//     firebase.auth().signOut();
//   });
//   document.getElementById('delete-account').addEventListener(
//       'click', function() {
//         deleteAccount();
//       });
// };

// window.addEventListener('load', initApp);










 //  var uiConfig = {
 //    signInSuccessUrl: "file:///C:/Users/vviscont/Google%20Drive/RCBprojects/TrainTracker/index.html",
 //    signInOptions: [
 //      // Leave the lines as is for the providers you want to offer your users.
 //      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
 //      firebase.auth.GithubAuthProvider.PROVIDER_ID
 //    ],
 //    // Terms of service url.
 //    tosUrl: "file:///C:/Users/vviscont/Google%20Drive/RCBprojects/TrainTracker/tos.html"
 //  };

 //  // Initialize the FirebaseUI Widget using Firebase.
 //  var ui = new firebaseui.auth.AuthUI(firebase.auth());
 //  // The start method will wait until the DOM is loaded.
 //  ui.start("#firebaseui-auth-container", uiConfig);

'use strict';

// Initializes FriendlyChat.
function trainTracker() {

  // Shortcuts to DOM Elements.
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');

  // Saves message on form submit.
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));

  this.initFirebase();
}

// Sets up shortcuts to Firebase features and initiate firebase auth.
trainTracker.prototype.initFirebase = function() {
  // Shortcuts to Firebase SDK features.
  this.auth = firebase.auth();
  this.database = firebase.database();
  // Initiates Firebase auth and listen to auth state changes.
  this.auth.onAuthStateChanged(this.onAuthStateChanged.bind(this));
};


// Signs-in
trainTracker.prototype.signIn = function() {
  // Sign in Firebase using popup auth and Google as the identity provider.
  var provider = new firebase.auth.GoogleAuthProvider();
  this.auth.signInWithPopup(provider);
};

// Signs-out of Friendly Chat.
trainTracker.prototype.signOut = function() {
  // Sign out of Firebase.
  this.auth.signOut();
};

// Triggers when the auth state change for instance when the user signs-in or signs-out.
trainTracker.prototype.onAuthStateChanged = function(user) {
  if (user) { // User is signed in!
    // Get profile pic and user's name from the Firebase user object.
    var profilePicUrl = user.photoURL; 
    var userName = user.displayName;  

    // Set the user's profile pic and name.
    this.userPic.style.backgroundImage = 'url(' + profilePicUrl + ')';
    this.userName.textContent = userName;

    // Show user's profile and sign-out button.
    this.userName.removeAttribute('hidden');
    this.userPic.removeAttribute('hidden');
    this.signOutButton.removeAttribute('hidden');

    // Hide sign-in button.
    this.signInButton.setAttribute('hidden', 'true');

  } else { // User is signed out!
    // Hide user's profile and sign-out button.
    this.userName.setAttribute('hidden', 'true');
    this.userPic.setAttribute('hidden', 'true');
    this.signOutButton.setAttribute('hidden', 'true');

    // Show sign-in button.
    this.signInButton.removeAttribute('hidden');
  }
};


window.onload = function() {
  window.trainTracker = new trainTracker();
};





        // firebase.auth().onAuthStateChanged(function(user) {
        //   if (user) {
        //     // User is signed in.
        //     var displayName = user.displayName;
        //     var email = user.email;
        //     var emailVerified = user.emailVerified;
        //     var photoURL = user.photoURL;
        //     var uid = user.uid;
        //     var providerData = user.providerData;
        //     user.getToken().then(function(accessToken) {
        //       document.getElementById("sign-in-status").textContent = "Signed in";
        //       document.getElementById("sign-in").textContent = "Sign out";
        //       document.getElementById("account-details").textContent = JSON.stringify({
        //         displayName: displayName,
        //         email: email,
        //         emailVerified: emailVerified,
        //         photoURL: photoURL,
        //         uid: uid,
        //         accessToken: accessToken,
        //         providerData: providerData
        //       }, null, "  ");
        //     });
        //   } else {
        //     // User is signed out.
        //     document.getElementById("sign-in-status").textContent = "Signed out";
        //     document.getElementById("sign-in").textContent = "Sign in";
        //     document.getElementById("account-details").textContent = "null";
        //   }
        // }, function(error) {
        //   console.log(error);
        // });
      // };

      // window.addEventListener("load", function() {
      //   initApp()
      // });





    $("#first-train-time-input").timepicker({ timeFormat: "HH:mm", interval: 5 });

    $(".train-table").empty();
    console.log("initial write header")
    $(".train-table").append($("<tr>")
  		.append("<th style=\"width:15%\">Action</th>")
	    .append("<th style=\"width:20%\">Train Name</th>")
	    .append("<th style=\"width:20%\">Destination</th>")
	    .append("<th style=\"width:15%\">Frequency (Mins)</th>")
	    .append("<th style=\"width:15%\">Next Arrival</th>")
	    .append("<th style=\"width:15%\">Minutes Away</th>"));

    $("#clock").fitText(1.3);

    function update() {
        var timeNow = moment();
        $("#clock").html(timeNow.format("hh:mm:ss A"));

        if (timeNow.format("ss") === "00") {
            refreshTrainTracker();
        }

    }

    function refreshTrainTracker() {

        $(".train-table").empty();
        console.log("refresh-header")
		    $(".train-table").append($("<tr>")
		    .append("<th style=\"width:15%\">Action</th>")
		    .append("<th style=\"width:20%\">Train Name</th>")
		    .append("<th style=\"width:20%\">Destination</th>")
		    .append("<th style=\"width:15%\">Frequency (Mins)</th>")
		    .append("<th style=\"width:15%\">Next Arrival</th>")
		    .append("<th style=\"width:15%\">Minutes Away</th>"));

				firebase.database().ref()
					.once("value")
					.then(function(tableSnapshot) {
        // database.ref().on("value", function(tableSnapshot) {

        	// console.log("value")

            tableSnapshot.forEach(function(dataSnapshot) {

                    var dataObj = dataSnapshot.val();

                    var dataKey = dataSnapshot.key;

                    var tFrequency = dataObj.frequency;

                    var firstTime = dataObj.firstTrainTime;

                    // First Time (pushed back 1 year to make sure it comes before current time)
                    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
                    // console.log(firstTimeConverted);

                    // Current Time
                    var currentTime = moment();
                    // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

                    // Difference between the times
                    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
                    // console.log("DIFFERENCE IN TIME: " + diffTime);

                    // Time apart (remainder)
                    var tRemainder = diffTime % tFrequency;
                    // console.log(tRemainder);

                    // Minute Until Train
                    var tMinutesTillTrain = tFrequency - tRemainder;
                    // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

                    // Next Train
                    var nextTrain = moment().add(tMinutesTillTrain, "minutes");
                    // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

                    // Train schedule to table
                    var $tr = $("<tr>").attr("data-key", dataKey)
                    	.append("<td><a class=\"edit-train\" data-toggle=\"modal\" href=\"#editModal\">Edit</a>/" +
        		          						"<a class=\"delete-train\" data-toggle=\"modal\" href=\"#deleteModal\">Delete</a>")
                    	.append("<td>" + dataObj.trainName)
                      .append("<td>" + dataObj.destination)
                      .append("<td>" + dataObj.frequency)
                      .append("<td>" + moment(nextTrain).format("hh:mm A"))
                      .append("<td>" + tMinutesTillTrain);
                  console.log("for-each")
                  $(".train-table").append($tr);

                }) // ends forEach

            // Handle the errors
        }, function(errorObject) {
            // console.log("Errors handled: " + errorObject.code);
        });
    } // end function


    setInterval(update, 1000);

    // Variables to hold values for Firebase
    var trainName;
    var destination;
    var firstTrainTime;
    var frequency;

    var trainKey;

    $("#add-train").on("click", function(event) {
        event.preventDefault();

        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = $("#first-train-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // Code for the push
        databaseRef.ref().push({

            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        }); //end firebase push

    }); //end add-train click

    databaseRef.ref().on("child_added", function(childSnapshot) {

    	// console.log("child_added")

       var tFrequency = childSnapshot.val().frequency;

        var firstTime = childSnapshot.val().firstTrainTime;

        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
        // console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        // console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        // console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        // console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        // console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        // Next Train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");
        // console.log("ARRIVAL TIME: " + moment(nextTrain).format("hh:mm"));

        // Train schedule to table
        var $tr = $("<tr>").attr("data-key", childSnapshot.key)
        	.append("<td><a class=\"edit-train\" data-toggle=\"modal\" href=\"#editModal\">Edit</a>/" +
        		          "<a class=\"delete-train\" data-toggle=\"modal\" href=\"#deleteModal\">Delete</a>")
        	.append("<td>" + childSnapshot.val().trainName)
          .append("<td>" + childSnapshot.val().destination)
          .append("<td>" + childSnapshot.val().frequency)
          .append("<td>" + moment(nextTrain).format("hh:mm A"))
          .append("<td>" + tMinutesTillTrain);
        console.log("child-added");
        $(".train-table").append($tr);

        // Handle the errors
    }, function(errorObject) {
        // console.log("Errors handled: " + errorObject.code);
    });

  $(document).on("click", ".edit-train", function() {

  	trainKey = $(this).parent("td").parent("tr").data("key");

  	firebase.database().ref().child(trainKey)
  		.once("value")
  		.then(function(snapshot) {

  			var trainData = snapshot.val();

        $("#train-name-edit").val(trainData.trainName);
        $("#destination-edit").val(trainData.destination);
        $("#first-train-time-edit").val(trainData.firstTrainTime);
        $("#frequency-edit").val(trainData.frequency);

  	});

  
  }); //end edit-train on click

  $(document).on("click", "#edit-train-info", function() {

		trainName = $("#train-name-edit").val().trim();
		destination = $("#destination-edit").val().trim();
		firstTrainTime = $("#first-train-time-edit").val().trim();
		frequency = $("#frequency-edit").val().trim();

  	firebase.database().ref().child(trainKey).set( {

      trainName: trainName,
      destination: destination,
      firstTrainTime: firstTrainTime,
      frequency: frequency,
      dateAdded: firebase.database.ServerValue.TIMESTAMP

  	});

  	$(".close-edit").trigger("click");

  	refreshTrainTracker();

  }); //end edit-train-info on click

  $(document).on("click", ".delete-train", function() {

	trainKey = $(this).parent("td").parent("tr").data("key");

	firebase.database().ref().child(trainKey)
		.once("value")
		.then(function(snapshot) {

			var trainData = snapshot.val();

      $("#train-name-delete").val(trainData.trainName);
      $("#destination-delete").val(trainData.destination);
      $("#first-train-time-delete").val(trainData.firstTrainTime);
      $("#frequency-delete").val(trainData.frequency);

		});


	}); //end delete-train on click


  $(document).on("click", "#delete-train-info", function() {

  	firebase.database().ref().child(trainKey).remove();

  	$(".close-delete").trigger("click");

  	refreshTrainTracker();

  }); //end delete-train-info on click

}); // end document ready
