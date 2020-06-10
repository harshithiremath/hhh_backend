const sql = require("./db");

const User = function (user) {
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.email = user.email;
  this.phone = user.phone;
  this.password = user.password;
};

User.create = async (newUser, result) => {
  const passwordd=newUser.password;
  const hashCost=10;
  newUser.password=await bcrypt.hash(passwordd,hashCost);
  sql.query(
    `SELECT * FROM users WHERE email= '${newUser.email}'`,
    (err, res) => {
      if (err) {
        console.log("error:", err);
        result(err, null);
        return;
      }
      if (res.length) {
        console.log("Users credentials already present in database");
        result({ message: "User present in database" }, null);
        return;
      } else if (!res.length) {
        sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
          if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
          }

          console.log("created user: ", { id: res.insertId });
          result(null, { message:"User added to database"});
        });
      }
    }
  );
};

User.verify = (checkUser, result) => {
  let email = checkUser.email;
  sql.query(`SELECT * FROM hhh.users where email = '${email}'`,(err, res) => {
    if (err) {
       //console.log("error", err);
      result(err, { done: false });
      return;
    }
    if (res.length) {
      if (res[0].password === checkUser.password) {
        console.log("signed in: ", { id: res[0].user_id });
      result(null, { done: true, id: res[0].user_id,email:res[0].email /*, token: jwttoken*/ });
      } else {
        result(null, { done: false });
      }
    } 
    else {
      result(null, { done: false });
    }
  });
};
module.exports = User;
