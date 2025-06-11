const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const roleRoute = require("./role.route");
const permissionRoute = require("./permission.route");

router.use("/users", userRoute);
router.use("/roles", roleRoute);
router.use("/permissions", permissionRoute);

module.exports = router;