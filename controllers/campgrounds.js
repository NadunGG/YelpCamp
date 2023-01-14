const Campground = require('../models/campground');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({accessToken: mapBoxToken});
const cloudinary = require('cloudinary').v2;

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index', { campgrounds });
};

module.exports.renderNewForm = async (req, res) => {
  res.render('campgrounds/new');
};

module.exports.renderCampgroundShow = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: 'reviews', populate: 'author' })
    .populate('author');
  res.render('campgrounds/show', { campground });
};

module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render('campgrounds/edit', { campground });
};
module.exports.createCampground = async (req, res) => {
  const geoData = await geoCoder.forwardGeocode({
    query: req.body.campground.location,
    limit: 1
  }).send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.author = req.user._id;
  await campground.save();
  req.flash('success', 'Successfully Created a Campground!');
  res.redirect(`/campgrounds/${campground._id}`);

};

module.exports.updateCampground = async (req, res) => {
  const id = req.params.id;
  const campground = await Campground.findByIdAndUpdate(id, req.body.campground, {
    runValidators: true,
    new: true,
  });
  const newImages = req.files.map((file) => ({ url: file.path, filename: file.filename }));
  campground.images.push(...newImages);
  await campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    };
    await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
  }
  req.flash('success', 'Successfully Updated Campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  const id = req.params.id;
  const deletedCampground = await Campground.findByIdAndDelete(id);
  req.flash('success', `Successfully Deleted ${deletedCampground.title} Campground!`);
  res.redirect('/campgrounds');
};
