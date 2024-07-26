const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema({
  name: { type: String, unique: true },
});
const Brand = mongoose.model("Brand", BrandSchema);
module.exports = Brand;
