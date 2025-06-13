const express = require("express");
const router = express.Router();
const passport = require("passport");
const { verifyUser } = require("../middlewares/auth.middleware");

const { login, register, logout, forgotPassword, resetPassword, verifyEmail, resendVerificationEmail, changePassword, updateProfile, deleteAccount } = require("../controllers/auth.controller");
const { googleStrategy, facebookStrategy } = require("../controllers/passport.controller");

// Register the strategies with proper names
passport.use("google", googleStrategy);
passport.use("facebook", facebookStrategy);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login successfully",
        data: req.user,
    });
});

router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
    res.status(200).json({
        success: true,
        message: "Login successfully",
        data: req.user,
    });
});

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/forgot-password",verifyUser, forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/change-password",verifyUser, changePassword);
router.post("/update-profile",verifyUser, updateProfile);

module.exports = router;