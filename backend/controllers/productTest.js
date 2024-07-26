const ProductTest = require("../models/ProductTest");
const User = require("../models/User");
const createProduct = async (req, res) => {
  try {
    const newProduct = new ProductTest(req.body);
    await newProduct.save();
    res.status(200).json("Product Created Successfully!");
  } catch (err) {
    res.status(500).json(err);
  }
};
const updatedProduct = async (req, res) => {
  try {
    const updatedProduct = await ProductTest.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};
const deleteProduct = async (req, res) => {
  try {
    await ProductTest.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};
const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductTest.findById(req.params.id);
    const similarProduct = await ProductTest.find(
      {
        categories: product.categories,
        _id: { $ne: product._id },
        isActive: "Active",
      },
      { name: 1, colors: { $slice: 1 }, _id: 1, categories: 1, discount: 1 }
    )
      .sort({ createdAt: -1 })
      .limit(5);
    res.status(200).json({ product, similarProduct });
  } catch (err) {
    res.status(500).json(err);
  }
};

const getAllProduct = async (req, res) => {
  try {
    const items = await ProductTest.find({}).sort({ createdAt: -1 });
    console.log('123');
    return res.status(200).json(items);
  } catch (e) {
    console.log('error')
    return res.status(401).json(e);
  }
};
const getAllPublicProduct = async (req, res) => {
  try {
    const products = await ProductTest.aggregate([
      { $match: { isActive: "Active" } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$categories",
          data: { $push: "$$ROOT" },
        },
      },
      {
        $project: {
          data: { $slice: ["$data", 0, 5] },
        },
      },
    ]);
    return res.status(200).json(products);
  } catch (e) {
    return res.status(401).json(e);
  }
};
const getProductByCategory = async (req, res) => {
  const { category } = req.params;
  const products = await ProductTest.find(
    { categories: category, isActive: "Active" },
    {
      colors: { $slice: 1 },
    }
  ).sort({ createdAt: -1 });
  return res.status(200).json(products);
};
const createProductReview = async (req, res) => {
  try {
    const { comment, rating, user } = req.body;
    const product = await ProductTest.findById(req.params.id);
    const findUser = await User.findOne({ username: user.username });
    if (findUser) {
      const alreadyReviewed = product.reviews.find(
        (review) => review.user.toString() === findUser._id.toString()
      );
      if (alreadyReviewed) {
        return res.status(400).json("Product Already Reviewed");
      }
      const review = {
        name: findUser.username,
        rating: Number(rating),
        comment,
        user: findUser._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;
      await product.save();
      res.status(200).json({ message: "Product Reviewed!", data: product });
    }
  } catch (error) {
    if (error.name === "CaseError") {
      return res.status(500).json("Invalid Id");
    }
    res.status(500).json("Error In Review Comment API");
  }
};
module.exports = {
  createProduct,
  updatedProduct,
  deleteProduct,
  getSingleProduct,
  getAllProduct,
  getAllPublicProduct,
  getProductByCategory,
  createProductReview,
};
