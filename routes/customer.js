const router = require("express").Router();
const Customer = require("../model/customerModel");
const mongoose = require("mongoose");

router.post("/register", async (req, res) => {
  try {
    const { mobile } = req.body;

    // Check if customer already exists
    const existingCustomer = await Customer.findOne({ mobile });

    if (existingCustomer) {
      return res.status(400).json({ message: "Customer already registered" });
    }

    // Create and save new customer
    const newCustomer = new Customer(req.body);
    const savedCustomer = await newCustomer.save();

    res.status(201).json(savedCustomer);
  } catch (error) {
    console.error("Error registering customer:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { mobile, password } = req.body;

    if (!mobile || !password) {
      return res
        .status(400)
        .json({ message: "Mobile and password are required" });
    }

    // Find customer by mobile and password
    const customer = await Customer.findOne({ mobile, password });

    if (!customer) {
      return res.status(401).json({ message: "Invalid mobile or password" });
    }

    // Respond with basic customer info (or token if needed later)
    res.status(200).json({
      message: "Login successful",
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        mobile: customer.mobile,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

router.get("/profile/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).select("-password");
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching customer profile" });
  }
});

// Update customer profile
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;

  // Validate ID
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid customer ID" });
  }

  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(
      id,
      {
        $set: {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          address: req.body.address,
          landMark: req.body.landMark,
          city: req.body.city,
          state: req.body.state,
          pincode: req.body.pincode,
          // Do NOT allow password update here unless explicitly handled with hashing
        },
      },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    res
      .status(200)
      .json({ message: "Profile updated", customer: updatedCustomer });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

// Added the Item in the cart
router.post("/cart/:id", async (req, res) => {
  const customerId = req.params.id;
  const { productId } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    // Check if product already exists in cart
    const existingProduct = customer.cart.find(
      (item) => item.productId === productId
    );

    if (existingProduct) {
      // If product exists, increment quantity
      existingProduct.quantity += 1;
    } else {
      // If product doesn't exist, add new entry
      customer.cart.push({ productId, quantity: 1 });
    }

    await customer.save();
    res
      .status(200)
      .json({ message: "Product added to cart", cart: customer.cart });
  } catch (err) {
    console.error("Cart update failed:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/cart/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

//Control the quantity in the cart
router.post("/cart/update-quantity/:id", async (req, res) => {
  const customerId = req.params.id;
  const { productId, action } = req.body;

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: "Customer not fount" });
    }

    const item = customer.cart.find((item) => item.productId === productId);
    if (!item) {
      return res.status(404).json({ message: "Product not in cart" });
    }

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        customer.cart = customer.cart.filter((i) => i.productId !== productId);
      }
    }
    await customer.save();
    res.status(200).json({ cart: customer.cart });
  } catch (error) {
    res.status(500).json({ message: "server error" });
  }
});

module.exports = router;
