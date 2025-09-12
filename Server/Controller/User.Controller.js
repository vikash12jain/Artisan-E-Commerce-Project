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
            return res.status(400).send('User with this credential already exists!');
        }

        const user = await UserModel.create({
            fullname,
            email,
            password,
        });

        if (user) {
            const token = generateToken(user._id);
             res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 
                });
                console.log(token, user)
            res.status(200).json({
                token,
                user: {
                    message: 'User registered successfully',
                    _id: user._id,
                    email: user.email,
                    fullname: {
                        firstname: user.fullname.firstname,
                        lastname: user.fullname.lastname,
                    },
                    isAdmin: user.isAdmin
                }
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
        if (!user) {
          return  res.status(401).send('Invalid email or password' );
        }

            const isPassowordMatched = await user.ComparePassword(password);
            if (user && isPassowordMatched) {
                const token = generateToken(user._id);
                res.cookie('token', token, {
                    httpOnly: true,
                    maxAge: 24 * 60 * 60 * 1000 //token stay till 24h
                });

                res.status(200).json({
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        fullname: {
                            firstname: user.fullname.firstname,
                            lastname: user.fullname.lastname,
                        },
                        isAdmin: user.isAdmin
                    }
                });
            } else {
                res.status(401).json('Invalid email or password');
            
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
        let token;

        if (req.cookies?.token) {
            token = req.cookies.token;
        } else if (req.headers?.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (token) {
            await BlacklistToken.create({ token });
        }

        res.clearCookie("token");
        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

