const express = require('express');
const router = express.Router();

//Route - GET post
//Access - Public
router.get('/', (req, res) => {
  res.send('post Route');
});

module.exports = router;
