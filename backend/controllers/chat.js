const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const Message = require("../models/Message");
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "username img")
      .populate({
        path: "latestMessage",
      })
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username img",
        });
        results = await User.populate(results, {
          path: "latestMessage.readBy",
          select: "username img",
        });
        const data = [];
        results.forEach((item, index) => {
          if (item.latestMessage === undefined) {
            return;
          } else {
            data.push(item);
          }
        });
        res.status(200).send(data);
      });
  } catch (error) {
    res.status(400);
  }
});
const getChat = async (req, res) => {
  const { id } = req.params;
  try {
    await Chat.findById(id)
      .populate("users", "-password")
      .populate({
        path: "latestMessage",
      })
      .then(async (result) => {
        result = await User.populate(result, {
          path: "latestMessage.sender",
          select: "username img",
        });
        result = await User.populate(result, {
          path: "latestMessage.readBy",
          select: "username img",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400).json(err);
  }
};
const findUserGroupChat = asyncHandler(async (req, res) => {
  const { chatName } = req.params;
  const existUser = await User.findOne({ username: chatName }, { _id: 1 });
  const existGroup = await Chat.findOne({ chatName: chatName }, { _id: 1 });
  const adminsAndMods = await User.find(
    { role: { $nin: ["user", "guess"] } },
    { _id: 1 }
  );
  if (!existUser) {
    const guess = await User.create({
      username: chatName,
      email: chatName + "@gmail.com",
      password: CryptoJS.AES.encrypt(chatName, process.env.PASS_SEC).toString(),
      role: "guess",
    });
    const createGroup = await Chat.create({
      chatName: chatName,
      users: adminsAndMods.concat(guess._id),
    });
    res.status(200).json(createGroup._id);
  } else if (existUser && !existGroup) {
    const createGroup = await Chat.create({
      chatName: chatName,
      users: adminsAndMods.concat(existUser),
    });
    res.status(200).json(createGroup._id);
  } else {
    res.status(200).json(existGroup._id);
  }
});
const updateChat = async (req, res) => {
  const { chatId } = req.params;
  const user = await User.findById(req.user.id);
  const haveMessage = await Chat.findById(chatId);
  if (haveMessage.latestMessage) {
    await Message.findOneAndUpdate(
      { _id: haveMessage.latestMessage._id, readBy: { $nin: [user._id] } },
      { $push: { readBy: user } },
      { upsert: true, new: true }
    );
  }
  try {
    await Chat.findById(chatId)
      .populate("users", "username img")
      .populate({
        path: "latestMessage",
      })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username img",
        });
        results = await User.populate(results, {
          path: "latestMessage.readBy",
          select: "username img",
        });
        res.status(200).json(results);
      });
  } catch (error) {
    console.log("error");
  }
};
module.exports = {
  fetchChats,
  findUserGroupChat,
  updateChat,
  getChat,
};
