const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const createOrder = async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    const { products } = req.body;
    products.map(async (product) => {
      const { productId, colorId, quantity } = product;

      await Product.findOneAndUpdate(
        { _id: productId, "colors._id": `${colorId}` },
        {
          $inc: {
            "colors.$.inStock": -quantity,
          },
        },
        { new: true }
      );
    });
    let hasDoc = await User.countDocuments({
      role: { $nin: ["user", "guess"] },
      "noti.name": "order",
    });
    if (hasDoc > 0) {
      await User.updateMany(
        { role: { $nin: ["user", "guess"] }, "noti.name": "order" },
        { $inc: { "noti.$.number": 1 } }
      );
    }

    // Document not exists then add document
    else {
      await User.updateMany(
        { role: { $nin: ["user", "guess"] } },
        { $push: { noti: { name: "order", number: 1 } } }
      );
    }
    // Document not exists then add document
    res.status(200).json(savedOrder);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
};
const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    return res.status(200).json(order);
  } catch (err) {
    return res.status(403).json('Order not exist!');
  }
};
const updatedOrder = async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json("Order Updated Successfully");
  } catch (err) {
    res.status(500).json(err);
  }
};

const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
const getAllOrder = async (req, res) => {
  try {
    const items = await Order.find({}).sort({ createdAt: -1 });
    return res.status(200).json(items);
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getMonthlyIncome = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          income: { $sum: "$sales" },
          sum: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
};
const getUserOrder = async (req, res) => {
  const query = { userId: req.params.id };
  try {
    const items = await Order.find(query).sort({ createdAt: -1 });

    return res.status(200).json(items);
  } catch (e) {
    return res.status(403).json(e);
  }
};
module.exports = {
  createOrder,
  updatedOrder,
  deleteOrder,
  getAllOrder,
  getMonthlyIncome,
  getUserOrder,
  getSingleOrder,
};
