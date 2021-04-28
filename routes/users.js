const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check, validationResult} = require('express-validator');
const User = require('../models/User');
// bring in normalize to give us a proper url, regardless of what user entered
const normalize = require('normalize-url');

//Route - POST users
//description - Register user
//Access - Public

// Steps to register a user = see if user exists already (if not then only move to
// next step else throw error) -> get user's gravatar (based on their email) -> encrycpt pass using
// bcryptjs  -> Return jsonwebtoken (so that user is immediately logged in after regiseration)

router.post('/', [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please enter a valid email address').isEmail(),
  check('password', 'Password should have 6 or more characters').isLength({
    min: 6
  })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  const {
    name,
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

    if (user) {
      return res.status(400).json({
        errors: [{
          msg: 'User already exists'
        }]
      });
    }

    // Get gravatar of user. Added normalize here to fix broken links in gravatar, it is an unresolved issue with this package.
    const avatar = normalize(
      gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      }),
      { forceHttps: true }
    );

    // creating a user
    user = new User({
      name,
      email,
      avatar,
      password
    });

    // Encrycpt Password
    const salt = await bcrypt.genSalt(10); //generate salt for hasshing Password
    user.password = await bcrypt.hash(password, salt);
    // saving user to db
    await user.save();

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
