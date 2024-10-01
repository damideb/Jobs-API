const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
const User = require('../models/User')

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication failed");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // const user = User.findById(decoded.userId).select('-password'); // find user by id and remove the password field
    req.user = { userId: decoded.userId, name: decoded.name }; // send this obj to the next middleware
    next();
  } catch (err) {
    throw new UnauthenticatedError("Authentication failed");
  }
};

module.exports = verifyJWT;
