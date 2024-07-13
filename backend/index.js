const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const chatRoute = require("./routes/chat");
const messageRoute = require("./routes/message");
const cors = require("cors");
const User = require("./models/User");
const Message = require("./models/Message");
const Chat = require("./models/Chat");
const app = express();
const http = require("http").Server(app);
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then(() => {
      console.log("Connect to MongoDB");
    });
  } catch (error) {
    throw error;
  }
};
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
  next();
});
const socketIO = require("socket.io")(http, {
  cors: {
    origin: [`${process.env.CLIENT_URL}`],
  },
});
//Add this before the app.get() block
let onlineUsers = [];
const removeUser = async (socketId) => {
  const anoUser = onlineUsers.find((user) => user.socketId === socketId);
  if (anoUser) {
    const chat = await Chat.findOne({ chatName: anoUser.username });
    if (chat?.latestMessage === null) {
      const result = await Chat.deleteOne({ _id: chat._id });
      if (result.deletedCount === 1) {
        console.log("Successfully deleted one document.");
      } else {
        console.log("No documents matched the query. Deleted 0 documents.");
      }
    }
  }
  onlineUsers = onlineUsers.filter((user) => user.socketId !== socketId);
};
const addUser = (username, socketId) => {
  !onlineUsers.some((user) => user.username === username) &&
    onlineUsers.push({ username, socketId });
};

socketIO.on("connection", (socket) => {
  socket.on("loggedUser", async (username) => {
    if (username) {
      removeUser(socket.id);
      addUser(username, socket.id);
      const alreadyUser = onlineUsers.find(
        (user) => user.username === username
      );
      socketIO.to(socket.id).emit("user", alreadyUser);
    } else {
      const anonymousName = "user-" + socket.id;
      addUser(anonymousName, socket.id);
      const user = { username: anonymousName, socketId: socket.id };
      socketIO.to(socket.id).emit("user", user);
    }
  });

  socket.on("join", (room) => {
    socket.join(room);
  });
  socket.on("userMessage", async (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;
    if (!chat.users) return;
    await chat.users.forEach(async (userChat) => {
      if (userChat._id == newMessageRecieved.sender._id) return;
      const getUser = await User.findOne({ _id: userChat._id });
      const userOnline = onlineUsers.find(
        (user) => user.username === getUser.username
      );

      if (userOnline) {
        if (getUser.role === "admin" || getUser.role === "mod") {
          socketIO
            .to(userOnline.socketId)
            .emit("message notification", getUser.noti);
        }
        const updatedNewMessage = await Message.findById(newMessageRecieved._id)
          .populate({ path: "sender", select: "username img" })
          .populate({
            path: "chat",
            populate: { path: "users", select: "username email" },
          })
          .populate({ path: "readBy", select: "username img" });
        socketIO
          .to(userOnline.socketId)
          .emit("message recieved", updatedNewMessage);
      }
    });
  });
  socket.on("userRead", async (data) => {
    const { room, user } = data;
    socket.to(room).emit("updateMessages");
  });
  socket.on("logout", (username) => {
    removeUser(socket.id);
  });

  socket.on("orderSuccess", async () => {
    const adminsAndMods = await User.find({
      role: { $nin: ["user", "guess"] },
    });
    adminsAndMods.forEach(async (username) => {
      const user = onlineUsers.find(
        (user) => user.username === username.username
      );
      if (user) {
        socketIO.to(user.socketId).emit("new order", username.noti);
      }
    });
  });
  socket.on("disconnect", () => {
    removeUser(socket.id);
  });
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/stripe", stripeRoute);
app.use("/api/chat", chatRoute);
app.use("/api/message", messageRoute);
app.get("/api/test", (req, res) => {
  res.status(200).send({ data: "hello" });
});
http.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running on port", process.env.PORT || 5000);
  connect();
});
