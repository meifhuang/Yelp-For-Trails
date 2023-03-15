const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Trail = require('./models/trail');
require("dotenv").config();
const ejsMate = require('ejs-mate');


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


//for trail difficulty options
const difficulty = ['Easy', 'Moderate', 'Strenuous', 'Extremely strenuous']

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

app.post('/trails', async (req, res) => {
    const trail = new Trail(req.body);
    await trail.save();
    res.redirect(`/trails/${trail._id}`);
})

app.get('/trails/:id', async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    res.render('trails/detail', { trail })
})



app.listen(3000, () => {
    console.log("Serving port 3000")
})
