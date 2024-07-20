const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: { type: String },
        color: { type: String },
        productName: { type: String },
        productPrice: { type: Number },
        quantity: {
          type: Number,
        },
      },
    ],
    phone: Number,
    amount: { type: Number, required: true },
    address: { type: Object},
    status: { type: String, default: "pending" },
    payment_method:{type:String,required:true},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
