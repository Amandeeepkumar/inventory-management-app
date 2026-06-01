# InvenTrack — Inventory \& Order Management System

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

\---

## Local Development (Docker)

### 1\. Clone \& setup env

```bash
git clone <your-repo-url>
cd inventory-app
cp .env.example .env
# Edit .env if needed
```

### 2\. Run everything

```bash
docker compose up --build
```

* Frontend: http://localhost:3000
* Backend API: http://localhost:8000
* API Docs: http://localhost:8000/docs

\---

## Deployment Guide

### Backend → Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repo
3. Settings:

   * **Root Directory:** `backend`
   * **Build Command:** `pip install -r requirements.txt`
   * **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add a **PostgreSQL** database on Render (free tier)
5. Copy the **Internal Database URL** into Environment Variables:

   * `DATABASE\\\_URL` = `<your-render-postgres-url>`
6. Deploy → copy the live URL (e.g. `https://your-app.onrender.com`)

### Frontend → Vercel

1. Go to https://vercel.com → New Project → Import your GitHub repo
2. Settings:

   * **Root Directory:** `frontend`
   * **Build Command:** `npm run build`
   * **Output Directory:** `build`
3. Environment Variables:

   * `REACT\\\_APP\\\_API\\\_URL` = `https://your-backend.onrender.com`
4. Deploy → copy the live URL

### Docker Hub (Backend Image)

```bash
docker build -t yourdockerhubusername/inventrack-backend:latest ./backend
docker push yourdockerhubusername/inventrack-backend:latest
```

\---

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

