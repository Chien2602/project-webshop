const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, createUser, updateUser, softDeleteUser, hardDeleteUser, changeUserStatus } = require("../controllers/user.controller");
const { verifyUser, checkPermission } = require("../middlewares/verifyUser.middleware");

router.get("/", verifyUser, checkPermission("user:read", getAllUsers));
router.get("/:id", verifyUser, checkPermission("user:read", getUserById));
router.post("/", verifyUser, checkPermission("user:create", createUser));
router.put("/:id", verifyUser, checkPermission("user:update", updateUser));
router.delete("/soft/:id", verifyUser, checkPermission("user:delete", softDeleteUser));
router.delete("/hard/:id", verifyUser, checkPermission("user:delete", hardDeleteUser));
router.put("/status/:id", verifyUser, checkPermission("user:update", changeUserStatus));

module.exports = router;