const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    //Get tokens from header
    const token = req.header('x-auth-token');

    // Check if token absent
    if (!token) {
        return res.status(401).json({ msg: 'No token found, auth denied'})
    } 
    
    // Verify Token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'));

        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid'});
    }
}