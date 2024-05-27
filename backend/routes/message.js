const express = require("express");
const { allMessages, sendMessage } = require("../controllers/message");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

const router = express.Router();

router.route("/:chatId").get(allMessages);
router.route("/").post(sendMessage);
router.route("/agent/:chatId").get(verifyTokenAndAdmin, allMessages);

module.exports = router;
