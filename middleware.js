module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', "Sign in to complete action")
        return res.redirect('/login');
    }
    next();
}
