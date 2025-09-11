// controllers/users.js
// Community related routes: list users and show a user's pantry (read-only)

const express = require('express'); // import express
const router = express.Router(); // create a router
const User = require('../models/user.js'); // User model
const { asyncRoute } = require('../utils/route-helpers.js'); // async helper

// GET /users - list all users (including self)
router.get('/', asyncRoute(async (req, res) => {
  const users = await User.find({}, 'username foods._id'); // project only needed fields
  res.render('users/index.ejs', { users }); // render community index
}, '/'));

// GET /users/:id - show another user's pantry
router.get('/:id', asyncRoute(async (req, res) => {
  const otherUser = await User.findById(req.params.id); // fetch user by id
  if (!otherUser) return res.redirect('/users'); // redirect if missing
  res.render('users/show.ejs', { otherUser }); // render pantry view
}, '/users'));

module.exports = router; // export router

