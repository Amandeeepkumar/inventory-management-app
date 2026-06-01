import React, { useEffect, useState } from "react";
import { Package, Users, ShoppingCart, AlertTriangle } from "lucide-react";
import { dashboardAPI } from "../api";

const statCards = [
  { key: "total_products", label: "Total Products", icon: Package, color: "#4f46e5", bg: "#eef2ff" },
  { key: "total_customers", label: "Total Customers", icon: Users, color: "#10b981", bg: "#d1fae5" },
  { key: "total_orders", label: "Total Orders", icon: ShoppingCart, color: "#f59e0b", bg: "#fef3c7" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardAPI.get().then(r => setData(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard…</div>;

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Overview of your inventory and orders</p>
      </div>

      <div className="stats-grid">
        {statCards.map(({ key, label, icon: Icon, color, bg }) => (
          <div className="stat-card" key={key}>
            <div className="stat-icon" style={{ background: bg }}>
              <Icon size={22} color={color} />
            </div>
            <div className="stat-info">
              <h3>{data?.[key] ?? 0}</h3>
              <p>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="section-header">
          <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={18} color="#f59e0b" />
            Low Stock Products
          </h2>
        </div>
        {data?.low_stock_products?.length === 0 ? (
          <p style={{ color: "#6b7280", fontSize: 14 }}>All products have sufficient stock.</p>
        ) : (
          <div className="low-stock-list">
            {data?.low_stock_products?.map(p => (
              <div className="low-stock-item" key={p.id}>
                <span>{p.name}</span>
                <span className="badge badge-warning">{p.quantity} left</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
