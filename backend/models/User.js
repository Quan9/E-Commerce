const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["user", "admin", "mod", "guess"],
      default: "user",
    },
    img: { type: String },
    noti: [
      {
        name: { type: String },
        number: { type: Number },
      },
    ],
    email_conformation: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
