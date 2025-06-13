const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: [String],
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },
    price: {
        type: Number,
        required: true,
    },
    discount: {
        type: Number,
        required: true,
    },
    discountPrice: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isNew: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
}, { 
    timestamps: true,
});

productSchema.virtual("isNewProduct").get(function () {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return this.createdAt.getTime() > oneWeekAgo;
});

productSchema.pre("save", function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { 
            lower: true, 
            strict: true,
            locale: 'vi'
        });
    }
    this.discountPrice = this.price - (this.price * this.discount / 100);
    next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;