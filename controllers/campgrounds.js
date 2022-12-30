const Campground = require('../models/campground')

module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
  }

module.exports.renderNewForm = async (req, res) => {
    res.render('campgrounds/new');
  }  

module.exports.renderCampgroundShow = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({ path: 'reviews', populate: 'author' })
      .populate('author');
    res.render('campgrounds/show', { campground });
  } 

module.exports.renderEditForm = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
  } 
module.exports.createCampground = async (req, res) => {
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully Created a Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.updateCampground = async (req, res) => {
    const id = req.params.id;
    const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {
      runValidators: true,
      new: true,
    });
    req.flash('success', 'Successfully Updated Campground!');
    res.redirect(`/campgrounds/${campground._id}`);
  }

module.exports.deleteCampground = async (req, res) => {
    const id = req.params.id;
    const deletedCampground = await Campground.findByIdAndDelete(id);
    req.flash('success', `Successfully Deleted ${deletedCampground.title} Campground!`);
    res.redirect('/campgrounds');
  }