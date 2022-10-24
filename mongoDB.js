const mongoose = require('mongoose');

const mongoDB = async function () {
  await mongoose
    .connect('mongodb://localhost:27017/yelp-camp')
    .then(() => {
      console.log('MONGO CONNECTION OPEN!');
    })
    .catch((err) => {
      console.log('OH NO! MONGO CONNECTION ERROR!!!!!');
      console.log(err);
    });
};

module.exports = mongoDB;
