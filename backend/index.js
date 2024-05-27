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
const model3DRoute = require("./routes/model3D");
const CryptoJS = require("crypto-js");

const cors = require("cors");
const User = require("./models/User");
const app = express();
const http = require("http").Server(app);
dotenv.config();
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Connect to MongoDB");
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
    origin: ["http://localhost:5173", "http://localhost:3000"],
  },
});

//Add this before the app.get() block
let onlineUsers = [];

const removeUser = (socketId) => {
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
    if (!chat.users) return console.log("chat.users not defined");
    //for admin
    const adminsAndMods = await User.find({
      role: { $nin: ["user", "guess"] },
    });
    adminsAndMods.forEach(async (username) => {
      const user = onlineUsers.find(
        (user) => user.username === username.username
      );
      if (user) {
        socketIO.to(user.socketId).emit("message notification", username.noti);
        socketIO.to(user.socketId).emit("message update", newMessageRecieved);
      }
    });
    //for user
    chat.users.forEach(async (user) => {
      if (user._id == newMessageRecieved.sender._id) return;
      const getUser = await User.findOne({ _id: user._id });
      onlineUsers.forEach((user) => {
        if (user.username === getUser.username) {
          socket.to(user.socketId).emit("message recieved", newMessageRecieved);
        }
      });
    });
  });

  socket.on("logout", (username) => {
    onlineUsers = onlineUsers.filter((user) => user.username !== username);
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
    const anoUser = onlineUsers.find((user) => user.socketId === socket.id);
    if (anoUser) {
    }
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
app.use("/api/model", model3DRoute);
app.get("/api/test", (req, res) => {
  res.status(200).send({ data: "hello" });
});
http.listen(process.env.PORT || 5000, () => {
  console.log("Backend server is running on port", process.env.PORT || 5000);
  connect();
});
