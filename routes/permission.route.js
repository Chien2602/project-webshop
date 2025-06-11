const express = require("express");
const router = express.Router();
const { getAllPermissions, getPermissionById, createPermission, updatePermission, softDeletePermission, hardDeletePermission } = require("../controllers/permission.controller");
const { verifyUser, checkPermission } = require("../middlewares/auth.middleware");

router.get("/", verifyUser, checkPermission("permission:read", getAllPermissions));
router.get("/:id", verifyUser, checkPermission("permission:read", getPermissionById));
router.post("/", verifyUser, checkPermission("permission:create", createPermission));
router.put("/:id", verifyUser, checkPermission("permission:update", updatePermission));
router.delete("/:id", verifyUser, checkPermission("permission:delete", hardDeletePermission));
router.patch("/:id", verifyUser, checkPermission("permission:update", softDeletePermission));

module.exports = router;