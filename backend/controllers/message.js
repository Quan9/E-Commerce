const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
const allMessages = (async (req, res) => {
  try {
    const total = req.query.total - 20 < 0 ? 0 : req.query.total - 20;
    if (req.query.user) {
      const findUser = await User.findOne({ username: req.query.user });
      const chat = await Chat.findById(req.params.chatId);
      await Message.updateMany(
        {
          chat: req.params.chatId,
        },
        {
          $pull: { readBy: findUser._id },
        }
      );
      await Message.updateOne(
        { _id: chat.latestMessage._id },
        {
          $push: { readBy: findUser._id },
        }
      );
    }
    const messagesCount = await Message.countDocuments({
      chat: req.params.chatId,
    });
    if (total === "0") {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username img")
        .populate("readBy", "username img")
        .sort({ createdAt: -1 })
        .limit(20);
      if (messagesCount <= 20) {
        res.status(200).json({ messages: messages, top: true });
      } else {
        res.status(200).json({ messages: messages, top: false });
      }
    } else {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "username img")
        .populate("readBy", "username img")
        .sort({ createdAt: -1 })
        .skip(total)
        .limit(20);
      if (
        (messagesCount > total && messages.length !== 20) ||
        messagesCount <= 20
      ) {
        res.status(200).json({ messages: messages, top: true });
      } else res.status(200).json({ messages: messages, top: false });
    }
  } catch (error) {
    res.status(400);
  }
});
const sendMessage = (async (req, res) => {
  const { content, chatId, user } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400).json("Invalid data passed into request");
  }
  const findUser = await User.findOne({ username: user });
  await Message.updateMany(
    {
      chat: chatId,
    },
    {
      $pull: { readBy: findUser._id },
    }
  );

  try {
    let message = await Message.create({
      sender: findUser._id,
      content: content,
      chat: chatId,
      readBy: [findUser._id],
    });
    await Chat.findByIdAndUpdate(
      chatId,
      {
        latestMessage: message,
      },
      { upsert: true, new: true }
    );
    const messageSend = await Message.findById(message._id)
      .populate({ path: "sender", select: "username img" })
      .populate({
        path: "chat",
        populate: { path: "users", select: "username img" },
      })
      .populate({ path: "readBy", select: "username img" })
      .exec();

    if (findUser.role === "user" || findUser.role === "guess") {
      let hasDoc = await User.countDocuments({
        role: { $nin: ["user", "guess"] },
        "noti.name": "message",
      });
      if (hasDoc > 0) {
        await User.updateMany(
          { role: { $nin: ["user", "guess"] }, "noti.name": "message" },
          { $inc: { "noti.$.number": 1 } }
        );
      }
      // Document not exists then add document
      else {
        await User.updateMany(
          { role: { $nin: ["user", "guess"] } },
          { $addToSet: { noti: { name: "message", number: 1 } } }
        );
      }
    }
    res.status(200).json(messageSend);
  } catch (error) {
    res.status(400).json(error);
  }
});
const messageRead = (async (req, res) => {
  const { id } = req.params;
  const { totalMessage, user } = req.query;
  const findUser = await User.findOne({ username: user });
  const chat = await Chat.findById(id);
  try {
    await Message.updateMany(
      {
        chat: chat,
        readBy: { $eq: findUser._id },
      },
      {
        $pull: { readBy: findUser._id },
      }
    );
    await Message.updateOne(
      { _id: chat.latestMessage._id },
      {
        $push: { readBy: findUser._id },
      }
    );
    const messagesSend = await Message.find({ chat: id })
      .populate("sender", "username img")
      .populate("readBy", "username img")
      .sort({ createdAt: -1 })
      .limit(totalMessage);
    res.status(200).json(messagesSend);
  } catch (error) {
    res.status(400).json({ message: "error" });
  }
});
module.exports = { allMessages, sendMessage, messageRead };
