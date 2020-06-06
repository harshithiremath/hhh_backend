const stripe=require("stripe")("sk_test_51GqJIvEkPqBpQLilF1MKxPVKJwtC4DztasQrhoqY9BB89NMRhxxsYnJJEW8FPe4OreHqFrRq1xbylfPgwHRZ5AmE00zTOMudSs")
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

  // ! route
  app.post("/rechargeWallet", (req, res) => {
    const user_email = req.body.user_email;

    // TODO get user_id
    connection.query(
      `SELECT user_id FROM users WHERE email='${user_email}'`,
      (err, res1) => {
        if (err) {
          console.log("error in rechargeWallet 1");
          res.sendStatus(201);
        } else {
          const user_id = res1[0].user_id;
          // console.log("user_id", res1[0].user_id);
          // TODO increase the wallet by amount
          // console.log(
          //   `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`
          // );
          connection.query(
            `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`,
            (err, res2) => {
              if (err) {
                console.log("error in rechargeWallet 2");
                res.sendStatus(201);
              } else {
                console.log("successfully recharged the wallet");
                res.sendStatus(200);
              }
            }
          );
        }
      }
    );
  });
  const postStripeCharge = (res,email) => (stripeErr, stripeRes) => {
    if (stripeErr) {
      console.log("error in rechargeWallet");
          res.sendStatus(201);
    } else {
      console.log("Done")
      connection.query(
        `SELECT user_id FROM users WHERE email='${email}'`,
        (err, res1) => {
          if (err) {
            console.log("error in rechargeWallet 1");
            res.sendStatus(201);
          } else {
            const user_id = res1[0].user_id;
            // console.log("user_id", res1[0].user_id);
            // TODO increase the wallet by amount
            // console.log(
            //   `UPDATE wallet SET balance=balance+${req.body.amount}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`
            // );
            connection.query(
              `UPDATE wallet SET balance=balance+${1000}, expiry=DATE_ADD(expiry, INTERVAL 2 MONTH) WHERE user_id=${user_id}`,
              (err, res2) => {
                if (err) {
                  console.log("error in rechargeWallet 2");
                  res.sendStatus(201);
                } else {
                  console.log("successfully recharged the wallet");
                  res.sendStatus(200);
                }
              }
            );
          }
        }
      );
    }
  }
  app.post("/rechargeStripe",async (req,res)=>{
    console.log("Request :", req.body);

    let error;
    let status;
    const { token } = req.body;
    const customer = await stripe.customers.create({
      source: 'tok_visa',
      email: token.email
    });

    const charge = await stripe.charges.create(
      {
        amount: 1000 * 100,
        currency: "INR",
        customer: customer.id,
        description: `Added to walllet`,
      },
      postStripeCharge(res,token.email)
    );
  })
};
