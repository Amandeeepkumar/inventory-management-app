# InvenTrack  Inventory \& Order Management System

A full-stack production-ready application for managing products, customers, and orders with automatic inventory tracking.

## Tech Stack

|Layer|Technology|
|-|-|
|Frontend|React 18, React Router, Axios|
|Backend|FastAPI (Python 3.11)|
|Database|PostgreSQL 16|
|Containerization|Docker + Docker Compose|
|Frontend Hosting|Vercel / Netlify|
|Backend Hosting|Render / Railway|

\---

## Features

* **Product Management** — CRUD with unique SKU enforcement, stock tracking
* **Customer Management** — CRUD with unique email enforcement
* **Order Management** — Multi-item orders, automatic stock deduction, cancellation restores stock
* **Dashboard** — Live stats + low stock alerts
* **Business Rules** — Insufficient stock blocks order creation; total auto-calculated



## API Reference

### Products

|Method|Endpoint|Description|
|-|-|-|
|POST|/products|Create product|
|GET|/products|List all products|
|GET|/products/{id}|Get product|
|PUT|/products/{id}|Update product|
|DELETE|/products/{id}|Delete product|

### Customers

|Method|Endpoint|Description|
|-|-|-|
|POST|/customers|Create customer|
|GET|/customers|List all customers|
|GET|/customers/{id}|Get customer|
|DELETE|/customers/{id}|Delete customer|

### Orders

|Method|Endpoint|Description|
|-|-|-|
|POST|/orders|Create order (validates stock)|
|GET|/orders|List all orders|
|GET|/orders/{id}|Get order|
|DELETE|/orders/{id}|Cancel order (restores stock)|

### Dashboard

|Method|Endpoint|Description|
|-|-|-|
|GET|/dashboard|Stats + low stock|

Full interactive docs available at `/docs` (Swagger UI).

\---

## Business Rules Implemented

* Product SKU must be unique across the system
* Customer email must be unique
* Product quantity cannot go negative
* Orders are blocked if any product has insufficient stock
* Creating an order automatically reduces stock for all ordered products
* Cancelling an order restores stock for all items
* Order total is auto-calculated from product prices at time of order



## 

