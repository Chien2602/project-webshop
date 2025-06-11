const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("../models/user.model");

const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const googleStrategy = new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback",
    passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ email: profile.email });
        if (!user) {
            const newUser = await User.create({
                email: profile.email,
                password: profile.id,
            });
            return done(null, { token: generateToken(newUser), refreshToken: generateRefreshToken(newUser) });
        }
        return done(null, { token: generateToken(user), refreshToken: generateRefreshToken(user) });
    } catch (error) {
        return done(error);
    }
});

const facebookStrategy = new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "/auth/facebook/callback",
    passReqToCallback: true,
}, async (request, accessToken, refreshToken, profile, done) => {
    try {
        const user = await User.findOne({ email: profile.email });
        if (!user) {
            const newUser = await User.create({
                email: profile.email,
                password: profile.id,
            });
            return done(null, { token: generateToken(newUser), refreshToken: generateRefreshToken(newUser) });
        }
        return done(null, { token: generateToken(user), refreshToken: generateRefreshToken(user) });
    } catch (error) {
        return done(error);
    }
});

const serializeUser = (user, done) => {
    done(null, user);
};

const deserializeUser = (user, done) => {
    done(null, user);
};

passport.serializeUser(serializeUser);  // Lưu user vào session
passport.deserializeUser(deserializeUser); // Lấy user từ session

passport.use("google", googleStrategy); // Sử dụng strategy cho Google
passport.use("facebook", facebookStrategy); // Sử dụng strategy cho Facebook

module.exports = passport;