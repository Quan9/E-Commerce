const express = require("express");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const {
  allCategories,
  deleteCategory,
  editCategory,
  newCategory,
} = require("../controllers/Category");
const router = express.Router();
router.get("/all", allCategories);
router.delete("/:id", verifyTokenAndAdmin, deleteCategory);
router.post("/", verifyTokenAndAdmin, newCategory);
router.put("/:id", verifyTokenAndAdmin, editCategory);
module.exports = router;
