const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

const verifyUser = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }
    req.user = user;
    next();
}

const checkPermission = async (req, res, actions, next) => {
    try {
        const { user } = req;

        const actionList = Array.isArray(actions) ? actions : [actions];

        const role = await Role.findById(user.role);
        if (!role) {
            return res.status(403).json({
                success: false,
                message: "Role not found",
            });
        }
        const permissions = await Permission.find({ action: { $in: actionList } });

        if (permissions.length !== actionList.length) {
            return res.status(403).json({
                success: false,
                message: "Some actions are invalid or not found",
            });
        }

        const permissionIds = permissions.map(p => p._id.toString());
        const rolePermissionIds = role.permissions.map(p => p.toString());

        const hasAllPermissions = permissionIds.every(id => rolePermissionIds.includes(id));

        if (!hasAllPermissions) {
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


module.exports = {
    verifyUser,
    checkPermission,
}