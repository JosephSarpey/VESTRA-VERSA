const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require('crypto');
const { sendResetEmail } = require('../../helpers/email');

// register user
const registerUser = async (req, res) => {
  const { userName, email, password } = req.body;

  // Check for missing fields
  if (!userName || !email) {
    return res.status(400).json({
      success: false,
      message: "Username and email are required to register.",
    });
  }

  try {
    const checkUser = await User.findOne({ email });
    if (checkUser) {
      return res.json({
        success: false,
        message:
          "This Email is already linked to another account! Please use another email",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      userName,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.json({
        success: false,
        message: "User doesn't exist! Please Register first",
      });
    }

    const checkPasswordMatch = await bcrypt.compare(
      password,
      checkUser.password
    );
    if (!checkPasswordMatch) {
      return res.json({
        success: false,
        message: "Incorrect Password!   Please try again",
      });
    }

    const token = jwt.sign(
      {
        id: checkUser._id,
        role: checkUser.role,
        email: checkUser.email,
        userName: checkUser.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "60m" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,         
      sameSite: "none",     
    }).json({
      success: true,
      message: "Logged In Successfully",
      user: {
        email: checkUser.email,
        role: checkUser.role,
        id: checkUser._id,
        userName: checkUser.userName,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred",
    });
  }
};

// Logout user

const logoutUser = (req, res) =>
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  }).json({
    success: true,
    message: "Logged out successfully",
  });

// Request password reset
const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'No user with that email.' });

  const token = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetLink = `${process.env.BASE_URL}/reset-password/${token}`;
  await sendResetEmail(user.email, resetLink);

  res.json({ message: 'Password reset link sent to your email.' });
};

// Reset password
const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });
  if (!user) return res.status(400).json({ message: 'Invalid or expired token.' });

  const bcrypt = require("bcryptjs");
// ...inside resetPassword
const hashPassword = await bcrypt.hash(password, 12);
user.password = hashPassword;
user.resetPasswordToken = undefined;
user.resetPasswordExpires = undefined;
await user.save();

  res.json({ message: 'Password has been reset.' });
};

// Auth middleware
const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Unauthorized user!",
    });
  }
};

module.exports = {
  registerUser, loginUser, logoutUser, authMiddleware, requestPasswordReset,
  resetPassword
};
