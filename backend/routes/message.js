const express = require("express");
const {
  allMessages,
  sendMessage,
  messageRead,
} = require("../controllers/message");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.get("/:chatId", allMessages);
router.post("/", sendMessage);
router.get("/agent/:chatId", verifyTokenAndAdmin, allMessages);
router.get("/updatemessage/:id", messageRead);

module.exports = router;
