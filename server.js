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

// !!!! route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hhh test application." });
});

require("./app/routes/user.routes.js")(app);
// require("./app/routes/tour.routes")(app);

// !!!! route
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", function (err, results, fields) {
    if (err) {
      res.send({ message: "error in query" });
    } else {
      res.send(results);
    }
  });
});

// !!!! route
app.get("/merch", (req, res) => {
  // todo This route is used both by for getting the details of all the merchandise
  // todo and of a single merchandise whose merch_id is passed in query object of HTTP GET request
  // // console.log(req);
  if (Object.keys(req.query).length != 0) {
    const merch_id = req.query.merch_id;
    connection.query(
      `SELECT * FROM merch WHERE merch_id='${merch_id}'`,
      function (err, results, fields) {
        if (err) {
          res.send({ message: "error in query for individual merch" });
        } else {
          res.send(results);
        }
      }
    );
  } else {
    connection.query("SELECT * FROM merch", function (err, results, fields) {
      if (err) {
        res.send({ message: "error in query" });
      } else {
        res.send(results);
      }
    });
  }
});

// !!!! route
app.get("/orders", (req, res) => {
  const user = req.query.user;
  // console.log(req);
  console.log("user", user);
  // console.log(`SELECT * FROM users WHERE email='${user}'`);
  connection.query(`SELECT * FROM users WHERE email='${user}'`, function (
    err,
    useless_res,
    fields
  ) {
    if (err) {
      res.send({ message: "error in query1" });
    } else {
      // console.log(useless_res[0].user_id);
      console.log(
        `SELECT * FROM merchandise_order WHERE user_id='${useless_res[0].user_id}'`
      );
      connection.query(
        `SELECT * FROM merchandise_order WHERE user_id='${useless_res[0].user_id}'`,
        function (err, results, fields) {
          if (err) {
            res.send({ message: "error in query2" });
          } else {
            res.send(results);
          }
        }
      );
    }
  });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
