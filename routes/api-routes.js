// Requiring our models and passport as we've configured it
const db = require("../models");
const passport = require("../config/passport");
const express = require("express");
const router = express.Router();

module.exports = function(app) {
  
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post("/api/login", passport.authenticate("local"), function(req, res) {
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      email: req.user.email,
      id: req.user.id,
      usertype: req.user.usertype,
    });
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post("/api/signup", function(req, res) {
    db.User.create({
      user: req.body.username,
      email: req.body.email,
      password: req.body.password,
      usertype: req.body.usertype,
    })
      .then(function() {

        res.redirect(307, "/api/login");
        
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  //Add winery
  app.post("/api/addwinery", function(req, res){
    db.Wineries.create(req.body).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.status(401).json(err);
    });
  });

  //Add event
  app.post("/api/addevent", function(req, res){
    
    db.Events.create(req.body).then(function(result){
      res.json(result);
    }).catch(function(err){
      res.status(401).json(err);
    })
  });

  app.get("/api/event/:id", function(req, res){
    db.Events.findAll({
      where: {
        FK_Wineryid: req.params.id,
      }
    }).then(function(result){
      res.json(result)
    })
  });


  // Route for logging user out
  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });

  // Route for getting some data about our user to be used client side
  app.get("/api/user_data", function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's email and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        email: req.user.email,
        id: req.user.id
      });
    }
  });

  app.get("/api/wineries_data/:id", function(req, res){
    db.Wineries.findAll({
      where: {
        FK_Userid: req.params.id,
        current: true,
      }
    }).then(function(result){
      res.json(result)
    })
  });

  app.get("/api/wineries_uncdata/:id", function(req, res){
    db.Wineries.findAll({
      where: {
        FK_Userid: req.params.id,
        current: false,
      }
    }).then(function(result){
      res.json(result)
    })
  });

  app.post("/api/wineryinfo", function(req, res){
    db.Wineries.findAll({
      where: {
        id: req.body.wineryid
      }
    }).then(function(result){
      
      res.json(result)
    })
  });


  app.get("/api/winerydata/:id",function(req,res){
    db.Wineries.findAll({
      where: {
        id: req.params.id
      }
    }).then(function(result){
      res.json(result)
    });
  });



  app.get("/api/winery", function(req, res){
    var query = {};
    if(req.query.winery_id){
      query.id = req.query.winery_id;
    }
    db.Wineries.findAll({
      where: query
    }).then(function(result){
      res.json(result);
    });
  });

  app.put("/api/updatewinery", function(req, res) {
    db.Wineries.update({
      current: req.body.current,
    },{
      where: {
        id: req.body.id
      }
    }).then(function(result){
      res.json(result)
    }).catch(function(err) {
      res.json(err)
    })
  })
};
