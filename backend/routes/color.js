const express = require("express");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const {
  allColors,
  deleteColor,
  editColor,
  newColor,
} = require("../controllers/color");
const router = express.Router();
router.get("/all", verifyTokenAndAdmin, allColors);
router.delete("/:id", verifyTokenAndAdmin, deleteColor);
router.post("/", verifyTokenAndAdmin, newColor);
router.put("/:id", verifyTokenAndAdmin, editColor);
module.exports = router;
