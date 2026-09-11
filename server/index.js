// index.js — Express server entry point
// Starts the server, applies middleware, and mounts routes.

const express = require("express");
const cors = require("cors");
const productsRouter = require("./routes/products");

const app = express();
const PORT = 3000;

// ─── Middleware ───────────────────────────────────────────────────────────────

// Parse incoming JSON request bodies (populates req.body).
// Without this, req.body would be undefined for POST/PUT requests.
app.use(express.json());

// CORS — allows the React app (running on a different port, e.g. 5173) to
// call this API. Without CORS, the browser blocks cross-origin requests.
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);

// ─── Custom Middleware: Request Logger ────────────────────────────────────────
// Logs every incoming request: timestamp, HTTP method, and URL.
// Middleware runs BEFORE the route handlers, so every request is captured.
// It calls next() to pass control to the next middleware/route.
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next(); // must call next() or the request will hang
});

// ─── Routes ───────────────────────────────────────────────────────────────────
// Mount the products router at /products.
// All routes defined in routes/products.js will be prefixed with /products.
app.use("/products", productsRouter);

// Root health-check route
app.get("/", (req, res) => {
  res.json({ message: "Shopping Cart API is running 🛒", port: PORT });
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
// Catches any request to a route that doesn't exist (after all routes above).
app.use((req, res, next) => {
  const err = new Error(`Route not found: ${req.method} ${req.url}`);
  err.status = 404;
  next(err); // pass to the error-handling middleware below
});

// ─── Error Handling Middleware ────────────────────────────────────────────────
// MUST have 4 parameters (err, req, res, next) — this is how Express knows
// it's an error handler, not a regular middleware.
// Must be LAST in the middleware chain.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[ERROR] ${status}: ${message}`);

  res.status(status).json({
    error: message,
    status,
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🛒 Shopping Cart API running on http://localhost:${PORT}`);
  console.log(`   Press Ctrl+C to stop\n`);
});
