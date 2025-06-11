const Product = require("../models/product.model");
const Category = require("../models/category.model");

const getAllProducts = async (req, res) => {
    try {
        const limit = req.query.limit || 10;
        const page = req.query.page || 1;
        const skip = (page - 1) * limit;
        const total = await Product.countDocuments({ isDeleted: false, isActive: true });
        const totalPages = Math.ceil(total / limit);
        const products = await Product.find({ isDeleted: false, isActive: true }).skip(skip).limit(limit);
        res.status(200).json({
            success: true,
            message: "Products fetched successfully",
            data: {
                products,
                totalPages,
                total,
                page,
                limit,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product fetched successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const createProduct = async (req, res) => {
    try {
        const { name, description, thumbnail, category, price, discount, stock } = req.body;
        const product = await Product.create({ name, description, thumbnail, category, price, discount, stock, createdBy: req.user.id });
        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, thumbnail, category, price, discount, stock } = req.body;
        const product = await Product.findByIdAndUpdate(id, { name, description, thumbnail, category, price, discount, stock, updatedBy: req.user.id }, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const handleDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const softDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { isDeleted: true, deletedBy: req.user.id }, { new: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Product soft deleted successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, handleDeleteProduct, softDeleteProduct };