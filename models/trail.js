const mongoose = require('mongoose');
const Review = require("./review");
const Schema = mongoose.Schema;


const difficulty = ['Easy', 'Moderate', 'Strenuous', 'Extremely strenuous']

const ImageSchema = new Schema({
    url: String, 
    filename: String
})

//make image smaller
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/h_100')
});

const TrailSchema = new Schema({
    title: String,
    images:[ImageSchema],
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
