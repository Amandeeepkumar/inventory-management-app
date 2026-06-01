import React, { useEffect, useState } from "react";
import { Plus, Trash2, X, Eye } from "lucide-react";
import toast from "react-hot-toast";
import { ordersAPI, customersAPI, productsAPI } from "../api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);

  const load = () =>
    Promise.all([
      ordersAPI.getAll(),
      customersAPI.getAll(),
      productsAPI.getAll(),
    ]).then(([o, c, p]) => {
      setOrders(o.data);
      setCustomers(c.data);
      setProducts(p.data);
    }).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const addItem = () => setItems(i => [...i, { product_id: "", quantity: 1 }]);
  const removeItem = (idx) => setItems(i => i.filter((_, ix) => ix !== idx));
  const updateItem = (idx, field, val) =>
    setItems(i => i.map((item, ix) => ix === idx ? { ...item, [field]: val } : item));

  const handleSubmit = async () => {
    if (!customerId) return toast.error("Select a customer");
    if (items.some(i => !i.product_id)) return toast.error("Select product for all items");
    const payload = {
      customer_id: parseInt(customerId),
      items: items.map(i => ({ product_id: parseInt(i.product_id), quantity: parseInt(i.quantity) })),
    };
    try {
      await ordersAPI.create(payload);
      toast.success("Order placed!");
      setShowModal(false);
      setCustomerId("");
      setItems([{ product_id: "", quantity: 1 }]);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error placing order");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Cancel this order? Stock will be restored.")) return;
    try {
      await ordersAPI.delete(id);
      toast.success("Order cancelled");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error");
    }
  };

  const getCustomerName = (id) => customers.find(c => c.id === id)?.full_name || `#${id}`;
  const getProductName = (id) => products.find(p => p.id === id)?.name || `#${id}`;

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <p>Manage and track customer orders</p>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>Order List</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> New Order
          </button>
        </div>
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Order ID</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No orders yet</td></tr>
                ) : orders.map(o => (
                  <tr key={o.id}>
                    <td><strong>#ORD-{String(o.id).padStart(4, "0")}</strong></td>
                    <td>{getCustomerName(o.customer_id)}</td>
                    <td><strong>₹{o.total_amount.toFixed(2)}</strong></td>
                    <td><span className="badge badge-success">{o.status}</span></td>
                    <td style={{ color: "#9ca3af", fontSize: 13 }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewOrder(o)}><Eye size={14} /></button>
                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(o.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Order Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Create Order</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="form-group">
              <label>Customer</label>
              <select value={customerId} onChange={e => setCustomerId(e.target.value)}>
                <option value="">Select customer…</option>
                {customers.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div className="order-items-section">
              <h4>Order Items</h4>
              {items.map((item, idx) => (
                <div className="order-item-row" key={idx}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <select value={item.product_id} onChange={e => updateItem(idx, "product_id", e.target.value)}>
                      <option value="">Select product…</option>
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <input
                      type="number" min={1} value={item.quantity}
                      onChange={e => updateItem(idx, "quantity", e.target.value)}
                    />
                  </div>
                  {items.length > 1 && (
                    <button className="btn btn-danger btn-sm" onClick={() => removeItem(idx)}><X size={14} /></button>
                  )}
                </div>
              ))}
              <button className="add-item-btn" onClick={addItem}>+ Add another item</button>
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Place Order</button>
            </div>
          </div>
        </div>
      )}

      {/* View Order Modal */}
      {viewOrder && (
        <div className="modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ margin: 0 }}>Order #ORD-{String(viewOrder.id).padStart(4, "0")}</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewOrder(null)}><X size={16} /></button>
            </div>
            <p style={{ marginBottom: 8, fontSize: 14 }}><strong>Customer:</strong> {getCustomerName(viewOrder.customer_id)}</p>
            <p style={{ marginBottom: 16, fontSize: 14 }}><strong>Date:</strong> {new Date(viewOrder.created_at).toLocaleString()}</p>
            <table style={{ width: "100%", fontSize: 14, marginBottom: 16 }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <th style={{ textAlign: "left", padding: "8px 0", color: "#6b7280", fontSize: 12 }}>Product</th>
                  <th style={{ textAlign: "right", padding: "8px 0", color: "#6b7280", fontSize: 12 }}>Qty</th>
                  <th style={{ textAlign: "right", padding: "8px 0", color: "#6b7280", fontSize: 12 }}>Price</th>
                  <th style={{ textAlign: "right", padding: "8px 0", color: "#6b7280", fontSize: 12 }}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {viewOrder.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid #f3f4f6" }}>
                    <td style={{ padding: "10px 0" }}>{getProductName(item.product_id)}</td>
                    <td style={{ textAlign: "right", padding: "10px 0" }}>{item.quantity}</td>
                    <td style={{ textAlign: "right", padding: "10px 0" }}>₹{item.unit_price.toFixed(2)}</td>
                    <td style={{ textAlign: "right", padding: "10px 0" }}><strong>₹{(item.quantity * item.unit_price).toFixed(2)}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ textAlign: "right", fontSize: 16, fontWeight: 700 }}>
              Total: ₹{viewOrder.total_amount.toFixed(2)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
