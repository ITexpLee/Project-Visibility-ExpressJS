//Importing express and all other modules on top
const express = require("express");
const app = express();
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
// Fetching module to run python scripts
const { spawn } = require("child_process");

//Setting up the view engine and it's directory
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//All Express middleware/ Static files
app.use(express.urlencoded({ extended: true })); //req.body is parsed as a form
app.use(methodOverride("_method")); //Setting the query for method-override
app.use(express.static(path.join(__dirname, "public"))); //It will serve our static files

//Default Index Route
//We don't need to add backslash when rendering view pages
// app.get("/name", (req, res) => {
//   // JavaScript object
//   // const obj1 = { visit: "Oye Kool" };
//   // const childPython = spawn("python", ["--version"]);
//   const username = req.query.username;
//   console.log(username);
//   const childPython = spawn("python", ["hello.py", username]);
//   //Execute the script
//   childPython.stdout.on("data", (data) => {
//     res.send(`stdOut: ${data}`);
//   });
//   childPython.stderr.on("data", (data) => {
//     console.error(`stdError ${data}`);
//   });
//   childPython.on("close", (code) => {
//     console.log(`child process exited with the code: ${code}`);
//   });
// });

//Homepage Route
app.get("/home", (req, res) => {
  res.render("home/home.ejs");
});

//Starting up server
app.listen(3000, () => {
  console.log("You are listening at PORT: 3000");
});
