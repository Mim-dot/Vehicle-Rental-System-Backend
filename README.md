# 🚗 Vehicle Rental System API

[Live Demo](https://express-typescript-server-one.vercel.app/)

---

## 📌 Project Overview

Backend API to manage **vehicle rentals** with secure role-based access:

- **Admin:** Manage users, vehicles, bookings
- **Customer:** Register, view vehicles, create/manage own bookings

Features:

- JWT-based authentication with bcrypt password hashing
- CRUD operations for users, vehicles, and bookings
- Vehicle availability tracking and booking cost calculation
- RESTful API with proper validation and error handling

---

## 🛠️ Technology Stack

- **Node.js & Express.js** (TypeScript)
- **PostgreSQL** (Relational Database)
- **JWT & bcryptjs** (Authentication & Security)
- **Vercel** (Deployment)

---

## 📂 Project Structure

src/
├── config/ # DB & app configuration
├── middleware/ # Auth, logging
├── modules/
│ ├── auth/ # Authentication
│ ├── user/ # User management
│ ├── vehicle/ # Vehicle management
│ └── booking/ # Booking management
├── server.ts # Entry point
├── app.ts # Express app

---

## 🌐 API Endpoints

### Auth

- `POST /api/v1/auth/signup` – Register user
- `POST /api/v1/auth/signin` – Login and get JWT

### Users

- `GET /api/v1/users` – Admin only
- `PUT /api/v1/users/:userId` – Admin or own user
- `DELETE /api/v1/users/:userId` – Admin only

### Vehicles

- `POST /api/v1/vehicles` – Admin only
- `GET /api/v1/vehicles` – Public
- `GET /api/v1/vehicles/:vehicleId` – Public
- `PUT /api/v1/vehicles/:vehicleId` – Admin only
- `DELETE /api/v1/vehicles/:vehicleId` – Admin only

### Bookings

- `POST /api/v1/bookings` – Customer/Admin
- `GET /api/v1/bookings` – Role-based
- `PUT /api/v1/bookings/:bookingId` – Cancel or mark returned

---

## 🚀 Setup & Usage

1. Clone repo:

```bash
git clone <repo-url>
cd Vehicle-Rental-System
npm install
```

DATABASE_URL=postgresql://user:password@localhost:5432/vehicle_rental
JWT_SECRET=your_jwt_secret
PORT=8080

# Development

npm run dev

# Production

npm run build
npm start
