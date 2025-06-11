const Role = require("../models/role.model");
const Permission = require("../models/permission.model");

const getAllRoles = async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false, isActive: true }).select("-__v -isDeleted -isActive -createdAt -updatedAt -deletedAt -createdBy -updatedBy -deletedBy");
        res.status(200).json({
            success: true,
            message: "Roles fetched successfully",
            data: roles,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "Role ID is required",
            });
        }
        const role = await Role.findById(id).select("-__v -isDeleted -isActive -createdAt -updatedAt -deletedAt -createdBy -updatedBy -deletedBy");
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Role fetched successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const createRole = async (req, res) => {
    try {
        const { name, description, permissions } = req.body;
        if (!name || !permissions) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingRole = await Role.findOne({ name });
        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role already exists",
            });
        }
        if (permissions.includes("*")) {
            const allPermissions = await Permission.find({});
            permissions = allPermissions.map((permission) => permission._id);
        }
        const role = await Role.create({
            name,
            description,
            permissions,
            createdBy: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, permissions } = req.body;
        if (!name || !permissions) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        if (permissions.includes("*")) {
            const allPermissions = await Permission.find({});
            permissions = allPermissions.map((permission) => permission._id);
        }
        const role = await Role.findByIdAndUpdate(id, { name, description, permissions, updatedBy: req.user._id }, { new: true });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Role updated successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const softDeleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndUpdate(id, { isDeleted: true, deletedBy: req.user._id }, { new: true });
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
            data: role,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const hardDeleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await Role.findByIdAndDelete(id);
        if (!role) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Role deleted successfully",
            data: role,
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
    getAllRoles,
    getRoleById,
    createRole,
    updateRole,
    softDeleteRole,
    hardDeleteRole,
}