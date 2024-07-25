const Color = require("../models/Color");
const allColors = async (req, res) => {
  try {
    const colors =await Color.find({}).sort({ createdAt: -1 });
    return res.status(200).json(colors);
  } catch (err) {
    return res.status(400).json(err);
  }
};
const newColor = async (req, res) => {
  try {
    const color = new Color(req.body);
    color.save();
    return res.status(200).json("Created!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
const editColor = async (req, res) => {
  try {
    await Color.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
    return res.status(200).json("Updated!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
const deleteColor = async (req, res) => {
  try {
    await Color.findByIdAndDelete(req.params.id);
    return res.status(200).json("Deleted!");
  } catch (err) {
    return res.status(400).json(err);
  }
};
module.exports = { deleteColor, editColor, allColors,newColor };
