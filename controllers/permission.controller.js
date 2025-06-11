const Permission = require("../models/permission.model");

const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find({
      isDeleted: false,
      isActive: true,
    });
    res.status(200).json({
      success: true,
      message: "Permissions fetched successfully",
      data: permissions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id).select(
      "-__v -isDeleted -isActive -createdAt -updatedAt -deletedAt -createdBy -updatedBy -deletedBy"
    );
    if (!permission) {
      return res.status(404).json({
        success: false,
        message: "Permission not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Permission fetched successfully",
      data: permission,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const createPermission = async (req, res) => {
    try {
        const { name, module, action } = req.body;
        if (!name || !module || !action) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const existingPermission = await Permission.findOne({ name, module, action });
        if (existingPermission) {
            return res.status(400).json({
                success: false,
                message: "Permission already exists",
            });
        }
        const permission = await Permission.create({
            name,
            module,
            action: `${module}:${action}`,
            createdBy: req.user._id,
        });
        res.status(201).json({
            success: true,
            message: "Permission created successfully",
            data: permission,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, module, action } = req.body;
        if (!name || !module || !action) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const permission = await Permission.findByIdAndUpdate(id, { name, module, action, updatedBy: req.user._id }, { new: true });
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Permission updated successfully",
            data: permission,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const softDeletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findByIdAndUpdate(id, { isDeleted: true, deletedBy: req.user._id }, { new: true });
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Permission deleted successfully",
            data: permission,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

const hardDeletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await Permission.findByIdAndDelete(id);
        if (!permission) {
            return res.status(404).json({
                success: false,
                message: "Permission not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Permission deleted successfully",
            data: permission,
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
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  softDeletePermission,
  hardDeletePermission,
};
