const express = require("express");
const router = express.Router();
const { createOrder, getOrderByUserId, updateOrder, deleteOrder, softDeleteOrder, hardDeleteOrder, handleDeleteOrder } = require("../controllers/order.controller");
const { verifyUser, checkPermission } = require("../middlewares/auth.middleware");

router.post("/", verifyUser, checkPermission("order:create"), createOrder);
router.get("/:userId", verifyUser, checkPermission("order:get"), getOrderByUserId);
router.put("/:orderId", verifyUser, checkPermission("order:update"), updateOrder);
router.delete("/:orderId", verifyUser, checkPermission("order:delete"), deleteOrder);
router.patch("/soft-delete/:orderId", verifyUser, checkPermission("order:update"), softDeleteOrder);
router.delete("/hard-delete/:orderId", verifyUser, checkPermission("order:delete"), hardDeleteOrder);

module.exports = router;