const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  authMiddleware,
  requestPasswordReset,
  resetPassword,
  verifyOtp,
  resendOtp 
} = require("../../controllers/auth/auth-controller");

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/check-auth", authMiddleware, (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    user,
  });
});

router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password/:token", resetPassword);

router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);

module.exports = router;
