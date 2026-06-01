import React, { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { customersAPI } from "../api";

const emptyForm = { full_name: "", email: "", phone: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const load = () =>
    customersAPI.getAll().then(r => setCustomers(r.data)).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.full_name || !form.email || !form.phone) return toast.error("All fields required");
    try {
      await customersAPI.create(form);
      toast.success("Customer added!");
      setShowModal(false);
      setForm(emptyForm);
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Error");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    try {
      await customersAPI.delete(id);
      toast.success("Customer deleted");
      load();
    } catch (e) {
      toast.error(e.response?.data?.detail || "Cannot delete");
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <p>Manage your customer base</p>
      </div>

      <div className="card">
        <div className="section-header">
          <h2>Customer List</h2>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Customer
          </button>
        </div>
        {loading ? <div className="loading">Loading…</div> : (
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Name</th><th>Email</th><th>Phone</th><th>Joined</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: "center", color: "#9ca3af", padding: 32 }}>No customers yet</td></tr>
                ) : customers.map(c => (
                  <tr key={c.id}>
                    <td><strong>{c.full_name}</strong></td>
                    <td>{c.email}</td>
                    <td>{c.phone}</td>
                    <td style={{ color: "#9ca3af", fontSize: 13 }}>{new Date(c.created_at).toLocaleDateString()}</td>
                    <td>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(c.id)}>
                        <Trash2 size={14} />
                      </button>
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
              <h2 style={{ margin: 0 }}>Add Customer</h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="John Doe" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="john@example.com" />
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+91 98765 43210" />
            </div>
            <div className="form-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
