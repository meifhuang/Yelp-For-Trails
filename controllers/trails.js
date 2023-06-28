const Trail = require('../models/trail');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding")
const mapboxToken = process.env.MAP_BOX
const geocoder = mbxGeocoding({accessToken: mapboxToken}); 
//for trail difficulty options
const difficulty = ['Easy', 'Moderate', 'Strenuous', 'Extremely strenuous']

module.exports.index = async (req, res) => {
    const trail_list = await Trail.find({});
    res.render('trails/index', { trail_list });
}

module.exports.trailForm = (req, res) => {
    res.render('trails/new', { difficulty });
}

module.exports.createTrail = async (req, res, next) => {
    //forward geocoding 
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location, 
        limit: 1
    }).send()

    const trail = new Trail(req.body);
    if (trail) { 
    trail.geometry = geoData.body.features[0].geometry
    trail.images = req.files.map(f => ({url: f.path, filename: f.filename})); 
    trail.author = req.user._id;
    await trail.save();
    req.flash('success', 'Successfully created trail');
    res.redirect("/trails");
    }
    else {
        req.flash('error', 'Trail could not be created')
    }

}

module.exports.showTrail = async (req, res) => {
    const trail = await Trail.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/detail', { trail})
}

module.exports.trailEditForm = async (req, res,) => {
    const trail = await Trail.findById(req.params.id);
    if (!trail) {
        req.flash('error', 'Trail not found')
        return res.redirect('/trails');
    }
    res.render('trails/edit', { trail, difficulty })
}

module.exports.editTrail = async (req, res) => {
    const { id } = req.params
    const trailz = await Trail.findByIdAndUpdate(id, { ...req.body })
    const geoData = await geocoder.forwardGeocode({
        query: req.body.location, 
        limit: 1
    }).send();
    trailz.geometry = geoData.body.features[0].geometry
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    trailz.images.push(...imgs);

    await trailz.save();
    if (req.body.deleteImages) { 
    for (let filename of req.body.deleteImages) {
        await cloudinary.uploader.destroy(filename)
    } 
    await trailz.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}});
    console.log(trailz);
} 
    req.flash('success', "Successfully updated trail")
    res.redirect(`/trails/${trailz._id}`)
}

module.exports.deleteTrail = async (req, res) => {
    const { id } = req.params;
    const trail = await Trail.findById(id);
    if (!trail.author.equals(req.user._id)) {
        req.flash("error", 'You do not have permission to do that')
        return res.redirect(`/trails/${id}`);
    }
    await Trail.findByIdAndDelete(id);
    req.flash('success', "Deleted trail")
    res.redirect('/trails');
}
