const mongoose = require("mongoose");
const ColorSchema = new mongoose.Schema({
  name: String,
});
const Color = mongoose.model("Color", ColorSchema);
module.exports = Color;
