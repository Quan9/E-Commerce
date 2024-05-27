const express = require("express");
const {
  fetchChats,
  findUserGroupChat,
  updateChat,
} = require("../controllers/chat");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.route("/").get(verifyTokenAndAdmin, fetchChats);
router.route("/client/:chatName").get(findUserGroupChat);
router.route("/agent/:chatId").get(verifyTokenAndAdmin, updateChat);
module.exports = router;
