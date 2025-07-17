const router = require("express").Router();
const mongoose = require("mongoose");
const Product = require("../model/productModel");

// Add new product
router.post("/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    const saveProduct = await product.save();
    res.status(201).json(saveProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get the list of products
router.get("/list", async (req, res) => {
  try {
    const list = await Product.find({});
    res.status(200).json(list);
  } catch (error) {
    console.error("Error fetching product list:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Find the product based on the id
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id); // Correct method
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Update the product
router.put("/update/:id", async (req, res) => {
  const { id } = req.params;

  // Validate the Mongodb objectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product Id" });
  }

  try {
    const product = await Product.findById(id);

    // Handle heroImage: if provided, append to existing images
    if (Array.isArray(req.body.heroImage) && req.body.heroImage.length > 0) {
      req.body.heroImage = [...product.heroImage, ...req.body.heroImage];
    } else {
      delete req.body.heroImage; // skip if empty or invalid
    }

    //Update the product with given data
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete product
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const deltedProduct = await Product.findByIdAndDelete(id);

    if (!deltedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH route to delete a specific image from heroImage array
router.patch("/delete-image/:id", async (req, res) => {
  const { id } = req.params;
  const { imageToDelete } = req.body;

  // Validate MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid product ID" });
  }

  // Validate input
  if (!imageToDelete || typeof imageToDelete !== "string") {
    return res.status(400).json({ error: "Invalid or missing imageToDelete" });
  }

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Check if the image exists in heroImage array
    if (!product.heroImage.includes(imageToDelete)) {
      return res.status(404).json({ error: "Image not found in product" });
    }

    // Filter out the image
    product.heroImage = product.heroImage.filter(
      (img) => img !== imageToDelete
    );

    // Save the updated product
    await product.save();

    res.status(200).json({
      message: "Image deleted successfully",
      heroImage: product.heroImage,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
