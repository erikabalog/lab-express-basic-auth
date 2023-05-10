const router = require("express").Router();
const bcrypt = require("bcryptjs");
const saltRounds = 14;
const User = require("../models/User.model");

/* GET home page */
// router.get("/", (req, res, next) => {
//   res.render("index");
// });

router.get("/signup", (req, res, next) => {
  res.render("users/signup");
});

router.post("/signup", (req, res, next) => {
  //signup process
  const { username, password } = req.body;

  if (username == "" || password == "") {
    let data = {
      errorMessage: "Missing information",
      user: {
        username,
        password,
      },
    };
    res.render("users/signup", data);
    return;
  }

  const salt = bcrypt.genSaltSync(saltRounds);

  // Continue with the signup process
});

module.exports = router;