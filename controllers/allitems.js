const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


router.get('/', async (req, res) => {// items/items// landing view is just // any time you use the word use the /items everything follows that slash.
    console.log("In all items route");
    res.render('items/allitems.ejs');
});

router.get('/add', async (req, res) => {
    console.log('in route')
    res.render('items/add.ejs')
});




module.exports = router;
