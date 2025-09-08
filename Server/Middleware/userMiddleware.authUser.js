const jwt = require("jsonwebtoken");
const User = require("../Models/User.model");
const BlacklistToken = require("../Models/BlackListToken.model");
const JWT_SECRET = process.env.JWT_SECRET;

exports.authUser = async (req, res, next) => {
    try {
        const token = req.cookies.token || (req.headers.authorization ? req.headers.authorization.split(" ")[1] : null);
        
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const isblacklisted = await BlacklistToken.findOne({ token });
        
        if (isblacklisted) {
            return res.status(401).json({ message: 'Unauthorized access' });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.id);
        req.user = user;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Unauthorized access' });
    }
};
