// ProductList.jsx — Renders the list of products.
// Each card has Edit and Delete buttons.

export default function ProductList({ products, onEdit, onDelete, deletingId }) {
  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <p className="empty-title">No products yet</p>
        <p className="empty-subtitle">Add your first product using the form above</p>
      </div>
    );
  }

  return (
    <ul className="product-list">
      {products.map((product) => (
        <li key={product.id} className="product-card">
          <div className="product-badge">
            <span className="product-qty">×{product.quantity}</span>
          </div>

          <div className="product-info">
            <h3 className="product-name">{product.name}</h3>
            <p className="product-price">
              ฿{product.price.toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </p>
            <p className="product-id">ID: {product.id}</p>
          </div>

          <div className="product-total">
            <p className="total-label">Total</p>
            <p className="total-value">
              ฿{(product.price * product.quantity).toLocaleString("th-TH", { minimumFractionDigits: 2 })}
            </p>
          </div>

          <div className="product-actions">
            <button
              id={`edit-btn-${product.id}`}
              className="btn btn-sm btn-secondary"
              onClick={() => onEdit(product)}
              disabled={deletingId === product.id}
            >
              ✏️ Edit
            </button>
            <button
              id={`delete-btn-${product.id}`}
              className="btn btn-sm btn-danger"
              onClick={() => onDelete(product.id)}
              disabled={deletingId === product.id}
            >
              {deletingId === product.id ? "Deleting…" : "🗑 Delete"}
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
