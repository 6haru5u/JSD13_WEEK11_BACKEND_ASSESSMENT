// ProductForm.jsx — Used for BOTH adding a new product and editing an existing one.
// When `editingProduct` prop is provided, the form pre-fills with that product's data.
// When it's null, the form is in "add" mode.

import { useState, useEffect } from "react";

const EMPTY_FORM = { name: "", price: "", quantity: "1" };

export default function ProductForm({ editingProduct, onSubmit, onCancel, isLoading }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState([]);

  // When editingProduct changes, pre-fill the form (or reset it)
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        price: String(editingProduct.price),
        quantity: String(editingProduct.quantity),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors([]);
  }, [editingProduct]);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors([]);
  }

  function validate() {
    const errs = [];
    if (!form.name.trim()) errs.push("Name is required");
    const price = Number(form.price);
    if (form.price === "" || isNaN(price) || price < 0)
      errs.push("Price must be a non-negative number");
    const qty = Number(form.quantity);
    if (form.quantity !== "" && (!Number.isInteger(qty) || qty < 0))
      errs.push("Quantity must be a non-negative integer");
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const clientErrors = validate();
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    try {
      await onSubmit({
        name: form.name.trim(),
        price: Number(form.price),
        quantity: form.quantity !== "" ? Number(form.quantity) : 1,
      });
      setForm(EMPTY_FORM);
      setErrors([]);
    } catch (err) {
      // Surface server-side validation errors in the form
      setErrors([err.message]);
    }
  }

  const isEditing = Boolean(editingProduct);

  return (
    <div className={`form-card ${isEditing ? "editing" : ""}`}>
      <h2 className="form-title">
        {isEditing ? (
          <>
            <span className="form-icon">✏️</span> Edit Product
          </>
        ) : (
          <>
            <span className="form-icon">➕</span> Add Product
          </>
        )}
      </h2>

      {errors.length > 0 && (
        <div className="form-errors" role="alert">
          {errors.map((err, i) => (
            <p key={i} className="form-error-item">
              ⚠ {err}
            </p>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="product-form" noValidate>
        <div className="form-group">
          <label htmlFor="product-name" className="form-label">
            Product Name
          </label>
          <input
            id="product-name"
            name="name"
            type="text"
            className="form-input"
            placeholder="e.g. Mechanical Keyboard"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-price" className="form-label">
            Price (฿)
          </label>
          <input
            id="product-price"
            name="price"
            type="number"
            className="form-input"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="product-quantity" className="form-label">
            Quantity
          </label>
          <input
            id="product-quantity"
            name="quantity"
            type="number"
            className="form-input"
            placeholder="1"
            min="0"
            step="1"
            value={form.quantity}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          {isEditing && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setForm(EMPTY_FORM);
                setErrors([]);
                onCancel();
              }}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          <button
            id={isEditing ? "submit-edit-btn" : "submit-add-btn"}
            type="submit"
            className={`btn ${isEditing ? "btn-warning" : "btn-primary"}`}
            disabled={isLoading}
          >
            {isLoading
              ? "Saving…"
              : isEditing
              ? "Save Changes"
              : "Add Product"}
          </button>
        </div>
      </form>
    </div>
  );
}
