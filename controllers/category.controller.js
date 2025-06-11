const Category = require("../models/category.model");

const getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findById(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category fetched successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const createCategory = async (req, res) => {
    try {
        const { name, description, thumbnail } = req.body;
        const category = await Category.create({ name, description, thumbnail, createdBy: req.user.id });
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, thumbnail } = req.body;
        const category = await Category.findByIdAndUpdate(id, { name, description, thumbnail, updatedBy: req.user.id }, { new: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const handleDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndDelete(id);
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const softDeleteCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await Category.findByIdAndUpdate(id, { isDeleted: true, deletedBy: req.user.id }, { new: true });
        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Category soft deleted successfully",
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}

module.exports = { getAllCategories, getCategoryById, createCategory, updateCategory, handleDeleteCategory, getProductsByCategory };