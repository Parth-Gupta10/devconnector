const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// const connectDB = () => {
//   mongoose.connect(db)
//   .then(() => {
//     console.log("MongoDB connected");
//   })
//   .catch(err => console.log(err));
// }

// Although we can use then and catch as mongoose commands returns promises but I will be using
// async await function for keeping the code same as that taught in course. Promise version has
// been written above in comments if I would want to refer in future.

const connectDB = async () => {
  try {
    await mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false}) //these options passed to clear depreciation warnings
    console.log('Mongoose connected');
  } catch (err) {
    console.log(err);
    //Exit process with failure
    process.exit(1);
  }
}

module.exports = connectDB;
