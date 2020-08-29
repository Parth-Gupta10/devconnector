const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

app.get("/", (req, res) => {
  res.send('Api running');
})

const PORT = process.env.PORT || 5000; //used process.env.PORT for heroku
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
