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

const trails = require('./routes/trailroutes');
const reviews = require('./routes/reviewroutes');

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

app.use("/trails", trails)
app.use("/trails/:id/reviews", reviews);


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
