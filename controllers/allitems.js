// controllers/allitems.js
// Handles CRUD operations for a signed-in user's embedded food (pantry) items.

const express = require('express'); // import express
const router = express.Router(); // create isolated router instance
const User = require('../models/user.js'); // import User model (with embedded foods)
const { asyncRoute } = require('../utils/route-helpers.js'); // helper to DRY async routes

// GET /items - List all foods for the current user
router.get('/', asyncRoute(async (req, res) => {
  const currentUser = await User.findById(req.session.user._id); // fetch user by session id
  res.render('items/allitems.ejs', { item: currentUser.foods }); // render list view
}, '/'));

// GET /items/add - Display 'new food item' form
router.get('/add', (req, res) => { // simple sync route
  res.render('items/add.ejs'); // render add form
});

// GET /items/edit/:itemId - Show edit form for a specific food item
router.get('/edit/:itemId', asyncRoute(async (req, res) => {
  const currentUser = await User.findById(req.session.user._id); // locate user
  const food = currentUser.foods.id(req.params.itemId); // locate subdocument by id
  if (!food) return res.redirect('/items'); // guard if not found
  res.render('items/edit.ejs', { item: food }); // pass single item to view
}, '/items'));

// POST /items - Create a new food item
router.post('/', asyncRoute(async (req, res) => {
  const currentUser = await User.findById(req.session.user._id); // fetch user
  currentUser.foods.push({ // push sanitized fields
    name: req.body.name,
    quantity: req.body.quantity,
    description: req.body.description
  });
  await currentUser.save(); // persist changes
  res.redirect('/items'); // back to list
}, '/'));

// PUT /items/edit/:itemId - Update an existing food item
router.put('/edit/:itemId', asyncRoute(async (req, res) => {
  const currentUser = await User.findById(req.session.user._id); // fetch user
  const food = currentUser.foods.id(req.params.itemId); // find subdoc
  if (!food) return res.redirect('/items'); // guard
  food.name = req.body.name; // update fields
  food.quantity = req.body.quantity;
  food.description = req.body.description;
  await currentUser.save(); // save parent
  res.redirect('/items'); // redirect to list
}, '/items'));

// DELETE /items/:itemId - Remove a food item
router.delete('/:itemId', asyncRoute(async (req, res) => {
  const currentUser = await User.findById(req.session.user._id); // fetch user
  const item = currentUser.foods.id(req.params.itemId); // locate subdoc
  if (item) { // only if found
    item.deleteOne(); // remove subdocument instance
    await currentUser.save(); // persist update
  }
  res.redirect('/items'); // return to list
}, '/items'));

module.exports = router; // export router for mounting

