require('dotenv').config();
const express = require('express');
const router = express.Router();
// saving data and retrieving data from db - need mongoose
const mongoose = require('mongoose');
// dealing with mongoose and need to get user from database - need user model
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// start with router seperate routes
router.post('/signup', (req, res) => {
  console.log('hit backend /signup')
  // See if the email is already in the database
  User.findOne({email: req.body.email}, function(err, user) {
    console.log('after findOne', user)
    if(user) {
      // Alert user 'email is taken'
      console.log('Error 1', user)
      res.status(401).json({
        error: true,
        messsage: 'Email already exists'
      });
    } else {
      //if the email is not taken...
      //create the user in the database
      console.log('creating new user')
      User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      }, function(err,user) {
        //check for any db errors
        if (err) {
          console.log('WE GOT AN ERROR CREATING THE USER!!!!!!!!!!!!!');
          console.log(err);
          res.status(401).json(err);
        } else {
          //log user in (sign a new token (jwt..jsonwebtoken??)''
          console.log('JUST ABOUT TO SIGN THE TOKEN!!!!!$$$$$$$$', user)
          var token = jwt.sign(user.toObject(), process.env.JWT_SECRET, {
            expiresIn: 60 * 60 *24
          })
          //Return user and token to React app
          res.json({user, token});
        }
      })
    }
  })
});

router.post('/login', (req, res) => {
  //Look up user in the database
  User.findOne({email: req.body.email}, function(err,user) {
    if (user) {
      //if there is a user...
      //check their entered password against the hash

      //DO NOT USE THIS below
      // var passwordMatch = bcrypt.compareSync(req.body.password, user.password);
      if (user.authenticated(req.body.password)) {
        console.log('user was authenticated')
        //if it matches: log them in (sign a token)
        var token = jwt.sign(user.toObject (), process.env.JWT_SECRET, {
          expiresIn: 60 * 60 * 24
        });
        res.json({user, token});
      } else {
        //if it doesn't match: send an error
        //ADDED/edited##########
        res.json({
          error: true,
          //ADDED
          status: 401,
          message: 'Email or password is incorrect'
        });
      }
    } else {
      //if the user isn't inthe db...
      //ADDED/edited########################
      res.json({
        error: true,
        status: 401,
        message: 'Account not found'
      });
    }
  })
});

router.post('/me/from/token', (req, res) => {
  // front end sends us a Token, we need to verify it,***
    //...send it back to the front if it's valid***
  // make sure they send a token to the back***
  let token = req.body.token;
  // Check for the presence of a token
  if (!token) {
    // They didn't send me a Token
    res.status(401).json({
      error: true,
      message: 'You must pass a token'
    })
  } else {
    // We do have a Token
    // Validate the token
    jwt.verify(token, process.env.JWT_SECRET, function(err, user) {
      if (err) {
        res.status(401).json(err);
      } else {
        // If token is valid...
        // Look up the user in the db
        User.findById(user._id, function(err, user) {
          if (err) {
            //if the token is invalid...
            //send an error, redirect to a login screen
            res.status(401).json(err);
          } else {
            //send the user and the token back to the React app
            res.json({user, token});
          }
        })
      }
    })
  }
});

module.exports = router;
