const mongoose = require("mongoose");
const BrandSchema = new mongoose.Schema({
  name: String,
});
const Brand = mongoose.model("Brand", BrandSchema);
module.exports = Brand;
