const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password, role, location } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.send({
        status: 0,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
      role: role || "explorer",
      // ✅ save location if provided
      location: location ? {
        latitude: location.latitude,
        longitude: location.longitude
      } : undefined
    });

    await user.save();

    // ✅ generate token immediately after register
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    // ✅ return user + token so frontend can auto-login
    res.send({
      status: 1,
      message: "User registered successfully",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error); // ✅ log error for debugging
    res.send({
      status: 0,
      message: "Error registering user"
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.send({
        status: 0,
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.send({
        status: 0,
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "secretkey",
      { expiresIn: "7d" }
    );

    res.send({
      status: 1,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.log(error);
    res.send({
      status: 0,
      message: "Login error"
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.send({
      status: 1,
      data: users
    });
  } catch (error) {
    res.send({
      status: 0,
      message: "Error fetching users"
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUsers
};