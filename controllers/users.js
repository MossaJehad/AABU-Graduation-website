const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password, department, collage, authen } = req.body;
        const user = new User({ email, username, department, collage, authen });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to AABU Interactive Map!');
            res.redirect('/schedules');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}

module.exports.renderLogin = async (req, res) => {
    try {
        res.render('users/login');
    } catch (err) {
        req.flash('error', err.message);
        res.redirect('login');
    }
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    const user = new User({ username });
    req.flash('success', `welcome back!, ${user.username}`);
    const redirectUrl = req.session.returnTo || '/schedules';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/schedules');
}