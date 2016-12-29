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

  "use strict";

  // Initialize
  function trainTracker() {

    // Shortcuts to DOM Elements.
    this.userPic = $("#user-pic");
    this.userName = $("#user-name");
    this.signInButton = $("#sign-in");
    this.signOutButton = $("#sign-out");
    this.addTrainButton = $("#add-train");

    // Create Button Click Event Listeners
    $(document).on("click", "#sign-out", this.signOut);
    $(document).on("click", "#sign-in", this.signIn);
    $(document).on("click", "#add-train", this.addTrain);

    $(document).on("click", "#edit-train", this.editTrain);
    $(document).on("click", "#edit-train-info", this.editTrainInfo);
    $(document).on("click", "#delete-train", this.deleteTrain);
    $(document).on("click", "#delete-train-info", this.deleteTrainInfo);

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
    window.trainTracker.auth.signInWithPopup(provider);
  };

  // Signs-out of App.
  trainTracker.prototype.signOut = function() {
    window.trainTracker.auth.signOut();
  };

  trainTracker.prototype.addTrain = function(event) {
    event.preventDefault();

    if (!(trainTracker.prototype.checkSignedIn())) { //not signed in, not allowed to add

      $(".message").html("<p>You must be signed in to this app to add train records!</p>");

      $("#msgModal").modal();

    } else { // signed in, can add train

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

      //delete text input after add
      $("#train-name-input").val("");
      $("#destination-input").val("");
      $("#first-train-time-input").val("");
      $("#frequency-input").val("");

    } //end-if signed in  

  }; //end add-train click


  trainTracker.prototype.editTrain = function() {

    if (!(trainTracker.prototype.checkSignedIn())) { //not signed in, not allowed to edit

      $(".message").html("<p>You must be signed in to this app to edit train information!</p>");

      $("#msgModal").modal();

    } else { // signed in, can edit train


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

    $("#editModal").modal({
    backdrop: "static",
    keyboard: true});

    } // end-if signed in


  }; //end edit-train on click

  trainTracker.prototype.editTrainInfo = function() {

    trainName = $("#train-name-edit").val().trim();
    destination = $("#destination-edit").val().trim();
    firstTrainTime = $("#first-train-time-edit").val().trim();
    frequency = $("#frequency-edit").val().trim();

    firebase.database().ref().child(trainKey).set({

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

    if (!(trainTracker.prototype.checkSignedIn())) { //not signed in, not allowed to delete

      $(".message").html("<p>You must be signed in to this app to delete train records!</p>");

      $("#msgModal").modal();

    } else { // signed in, can delete train

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

    $("#deleteModal").modal({
    backdrop: "static",
    keyboard: true});


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
      this.userPic.css("backgroundImage", "url(" + profilePicUrl + ")");
      this.userName.text(userName);

      // Show user's profile and sign-out button.
      this.userName.removeClass("hidden");
      this.userPic.removeClass("hidden");
      this.signOutButton.removeClass("hidden");

      // Hide sign-in button.
      this.signInButton.addClass("hidden");

    } else { // User is signed out!
      // Hide user's profile and sign-out button.
      this.userName.addClass("hidden");
      this.userPic.addClass("hidden");
      this.signOutButton.addClass("hidden");

      // Show sign-in button.
      this.signInButton.removeClass("hidden");
    }
  };

  // Returns true if user is signed-in. Otherwise false and displays a message.
  trainTracker.prototype.checkSignedIn = function() {
    // Return true if the user is signed in Firebase
    if (window.trainTracker.auth.currentUser) {
      return true;
    }

    // Return false if the user is not signed in Firebase
    return false;
  };

  trainTracker.prototype.update = function() {
    var timeNow = moment();
    // $("#clock").html(timeNow.format("hh:mm:ss A"));

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

        tableSnapshot.forEach(function(dataSnapshot) {

            var dataObj = dataSnapshot.val();

            var dataKey = dataSnapshot.key;

            var tFrequency = dataObj.frequency;

            var firstTime = dataObj.firstTrainTime;

            // First Time (pushed back 1 year to make sure it comes before current time)
            var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

            // Current Time
            var currentTime = moment();

            // Difference between the times
            var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

            // Time apart (remainder)
            var tRemainder = diffTime % tFrequency;

            // Minute Until Train
            var tMinutesTillTrain = tFrequency - tRemainder;

            // Next Train
            var nextTrain = moment().add(tMinutesTillTrain, "minutes");

            // Train schedule to table
            var $tr = $("<tr>").attr("data-key", dataKey)
              .append("<td> <span id=\"edit-train\">Edit</span>/" +
                           "<span id=\"delete-train\">Delete</span>")
              .append("<td class=\"table-lcd-font\">" + dataObj.trainName)
              .append("<td class=\"table-lcd-font\">" + dataObj.destination)
              .append("<td class=\"table-lcd-font\">" + dataObj.frequency)
              .append("<td class=\"table-lcd-font\">" + moment(nextTrain).format("hh:mm A"))
              .append("<td class=\"table-lcd-font\">" + tMinutesTillTrain);
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

  // $("#clock").fitText(1.3);

  var clock = $("#clock").FlipClock({
    clockFace: "TwelveHourClock"
  });

  setInterval(trainTracker.prototype.update, 1000);


  databaseRef.ref().on("child_added", function(childSnapshot) {

    var tFrequency = childSnapshot.val().frequency;

    var firstTime = childSnapshot.val().firstTrainTime;

    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");

    // Current Time
    var currentTime = moment();

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

    // Time apart (remainder)
    var tRemainder = diffTime % tFrequency;

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;

    // Next Train
    var nextTrain = moment().add(tMinutesTillTrain, "minutes");

    // Train schedule to table
    var $tr = $("<tr>").attr("data-key", childSnapshot.key)
      .append("<td> <span id=\"edit-train\">Edit</span>/" +
                   "<span id=\"delete-train\">Delete</span>")
      .append("<td class=\"table-lcd-font\">" + childSnapshot.val().trainName)
      .append("<td class=\"table-lcd-font\">" + childSnapshot.val().destination)
      .append("<td class=\"table-lcd-font\">" + childSnapshot.val().frequency)
      .append("<td class=\"table-lcd-font\">" + moment(nextTrain).format("hh:mm A"))
      .append("<td class=\"table-lcd-font\">" + tMinutesTillTrain);

    $(".train-table").append($tr);

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });


}); // end document ready
