const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: No token provided",
            });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token format",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded || !decoded.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Invalid token",
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Token expired",
            });
        }
        console.error("Auth middleware error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const checkPermission = (action) => {
    return async (req, res, next) => {
        try {
            const { user } = req;
            if (!user || !user.roleId) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: User role not found",
                });
            }

            const role = await Role.findById(user.roleId);
            if (!role) {
                return res.status(403).json({
                    success: false,
                    message: "Role not found",
                });
            }

            const permissions = await Permission.find({ action: action });
            if (!permissions || permissions.length === 0) {
                return res.status(403).json({
                    success: false,
                    message: "Action not found in permissions",
                });
            }

            const permissionIds = permissions.map(p => p._id.toString());
            const rolePermissionIds = role.permissions.map(p => p.toString());

            const hasPermission = permissionIds.some(id => rolePermissionIds.includes(id));

            if (!hasPermission) {
                return res.status(403).json({
                    success: false,
                    message: "Forbidden: Insufficient permissions",
                });
            }

            next();
        } catch (err) {
            console.error("Permission check error:", err);
            res.status(500).json({
                success: false,
                message: "Internal server error",
            });
        }
    };
};

module.exports = {
    verifyUser,
    checkPermission,
}