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

// @route    PUT profile/experience
// @desc     Add profile experience
// @access   Private

router.put('/experience', [auth, [
  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title: title,
    company: company,
    location: location,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id});

    profile.experience.unshift(newExp); //unshift similar to push but it pushes value at beginning of array

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error')
  }

});

// @route    DELETE profile/experience/:exp_id
// @desc     Delete exp from profile by exp id
// @access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id});

    // Get remove index - find index of exp to be removed in array
    const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    //splice to remove item at the index found
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// @route    PUT profile/experience/:exp_id
// @desc     Update exp from profile by exp id
// @access   Private

router.put('/experience/:exp_id', [auth, [
  check('title', 'title is required').not().isEmpty(),
  check('company', 'company is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  } = req.body;

  const newExp = {
    title: title,
    company: company,
    location: location,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id});

    // Get update index - find index of exp to be updated in array
    const updateIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

    //splice to remove item at the index found and then add item at than index
    profile.experience.splice(updateIndex, 1, newExp);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// @route    PUT profile/education
// @desc     Add profile education
// @access   Private

router.put('/education', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school: school,
    degree: degree,
    fieldofstudy: fieldofstudy,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id});

    profile.education.unshift(newEdu); //unshift similar to push but it pushes value at beginning of array

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('server error')
  }

});

// @route    DELETE profile/education/:edu_id
// @desc     Delete edu from profile by edu id
// @access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id});

    // Get remove index - find index of exp to be removed in array
    const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    //splice to remove item at the index found
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

// @route    PUT profile/education/:edu_id
// @desc     Update edu from profile by edu id
// @access   Private

router.put('/education/:edu_id', [auth, [
  check('school', 'School is required').not().isEmpty(),
  check('degree', 'Degree is required').not().isEmpty(),
  check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
  check('from', 'from date is required').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    school,
    degree,
    fieldofstudy,
    from,
    to,
    current,
    description
  } = req.body;

  const newEdu = {
    school: school,
    degree: degree,
    fieldofstudy: fieldofstudy,
    from: from,
    to: to,
    current: current,
    description: description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id});

    // Get update index - find index of edu to be updated in array
    const updateIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

    //splice to remove item at the index found and then add item at than index
    profile.education.splice(updateIndex, 1, newEdu);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server Error")
  }
});

module.exports = router;
