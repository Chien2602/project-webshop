const express = require("express");
const router = express.Router();
const { getAllCategories, getCategoryById, createCategory, updateCategory, handleDeleteCategory, softDeleteCategory, getProductsByCategory } = require("../controllers/category.controller");
const { verifyUser, checkPermission } = require("../middlewares/auth.middleware");

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/:id/products", getProductsByCategory);
router.post("/", verifyUser, checkPermission("category:create"), createCategory);
router.put("/:id", verifyUser, checkPermission("category:update"), updateCategory);
router.delete("/:id", verifyUser, checkPermission("category:delete"), handleDeleteCategory);
router.patch("/:id", verifyUser, checkPermission("category:delete"), softDeleteCategory);

module.exports = router;