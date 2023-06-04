const ExpressError = require('./utils/ExpressError');
const Schedule = require('./models/schedule');
const user = require('./models/user');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const schedule = await Schedule.findById(id);
    if (!schedule.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/schedules/${id}`);
    }
    next();
}

module.exports.authen = (req, res, next) => {
    if (req.user && req.user.authen === true) {
      next();
    } else {
        req.flash('error', 'You are not allowed to make Schedule');
        return res.redirect(`/schedules`);
    }
  };