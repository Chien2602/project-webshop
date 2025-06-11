const mongoose = require("mongoose");
const Permission = require("./permission.model");

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    permissions: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "Permission",
        required: true,
        default: [],
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
}, {
    timestamps: true
});

const Role = mongoose.model("Role", roleSchema, "roles");
module.exports = Role;