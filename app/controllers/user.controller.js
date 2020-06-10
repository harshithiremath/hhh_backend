const User = require("../models/user.model.js");
const LocalStrategy=require('passport-local').Strategy;

// Create and Save a new uer
/*
exports.create = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    email: req.body.user.email,
    first_name: req.body.user.first_name,
    last_name: req.body.user.last_name,
    password: req.body.user.password,
    phone: req.body.user.phone,
  });

  // Save user in the database
  User.create(user, (err, data) => {
    if (err) {
      if (err.message === "User present in database") {
        console.log("Present in database");
        res.status(418).send({
          message: err.message,
        });
        return;
      } else {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the user.",
        });
      }
    } else {
      res.send(data);
    }
  });
};
*/
module.exports=function(passport){
  
  passport.use(
    new LocalStrategy({
      usernameField: 'user[email]',
    passwordField: 'user[password]'
    },
    (username,password,done)=>{
      console.log("u",username)  
      const user = new User({
        email:username,
        password: password,
      });
        User.verify(user,(err,data)=>{
          if(err){ 
            return done(err);
          }
          else{
            console.log(data)
            return done(null,data);
          }
        });
    }));
};
  /*
exports.verify = (req, res) => {
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  const user = new User({
    email: req.body.user.email,
    password: req.body.user.password,
  });
  User.verify(user, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while signing the user.",
      });
    else {
      console.log("data in verify", data);
      res.send(data);
    }
  });
};
*/