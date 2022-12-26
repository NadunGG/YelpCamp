const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, isAuthor, campgroundExists, validateCampground } = require('../middleware');

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  })
);

router.get(
  '/new',
  isLoggedIn,
  catchAsync(async (req, res) => {
    res.render('campgrounds/new');
  })
);

router.get(
  '/:id',
  campgroundExists,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: 'reviews', populate: 'author' })
      .populate('author');
    res.render('campgrounds/show', { campground });
  })
);

router.get(
  '/:id/edit',
  isLoggedIn,
  campgroundExists,
  isAuthor,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  })
);

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully Created a Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.put(
  '/:id',
  isLoggedIn,
  campgroundExists,
  isAuthor,
  validateCampground,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {
      runValidators: true,
      new: true,
    });
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  '/:id',
  isLoggedIn,
  campgroundExists,
  isAuthor,
  catchAsync(async (req, res) => {
    const id = req.params.id;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully Deleted ${deletedCampground.title} Campground!`);
    res.redirect('/campgrounds');
  })
);

module.exports = router;
