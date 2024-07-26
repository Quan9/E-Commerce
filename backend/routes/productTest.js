const {
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
  getAllPublicProduct,
  getProductByCategory,
  createProductReview,
} = require("../controllers/productTest");
const router = require("express").Router();
router.post("/", createProduct); //CREATE
router.put("/:id", updatedProduct); //UPDATE
router.get("/", getAllPublicProduct); //GET ALL PRODUCTS FOR CLIENT
router.get("/admin", getAllProduct); //GET ALL PRODUCTS FOR CLIENT

module.exports = router;
