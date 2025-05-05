const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

// 🔑 Login Controller
const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      if (!email || !password) {
        return res.status(400).json({ msg: "Please provide both email and password" });
      }
  
      const foundUser = await User.findOne({ email });
      if (!foundUser) {
        return res.status(400).json({ msg: "Invalid credentials" });
      }
  
      const isMatch = await foundUser.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ msg: "Invalid password" });
      }
  
      const token = jwt.sign(
        { id: foundUser._id, name: foundUser.name },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
      );
  
      return res.status(200).json({ msg: "User logged in", token });
    } catch (err) {
      console.error("Login error:", err.message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  };

// 🧠 Dashboard (requires JWT middleware)
const dashboard = async (req, res) => {
  const luckyNumber = Math.floor(Math.random() * 100);

  res.status(200).json({
    msg: `Hello, ${req.user.name}`,
    secret: `Here is your authorized data, your lucky number is ${luckyNumber}`,
  });
};

// 📃 Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json({ users });
  } catch (err) {
    return res.status(500).json({ msg: "Failed to fetch users" });
  }
};

// 📝 Register Controller
const register = async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ msg: "Please add all values in the request body" });
      }
  
      const foundUser = await User.findOne({ email });
      if (foundUser) {
        return res.status(400).json({ msg: "Email already in use" });
      }
  
      // 🔥 No need to hash password here
      const newUser = new User({
        name: username,
        email,
        password, // Will be hashed automatically by pre("save")
      });
  
      await newUser.save();
      return res.status(201).json({ user: newUser });
    } catch (err) {
      console.error("Register error:", err.message);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  };

module.exports = {
  login,
  register,
  dashboard,
  getAllUsers,
};
