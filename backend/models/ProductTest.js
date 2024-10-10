const mongoose = require("mongoose");
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
    name: String,
    desc: String,
    category: String,
    brand: String,
    colors: [
      {
        color: String,
        image: String,
        inStock: Number,
      },
    ],
    images: Array,
    price: { type: Number, required: true },
    systeminfo: Object,
    discount: Number,
    isActive: { type: String, default: "Inactive" },
    image360: Array,
    attributes: [{ type: mongoose.Schema.Types.Mixed }],
    reviews: [ProductReviewSchema],
  },
  { timestamps: true }
);
const ProductTest = mongoose.model("ProductTest", ProductSchema);
module.exports = ProductTest;
