const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, campgroundExists, validateCampground } = require('../middleware');
const { index, renderNewForm, renderCampgroundShow, renderEditForm, createCampground, updateCampground, deleteCampground } = require('../controllers/campgrounds');

router.route('/')
  .get(catchAsync(index))
  .post(isLoggedIn, validateCampground, catchAsync(createCampground));

router.get('/new', isLoggedIn, catchAsync(renderNewForm));

router.route('/:id')
  .get(campgroundExists, catchAsync(renderCampgroundShow))
  .put(isLoggedIn, campgroundExists, isAuthor, validateCampground, catchAsync(updateCampground))
  .delete(isLoggedIn, campgroundExists, isAuthor, catchAsync(deleteCampground));

router.get('/:id/edit', isLoggedIn, campgroundExists, isAuthor, catchAsync(renderEditForm));

module.exports = router;
