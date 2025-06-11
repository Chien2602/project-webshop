const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

const createOrder = async (req, res) => {
    try {
        const { userId, products, totalPrice, totalQuantity, status, paymentMethod, paymentDate, address, phone, email } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        const order = await Order.create({ userId, products, totalPrice, totalQuantity, status, paymentMethod, paymentDate, address, phone, email });
        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const getOrderByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const order = await Order.find({ userId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order fetched successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, paymentMethod, paymentDate, address, phone, email } = req.body;
        const order = await Order.findByIdAndUpdate(orderId, { status, paymentMethod, paymentDate, address, phone, email, updatedBy: req.user.id }, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order updated successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndDelete(orderId, { deletedBy: req.user.id });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const softDeleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndUpdate(orderId, { isDeleted: true, deletedAt: new Date(), deletedBy: req.user.id }, { new: true });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order soft deleted successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

const hardDeleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findByIdAndDelete(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Order hard deleted successfully",
            data: order,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};

module.exports = { createOrder, getOrderByUserId, updateOrder, deleteOrder, softDeleteOrder, hardDeleteOrder, handleDeleteOrder };