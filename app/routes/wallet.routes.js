module.exports = (app, connection) => {
  // app.get("/singleTour", (req, res) => {
  //     const tour_id = req.query.tour_id;
  //     // console.log("tour_id", tour_id);
  //     connection.query(
  //       `SELECT * FROM tours WHERE tour_id='${tour_id}'`,
  //       (err, res1, fields) => {
  //         if (err) {
  //           res.send({
  //             message: "error in singleTour get1"
  //           });
  //         } else {
  //           res.send(res1);
  //         }
  //       }
  //     );
  //   });

  // ! route

  app.get("/getWalletInfo", (req, res) => {
    const user_id = req.query.user_id;
    // console.log(
    //   `SELECT * FROM wallet WHERE user_id = (SELECT user_id FROM users WHERE email='${user_id}')`
    // );
    connection.query(
      `SELECT * FROM wallet WHERE user_id = (SELECT user_id FROM users WHERE email='${user_id}')`,
      (err, res1, fields) => {
        if (err) {
          console.log("error in query 1 of getWalletInfo");
          res.send({
            message: "error in query 1 of getWalletInfo",
          });
        } else {
          res.send(res1);
        }
      }
    );
  });
};
