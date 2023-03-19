const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Trail = require('./models/trail');
const methodOverride = require('method-override');
require("dotenv").config();
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError')
const { trailSchema, reviewSchema} = require('./schemas.js');
const Joi = require('joi');
const Review = require('./models/review');


mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


mongoose.set('strictQuery', false)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection err:"));
db.once("open", () => {
    console.log("database connected");
})


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

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

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(e => e.message).join(',')
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/trails', async (req, res) => {
    const trail_list = await Trail.find({});
    res.render('trails/index', { trail_list });
})

app.get('/trails/new', (req, res) => {
    res.render('trails/new', { difficulty });
})

app.post('/trails', validateTrail, catchAsync(async (req, res, next) => {
    const trail = new Trail(req.body);
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
}))

app.delete('/trails/:id/reviews/:reviewid', catchAsync(async (req, res, next) => {
    const {id, reviewid} = req.params;
    await Trail.findByIdAndUpdate(id, {$pull: {reviews: reviewid}})
    await Review.findByIdAndDelete(reviewid);
    res.redirect(`/trails/${id}`); 
}))

app.get('/trails/:id', catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate('reviews');
    res.render('trails/detail', { trail })
}))

app.get('/trails/:id/edit', catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    res.render('trails/edit', { trail, difficulty })
}))

app.put('/trails/:id/', validateTrail, catchAsync(async (req, res) => {
    const { id } = req.params
    const trail = await Trail.findByIdAndUpdate(id, { ...req.body })
    res.redirect(`/trails/${trail._id}`)
}))

app.delete('/trails/:id', async (req, res) => {
    const { id } = req.params;
    await Trail.findByIdAndDelete(id);
    res.redirect('/trails');
})

app.post('/trails/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body);
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    res.redirect(`/trails/${trail._id}`); 
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = 'Something went wrong'
    res.status(status).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving port 3000")
})
