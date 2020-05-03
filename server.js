const express = require("express");
let cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./app/models/db.js");
const app = express();
app.use(cors());
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Welcome to hhh test application." });
});

require("./app/routes/user.routes.js")(app);
// require("./app/routes/tour.routes")(app);

app.get("/tours", (req, res) => {
  connection.query("SELECT * from tours", function (err, results, fields) {
    if (err) {
      res.send({ message: "error in query" });
    } else {
      res.send(results);
    }
  });
});
app.get("/merch", (req, res) => {
  connection.query("SELECT * from merch", function (err, results, fields) {
    if (err) {
      res.send({ message: "error in query" });
    } else {
      res.send(results);
    }
  });
});
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
