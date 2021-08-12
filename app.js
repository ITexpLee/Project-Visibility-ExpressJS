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
  if (src) {
    console.log(`Source printed by about: ${src}`);
  } else {
    src = "";
  }
  res.render("home/home.ejs", { src: src });
});

// Create Route for audio creation and rendering
app.post("/", (req, res) => {
  // Using spawn to call python script
  let audio = "success";
  console.log(req.body);
  const childPython = spawn("python", ["hello.py", audio]);
  //Execute the python script and fetch data
  childPython.stdout.on("data", (data) => {
    // Converting the data to string
    let stri = data.toString();
    // Parsing the JSON to javascript object
    let jsonObj = JSON.parse(stri);
    // Destructing the object and creating variables
    let str = jsonObj.str;
    src = jsonObj.src;
    // User if he wants to stop traversing
    // src = "stop";
    // Redirecting to the specified link
    res.redirect(str);
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
  if (src) {
    console.log(`Source printed by about: ${src}`);
  } else {
    src = "";
  }
  res.render("about/about.ejs", { src: src });
});

//Programmes Route
app.get("/programs/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  res.locals.title = "programs";
  res.render("programs/programs.ejs", { id: id });
});

//Starting up server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`You are listening at PORT: ${port}`);
});
