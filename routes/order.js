const router = require("express").Router();
const Order = require("../model/orderModel");

router.post("/add", async (req, res) => {
  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder); // 201 Created
  } catch (error) {
    console.error("Error saving order:", error);
    res
      .status(500)
      .json({ message: "Failed to create order", error: error.message });
  }
});

router.get("/customer/:id", async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.get("/list", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error fetching orders" });
  }
});

router.put("/update-status/:id", async (req, res) => {
  const { status } = req.body;

  try {
    const updatedOder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedOder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.json(updatedOder);
  } catch (error) {
    console.log("Error updating status: ", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});

module.exports = router;
