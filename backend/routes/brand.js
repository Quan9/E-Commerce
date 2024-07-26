const express = require("express");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");
const {
    allBrands,
    deleteBrand,
    editBrand,
    newBrand,
  } = require("../controllers/brand");
  const router = express.Router();
  router.get("/all", verifyTokenAndAdmin, allBrands);
  router.delete("/:id", verifyTokenAndAdmin, deleteBrand);
  router.post("/", verifyTokenAndAdmin, newBrand);
  router.put("/:id", verifyTokenAndAdmin, editBrand);
  module.exports = router