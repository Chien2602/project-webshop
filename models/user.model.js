const mongoose = require("mongoose");
const slugify = require("slugify");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
    },
    avatar: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
    slug: {
      type: String,
    },
    refreshToken: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    codeVerify: {
      type: String,
    },
    codeVerifyExpire: {
      type: String,
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
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.isModified('fullname')) {
    const baseSlug = slugify(this.fullname, {
      lower: true,
      strict: true,
      locale: 'vi',
    });

    let slug = baseSlug;
    let count = 1;

    while (await User.findOne({ slug, _id: { $ne: this._id } })) {
      slug = `${baseSlug}-${count++}`;
    }

    this.slug = slug;
  }

  next();
});
const User = mongoose.model("User", userSchema, "users");

module.exports = User;
