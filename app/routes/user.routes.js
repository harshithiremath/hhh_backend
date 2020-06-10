const passport=require('passport');
const users=require('../controllers/user.controller')
module.exports = (app) => {

  // Create a new User
  // ! route
  app.post("/users", users.create);

  // ! route
  app.post("/signin", users.verify);
  //require('../controllers/user.controller')(passport)
  /*app.post("/signin", (req,res)=>{
    console.log(req.body.user.email)
     
    passport.authenticate(
      'local',
      {session:false},  
      (error,user)=>{
        if(error)
        {
          res.status(500).send({message:error.message||"Some error occurred while signing the user."})
        }
        if(!user){
          res.status(400).send({
            message: "Content can not be empty!",
          });
        }
        else{
        console.log("data inside verify",user)
        res.send(user);
        }
      }
    )(req,res)
  });
  */
  // Retrieve all Users
  //app.get("users", users.findAll);

  // Retrieve a single user with userId
  //app.get("/users/:userId", users.findOne);

  // Update a User with userId
  //app.put("/users/:userId", users.update);

  // Delete a User with userId
  //app.delete("/users/:userId", users.delete);

  // Create a new User
  //app.delete("/users", users.deleteAll);
};
