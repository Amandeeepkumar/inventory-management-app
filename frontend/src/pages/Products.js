import React, { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { productsAPI } from "../api";

const emptyForm = { name: "", sku: "", price: "", quantity: "" };

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () =>
    productsAPI.getAll().then(r => setProducts(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, sku: p.sku, price: p.price, quantity: p.quantity }); setShowModal(true); };

  const handleSubmit = async () => {
    if (!form.name || !form.sku || form.price === "" || form.quantity === "") {
      return toast.error("All fields are required");
    }
    const payload = { ...form, price: parseFloat(form.price), quantity: parseInt(form.quantity) };
    try {
      if (editing) {
        await productsAPI.update(editing.id, { name: payload.name, price: payload.price, quantity: payload.quantity });
        toast.success("Product updated!");
      } else {
        await productsAPI.create(payload);
        toast.success("Product added!");
      }
      setShowModal(false);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error occurred");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      toast.success("Product deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Cannot delete");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your product inventory</p>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>Product List</h2>
          <button className="btn btn-primary" onClick={openAdd}>
            <Plus size={16} /> Add Product
          </button>
        </div>
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th><th>SKU</th><th>Price</th><th>Stock</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No products yet</td></tr>
                ) : products.map(p => (
                  <tr key={p.id}>
                    <td><strong>{p.name}</strong></td>
                    <td><code style={{ background: "#f3f4f6", padding: "2px 8px", borderRadius: 4, fontSize: 12 }}>{p.sku}</code></td>
                    <td>₹{p.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${p.quantity > 10 ? "badge-success" : p.quantity > 0 ? "badge-warning" : "badge-danger"}`}>
                        {p.quantity}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(p)}><Pencil size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>{editing ? "Edit Product" : "Add Product"}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            {["name", "sku", "price", "quantity"].map(field => (
              <div className="form-group" key={field}>
                <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                  type={["price", "quantity"].includes(field) ? "number" : "text"}
                  min={0}
                  placeholder={field === "sku" ? "e.g. PROD-001" : ""}
                  value={form[field]}
                  disabled={editing && field === "sku"}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                />
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{editing ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
