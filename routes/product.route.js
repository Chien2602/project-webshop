const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, createProduct, updateProduct, handleDeleteProduct, softDeleteProduct } = require("../controllers/product.controller");
const { verifyUser, checkPermission } = require("../middlewares/auth.middleware");

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", verifyUser, checkPermission("product:create"), createProduct);
router.put("/:id", verifyUser, checkPermission("product:update"), updateProduct);
router.delete("/:id", verifyUser, checkPermission("product:delete"), handleDeleteProduct);
router.patch("/:id", verifyUser, checkPermission("product:update"), softDeleteProduct);

module.exports = router;