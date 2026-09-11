import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./api/products";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import SearchSort from "./components/SearchSort";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Search & Sort query state
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({ name: search, sort });
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError(
        err.message || "Failed to load products. Is the server running on http://localhost:3000?"
      );
    } finally {
      setLoading(false);
    }
  }, [search, sort]);

  // Initial load and refetch on search/sort change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Add or Edit submission handler
  async function handleFormSubmit(productData) {
    setFormLoading(true);
    try {
      if (editingProduct) {
        // PUT /products/:id
        const updated = await updateProduct(editingProduct.id, productData);
        // Update state locally without full refetch or page reload
        setProducts((prev) =>
          prev.map((p) => (p.id === updated.id ? updated : p))
        );
        setEditingProduct(null);
      } else {
        // POST /products
        const created = await createProduct(productData);
        // Prepend new product to UI state
        setProducts((prev) => [created, ...prev]);
      }
    } finally {
      setFormLoading(false);
    }
  }

  // Delete handler
  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      // Remove deleted item from local state without reloading
      setProducts((prev) => prev.filter((p) => p.id !== id));
      if (editingProduct?.id === id) {
        setEditingProduct(null);
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeletingId(null);
    }
  }

  // Calculate shopping cart summary metrics
  const totalProducts = products.length;
  const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
  const totalCartValue = products.reduce(
    (acc, p) => acc + p.price * p.quantity,
    0
  );

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <span className="logo-icon">🛒</span>
          <div>
            <h1 className="app-title">Shopping Cart Admin</h1>
            <p className="app-subtitle">Full-stack Express REST API & React Integration</p>
          </div>
        </div>
        <div className="cart-summary">
          <div className="summary-stat">
            <span className="stat-label">Products</span>
            <span className="stat-value">{totalProducts}</span>
          </div>
          <div className="summary-stat">
            <span className="stat-label">Total Units</span>
            <span className="stat-value">{totalItems}</span>
          </div>
          <div className="summary-stat highlight">
            <span className="stat-label">Cart Value</span>
            <span className="stat-value">
              ฿{totalCartValue.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {/* Left Column: Form */}
        <section className="form-section">
          <ProductForm
            editingProduct={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setEditingProduct(null)}
            isLoading={formLoading}
          />
        </section>

        {/* Right Column: Search + List */}
        <section className="list-section">
          <div className="section-header">
            <h2>Product Catalog</h2>
            <button
              className="btn btn-ghost btn-sm"
              onClick={fetchProducts}
              title="Refresh product list"
            >
              🔄 Refresh
            </button>
          </div>

          <SearchSort
            search={search}
            sort={sort}
            onSearchChange={setSearch}
            onSortChange={setSort}
          />

          {/* Loading state */}
          {loading && (
            <div className="status-box loading-box">
              <div className="spinner"></div>
              <p>Loading products from server...</p>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <div className="status-box error-box" role="alert">
              <div className="error-icon">⚠️</div>
              <div className="error-content">
                <h3>Connection Error</h3>
                <p>{error}</p>
                <button className="btn btn-secondary btn-sm mt-2" onClick={fetchProducts}>
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Product list */}
          {!loading && !error && (
            <ProductList
              products={products}
              onEdit={(prod) => {
                setEditingProduct(prod);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          )}
        </section>
      </main>

      <footer className="app-footer">
        <p>Built with Express.js & React • Localhost Integration Demo</p>
      </footer>
    </div>
  );
}
