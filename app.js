const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
require("dotenv").config();
const ejsMate = require('ejs-mate');
const trails = require('./routes/trailroutes');
const reviews = require('./routes/reviewroutes');
const session = require('express-session');
const flash = require('connect-flash');

mongoose.connect(process.env.MONGODB, {
    useNewUrlParser: true,
    useUnifiedTopology: true, 
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
app.use(express.static(path.join(__dirname, 'public')));

const sessConfig = {
    secret:  process.env.SECRET_KEY, 
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true, 
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    }
}

app.use(session(sessConfig));
app.use(flash());


//middleware for every single request - all routes will all have access to these
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

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
