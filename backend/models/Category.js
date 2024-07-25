const mongoose = require("mongoose");
const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, unique: true },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    brand: [{ type: mongoose.Schema.Types.ObjectId, ref: "Brand" }],
  },
  { timestamps: false }
);
const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;
