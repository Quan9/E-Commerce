var dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  host: "smtp.example.com", //<= add smtp server here
  port: 587, //add port
  // secure: true, // upgrade later with STARTTLS
  debug: true, // show debug output
  logger: true, // log information in console  **NEW**
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
const verifyUserEmail = async (username, email, token) => {
  try {
    console.log("email");
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject:
        "Hello " + username + ",verify your email by clicking the link below. ",
      html:
        "<p>Your password is 123456</p>" +
        `<a href=${process.env.CLIENT_URL}/${verifyEmail}/${username}/${token}>` +
        "Click here to verify your email</a>",
    });
  } catch (error) {}
};
module.exports = {
  verifyUserEmail,
};
