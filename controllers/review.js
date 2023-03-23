const Review = require('../models/review');
const Trail = require('../models/trail');

module.exports.createReview = async (req, res) => {
    const trail = await Trail.findById(req.params.id);
    const review = new Review(req.body);
    review.author = req.user._id;
    trail.reviews.push(review);
    await review.save();
    await trail.save();
    req.flash('success', 'Created new review')
    res.redirect(`/trails/${trail._id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id, reviewid } = req.params;
    await Trail.findByIdAndUpdate(id, { $pull: { reviews: reviewid } })
    await Review.findByIdAndDelete(reviewid);
    req.flash('success', 'Review Deleted')
    res.redirect(`/trails/${id}`);
}
