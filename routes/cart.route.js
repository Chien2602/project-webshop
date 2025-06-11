const express = require("express");
const router = express.Router();
const { createCart, getCartByUserId, addProductToCart, updateProductQuantity, deleteProductFromCart, deleteAllProductsFromCart, softDeleteCart } = require("../controllers/cart.controller");
const { verifyUser } = require("../middlewares/auth.middleware");

router.post("/", verifyUser, createCart);
router.get("/:userId", verifyUser, getCartByUserId);
router.post("/add-product", verifyUser, addProductToCart);
router.put("/update-product", verifyUser, updateProductQuantity);
router.delete("/delete-product", verifyUser, deleteProductFromCart);
router.delete("/delete-all-products", verifyUser, deleteAllProductsFromCart);
router.patch("/soft-delete", verifyUser, softDeleteCart);

module.exports = router;