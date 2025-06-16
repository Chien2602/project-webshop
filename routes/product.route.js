const express = require("express");
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    handleDeleteProduct,
    softDeleteProduct,
    addVariant,
    updateVariant,
    deleteVariant
} = require("../controllers/product.controller");
const { verifyUser, checkPermission } = require("../middlewares/auth.middleware");

// Product routes
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", verifyUser, checkPermission("product:create"), createProduct);
router.put("/:id", verifyUser, checkPermission("product:update"), updateProduct);
router.delete("/:id", verifyUser, checkPermission("product:delete"), handleDeleteProduct);
router.patch("/:id", verifyUser, checkPermission("product:update"), softDeleteProduct);

// Variant routes
router.post("/:id/variants", verifyUser, checkPermission("product:update"), addVariant);
router.put("/:id/variants/:variantId", verifyUser, checkPermission("product:update"), updateVariant);
router.delete("/:id/variants/:variantId", verifyUser, checkPermission("product:update"), deleteVariant);

module.exports = router;