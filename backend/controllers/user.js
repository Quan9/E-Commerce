const User = require("../models/User");
const CryptoJS = require("crypto-js");
const Chat = require("../models/Chat");
const createUser = async (req, res) => {
  const newUser = req.body;
  try {
    const savedUser = await User.saved(newUser);
    res.status(200).json("User Created Successfully");
  } catch (err) {
    res.status(401).json(err);
  }
};
const updateUser = async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json("User Updated Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};
const updateNoti = async (req, res) => {
  let updateNoti = req.body.noti;
  updateNoti.map((item) => {
    if (item.name === req.body.data) return (item.number = 0);
  });
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $set: { noti: updateNoti },
      },
      { new: true }
    );
    const { noti } = updatedUser._doc;
    res.status(200).json(noti);
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteUser = async (req, res) => {
  try {
    const chat = await Chat.findOne({ users: req.params.id });
    if (chat) {
      await Chat.findByIdAndDelete(chat._id);
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

const getSingleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    // const { password, ...others } = user._doc;
    // res.status(200).json(others);
    const decryptPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    ).toString(CryptoJS.enc.Utf8);
    user.password = decryptPassword;
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAnoUser = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.query.username });
    const { _id } = user._doc;
    res.status(200).json(_id);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllUser = async (req, res) => {
  try {
    const items = await User.find({}).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (error) {
    return res.status(400).json(error);
  }
};
const getUserStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
module.exports = {
  updateUser,
  deleteUser,
  getSingleUser,
  getAllUser,
  getUserStats,
  createUser,
  updateNoti,
  getAnoUser,
};
