const Cart = require("../models/cart.mode");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const createCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (cart) {
      return res.status(400).json({
        success: false,
        message: "Cart already exists",
      });
    }
    const newCart = await Cart.create({ userId, products });
    res.status(201).json({
      success: true,
      message: "Cart created successfully",
      data: newCart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getCartByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const addProductToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product added to cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const updateProductQuantity = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
    } else {
      cart.products.push({ productId, quantity });
    }
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product quantity updated successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteProductFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId.toString()
    );
    if (productIndex !== -1) {
      cart.products.splice(productIndex, 1);
    }
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Product deleted from cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const deleteAllProductsFromCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    cart.products = [];
    await cart.save();
    res.status(200).json({
      success: true,
      message: "All products deleted from cart successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const softDeleteCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }
    cart.isDeleted = true;
    await cart.save();
    res.status(200).json({
      success: true,
      message: "Cart soft deleted successfully",
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  createCart,
  getCartByUserId,
  addProductToCart,
  updateProductQuantity,
  deleteProductFromCart,
  deleteAllProductsFromCart,
  softDeleteCart,
};
