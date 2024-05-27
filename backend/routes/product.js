const {
  createProduct,
  getAllProduct,
  getSingleProduct,
  deleteProduct,
  updatedProduct,
  getAllPublicProduct,
  getProductByCategory,
  createProductReview,
} = require("../controllers/product");
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require("../middleware/verifyToken");

const router = require("express").Router();

router.post("/", verifyTokenAndAdmin, createProduct); //CREATE
router.put("/:id", verifyTokenAndAdmin, updatedProduct); //UPDATE
router.delete("/:id", verifyTokenAndAdmin, deleteProduct); //DELETE
router.get("/find/:id", getSingleProduct); //GET PRODUCT
router.get("/admin", verifyTokenAndAdmin, getAllProduct); // GET ALL PRODUCTS FOR ADMIN
router.get("/", getAllPublicProduct); //GET ALL PRODUCTS FOR CLIENT
router.get("/:category", getProductByCategory); //GET PRODUCTS BY CATEGORY
router.put("/:id/review", createProductReview);
module.exports = router;
