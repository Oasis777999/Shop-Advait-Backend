const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    productId: String,
    customerId: String,
    paymentMethod: String,
    billingData: {
      name: String,
      phone: String,
      email: String,
      address: String,
      landMark: String,
      city: String,
      state: String,
      pincode: Number,
    },
    product:[{
      name:String,
      category:String,
      brand:String,
      sku:String,
      sellPrice:Number,
      costPrice:Number,
      colour:String,
      warranty:Number,
      quantity:Number
    }],
    sellTotalPrice:{
      type:Number
    },
    costTotalPrice:{
      type:Number
    },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("order", orderSchema);
