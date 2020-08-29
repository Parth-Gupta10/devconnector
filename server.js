const express = require('express');

const app = express();

const PORT = process.env.PORT || 5000; //used process.env.PORT for heroku

app.get("/", (req, res) => {
  res.send('Api running');
})

app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
