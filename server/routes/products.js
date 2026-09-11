// products.js — Express Router for /products routes
// All CRUD operations + query string support + input validation

const express = require("express");
const router = express.Router();

// ─── In-memory data store ────────────────────────────────────────────────────
// In a real app this would be a database. For this assessment we store products
// in a plain JavaScript array. Data resets every time the server restarts.

let products = [
  { id: "1", name: "Mechanical Keyboard", price: 2499, quantity: 5 },
  { id: "2", name: "Wireless Mouse", price: 890, quantity: 12 },
  { id: "3", name: "4K Monitor", price: 12900, quantity: 3 },
];

// ─── Helper: find product by id ───────────────────────────────────────────────
function findProduct(id) {
  return products.find((p) => p.id === id);
}

// ─── GET /products ────────────────────────────────────────────────────────────
// Returns all products.
// Supports query strings:
//   ?name=key    — filter products whose name includes "key" (case-insensitive)
//   ?sort=price  — sort results by price ascending
//   ?sort=name   — sort results by name alphabetically
router.get("/", (req, res) => {
  let result = [...products];

  // Filter by name (req.query.name)
  if (req.query.name) {
    const keyword = req.query.name.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(keyword));
  }

  // Sort (req.query.sort)
  if (req.query.sort === "price") {
    result.sort((a, b) => a.price - b.price);
  } else if (req.query.sort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  res.status(200).json(result);
});

// ─── GET /products/:id ────────────────────────────────────────────────────────
// Returns a single product by its ID (req.params.id).
// 404 if not found.
router.get("/:id", (req, res, next) => {
  const product = findProduct(req.params.id);

  if (!product) {
    // Pass a custom error to the error-handling middleware
    const err = new Error(`Product with id "${req.params.id}" not found`);
    err.status = 404;
    return next(err);
  }

  res.status(200).json(product);
});

// ─── POST /products ───────────────────────────────────────────────────────────
// Creates a new product from req.body.
// Required fields: name (string), price (number).
// Optional: quantity (number, defaults to 1).
// Returns 201 Created with the new product.
router.post("/", (req, res, next) => {
  const { name, price, quantity } = req.body;

  // Validate required fields
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (price === undefined || price === null) {
    errors.push("price is required");
  } else if (typeof price !== "number" || isNaN(price) || price < 0) {
    errors.push("price must be a non-negative number");
  }

  if (quantity !== undefined && (typeof quantity !== "number" || quantity < 0 || !Number.isInteger(quantity))) {
    errors.push("quantity must be a non-negative integer");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      messages: errors,
    });
  }

  const newProduct = {
    id: String(Date.now()),
    name: name.trim(),
    price,
    quantity: quantity !== undefined ? quantity : 1,
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

// ─── PUT /products/:id ────────────────────────────────────────────────────────
// Fully replaces the product fields with those from req.body.
// 404 if not found.
router.put("/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    const err = new Error(`Product with id "${req.params.id}" not found`);
    err.status = 404;
    return next(err);
  }

  const { name, price, quantity } = req.body;

  // Validate required fields
  const errors = [];

  if (!name || typeof name !== "string" || name.trim() === "") {
    errors.push("name is required and must be a non-empty string");
  }

  if (price === undefined || price === null) {
    errors.push("price is required");
  } else if (typeof price !== "number" || isNaN(price) || price < 0) {
    errors.push("price must be a non-negative number");
  }

  if (quantity !== undefined && (typeof quantity !== "number" || quantity < 0 || !Number.isInteger(quantity))) {
    errors.push("quantity must be a non-negative integer");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      error: "Validation failed",
      messages: errors,
    });
  }

  // Replace the product (keep the original id)
  products[index] = {
    id: req.params.id,
    name: name.trim(),
    price,
    quantity: quantity !== undefined ? quantity : 1,
  };

  res.status(200).json(products[index]);
});

// ─── DELETE /products/:id ─────────────────────────────────────────────────────
// Removes the product with the given ID.
// 404 if not found.
router.delete("/:id", (req, res, next) => {
  const index = products.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    const err = new Error(`Product with id "${req.params.id}" not found`);
    err.status = 404;
    return next(err);
  }

  const deleted = products.splice(index, 1)[0];
  res.status(200).json({ message: "Product deleted", product: deleted });
});

module.exports = router;
