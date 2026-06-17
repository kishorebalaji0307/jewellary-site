const Product = require("../Model/product");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("GetProducts Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching products" });
  }
};

// @desc    Get product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error("GetProductById Error:", error.message);
    res.status(500).json({ message: "Server error occurred while fetching product" });
  }
};

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, weight } = req.body;

    // Validation
    if (!name || !description || !price || !images || !images.length || !category) {
      return res.status(400).json({ message: "Please fill in all required fields and upload at least one image" });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number" });
    }

    const product = await Product.create({
      name,
      description,
      price: numericPrice,
      images,
      category,
      weight: weight || "",
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("CreateProduct Error:", error.message);
    res.status(500).json({ message: "Server error occurred while creating product" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, weight } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update fields if provided
    product.name = name !== undefined ? name : product.name;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.images = images !== undefined ? images : product.images;
    product.category = category !== undefined ? category : product.category;
    product.weight = weight !== undefined ? weight : product.weight;

    // Validate images is not empty if provided
    if (images !== undefined && (!images || !images.length)) {
      return res.status(400).json({ message: "Product must have at least one image" });
    }

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("UpdateProduct Error:", error.message);
    res.status(500).json({ message: "Server error occurred while updating product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();
    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error("DeleteProduct Error:", error.message);
    res.status(500).json({ message: "Server error occurred while deleting product" });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
