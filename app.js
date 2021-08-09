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

// Index/Homepage Route
app.get("/", (req, res) => {
  res.locals.title = "home";
  res.render("home/home.ejs");
});

// Create Route for audio creation and rendering
app.post("/", (req, res) => {
  let audio = req.body.audio;
  console.log(`text from ajax call ${audio}`);
  // Using spawn to call python script
  const childPython = spawn("python", ["hello.py", audio]);
  //Execute the python script and fetch data
  childPython.stdout.on("data", (data) => {
    let str = data.toString();
    let jsonObj = JSON.parse(str);
    console.log(jsonObj.hi);
    // res.render("about/about.ejs");
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
  res.render("about/about.ejs");
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
