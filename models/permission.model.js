const mongoose = require("mongoose");

const permissionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    module: {
        type: String,
        required: true,
    },
    action: {
        type: [String],
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { timestamps: true });

const Permission = mongoose.model("Permission", permissionSchema, "permissions");
module.exports = Permission;