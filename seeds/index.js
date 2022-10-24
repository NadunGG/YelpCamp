const mongoDB = require('../mongoDB');
const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');
const Campground = require('../models/campground');
const mongoose = require('mongoose');
const axios = require('axios');
mongoDB();

// call unsplash and return small image
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

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 25; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      image: await seedImg(),
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
