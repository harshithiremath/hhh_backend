module.exports = (app, connection) => {
  app.post("/checkout/confirmMerch", (req, res) => {
    // res.setTimeout(5000);
    res.setTimeout(5000);
    let user_id = req.body.user_id;
    let cartTotal = 0; // ? Have
    let wallet = 0; // ? Have
    let cart = {};
    // TODO Deducting money from wallet

    // getting the total cart worth
    connection.query(
      `SELECT COUNT(*), SUM(c.quantity*m.price) AS sum FROM merch m, users u, merchandise_cart c WHERE c.user_id=(SELECT user_id FROM users WHERE email='${user_id}') AND c.user_id=u.user_id AND c.merch_id=m.merch_id;`,
      (err, res1) => {
        if (err) {
          console.log("failed in merchCheckout1");
          res.sendStatus(500);
        } else {
          cartTotal = res1[0].sum;
          // //
          // //
          // //
          // getting the wallet balance
          connection.query(
            `SELECT balance FROM wallet WHERE user_id=(SELECT user_id FROM users WHERE email='${user_id}')`,
            (err, res1) => {
              if (err) {
                console.log("failed in merchCheckout2");
                res.sendStatus(500);
              } else {
                wallet = res1[0].balance;
                // // console.log("wallet", typeof wallet, wallet);
                // // console.log("cartTotal", typeof cartTotal, cartTotal);
                // deducting money from wallet
                let deducted_balance = wallet - cartTotal;
                console.log("deducted balance", deducted_balance);
                // // deducted_balance = 99999;
                // //
                // //
                // //
                // //
                connection.query(
                  `UPDATE wallet SET balance=${deducted_balance} WHERE user_id=(SELECT user_id FROM users WHERE email='${user_id}')`,
                  (err, res1) => {
                    if (err) {
                      console.log("failed in merchCheckout3");
                      res.sendStatus(500);
                    } else {
                      //   console.log("Money deducted from wallet");
                      // wallet = res1[0].balance
                      // //
                      // //
                      // //

                      // TODO Main

                      // getting cart contents
                      connection.query(
                        `SELECT merch_id, quantity FROM merchandise_cart WHERE user_id=(SELECT user_id FROM users WHERE email='${user_id}')`,
                        (err, res1) => {
                          if (err) {
                            console.log("failed in merchCheckout4");
                            res.sendStatus(500);
                          } else {
                            cart = res1[0];
                            console.log("cart >>", cart);
                            for (let [key, value] of Object.entries(cart)) {
                              console.log(`${key}: ${value}`);
                            }
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  });
  // app.post()
  // res.sendStatus(200)
};

// // res.json({
// //     message: "Welcome to hhh test application."
// // });
