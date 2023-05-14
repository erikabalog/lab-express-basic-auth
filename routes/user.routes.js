const router = require("express").Router();
const bcrypt = require('bcryptjs'); //we need to use package to create user in DB and compare HASH
const saltRounds = 14; //nr. of cycles rounds that will apply algoritm

const isLoggedIn = require("../middleware/isLoggedIn");
const isLoggedOut = require("../middleware/isLoggedOut");
const User = require("../models/User.model");


/* GET home page */
 router.get("/", (req, res, next) => {
   res.render("index");
 }); 

//Iteration 1 | Sign Up

router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("signup");
});

//signup process
router.post("/signup", isLoggedOut, (req, res, next) => {

  let { username, password, passwordRepeat } = req.body;

  if (username == "" || password == "" || passwordRepeat == "") {
    let data = {
      errorMessage: "Missing information",
      user: {
        username,
        password,
        passwordRepeat,
      }
    }
    res.render("signup", data);
    return;
  }
  else if(password != passwordRepeat) {
    let data = {
      errorMessage: "Passwords must match!", 
      user: {
        username,
        password,
        passwordRepeat,
      }
    }
    res.render("signup", data); 
    return;
  } 

  //checking if username existe in DB
  User.find({ username }) //returns an array
    .then(user => {
      if(user.length != 0) {
        //username exist in DB
        let data = {
          errorMessage: "Username already exist",
          user: {
            username,
            password,
            passwordRepeat,
          }
        }
        res.render("signup", data);
        return;
      }
       //we need package bcryptjs
      //we need to create a param salt (number of cycle rounds)
      const salt= bcrypt.genSaltSync(saltRounds);
      const passwordEncrypted= bcrypt.hashSync(password, salt);

      console.log("password encrypted:", passwordEncrypted);

      User.create({ username, password: passwordEncrypted }) //user created and compare hash (encripted password)
        .then(result => {
          res.redirect("/login"); //login process done
        })
        .catch(err => next(err));
    })
  });
//Iteration 2 | Login

  //log in process
  router.get("/login", isLoggedOut, (req, res, next) => {
    res.render("login");
  });

  router.post("/login", isLoggedOut, (req, res, next) => {
    //login process
    let { username, password } = req.body;

    if (username == "" || password == "") {
      res.render("login", { errorMessage: "Missing Information" });
      return;
    }

    User.find({ username })
    .then(user => {
      if (user.length == 0) {  //if returning an empty array, user do not exist
        res.render("login", { errorMessage: "Wrong Credentials" })
        return;
      }
      let userDb = user[0];
      if (bcrypt.compareSync(password, userDb.password)) {
        //Session starts
        req.session.currentUser = username;
        res.redirect("/profile");
      } else {
        res.render("login", { errorMessage: "Wrong Credentials" });
        return;
      } 
    })
  });
 //Iteration 3 | Protected Routes
//create a profile user

router.get("/profile", (req, res, next)=>{
  res.send("profile ");
});

router.get("/main", isLoggedIn, (req, res, next) => { // compare if user is logged in or logged out
  res.render("main");
});

router.get("/private", isLoggedIn, (req, res, next) => { //if logged in pass if logged out redirect to login page
  res.render("private");
});

//Bonus | The validation
//post logout
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err => {
    if(err) next(err); //
    else res.redirect("/login");// if user doesn't exist consider it as logged out and send to login form
  }));

})

module.exports = router;
