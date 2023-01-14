if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}
//! DONT RUN THIS UNLESS YOU WANT TO RESEED THE DB!!!!!!
//! RUNNING THIS MODULE WILL FULLY WIPE THE EXISTING CAMPGROUNDS FROM THE DB!!!!!!
const mongoDB = require('../mongoDB');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const axios = require('axios');
const cloudinary = require('cloudinary').v2;
mongoDB();

// Call Unsplash and Return Small Image
async function seedImg() {
  try {
    const resp = await axios.get('https://api.unsplash.com/photos/random', {
      params: {
        client_id: 'MQ241YX_7HCvZ53AzYPRDYkSU5TGjaqACG1XqiG-0N0',
        collections: 483251,
      },
    });
    return resp.data.urls.regular;
  } catch (err) {
    console.error(err);
  }
}

// Upload Unsplash Img to Cloudinary
const uploadImg = async () =>
  await seedImg()
    .then((img) => cloudinary.uploader.upload(img, { folder: 'YelpCamp' }))
    .then((res) => {
      return { url: res.secure_url, filename: res.public_id };
    });

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  // await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const imageConfig = await uploadImg();
    const camp = new Campground({
      author: '63a860c026d8bd451568c839', //? Jesse Pinkman
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      geometry: {
        type: 'Point',
        coordinates: [cities[random1000].longitude, cities[random1000].latitude],
      },
      images: [{ ...imageConfig }],
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Ex, dolorum corporis consectetur molestias sint harum, quos iusto fugit recusandae doloremque velit culpa et. Mollitia voluptatem fugit eius id, cupiditate ratione!',
      price,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
  console.log('Database Disconnected');
});
