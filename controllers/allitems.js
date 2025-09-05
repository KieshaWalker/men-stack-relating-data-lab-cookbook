const express = require('express');
const router = express.Router();

const User = require('../models/user.js');


router.get('/', async (req, res) => {// items/items// landing view is just // any time you use the word use the /items everything follows that slash.
    try{
        const currentUser = await User.findById(req.session.user._id);
        res.render('items/allitems.ejs' , { tuna: currentUser.foods, });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});

router.get('/add', async (req, res) => {
    console.log('in route')
    res.render('items/add.ejs')
});

router.get('/edit', async (req, res) => {
     try{
        const currentUser = await User.findById(req.session.user._id);
        res.render('items/edit.ejs' , { tuna: currentUser.foods, });
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
});



router.put('/:userId', async (req, res) => {
    console.log('testing')
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
