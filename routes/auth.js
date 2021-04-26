const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');

//Route - GET Auth
//Access - Private

//Made this route protected by adding middleware, used to get info of user after verifying the JSON web token
//from the user that is authenticate them
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); //getting all info of user except their password
    res.json(user);
  } catch (err) {
    res.status(500).send('server error');
  }
});

//Route - POST /auth
//description - Authenticate a user / login a user
//Access - Public

router.post('/', [
  check('email', 'Please enter a valid email address').isEmail(),
  check('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    email,
    password
  } = req.body;

  // Again we can use promises as mongodb function return promise but to maintain tidiness i will be
  // using async await functions

  try {
    // see if user exists
    let user = await User.findOne({
      email: email
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({
        errors: [{
          msg: 'Invalid credentials'
        }]
      });
    }

    //after getting the email we match the password using bycryptjs method compare 
    const isMatch = await bcrypt.compare(password, user.password); //compare takes the password entered by user and the encrypted password from db to compare
    //If password does not match return invalid cred
    if (!isMatch) {
      return res.status(400).json({
        errors: [{
          msg: 'Invalid credentials'
        }]
      });
    }

    // Return jsonwebtoken
    const payload = {
      user: {
        id: user.id  //for mongodb we have _id but for mongoose it is simply id
      }
    }

    jwt.sign(
      payload,
      config.get('jwtSecret'),
      {expiresIn: 360000},
      (err, token) => {

      if(err) throw err;
      res.json({token});
    })

  } catch (e) {
    console.log(e);
    res.status(500).send('Server error');
  }
});

module.exports = router;
