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
    product:{
      name:String,
      category:String,
      brand:String,
      sku:String,
      sellPrice:String,
      costPrice:String,
      colour:String,
      warranty:String
    },
    status: { type: String, default: "Pending" },
    createdAt: { type: Date, default: Date.now },
  },
  { timeseries: true }
);

module.exports = mongoose.model("order", orderSchema);
