const router = require("express").Router();

const { createModel } = require("../controllers/model3D");
const upload = require("../middleware/upload");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.post("/create", verifyTokenAndAdmin, upload.single("file"), createModel);
// router.put("/:id", verifyTokenAndAdmin, updateModel);
// router.delete("/:id", verifyTokenAndAdmin, deleteModel);

module.exports = router;
