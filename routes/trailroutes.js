const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Trail = require('../models/trail');
const { trailSchema } = require('../schemas.js');
const { isLoggedIn } = require('../middleware');

//for trail difficulty options
const difficulty = ['Easy', 'Moderate', 'Strenuous', 'Extremely strenuous']


const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail.author.equals(req.user._id)) {
        req.flash("error", 'You do not have permission to do that')
        return res.redirect(`/trails/${id}`);
    }
    next();
}


const validateTrail = (req, res, next) => {
    const { error } = trailSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.get('/', async (req, res) => {
    const trail_list = await Trail.find({});
    res.render('trails/index', { trail_list });
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('trails/new', { difficulty });
})

router.post('/', isLoggedIn, validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body);
    trail.author = req.user._id;
    await trail.save();
    req.flash('success', 'Succesfully created trail');
    res.redirect(`/trails/${trail._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate('reviews').populate('author');
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/detail', { trail })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res,) => {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail, difficulty })
}))

router.put('/:id', isLoggedIn, isAuthor, validateTrail, catchAsync(async (req, res) => {
    const { id } = req.params
    const trailz = await Trail.findByIdAndUpdate(id, { ...req.body })
    req.flash('success', "Successfully updated trail")
    res.redirect(`/trails/${trailz._id}`)
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail.author.equals(req.user._id)) {
        req.flash("error", 'You do not have permission to do that')
        return res.redirect(`/trails/${id}`);
    }
    await Trail.findByIdAndDelete(id);
    req.flash('success', "Deleted trail")
    res.redirect('/trails');
})

module.exports = router;
