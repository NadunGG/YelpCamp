const mongoose = require('mongoose');
const remoteDbUrl = process.env.DB_URL;
const localDbUrl = 'mongodb://localhost:27017/yelp-camp';
const mongoDB = async function () {
  await mongoose
    .connect(remoteDbUrl || localDbUrl)
    .then(() => {
      console.log('MONGO CONNECTION OPEN!');
    })
    .catch((err) => {
      console.log('OH NO! MONGO CONNECTION ERROR!!!!!');
      console.log(err);
    });
};

module.exports = mongoDB;
