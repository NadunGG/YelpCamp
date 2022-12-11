const express = require('express');
const router = express.Router();
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');


const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      const msg = error.details.map((el) => el.message).join(',');
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

router.get(
    '/',
    catchAsync(async (req, res) => {
      const campgrounds = await Campground.find({});
      res.render('campgrounds/index', { campgrounds });
    })
  );
  
  router.get(
    '/new',
    catchAsync(async (req, res) => {
      res.render('campgrounds/new');
    })
  );
  
  router.get(
    '/:id',
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id).populate(
        'reviews'
      );
      res.render('campgrounds/show', { campground });
    })
  );
  
  router.get(
    '/:id/edit',
    catchAsync(async (req, res) => {
      const campground = await Campground.findById(req.params.id);
      res.render('campgrounds/edit', { campground });
    })
  );
  router.post(
    '/',
    validateCampground,
    catchAsync(async (req, res) => {
      // if (!req.body.campground) {
      //   throw new ExpressError('Invalid Campground Data', 400);
      // }
  
      const campground = new Campground(req.body.campground);
      await campground.save();
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.put(
    '/:id',
    validateCampground,
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const campground = await Campground.findByIdAndUpdate(
        id,
        req.body.campground,
        {
          runValidators: true,
          new: true,
        }
      );
      res.redirect(`/campgrounds/${campground._id}`);
    })
  );
  
  router.delete(
    '/:id',
    catchAsync(async (req, res) => {
      const id = req.params.id;
      const deletedCampground = await Campground.findByIdAndDelete(id);
      res.redirect('/campgrounds');
    })
  );

 module.exports = router; 