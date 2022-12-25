module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You have to be signed in to proceed!');
    return res.redirect('/login');
  }
  next();
};
