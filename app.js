const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Trail = require('./models/trail');
require("dotenv").config();


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

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render("home");
})

app.get('/maketrail', async (req, res) => {
    const trail = new Trail({title: 'My Trail', description:'cheap', image:'hi', difficulty:'hard', distance:'5.5'});
   
})

app.listen(3000, ()=> {
    console.log("Serving port 3000")
})