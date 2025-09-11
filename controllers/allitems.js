const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


// List all foods
router.get('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    res.render('items/allitems.ejs', { item: currentUser.foods });
  } catch (error) {
    console.log(error);
    return res.redirect('/');
  }
});

// New form
router.get('/add', (req, res) => {
  res.render('items/add.ejs');
});


router.put('/edit/:itemId', async (req, res) => {
    try {
        console.log('put route hit');
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.foods.id(req.params.itemId);
        food.name = req.body.name;
        food.quantity = req.body.quantity;
        food.description = req.body.description;
        await currentUser.save();
        res.redirect('/items');
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
});

// Edit form (single item)
router.get('/edit/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const food = currentUser.foods.id(req.params.itemId);
        res.render('items/edit.ejs', { item: food });
    } catch (error) {
        console.log(error);
        return res.redirect('/');
    }
});

// Create
router.post('/', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id);
    currentUser.foods.push({
      name: req.body.name,
      quantity: req.body.quantity,
      description: req.body.description,
    });
    await currentUser.save();
    res.redirect('/items');
  } catch (error) {
    console.log(error);
    return res.redirect('/');
  }
});

router.delete('/:itemId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id);
        const item = currentUser.foods.id(req.params.itemId);
        if (item) {
            item.deleteOne(); // removes the subdocument
            await currentUser.save();
        }
        res.redirect('/items');
    } catch (e) {
        console.log(e);
        res.redirect('/items');
    }
});

module.exports = router;
