import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { LayoutDashboard, Package, Users, ShoppingCart } from "lucide-react";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";

const navItems = [
  { to: "/", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/products", icon: Package, label: "Products" },
  { to: "/customers", icon: Users, label: "Customers" },
  { to: "/orders", icon: ShoppingCart, label: "Orders" },
];

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <h2><span>Inven<span style={{ color: "#10b981" }}>Track</span></span></h2>
            <p>Inventory Management Dashboard</p>
          </div>
          <nav className="sidebar-nav">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
              >
                <Icon size={18} />
                {label}
              </NavLink>
            ))}
          </nav>
          
          <div className="sidebar-profile">
            <div className="profile-avatar">AK</div>
            <div className="profile-info">
              <h4>Amandeep Kumar</h4>
              <p>Store Manager</p>
            </div>
          </div>
        </aside>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}