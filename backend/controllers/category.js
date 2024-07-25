const Brand = require("../models/Brand");
const Category = require("../models/Category");
const allCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .sort({ createdAt: -1 })
      .populate("brand", "name -_id");
    return res.status(200).json(categories);
  } catch (err) {
    return res.status(400).json(err);
  }
};
const newCategory = async (req, res) => {
  try {
    const { name, brand } = req.body;
    if (brand) {
      await Brand.find({ name: { $in: brand } }, "_id").then(async (brands) => {
        const category = new Category({ name: name, brand: brands });
        category.save();
        return res.status(200).json("Created!");
      });
    } else {
      const category = new Category({ name: name });
      category.save();
      return res.status(200).json("Created!");
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};
const editCategory = async (req, res) => {
  try {
    const { name, brand } = req.body;
    if (brand) {
      await Brand.find({ name: { $in: brand } }, "_id").then(async (brands) => {
        await Category.findByIdAndUpdate(req.params.id, {
          $set: {
            name: name,
            brand: brands,
          },
        });
        return res.status(200).json("Updated!");
      });
    } else {
      await Category.findByIdAndUpdate(req.params.id, {
        $set: {
          name: name,
          brand: [],
        },
      });
      return res.status(200).json("Updated!");
    }
  } catch (err) {
    return res.status(400).json(err);
  }
};
const deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    return res.status(200).json("Deleted!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports = { deleteCategory, editCategory, allCategories, newCategory };
