const mongoose = require('mongoose');
const Review = require("./review");
const Schema = mongoose.Schema;


const TrailSchema = new Schema({
    title: String,
    image: String,
    difficulty: String,
    location: String,
    distance: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

TrailSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})


module.exports = mongoose.model("Trail", TrailSchema);
