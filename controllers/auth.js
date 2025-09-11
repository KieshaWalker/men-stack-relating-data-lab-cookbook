// controllers/auth.js
// Handles user authentication: sign-up, sign-in, sign-out.

const express = require('express'); // import express
const router = express.Router(); // create router
const bcrypt = require('bcrypt'); // hashing library
const User = require('../models/user.js'); // User model
const { asyncRoute } = require('../utils/route-helpers.js'); // async wrapper

// GET /auth/sign-up - show registration form
router.get('/sign-up', (req, res) => { // simple GET
  res.render('auth/sign-up.ejs'); // render template
});

// GET /auth/sign-in - show login form
router.get('/sign-in', (req, res) => { // simple GET
  res.render('auth/sign-in.ejs'); // render template
});

// GET /auth/sign-out - destroy session then redirect
router.get('/sign-out', (req, res) => { // logout route
  req.session.destroy(); // remove session data
  res.redirect('/'); // go home
});

// POST /auth/sign-up - create new user
router.post('/sign-up', asyncRoute(async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username }); // check duplicate username
  if (userInDatabase) return res.send('Username already taken.'); // reject duplicate
  if (req.body.password !== req.body.confirmPassword) { // validate confirm
    return res.send('Password and Confirm Password must match'); // mismatch message
  }
  const hashedPassword = bcrypt.hashSync(req.body.password, 10); // hash password
  req.body.password = hashedPassword; // replace plain password
  await User.create(req.body); // create user document
  res.redirect('/auth/sign-in'); // redirect to login
}, '/'));

// POST /auth/sign-in - authenticate user
router.post('/sign-in', asyncRoute(async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username }); // fetch user
  if (!userInDatabase) return res.send('Login failed. Please try again.'); // guard on missing
  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password); // compare hash
  if (!validPassword) return res.send('Login failed. Please try again.'); // wrong password
  req.session.user = { // store minimal user info in session
    username: userInDatabase.username,
    _id: userInDatabase._id
  };
  res.redirect('/'); // go home
}, '/'));

module.exports = router; // export router

