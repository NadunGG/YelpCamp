const User = require('../models/user');

module.exports.renderRegisterForm =  (req, res) => {
    res.render('users/register');
  }

module.exports.registerNewUser = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.login(registeredUser, (err) => {
        if (err) return next(err);
        req.flash('success', 'Welcome to Yelp Camp!');
        res.redirect('/campgrounds');
      });
    } catch (err) {
      req.flash('error', err.message);
      res.redirect('/register');
    }
  }

module.exports.renderLoginForm =  (req, res) => {
    res.render('users/login');
  }

module.exports.loginUser = (req, res) => {
    req.flash('success', 'Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }  

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
      if (err) return next(err);
      req.flash('success', 'Successfully logged out!');
      res.redirect('/campgrounds');
    });
  }