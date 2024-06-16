const express = require("express");
const {
  fetchChats,
  findUserGroupChat,
  updateChat,
  getChat,
} = require("../controllers/chat");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.route("/").get(verifyTokenAndAdmin, fetchChats);
router.route("/client/:chatName").get(findUserGroupChat);
router.route("/agent/:chatId").get(verifyTokenAndAdmin, updateChat);
router.route('/agent/get/:id').get(verifyTokenAndAdmin,getChat)
module.exports = router;
