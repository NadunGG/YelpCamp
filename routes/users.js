const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { renderRegisterForm, registerNewUser, loginUser, logoutUser, renderLoginForm } = require('../controllers/users');

router.route('/register')
  .get(renderRegisterForm)
  .post(catchAsync(registerNewUser));

router.route('/login')
  .get(renderLoginForm)
  .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', failureMessage: true, keepSessionInfo: true }), loginUser);

router.get('/logout', logoutUser);

module.exports = router;
