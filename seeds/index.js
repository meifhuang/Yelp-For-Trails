//created just to add initial data to work with in the database

const mongoose = require('mongoose');
const Trail = require('../models/trail');
require("dotenv").config({path: '../.env'});


console.log(process.env.MONGODB);
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

const seedDB = async () => {
    await Trail.deleteMany({});
    const a = new Trail(
        {
            title: 'Skyline Trail',
            image: 'https://images.unsplash.com/photo-1600930383967-31d0604377b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
            location: 'Washington',
            difficulty: 'Strenuous', 
            distance: 6.2
        });
    const b = new Trail(
        {
            title: 'Angels Landing',
            image: 'https://images.unsplash.com/photo-1664489689704-748fa89bc172?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
            location: 'Utah',
            difficulty: 'Strenuous', 
            distance: 5.4
        });
    const c = new Trail(
        {
            title: 'Grinnell Glacier',
            image: 'https://images.unsplash.com/photo-1568582285914-4bfacceaf551?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
            location: 'Montana',
            difficulty: 'Strenuous', 
            distance: 10.6
        });
    const e = new Trail(
        {
            title: 'Half Dome',
            location: 'California',
            image: 'https://images.unsplash.com/photo-1631029266314-18309c825e83?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
            difficulty: 'Extremely strenuous', 
            distance: 7.2
        });

    const g = new Trail(
        {
            title: 'Notch Trail',
            image: 'https://images.unsplash.com/photo-1599010155319-ae106756512e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=928&q=80',
            location: 'South Dakota',
            difficulty: 'Easy', 
            distance: 1.5
        });

    await a.save();
    await b.save();
    await c.save();
    await e.save();
    await g.save();
}

seedDB().then(() => { 
    mongoose.connection.close();
});