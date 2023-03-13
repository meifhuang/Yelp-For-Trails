const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TrailSchema = new Schema({
    title: String, 
    image: String,
    difficulty: String, 
    location: String,
    distance: Number
})

module.exports = mongoose.model("Trail", TrailSchema);