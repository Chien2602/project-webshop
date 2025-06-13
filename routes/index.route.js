const express = require("express");
const router = express.Router();
const userRoute = require("./user.route");
const roleRoute = require("./role.route");
const permissionRoute = require("./permission.route");
const categoryRoute = require("./category.route");
const productRoute = require("./product.route");
const cartRoute = require("./cart.route");
const orderRoute = require("./order.route");
const authRoute = require("./auth.route");

router.use("/users", userRoute);
router.use("/roles", roleRoute);
router.use("/permissions", permissionRoute);
router.use("/categories", categoryRoute);
router.use("/products", productRoute);
router.use("/carts", cartRoute);
router.use("/orders", orderRoute);
router.use("/auth", authRoute);

module.exports = router;