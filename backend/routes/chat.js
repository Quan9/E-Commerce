const express = require("express");
const {
  fetchChats,
  findUserGroupChat,
  updateChat,
  getChat,
} = require("../controllers/chat");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", verifyTokenAndAdmin, fetchChats);
router.get("/client/:chatName", findUserGroupChat);
router.get("/agent/:chatId", verifyTokenAndAdmin, updateChat);
router.get("/agent/get/:id", verifyTokenAndAdmin, getChat);
module.exports = router;
