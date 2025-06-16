const mongoose = require("mongoose");
const slugify = require("slugify");

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    specifications: {
        type: Object,
        default: {}
    }
}, { _id: true });

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
    basePrice: {
        type: Number,
        required: true,
    },
    variants: [variantSchema],
    specifications: {
        type: Object,
        required: true,
        default: {},
    },
    discount: {
        type: Number,
        required: true,
        default: 0
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

productSchema.pre("save", async function (next) {
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { 
            lower: true, 
            strict: true,
            locale: 'vi'
        });
        let counter = 1;
        let originalSlug = this.slug;
        while (await this.constructor.findOne({ slug: this.slug })) {
            this.slug = `${originalSlug}-${counter}`;
            counter++;
        }
    }
    next();
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;