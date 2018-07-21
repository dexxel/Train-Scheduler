$(document).ready(function() {

var config = {
   
    apiKey: "AIzaSyCyk_tVCC9qjKFgt86bNxsw1B-M9gUST2k",
    authDomain: "my-demo-01-6aef2.firebaseapp.com",
    databaseURL: "https://my-demo-01-6aef2.firebaseio.com",
    projectId: "my-demo-01-6aef2",
    storageBucket: "my-demo-01-6aef2.appspot.com",
    messagingSenderId: "862091525028"
  };
  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var database = firebase.database();

  $("#submit").on("click", function(){
    event.preventDefault(); 
      var name = $('#nameInput').val().trim();
      var dest = $('#destInput').val().trim();
    //   var time = $('#timeInput').val().trim();
      var time = moment($("#timeInput").val().trim(), "HH:mm").subtract(10, "years").format("X");
      var freq = $('#freqInput').val().trim();

        var trainInfo = {
          name: name,
          dest: dest,
          time: time,
          freq: freq,
          timeAdded: firebase.database.ServerValue. TIMESTAMP
      };

      database.ref().push(trainInfo);

      console.log(trainInfo.name);
      console.log(trainInfo.destination); 
      console.log(trainInfo.time);
    //   console.log(time);
      console.log(trainInfo.frequency)

      // Alert
      alert("New train successfully added");

      $('#nameInput').val("");
      $('#destInput').val("");
      $('#timeInput').val("");
      $('#freqInput').val("");
      return false;

  });

  database.ref().on("child_added", function(childSnapshot){
      
    console.log(childSnapshot.val());

      var name = childSnapshot.val().name;
      var dest = childSnapshot.val().dest;
      var time = childSnapshot.val().time;
      var freq = childSnapshot.val().freq;

      console.log("Name: " + name);
      console.log("Destination: " + dest);
      console.log("Time: " + time);
      console.log("Frequency: " + freq);

      //Train Time Converted======

      var freq = parseInt(freq);

      //Current Time

      var currentTime = moment();
      console.log("CURRENT TIME: " + moment().format('HH:mm'));
      	//FIRST TIME: PUSHED BACK ONE YEAR TO COME BEFORE CURRENT TIME
    // var dConverted = moment(time,'hh:mm').subtract(1, 'years');
    var dConverted = moment(childSnapshot.val().time, 'HH:mm').subtract(1, 'years');
	console.log("DATE CONVERTED: " + dConverted);
	var trainTime = moment(dConverted).format('HH:mm');
	console.log("TRAIN TIME : " + trainTime);
	
	//DIFFERENCE B/T THE TIMES 
	var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
	var tDifference = moment().diff(moment(tConverted), 'minutes');
	console.log("DIFFERENCE IN TIME: " + tDifference);
	//REMAINDER 
	var tRemainder = tDifference % freq;
	console.log("TIME REMAINING: " + tRemainder);
	//MINUTES UNTIL NEXT TRAIN
	var minsAway = freq - tRemainder;
	console.log("MINUTES UNTIL NEXT TRAIN: " + minsAway);
	//NEXT TRAIN
	var nextTrain = moment().add(minsAway, 'minutes');
	console.log("ARRIVAL TIME: " + moment(nextTrain).format('HH:mm A'));
    //console.log(==============================);
   //TABLE DATA=====================================================
 //APPEND TO DISPLAY IN TRAIN TABLE
$('#currentTime').text(currentTime);
$('#trainTable').append(
		"<tr><td id='nameDisplay'>" + childSnapshot.val().name +
		"</td><td id='destDisplay'>" + childSnapshot.val().dest +
		"</td><td id='freqDisplay'>" + childSnapshot.val().freq + ' minutes' +
		"</td><td id='nextDisplay'>" + moment(nextTrain).format("HH:mm") +
		"</td><td id='awayDisplay'>" + minsAway  + ' minutes' + "</td></tr>");
 },

function(errorObject){
    console.log("Read failed: " + errorObject.code)
    });
});