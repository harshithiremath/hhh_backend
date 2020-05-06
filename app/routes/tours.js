const connection = require("../models/db");

module.exports=(app)=>{
    app.get("/tours", (req, res) => {
        connection.query("SELECT * from tours", function (err, results, fields) {
          if (err) {
            res.send({ message: "error in query" });
          } else {
            res.send(results);
          }
        });
      });
}