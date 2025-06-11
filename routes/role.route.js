const express = require("express");
const router = express.Router();
const { getAllRoles, getRoleById, createRole, updateRole, softDeleteRole, hardDeleteRole } = require("../controllers/role.controller");
const { verifyUser, checkPermission } = require("../middlewares/verifyUser.middleware");

router.get("/", verifyUser, checkPermission("role:read", getAllRoles));
router.get("/:id", verifyUser, checkPermission("role:read", getRoleById));
router.post("/", verifyUser, checkPermission("role:create", createRole));
router.put("/:id", verifyUser, checkPermission("role:update", updateRole));
router.delete("/soft/:id", verifyUser, checkPermission("role:delete", softDeleteRole));
router.delete("/hard/:id", verifyUser, checkPermission("role:delete", hardDeleteRole));

module.exports = router;