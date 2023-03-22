const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const passport = require('passport');


router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registered = await User.register(user, password);
        //automatically login after registering
        req.login(registered, err => {
            if (err) {
                return next(err);
            }
        })
        req.flash('success', 'Successfully created account!');
        res.redirect('/trails');
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect('register');
    }

}))

router.get('/login', (req, res) => {
    res.render('users/login');
})

//passport middleware automatically authenticates and flashes if fail to login and redirect to login
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'Logged In');
    const redirectedURL = req.session.returnTo || '/trails'
    // delete req.session.returnTo
    res.redirect(redirectedURL);
})

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Successfully logged out');
        res.redirect('/trails');
    })
})
module.exports = router;
