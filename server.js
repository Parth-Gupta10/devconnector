const express = require('express');
const connectDB = require('./config/db');

const app = express();

//Connect Database
connectDB();

//Middleware
app.use(express.json({extended: false})); //Now body parser is include in express so instead of using bodyParser.json we use this.

//Routes
app.use('/users', require('./routes/users'));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));
app.use('/posts', require('./routes/posts'));

app.get("/", (req, res) => {
  res.send('Api running');
})

const PORT = process.env.PORT || 5000; //used process.env.PORT for heroku
app.listen(PORT, () => {
  console.log("Server started on port " + PORT);
});
