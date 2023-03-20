const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError')
const Trail = require('../models/trail');
const { trailSchema} = require('../schemas.js');


//for trail difficulty options
const difficulty = ['Easy', 'Moderate', 'Strenuous', 'Extremely strenuous']


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

router.get('/new', (req, res) => {
    res.render('trails/new', { difficulty });
})

router.post('/', validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body);
    await trail.save();
    req.flash('success', 'Succesfully created trail');
    res.redirect(`/trails/${trail._id}`);
}))

router.get('/:id', catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate('reviews');
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/detail', { trail })
}))

router.get('/:id/edit', catchAsync(async (req, res,) => {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail, difficulty })
}))

router.put('/:id', validateTrail, catchAsync(async (req, res) => {
    const { id } = req.params
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body })
    req.flash('success', "Successfully updated trail")
    res.redirect(`/trails/${trail._id}`)
}))

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    req.flash('success', "Deleted trail")
    res.redirect('/trails');
})

module.exports = router;