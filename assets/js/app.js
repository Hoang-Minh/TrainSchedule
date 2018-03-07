$(document).ready(function(){

    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAxO4qE19m9RlZk_bwCLjyOgcpBmAeYpuY",
        authDomain: "trainschedule-b18fd.firebaseapp.com",
        databaseURL: "https://trainschedule-b18fd.firebaseio.com",
        projectId: "trainschedule-b18fd",
        storageBucket: "",
        messagingSenderId: "175316701213"
    };
    firebase.initializeApp(config);
    
    // define database
    var trainDatabase = firebase.database().ref("/train");
    //var trainDatabase
    
    //console.log(trainDatabase);

    // Load data and display when the page is loading
    trainDatabase.on("value", displayData, getError);

    function displayData(snap){
        $("#train").empty();
        var values = snap.val();

        if(!$.isEmptyObject(values)){
            var keys = Object.keys(values);
            console.log(keys);

            for(var i = 0; i < keys.length; i++){
                var k = keys[i];
                var trainName = values[k].name;
                var trainDestination = values[k].destination;
                var trainFrequency = values[k].frequency;
                var trainFirstTime = values[k].firstTime;
                var minutesTillTrain = getMinutesTillTrain(trainFrequency, trainFirstTime);
                var nextTrain = moment().add(minutesTillTrain, "minutes").format("hh:mm");
                
                var trainData = "<tr>";
                trainData += "<td>" + trainName + "</td>";
                trainData += "<td>" + trainDestination + "</td>";
                trainData += "<td>" + trainFrequency + "</td>";
                trainData += "<td>" + nextTrain + "</td>";
                trainData += "<td>" + minutesTillTrain + "</td>";

                trainData += "</tr>";

                $("#train").append(trainData);
            }
        }
    }

    function getError(error){
        console.log(error);
    }

    function getMinutesTillTrain(tFrequency, firstTime){
        // First Time (pushed back 1 year to make sure it comes before current time)
        var firstTimeConverted = moment(firstTime, "hh:mm").subtract(1, "years");
        console.log(firstTimeConverted);

        // Current Time
        var currentTime = moment();
        console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

        // Difference between the times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        console.log("DIFFERENCE IN TIME: " + diffTime);

        // Time apart (remainder)
        var tRemainder = diffTime % tFrequency;
        console.log(tRemainder);

        // Minute Until Train
        var tMinutesTillTrain = tFrequency - tRemainder;
        console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

        return tMinutesTillTrain;
    }


    $(document).on("click", "#addToDatabase", function(event){
        event.preventDefault();
        var trainName = $("#name").val().trim();
        var trainDestination = $("#destination").val().trim();        
        var trainFrequency = $("#frequency").val().trim();        
        var trainFirstTime = $("#first-train-time").val().trim();
        
        trainDatabase.push({
            name : trainName,
            destination : trainDestination,
            frequency : trainFrequency,
            firstTime : trainFirstTime,
            dataAdded: firebase.database.ServerValue.TIMESTAMP
            });
        });
})