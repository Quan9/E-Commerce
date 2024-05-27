const router = require("express").Router();
const { register, login } = require("../controllers/auth");

router.post("/register", register);//REGISTER
router.post("/login", login);//LOGIN

module.exports = router;
