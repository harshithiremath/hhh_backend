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
app.get("/hhh", (req, res) => {
  res.send("Welcome to HHH website ");
});
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hhh test application." });
});

require("./app/routes/user.routes.js")(app);
// require("./app/routes/tour.routes")(app);

//! route
app.get("/tours", (req, res) => {
  connection.query("SELECT * FROM tours", function (err, results, fields) {
    if (err) {
      res.send({ message: "error in query" });
    } else {
      res.send(results);
    }
  });
});

//! route
app.get("/merch", (req, res) => {
  //! This route is used both for getting the details of all the merchandise
  //! and of a single merchandise whose merch_id is passed in query object of HTTP GET request
  // console.log(req);
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

//! route
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
          res.status(418).send({ message: "Insufficient Balance" });
        } else res.status(500).send({ message: "Server Eroor" });
      }
    }
  );
});

//! route
app.post("/cart", (res, req) => {
  data = req.body;
  //details:(Object conatining essential credentials)
  //data.details.user_id
  //data.details.merch_id
  //data.details.quantity
  if (data.message === "insert") {
    connection.query(
      "SELECT quantity FROM merchandise_cart WHERE user_id=? and merch_id= ?",
      [data.details.user_id, data.details.merch_id],
      (err, res) => {
        if (err) throw err;
        if (!res) {
          connection.query(
            "INSERT INTO merchandise_cart(user_id, merch_id,quantity) values ?",
            data.details,
            (err, rws) => {
              if (err) throw err;
              app.post("/checkout/merchandise");
              console.log("inserted in cart");
            }
          );
          res.send("Item added  to cart ");
          return;
        }
        if (res) {
          quantiti = res[0].quantity || res[0];
          quantiti += data.details.quantity;
          connection.query(
            "UPDATE merchandise_cart SET quantity= ? WHERE user_id = ? and merch_id= ?",
            [quantiti, data.details.quantity, data.details.merch_id],
            (err, res) => {
              if (err) console.log("quantity updated");
            }
          );
          res.send("Item added to cart");
          return;
        }
      }
    );
  }
  if (data.message === "view") {
    connection.query(
      "SELECT m.merch_id, m.quantity, p.price*m.quantity AS price FROM merch p, merchandise_cart m WHERE user_id= ? and m.merch_id=p.merch_id ",
      [data.details.user_id],
      (err, resu) => {
        if (err) throw err;
        if (resu) {
          res.send(resu);
        }
        if (!resu) {
          res.send("cart is empty");
        }
      }
    );
  }
});

//! route
app.post("/checkout/merch", (req, res) => {
  data = req.body;
  dtails = data.details;
  //details must be an array of arrays in which the inner array must have the values in order
  //details.user_id
  //details.merch_id
  //details.quantity
  //details.timestamp
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
