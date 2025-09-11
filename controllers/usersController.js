const express = require('express'); 
const router = express.Router(); 
const User = require('../models/user.js');

router.get('/', async (req, res) => {
     const users = await User.find({},
         'username foods');
         // only needed fields
         res.render('users/index.ejs',
            { users });
});


router.get('/:id', async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.redirect('/users');
    res.render('users/show.ejs', { otherUser: user });
});

module.exports = router;

