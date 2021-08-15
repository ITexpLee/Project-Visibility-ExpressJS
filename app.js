//Importing express and all other necessary modules
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
// Child process module for python
const { spawn } = require("child_process");

//Setting up the view engine and it's directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//All Express middleware/ Static files
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //req.body is parsed as a form
app.use(methodOverride("_method")); //Setting the query for method-override
app.use(express.static(path.join(__dirname, "public"))); //It will serve our static files

// Creating global variable for src file of mp3

// Global variable to store audio src
var src;

// Index/Homepage Route
app.get("/", (req, res) => {
  res.locals.title = "home";
  if (!src) {
    src = "";
  }
  res.render("home/home.ejs", { src: src });
});

// Create Route for sending audio Text to python
app.post("/", (req, res) => {
  // Getting information out of Request body
  var { url } = req.body.user;
  const userInformation = req.body.user;
  // Using spawn to call python script
  const childPython = spawn("python", [
    "test_file_updated.py",
    JSON.stringify(userInformation),
  ]);
  //Execute the python script and fetch data
  childPython.stdout.on("data", (data) => {
    const doIt = data.toString();
    // Parsing JSON to JavaScript Object
    let pythonData = JSON.parse(data);
    // Destructing the object and creating variables
    let str = pythonData.str;
    src = pythonData.src;
    console.log(`total python data ${doIt}`);
    // console.log(`source printed by python ${src}`);
    // User if he wants to stop traversing
    // src = "stop";
    // Redirecting to the specified link
    if (str === "stop") {
      res.redirect(url);
    } else {
      res.redirect(str);
    }
  });
  childPython.stderr.on("data", (data) => {
    console.error(`stdError ${data}`);
  });
  childPython.on("close", (code) => {
    console.log(`child process exited with the code: ${code}`);
  });
});

// About Route
app.get("/about", (req, res) => {
  res.locals.title = "about";
  if (!src) {
    src = "";
  }
  res.render("about/about.ejs", { src: src });
});

// How to Use Route
app.get("/howtouse", (req, res) => {
  res.locals.title = "howtouse";
  if (!src) {
    src = "";
  }
  res.render("howtouse/howtouse.ejs", { src: src });
});

//More Routes
// motivation Route
app.get("/more/motivation", (req, res) => {
  const { id } = req.params;
  if (!src) {
    src = "";
  }
  res.locals.title = "more";
  res.render("more/motivation.ejs", { id: id, src: src });
});

// benificiary Route
app.get("/more/beneficiary", (req, res) => {
  const { id } = req.params;
  if (!src) {
    src = "";
  }
  res.locals.title = "more";
  res.render("more/beneficiary.ejs", { id: id, src: src });
});

// technology Route
app.get("/more/beneficiary", (req, res) => {
  const { id } = req.params;
  if (!src) {
    src = "";
  }
  res.locals.title = "more";
  res.render("more/technology.ejs", { id: id, src: src });
});

//Starting up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`You are listening at PORT: ${port}`);
});
