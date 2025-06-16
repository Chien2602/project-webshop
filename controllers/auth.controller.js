const User = require("../models/user.model");
const Role = require("../models/role.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const slugify = require("slugify");
const sendMail = require("../configs/sendMail.config");

const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "1h" });
}

const generateRefreshToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role, email: user.email, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        const codeVerifyExpire = new Date(Date.now() + 5 * 60 * 1000);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            slug: slugify(username, { 
                lower: true,
                strict: true,
                locale: 'vi'
            }),
            codeVerify: code,
            codeVerifyExpire: codeVerifyExpire,
            verified: false,
        });

        // Update createdBy and updatedBy after user creation
        await User.findByIdAndUpdate(newUser._id, {
            createdBy: newUser._id,
            updatedBy: newUser._id
        });

        const emailSubject = "Xác nhận đăng ký tài khoản";
        const emailText = `Mã xác nhận của bạn là: ${code}. Mã này sẽ hết hạn sau 5 phút.`;
        const emailHtml = `
            <h1>Xác nhận đăng ký tài khoản</h1>
            <p>Xin chào ${username},</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã xác nhận sau để hoàn tất quá trình đăng ký:</p>
            <h2 style="color: #4CAF50; font-size: 24px;">${code}</h2>
            <p>Mã này sẽ hết hạn sau 5 phút.</p>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        `;
        
        await sendMail(email, emailSubject, emailText, emailHtml);

        res.status(201).json({
            success: true,
            message: "User created successfully. Please check your email for verification code.",
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
        const { username, email, password } = req.body;
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Username or email is incorrect",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Username is incorrect",
            });
        }
        const token = generateToken(user);
        const refreshToken = generateRefreshToken(user);
        await User.findByIdAndUpdate(user._id, { refreshToken: refreshToken });
        res.status(200).json({
            success: true,
            message: "Login successfully",
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
        const user = await User.findOne({ refreshToken: refreshToken });
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
        const user = await User.findOne({ email, verified: false });
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
        const emailSubject = "Mã xác nhận đặt lại mật khẩu";
        const emailText = `Mã xác nhận của bạn là: ${code}. Mã này sẽ hết hạn sau 5 phút.`;
        const emailHtml = `
            <h1>Mã xác nhận đặt lại mật khẩu</h1>
            <p>Xin chào ${user.username},</p>
            <p>Vui lòng sử dụng mã xác nhận sau để hoàn tất quá trình đặt lại mật khẩu:</p>
            <h2 style="color: #4CAF50; font-size: 24px;">${code}</h2>
            <p>Mã này sẽ hết hạn sau 5 phút.</p>
            <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        `;
        
        await sendMail(email, emailSubject, emailText, emailHtml);
        res.status(200).json({
            success: true,
            message: "Code verified successfully. Please check your email for verification code.",
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

const verifyForgotPassword = async (req, res) => {
    try {
        const { email, code } = req.body;
        const user = await User.findOne({ email, codeVerify: code });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }
        await User.findByIdAndUpdate(user._id, { codeVerify: null, codeVerifyExpire: null });
        res.status(200).json({
            success: true,
            message: "Code verified successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Verify code failed",
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
        const { username, email, phone, address, avatar } = req.body;
        const user = await User.findByIdAndUpdate(id, { username, email, phone, address, avatar }, { new: true });
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
    verifyForgotPassword,
    forgotPassword,
    resetPassword,
    changePassword,
    profile,
    updateProfile,
}