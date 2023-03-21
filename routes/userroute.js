const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
    const {email,username,password} = req.body; 
    const user = new User({email,username});
    const registered = await User.register(user, password); 
    req.flash('success', 'Successfully created account!');
    res.redirect('/trails');
    }
    catch(e) { 
        req.flash("error", e.message);
        res.redirect('register');
    }
   
})) 

module.exports = router;