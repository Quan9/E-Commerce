const mongoose = require("mongoose");
const { model3DSchema } = require("./Model3D");
const ProductReviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "name is required"] },
    rating: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user required"],
    },
    comment: { type: String },
  },
  { timestamps: true }
);
const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    desc: { type: String },
    categories: { type: String, required: true },
    colors: [
      {
        color: { type: String },
        image: { type: String },
        inStock: { type: Number },
      },
    ],
    productImage: { type: [String] },
    price: { type: Number, required: true },
    systeminfo: { type: Object },
    discount: { type: Number },
    isActive: { type: String, default: "Inactive" },
    image360: { type: [String] },
    reviews: [ProductReviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;
