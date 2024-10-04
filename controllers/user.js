const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError } = require("../errors");

const getUser = async (req, res) => {
  const userId = req.user.userId; // user object passed from the verifyJWT middleware

  const user = await User.findById(userId);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      location: user.location,
      name: user.name,
      id: user._id,
    },
  });
};

const updateUser = async (req, res) => {
  const { email, name, location } = req.body;
  if (!email || !name || !location) {
    throw new BadRequestError("Please provide all values");
  }
  const user = await User.findOne({ _id: req.user.userId });

  user.email = email;
  user.name = name;
  user.location = location;

  await user.save();

  res.status(StatusCodes.OK).json({
    user: {
      email: user.email,
      location: user.location,
      name: user.name,
    },
  });
};

module.exports = {
  updateUser,
  getUser,
};
