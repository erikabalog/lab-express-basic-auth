const isLoggedOut = (req, res, next) => {
    console.log("Hi from middleware 1!");
    if(req.session.currentUser) {
      //User logged in
      res.redirect("/profile");
    }
    else {
      //User not logged in
      next();
    }
  }

  module.exports = isLoggedOut;