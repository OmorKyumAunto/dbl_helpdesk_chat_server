let jwt = require('jsonwebtoken');


const resetPassTokenVerify = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Authorization header is missing' });
    }

    // Check if token starts with 'Bearer '
    if (!authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Invalid token format' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    jwt.verify(token, global.config.forgetPasswordSecretKey, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Password reset time has been expire.' });
        }
        req.decodedInfo = decoded;
        next();
    });
};

 module.exports = resetPassTokenVerify;
