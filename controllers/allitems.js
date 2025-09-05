const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


router.get('/', async (req, res) => {// items/items// landing view is just // any time you use the word use the /items everything follows that slash.
    try{
        const currentUser = await User.findById(req.session.user._id);
        res.render('items/allitems.ejs' , { item: currentUser.foods });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.get('/add', async (req, res) => {
    console.log('in route')
    res.render('items/add.ejs')
});


router.get('/edit/:itemId', async (req, res) => {
     try{
        const currentUser = await User.findById(req.session.user._id);
            const item = currentUser.foods.id(req.params.itemId);
                res.locals.food = item;
        res.render('items/edit.ejs' , { item: currentUser });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.put('/edit/:itemId', async (req, res) => {
    console.log(req.body)
    try {
const currentUser = await User.findById(req.session.user._id);
    const item = currentUser.foods.id(req.params.itemId);

        if (!item) {
            return res.status(404).send('Item not found');
        }

            item.set(req.body);
        await currentUser.save();
        res.redirect("/items");
        
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});




router.post('/', async (req, res) => {
    console.log(req.body)
     try{
        const currentUser = await User.findById(req.session.user._id);
        currentUser.foods.push(req.body)
        await currentUser.save();
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
    res.redirect("/items")
});


router.delete('/', async (req, res) => {})







module.exports = router;
