const Trail = require('../models/trail');

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
    const trail = new Trail(req.body);
    trail.images = req.files.map(f => ({url: f.path, filename: f.filename})); 
    trail.author = req.user._id;
    await trail.save();
    console.log(trail);
    req.flash('success', 'Succesfully created trail');
    res.redirect(`/trails/${trail._id}`);
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
    res.render('trails/detail', { trail })
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
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    trailz.images.push(...imgs);
    await trailz.save();
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
