var dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const verifyUserEmail = async (username, email, token) => {
  try {
    let info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject:
        "Hello " + username + ",verify your email by clicking the link below. ",
      html:
        "<p>Your password is 123456</p>" +
        `<a href=${process.env.CLIENT_URL}/${verifyEmail}/${username}/${token}>` +
        "Click here to verify your email</a>",
    });
  } catch (error) {
  }
};
module.exports = {
  verifyUserEmail,
};
