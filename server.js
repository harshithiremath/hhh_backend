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
app.get("/hhh",(req,res)=>{
  res.send("Welcome to HHH website ");
})
app.get("/", (req, res) => {
  res.json({ message: "Welcome to hhh test application." });
});

require("./app/routes/user.routes.js")(app);
// require("./app/routes/tour.routes")(app);
app.post("/merch",(req,res)=>{
  connection.query("SELECT * from merch", function (err, results, fields) {
    if (err) {
      res.send({ message: "error in query" });
    } else {
      res.json(results);
    }
   })
})
app.post("/checkout/tickets",(req,res)=>{
  details=req.body.details
  //details.user_id
  //details.ticket_quantity
  //details.tour_id
  //details.price
  //details.time
  connection.query("select balance from wallet where user_id= ? and balance > ?",[details.user_id,details.price],(error,row)=>{
    if(error) throw err 
    if(row){
      balance=row[0].balance || row[0] ;
      connection.query("insert into ticket_purchase (user_id,ticket_quantity,tour_id, price, time_purchased) values ? ",details,(err,result)=>{
        if(err) throw err
        console.log("Ticket inserted")
        res.send(result)
        balance-=details.price
        connection.query("update wallet set balance= ? where user_id= ",[balanace,details.user_id],(err,ress)=>{
          if(err) throw err ;
          console.log('Wallet updated');
        })
        return
      })
    if(!row){
      res.status(418).send({message:"Insufficient Balance"})
    }
    else res.status(500).send({message: "Server Eroor"})
    }
  })
})
app.post("/cart",(res,req)=>{
  data=req.body
  //data.user_id
  if(data.message==="insert"){
    connection.query("select quantity from merchandise_cart where user_id=? and merch_id= ?",[data.user_id,data.merch_id],(err,res)=>{
      if(err) throw err;
      if(!res){
        connection.query("insert into merchandise_cart(user_id,merch_id,quantity) values ?",data.details,(err,rws)=>{
          if (err) throw err; 
          app.post("/checkout/merchandise")
          console.log("inserted in cart");
        }) 
        res.send("Item added  to cart ");
        return;
      }
      if(res){
        quantiti=res[0].quantity || res[0]
        quantiti+=data.details.quantity
        connection.query("update merchandise_cart set quantity= ? where user_id = ? and merch_id= ?",[quantiti,data.details.quantity,data.details.merch_id],(err,res)=>{
          if(err)
          console.log("quantity updated")
        })
        res.send("Item added to cart");
        return;
      }
    })
  }
  if( data.message==="view"){
    connection.query("select m.merch_id,m.quantity ,p.price*m.quantity as price from merch p,merchandise_cart m where user_id= ? and m.merch_id=p.merch_id ",[data.details.user_id],(err,resu)=>{
      if (err) throw err; 
      if(resu){
        res.send(resu);
      }
      if(!resu){
        res.send("cart is empty");
      }
    })
  }
})


require("./app/routes/tours")(app);
app.listen(5000, () => {
  console.log("Server is running on port 5000.");
});
