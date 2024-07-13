const router = require("express").Router();
const {
  register,
  login,
  loginGoogle,
  registerGoogle,
  emailVerify,
} = require("../controllers/auth");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/register", register); //REGISTER
router.post("/registerGoogle", registerGoogle); //REGISTER
router.post("/login", login); //LOGIN
router.post("/loginGoogle", loginGoogle);
router.post("/verifyEmail", emailVerify);
module.exports = router;
