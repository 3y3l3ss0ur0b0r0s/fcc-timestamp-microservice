// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
// use node to get timestamps from various formats of time/date
app.get("/api/:timeCode?", function (req, res) {

  // if there is no timeCode
   if(req.params.timeCode == null) {
    console.log("Date not provided... :(");

    // get current date/time object
    let dateObject = new Date(Date.now());
    
     // return current date/time
    res.json({
      unix: Date.now(),
      utc: dateObject.toUTCString()
    });
  }

  // set up two variables to see if timeCode string is best interpreted as a String or an int in order to convert to a date
  // for dates/times provided in non-unix format, and unix format respectively
  let inputString = req.params.timeCode;
  let inputInt = 0;

  // to create a string we can interpret for conversions to non-unix or unix format
  // the string must be accessible to the conversion operations and outside of it
  let dateStringDate = new Date();

  // regex to use during the conditionals for determining the conversion operations
  const millisecondPattern = /^[0-9]+$/;

  // conditionals and conversion operations
  if (millisecondPattern.test(inputString) == true) {
    // converting unix input string to an int
    inputInt = parseInt(inputString);
    // converting that int to a date to use for the following conditionals
    dateStringDate = new Date(inputInt);
  } else {
    // since the input string is already in date format, converts it to a date string straight-up
    dateStringDate = new Date(inputString);
  }

  // use the dateStringDate to decide how to convert the missing value (unix or UTC)
  // if the date was provided in a correctly formatted non-unix string, get the month, day, and year, and the unix time
  if (inputInt == 0 && dateStringDate != "Invalid Date") {
    
    // get month, day, and year from dateStringDate
    let month = dateStringDate.getMonth();
    let day = dateStringDate.getDay();
    let year = dateStringDate.getYear();

    // get unix date/time int
    let unixDate = new Date(req.params.timeCode);
    let utcDate = dateStringDate.toUTCString();

    // return the JSON
    res.json({
      unix: Math.floor(unixDate.getTime()),
      utc: utcDate
    });
    
  } else if (inputInt != 0) {
    
    // if the timeCode was provided as a string representing a unix date/time int, then get the UTC date by converting the value to a Date object
    
    let unixDate = inputInt;
    let utcDateObject = new Date(inputInt);
    let utcDate = utcDateObject.toUTCString();

    // return the JSON
    res.json({
      unix: unixDate,
      utc: utcDate
    });
  } else {

    // if something was provided in invalid format, then return the error "Invalid Date" in a JSON object
    console.log("Invalid date provided... :(");

    // returning the JSON
    res.json({
      error: "Invalid Date"
    });
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
