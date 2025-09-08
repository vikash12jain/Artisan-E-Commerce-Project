const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const User = require("../Models/User.model");

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    try {
      token = req.cookies.token;
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(verified.id).select("-password");
      if (!user) {
        res.status(401);
        throw new Error("User not found.");
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, please login.");
    }
  }
  if (!token) {
    res.status(401);
    throw new Error("Authentication failed: no token provided.");
  }
});


exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin.");
  }
};

