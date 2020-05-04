const sql = require("./db");

const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
};

User.create = (newUser, result) => {
  sql.query("SELECT * FROM users WHERE email= ?",newUser.email,(err,res)=>{
    if (err){
      console.log('error:',err);
      result(err,null);
      return;
    }
    if (res.length){
      console.log("Users credentials already present in database");
      result({message:'User present in database'},null);
      return;
    }
    else if(!res.length){  
      sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }
      
        console.log("created user: ", { id: res.insertId });
        result(null, { id: res.insertId, first_name: newUser.first_name });
      });
    }
  });
};

User.verify = (checkUser, result) => {
  let email = checkUser.email;
  sql.query(`SELECT FROM users where email = ${email}`, (err, res) => {
    if (err) {
      console.log("error", err);
      result(err, null);
      return;
    }
    if (res.password === checkUser.password) {
      console.log("signed in: ", { id: res.user_id });
      result(null, { id: res.user_id, email: email });
    }
  });
};
module.exports = User;
