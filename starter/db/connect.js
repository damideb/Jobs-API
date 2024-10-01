const mongoose = require("mongoose");

const connectDB = (url) => {
  return mongoose.connect(url, {
    serverSelectionTimeoutMS: 60000,
  });
};
module.exports = connectDB;
