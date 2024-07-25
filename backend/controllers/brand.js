const Brand = require("../models/Brand");
const Category = require("../models/Category");
const allBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).sort({ createdAt: -1 });
    return res.status(200).json(brands);
  } catch (err) {
    return res.status(400).json(err);
  }
};
const newBrand = async (req, res) => {
  try {
    const { name } = req.body;
    const brand = new Brand({ name: name });
    brand.save();
    return res.status(200).json("Created!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
const editBrand = async (req, res) => {
  try {
    const { name } = req.body;

    await Brand.findByIdAndUpdate(req.params.id, {
      $set: { name: name },
    });
    return res.status(200).json("Updated!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
const deleteBrand = async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);
    await Category.updateMany(
      { brand: { $in: req.params.id } },
      { $pull: { brand: req.params.id } }
    );
    await Product.updateMany(
      { brand: { $in: req.params.id } },
      { $pull: { brand: req.params.id } }
    );
    return res.status(200).json("Deleted!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports = { deleteBrand, editBrand, allBrands, newBrand };
