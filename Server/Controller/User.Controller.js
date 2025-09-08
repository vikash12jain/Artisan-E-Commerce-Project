const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const UserModel = require('../Models/User.model');
const BlacklistToken = require('../Models/BlackListToken.model');

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '24h',
    });
};

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'User with this credential already exists!' });
        }

        const user = await UserModel.create({
            fullname,
            email,
            password,
        });

        if (user) {
            res.status(201).json({
                message: 'User registered successfully',
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.loginUser = async (req, res) => {
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        const user = await UserModel.findOne({ email }).select('+password');
        const isPassowordMatched = await user.ComparePassword(password);
        if (user && isPassowordMatched) {
            const token = generateToken(user._id);

            res.cookie('token', token, {
                httpOnly: true,
                maxAge: 86400
            });

            res.status(200).json({
                message: 'Login successful',
                _id: user._id,
                fullname: user.fullname,
                email: user.email,
                isAdmin: user.isAdmin,
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
};

exports.userProfile = (req, res) => {
    if (req.user) {
        res.status(200).json({
            _id: req.user._id,
            fullname: req.user.fullname,
            email: req.user.email,
            isAdmin: req.user.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.logoutUser = async (req, res) => {
    try {
       
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];

        await BlacklistToken.create({ token }); // to remove/blacklist the token so this token never used again
  
        res.clearCookie('token');

        res.status(200).json({ message: 'User logged out successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
