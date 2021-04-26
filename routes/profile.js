const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

//Route - GET profile/me
//desc - Get current user's profile 
//Access - Private

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user', 
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user'});
    }

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Server error');
  }
});

// @route    POST profile
// @desc     Create or update user profile
// @access   Private

router.post(
  '/',
  auth,
  check('status', 'Status is required').notEmpty(),
  check('skills', 'Skills is required').notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // destructure the request
    const { 
      company, 
      website, 
      location, 
      bio, 
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // build a profile
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }
    // Build socialFields object
    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (twitter) {
      profileFields.social.twitter = twitter;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }

    try {
      let profile = await Profile.findOne({ user: req.user.id});

      if (profile) {
        //update profile as profile already exists
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id}, { $set: profileFields}, {new: true}
        );

        return res.json(profile);
      }

      //if profile not found then create profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile)
      
    } catch (err) {
      console.log(err);
      res.status(500).send('server error');
    }
  }
);

// @route    GET profile
// @desc     Get all profiles
// @access   Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error')
  }
});

// @route    GET profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.user_id}).populate('user', ['name', 'avatar']);
    
    if (!profile) {
      return res.status(400).json({ msg: 'No profile found'})
    }

    res.json(profile);
  } catch (err) {
    //if the id is wrong (that is length is more) the response is "server error" but we would like to return 
    //no user found in that case also. This is a particular error that is present to solve this situation
    if (err.kind == 'ObjectId') {
      return res.status(400).json({msg: 'No profile found'})
    }
    console.log(err);
    res.status(500).send('server error')
  }
});

// @route    DELETE profile
// @desc     delete profile, user and posts
// @access   Private
router.delete('/', auth, async (req, res) => {
  try {
    //@todo - remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id});
    //then remove User
    await User.findOneAndRemove({ _id: req.user.id});

    res.json({msg: 'User deleted successfully'});
  } catch (err) {
    console.log(err);
    res.status(500).send('server error')
  }
});


module.exports = router;
