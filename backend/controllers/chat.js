const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const Message = require("../models/Message");

const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate({
        path: "latestMessage",
      })
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "username img email",
        });
        const data = [];
        results.forEach((item, index) => {
          if (item.isUser === false && item?.latestMessage === undefined) {
            return
          } else {
            data.push(item);
          }
        });
        res.status(200).send(data);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const getChat = async(req,res) =>{
  const {chatId} = req.params;
  try {
    Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
    })
    // .sort({ updatedAt: -1 })
    .then(async (result) => {
      result = await User.populate(result, {
        path: "latestMessage.sender",
        select: "username img email",
      });
      res.status(200).send(result);
    });
  } catch (error) {
    res.status(400).json(err)
  }
}
const findUserGroupChat = asyncHandler(async (req, res) => {
  const { chatName, loggedIn } = req.params;
  const existUser = await User.findOne({ username: chatName }, { _id: 1 });
  const existGroup = await Chat.findOne({ chatName: chatName }, { _id: 1 });
  const adminsAndMods = await User.find(
    { role: { $nin: ["user", "guess"] } },
    { _id: 1 }
  );
  //check guess
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
      isUser: false,
      isGroupChat: true,
      groupAdmin: adminsAndMods,
    });
    res.status(200).json(createGroup._id);
  } else if (existUser && !loggedIn && !existGroup) {
    const createGroup = await Chat.create({
      chatName: chatName,
      users: adminsAndMods.concat(existUser),
      isUser: false,
      isGroupChat: true,
      groupAdmin: adminsAndMods,
    });
    res.status(200).json(createGroup._id);
  } else if (existUser && loggedIn && !existGroup) {
    const createGroup = await Chat.create({
      chatName: chatName,
      users: adminsAndMods.concat(existUser),
      isUser: true,
      isGroupChat: true,
      groupAdmin: adminsAndMods,
    });
    res.status(200).json(createGroup._id);
  }
  //check logged/guess chat group
  else {
    res.status(200).json(existGroup._id);
  }
});
const updateChat = async (req, res) => {
  const { chatId } = req.params;
  const user = await User.findById(req.user.id);
  const haveMessage = await Chat.findById(chatId);
  if (haveMessage.latestMessage) {
    await Message.updateMany(
      { chat: chatId },
      { $set: { readBy: user } },
      { upsert: true, new: true }
    );
  }
  await Chat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate({
      path: "latestMessage",
    })
    // .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "username img email",
      });
      res.status(200).send(results);
    });
};
module.exports = {
  fetchChats,
  findUserGroupChat,
  updateChat,
  getChat
};
