const asyncHandler = require("express-async-handler");
const Message = require("../models/Message");
const User = require("../models/User");
const Chat = require("../models/Chat");
/* làm theo github để lấy chat của bên Agent
  copy pages bên mobileShop
*/
const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "username img email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId, user } = req.body;
  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400).json("Invalid data passed into request");
  }
  const findUser = await User.findOne({ username: user });
  var newMessage = {
    sender: findUser._id,
    content: content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);
    const messageSend = await Message.findById(message._id)
      .populate({ path: "sender", select: "username" })
      .populate({
        path: "chat",
        populate: { path: "users", select: "username email" },
      })
      .exec();
    if (findUser.role === "user" || findUser.role === "guess") {
      let hasDoc = await User.countDocuments({
        role: { $nin: ["user", "guess"] },
        "noti.name": "message",
      });
      if (hasDoc > 0) {
        const data = await User.updateMany(
          { role: { $nin: ["user", "guess"] }, "noti.name": "message" },
          { $inc: { "noti.$.number": 1 } }
        );
      }
      // Document not exists then add document
      else {
        const data = await User.updateMany(
          { role: { $nin: ["user", "guess"] } },
          { $addToSet: { noti: { name: "message", number: 1 } } }
        );
      }
    }
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    res.json(messageSend);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { allMessages, sendMessage };
