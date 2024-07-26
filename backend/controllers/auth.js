const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const verifyUserEmail = require("../services/verifyEmail");
const register = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    img: req.body?.img,
    role: req.body?.role,
  });
  try {
    await newUser.save();
    return res.status(201).json("User created successfully!");
  } catch (err) {
    const error = err.keyPattern;
    if (error?.email) {
      return res.status(500).json("Email already exist");
    } else {
      return res.status(500).json("Username already exist");
    }
  }
};
const registerGoogle = async (req, res) => {
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    img: req.body?.img,
    role: req.body?.role,
  });
  const emailToken = jwt.sign(
    {
      id: newUser._id,
      role: newUser.role,
    },
    process.env.JWT_SEC,
    { expiresIn: "1h" }
  );
  try {
    verifyUserEmail.verifyUserEmail(
      req.body.username,
      req.body.email,
      emailToken
    );
    await newUser.save();
    return res
      .status(201)
      .json("User created successfully! Check your mail to verify your mail.");
  } catch (err) {
    const error = err.keyPattern;
    if (error?.email) {
      return res.status(500).json("Email already exist");
    } else {
      return res.status(500).json("Username already exist");
    }
  }
};
const emailVerify = async (req, res) => {
  try {
    jwt.verify(req.body.emailToken, process.env.JWT_SEC);
    await User.findOneAndUpdate(
      { username: req.body.username },
      { $set: { email_conformation: true } }
    );
    return res.status(200).json({ status: "okay" });
  } catch (e) {
    console.log(e);
    return res.status(404).json({ status: "error" });
  }
};
const loginGoogle = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json("No user yet!");
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SEC
    );
    const { password, ...others } = user._doc;
    return res.status(200).json({ ...others, accessToken });
  } catch (e) {
    return res.status(500).json(e);
  }
};
const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.status(401).json("Wrong username!");

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    if (OriginalPassword !== req.body.password)
      return res.status(401).json("Wrong password!");

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SEC
      // { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
};

module.exports = {
  register,
  login,
  loginGoogle,
  registerGoogle,
  emailVerify,
};
