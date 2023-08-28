const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = async (req, res, next) => {
    const token = req.header('x-auth-token');

    if(!token) {
        return res.send('No token');
    }

    try {
        const verified = jwt.verify(token, process.env.SECRET_KEY);

        if(!verified) {
            return res.send('Token verification failed');
        }

        req.user = verified._id;

        next();
    }
    catch (error) {
        return res.send('Token verification failed');
    }
}

module.exports = auth;