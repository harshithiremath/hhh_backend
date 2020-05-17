const express = require("express");
let cors = require("cors");
const bodyParser = require("body-parser");
const connection = require("./app/models/db.js");
const app = express();

app.use(cors());
// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.get("/hhh", (req, res) => {
  res.send("Welcome to HHH website ");
});
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to hhh test application.",
  });
});

require("./app/routes/user.routes.js")(app);
// require("./app/routes/tour.routes")(app);

require("./app/routes/cart.routes.js")(app, connection);

require("./app/routes/checkout.routes.js")(app, connection);

require("./app/routes/wallet.routes.js")(app, connection);

//! route
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", function (err, results, fields) {
    if (err) {
      res.send({
        message: "error in query",
      });
    } else {
      res.send(results);
    }
  });
});

//! route
app.get("/merch", (req, res) => {
  //! This route is used both for getting the details of all the merchandise
  //! and of a single merchandise whose merch_id is passed in query object of HTTP GET request
  // // console.log(req);
  if (Object.keys(req.query).length != 0) {
    const merch_id = req.query.merch_id;
    connection.query(
      `SELECT * FROM merch WHERE merch_id='${merch_id}'`,
      function (err, results, fields) {
        if (err) {
          res.send({
            message: "error in query for individual merch",
          });
        } else {
          res.send(results);
        }
      }
    );
  } else {
    connection.query("SELECT * FROM merch", function (err, results, fields) {
      if (err) {
        res.send({
          message: "error in query",
        });
      } else {
        res.send(results);
      }
    });
  }
});

//! route
app.get("/orders", (req, res) => {
  const user = req.query.user;
  // // console.log("user", user);
  // // console.log(`SELECT * FROM users WHERE email='${user}'`);
  connection.query(
    `SELECT * FROM users WHERE email='${user}'`,
    (err, used_res, fields) => {
      if (err) {
        res.send({
          message: "error in query1",
        });
      } else if (used_res.length === 0) {
        res.send({});
      } else {
        // // console.log(useless_res[0].user_id);
        // // console.log(
        // //   `SELECT * FROM merchandise_order WHERE user_id='${used_res[0].user_id}'`
        // // );
        connection.query(
          `SELECT * FROM merchandise_order WHERE user_id='${used_res[0].user_id}'`,
          function (err, results, fields) {
            if (err) {
              res.send({
                message: "error in query2",
              });
            } else {
              res.send(results);
            }
          }
        );
      }
    }
  );
});

// ! route
app.get("/bought_tickets", (req, res) => {
  const user = req.query.user;
  // // console.log("user", user);
  connection.query(
    `SELECT * FROM users WHERE email='${user}'`,
    (err, res1, fields) => {
      if (err) {
        res.send({
          message: "error in bought_tickets1",
        });
      } else if (res1.length === 0) {
        res.send({});
      } else {
        connection.query(
          `SELECT * FROM ticket_purchase WHERE user_id='${res1[0].user_id}'`,
          (err, results, fields) => {
            if (err) {
              res.send({
                message: "error in bought_tickets2",
              });
            } else {
              res.send(results);
            }
          }
        );
      }
    }
  );
});

// ! route
app.get("/singleTour", (req, res) => {
  const tour_id = req.query.tour_id;
  // console.log("tour_id", tour_id);
  connection.query(
    `SELECT * FROM tours WHERE tour_id='${tour_id}'`,
    (err, res1, fields) => {
      if (err) {
        res.send({
          message: "error in singleTour get1",
        });
      } else {
        res.send(res1);
      }
    }
  );
});

//! route
app.post("/checkout/tickets", (req, res) => {
  details = req.body.details;
  //details.user_id
  //details.ticket_quantity
  //details.tour_id
  //details.price
  //details.time
  connection.query(
    "SELECT balance FROM wallet WHERE user_id= ? and balance > ?",
    [details.user_id, details.price],
    (error, row) => {
      if (error) throw err;
      if (row) {
        balance = row[0].balance || row[0];
        connection.query(
          "INSERT INTO ticket_purchase (user_id,ticket_quantity, tour_id, price, time_purchased) values ? ",
          details,
          (err, result) => {
            if (err) throw err;
            console.log("Ticket inserted");
            res.send(result);
            balance -= details.price;
            connection.query(
              "UPDATE wallet SET balance= ? WHERE user_id= ",
              [balanace, details.user_id],
              (err, ress) => {
                if (err) throw err;
                console.log("Wallet updated");
              }
            );
            return;
          }
        );
        if (!row) {
          res.status(418).send({
            message: "Insufficient Balance",
          });
        } else
          res.status(500).send({
            message: "Server Eroor",
          });
      }
    }
  );
});

//! route
app.post("/checkout/merch", (req, res) => {
  data = req.body;
  dtails = data.details;
  // ? details must be an array of arrays in which the inner array must have the values in order
  // ? details.user_id
  // ? details.merch_id
  // ? details.quantity
  // ? details.timestamp
  connection.query(
    "INSERT INTO orders_list values ?",
    [dtails],
    (err, rows) => {
      if (err) throw err;
      if (rows.affectedRows > 0) {
        connection.query(
          "INSERT INTO merchandise_order(user_id, price, time_purchased) SELECT p.user_id, sum(m.price*p.quantity) AS price, p.timestamp FROM merch m, orders_list p WHERE m.merch_id=p.merch_id and p.user_id=? and p.timestamp =?",
          [dtails.user_id, dtails.timestamp],
          (err, result) => {
            if (err) throw err;
            if (result.affectedRows > 0) {
              res.send(
                connection.query(
                  "SELECT * FROM merchandise_order WHERE user_id=? and time_purchased=?",
                  [dtails.user_id, dtails.timestamp],
                  (err, results) => {
                    if (err) throw err;
                    if (results) console.log("Order placed ");
                  }
                )
              );
            }
          }
        );
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
