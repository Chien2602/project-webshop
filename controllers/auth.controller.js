const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, email: user.email, fullname: user.fullname }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const register = async (req, res) => {
    try {
        const { fullname, email, password, phone, address} = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            fullname,
            email,
            password: hashedPassword,
            phone,
            address,
            createdBy: newUser._id,
            updatedBy: newUser._id,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: newUser,
            token: generateToken(newUser),
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
        res.status(200).json({
            success: true,
            message: "Login successfully",
            data: user,
            token: token,
            refreshToken: refreshToken,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const logout = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        await User.findByIdAndUpdate(user._id, { refreshToken: null });
        res.status(200).json({
            success: true,
            message: "Logout successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const user = await User.findOne({ refreshToken });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const token = generateToken(user);
        const newRefreshToken = generateRefreshToken(user);
        await User.findByIdAndUpdate(user._id, { refreshToken: newRefreshToken });
        res.status(200).json({
            success: true,
            message: "Refresh token successfully",
            data: user,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const verifyEmail = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.codeVerify !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid code",
            });
        }
        await User.findByIdAndUpdate(user._id, { verified: true });
        res.status(200).json({
            success: true,
            message: "Email verified successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const codeVerify = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        await User.findByIdAndUpdate(user._id, { codeVerify: code, codeVerifyExpire: "5 minutes" });
        res.status(200).json({
            success: true,
            message: "Code verified successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        await User.findByIdAndUpdate(user._id, { codeVerify: code, codeVerifyExpire: "5 minutes" });
        res.status(200).json({
            success: true,
            message: "Code verified successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const resetPassword = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const changePassword = async (req, res) => {
    try {
        const { email, password, code } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        if (user.codeVerify !== code) {
            return res.status(400).json({
                success: false,
                message: "Invalid code",
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(user._id, { password: hashedPassword });
        res.status(200).json({
            success: true,
            message: "Password reset successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const profile = async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const { fullname, email, phone, address, avatar } = req.body;
        const user = await User.findByIdAndUpdate(id, { fullname, email, phone, address, avatar }, { new: true });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

module.exports = {
    register,
    login,
    logout,
    refreshToken,
    verifyEmail,
    codeVerify,
    forgotPassword,
    resetPassword,
    changePassword,
    profile,
    updateProfile,
}