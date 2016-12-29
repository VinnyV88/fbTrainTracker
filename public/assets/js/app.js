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

      // Variables to hold values for Firebase
    var trainName;
    var destination;
    var firstTrainTime;
    var frequency;

    var trainKey;

'use strict';

// Initialize
function trainTracker() {

  // Shortcuts to DOM Elements.
  this.userPic = document.getElementById('user-pic');
  this.userName = document.getElementById('user-name');
  this.signInButton = document.getElementById('sign-in');
  this.signOutButton = document.getElementById('sign-out');
  this.addTrainButton = document.getElementById("add-train");
  // this.editTrainButton = document.getElementById("edit-train");
  // this.editTrainInfoButton = document.getElementById("edit-train-info");
  // this.deleteTrainButton = document.getElementById("delete-train");
  // this.deleteTrainInfoButton = document.getElementById("delete-train-info");

  // Create Button Click Event Listeners
  this.signOutButton.addEventListener('click', this.signOut.bind(this));
  this.signInButton.addEventListener('click', this.signIn.bind(this));
  this.addTrainButton.addEventListener('click', this.addTrain.bind(this));

  // this.editTrainButton.on('click', this.editTrain.bind(this));
  // this.editTrainInfoButton.on('click', this.editTrainInfo.bind(this));
  // this.deleteTrainButton.on('click', this.deleteTrain.bind(this));
  // this.deleteTrainInfoButton.on('click', this.deleteTrainInfo.bind(this));

  $(document).on('click', "#edit-train", this.editTrain);
  $(document).on('click', "#edit-train-info", this.editTrainInfo);
  $(document).on('click', "#delete-train", this.deleteTrain);
  $(document).on('click', "#delete-train-info", this.deleteTrainInfo);

  this.initFirebase();
};

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

trainTracker.prototype.addTrain = function(event) {
        event.preventDefault();

        if (!(this.checkSignedInWithMessage())) { //not signed in, not allowed to add

          alert("not allowed to add")

        }
        else {  // signed in, can add train

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

      } //end-if signed in  

    }; //end add-train click


  trainTracker.prototype.editTrain = function() {

    if (!(trainTracker.prototype.checkSignedInWithMessage())) { //not signed in, not allowed to edit

      alert("not allowed to edit")

    }
    else {  // signed in, can edit train


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
    } // end-if signed in

  
  }; //end edit-train on click

  trainTracker.prototype.editTrainInfo = function() {

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

    trainTracker.prototype.refreshTrainTracker();

  }; //end edit-train-info on click

  trainTracker.prototype.deleteTrain = function() {

    if (!(trainTracker.prototype.checkSignedInWithMessage())) { //not signed in, not allowed to delete

      alert("not allowed to delete")

    }
    else {  // signed in, can delete train

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
    } // end-if signed in

  }; //end delete-train on click


  trainTracker.prototype.deleteTrainInfo = function() {

    firebase.database().ref().child(trainKey).remove();

    $(".close-delete").trigger("click");

    trainTracker.prototype.refreshTrainTracker();

  }; //end delete-train-info on click


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

// Returns true if user is signed-in. Otherwise false and displays a message.
trainTracker.prototype.checkSignedInWithMessage = function() {
  // Return true if the user is signed in Firebase
  if (window.trainTracker.auth.currentUser) {
    return true;
  }

  // Display a message to the user using a Toast.



  //Inset modal message here



  // var data = {
  //   message: 'You must sign-in first',
  //   timeout: 2000
  // };
  // this.signInSnackbar.MaterialSnackbar.showSnackbar(data);
  return false;
};


    trainTracker.prototype.update = function() {
        var timeNow = moment();
        $("#clock").html(timeNow.format("hh:mm:ss A"));

        if (timeNow.format("ss") === "00") {
            trainTracker.prototype.refreshTrainTracker();
        }

    }; //end update function

    trainTracker.prototype.refreshTrainTracker = function() {

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
                      .append("<td><a id=\"edit-train\" data-toggle=\"modal\" href=\"#editModal\">Edit</a>/" +
                                  "<a id=\"delete-train\" data-toggle=\"modal\" href=\"#deleteModal\">Delete</a>")
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
            console.log("Errors handled: " + errorObject.code);
        });
    }; // end function

window.onload = function() {
  window.trainTracker = new trainTracker();
};

    $("#first-train-time-input").timepicker({ timeFormat: "HH:mm", interval: 5 });

    $(".train-table").empty();

    $(".train-table").append($("<tr>")
  		.append("<th style=\"width:15%\">Action</th>")
	    .append("<th style=\"width:20%\">Train Name</th>")
	    .append("<th style=\"width:20%\">Destination</th>")
	    .append("<th style=\"width:15%\">Frequency (Mins)</th>")
	    .append("<th style=\"width:15%\">Next Arrival</th>")
	    .append("<th style=\"width:15%\">Minutes Away</th>"));

    $("#clock").fitText(1.3);

    setInterval(trainTracker.prototype.update, 1000);


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
          .append("<td><a id=\"edit-train\" data-toggle=\"modal\" href=\"#editModal\">Edit</a>/" +
                      "<a id=\"delete-train\" data-toggle=\"modal\" href=\"#deleteModal\">Delete</a>")
          .append("<td>" + childSnapshot.val().trainName)
          .append("<td>" + childSnapshot.val().destination)
          .append("<td>" + childSnapshot.val().frequency)
          .append("<td>" + moment(nextTrain).format("hh:mm A"))
          .append("<td>" + tMinutesTillTrain);
        // console.log("child-added");
        $(".train-table").append($tr);

        // Handle the errors
    }, function(errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });


}); // end document ready
