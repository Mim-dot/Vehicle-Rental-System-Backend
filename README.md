# 🚗 Vehicle Rental System API

**Backend API for a comprehensive vehicle rental management system**

---

## 📌 Project Overview

A production-ready REST API built with **Node.js, Express.js, and TypeScript** for managing vehicle rentals. The system includes:

- **User Management** – Registration, authentication, and profile management
- **Vehicle Inventory** – Add, update, and manage vehicles with availability tracking
- **Booking System** – Create, track, and manage vehicle bookings with automatic pricing
- **Role-Based Access Control** – Separate permissions for Admin and Customer roles

### Key Features

✅ JWT-based authentication with bcrypt password hashing  
✅ RESTful API with comprehensive error handling  
✅ Vehicle availability tracking and real-time status updates  
✅ Automatic booking price calculation (daily rate × duration)  
✅ Role-based authorization (Admin & Customer)  
✅ PostgreSQL database with referential integrity

---

## 🛠️ Technology Stack

| Technology               | Purpose                |
| ------------------------ | ---------------------- |
| **Node.js & Express.js** | Web framework & server |
| **TypeScript**           | Type-safe development  |
| **PostgreSQL**           | Relational database    |
| **JWT**                  | Authentication tokens  |
| **bcryptjs**             | Password hashing       |
| **Vercel**               | Cloud deployment       |

---

## 📂 Project Structure

```
src/
├── config/
│   ├── db.ts          # PostgreSQL connection & schema
│   └── index.ts       # Environment variables
├── middleware/
│   ├── auth.ts        # JWT authentication middleware
│   └── logger.ts      # Request logging
├── modules/
│   ├── auth/
│   │   ├── auth.routes.ts
│   │   ├── auth.controller.ts
│   │   └── auth.service.ts
│   ├── users/
│   │   ├── user.routes.ts
│   │   ├── user.controller.ts
│   │   └── user.service.ts
│   ├── vehicles/
│   │   ├── vehicals.routes.ts
│   │   ├── vehicals.controller.ts
│   │   └── vehicals.service.ts
│   └── booking/
│       ├── book.routes.ts
│       ├── book.controller.ts
│       └── book.service.ts
├── types/
│   └── express/
│       └── index.d.ts # TypeScript declarations
├── app.ts            # Express app configuration
└── server.ts         # Server entry point
```

---

## 📊 Database Schema

### Users Table

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  phone VARCHAR(20) NOT NULL,
  role VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
)
```

### Vehicles Table

```sql
CREATE TABLE vehicles (
  id SERIAL PRIMARY KEY,
  vehicle_name TEXT NOT NULL,
  type TEXT NOT NULL,
  registration_number TEXT UNIQUE NOT NULL,
  daily_rent_price INT NOT NULL,
  availability_status TEXT NOT NULL
)
```

### Bookings Table

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES users(id),
  vehicle_id INT REFERENCES vehicles(id),
  rent_start_date DATE NOT NULL,
  rent_end_date DATE NOT NULL,
  total_price INT NOT NULL,
  status TEXT NOT NULL
)
```

---

## 🌐 API Endpoints

### Authentication (Public)

| Method | Endpoint              | Description                 |
| ------ | --------------------- | --------------------------- |
| POST   | `/api/v1/auth/signup` | Register new user           |
| POST   | `/api/v1/auth/signin` | Login and receive JWT token |

### Users (Role-Based)

| Method | Endpoint                | Access    | Description   |
| ------ | ----------------------- | --------- | ------------- |
| GET    | `/api/v1/users`         | Admin     | Get all users |
| PUT    | `/api/v1/users/:userId` | Admin/Own | Update user   |
| DELETE | `/api/v1/users/:userId` | Admin     | Delete user   |

### Vehicles (Public/Admin)

| Method | Endpoint                      | Access | Description         |
| ------ | ----------------------------- | ------ | ------------------- |
| POST   | `/api/v1/vehicles`            | Admin  | Create vehicle      |
| GET    | `/api/v1/vehicles`            | Public | Get all vehicles    |
| GET    | `/api/v1/vehicles/:vehicleId` | Public | Get vehicle details |
| PUT    | `/api/v1/vehicles/:vehicleId` | Admin  | Update vehicle      |
| DELETE | `/api/v1/vehicles/:vehicleId` | Admin  | Delete vehicle      |

### Bookings (Role-Based)

| Method | Endpoint                      | Access         | Description           |
| ------ | ----------------------------- | -------------- | --------------------- |
| POST   | `/api/v1/bookings`            | Customer/Admin | Create booking        |
| GET    | `/api/v1/bookings`            | Authenticated  | Get bookings          |
| PUT    | `/api/v1/bookings/:bookingId` | Customer/Admin | Update booking status |

**→ Detailed API specifications: [API_REFERENCE.md](API_REFERENCE.md)**

---

## 🔐 Authentication & Authorization

### User Roles

- **Admin**: Full system access to manage all users, vehicles, and bookings
- **Customer**: Register, view vehicles, create and manage own bookings only

### Authentication Flow

1. User registers/logs in with email and password
2. Password is hashed using bcryptjs (10 salt rounds)
3. JWT token is issued upon successful login
4. Token must be included in `Authorization: Bearer <token>` header for protected endpoints
5. Token is validated and user role is checked for permission-based access

---

## 🚀 Setup & Usage

### Prerequisites

- Node.js (v14+)
- PostgreSQL (v12+)
- npm or yarn

### Installation

1. **Clone the repository:**

```bash
git clone <repository-url>
cd Level-2/Assignment-2
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Create a `.env` file in the root directory:

```env
CONNECTION_STR=postgresql://username:password@localhost:5432/vehicle_rental
PORT=3000
JWT_SECRET=your_secure_jwt_secret_key_here
```

4. **Start development server:**

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### Build for Production

```bash
npm run build
```

---

## 📝 Example API Usage

### Register User

```bash
POST /api/v1/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01712345678",
  "role": "customer"
}
```

### Login

```bash
POST /api/v1/auth/signin
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Vehicle (Admin)

```bash
POST /api/v1/vehicles
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

### Create Booking

```bash
POST /api/v1/bookings
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

---

## 🧪 Testing

Run tests with:

```bash
npm test
```

---

## 📖 Documentation

- **[API Reference](API_REFERENCE.md)** - Complete endpoint documentation with request/response examples
- **[Submission Guide](SUBMISSION_GUIDE.md)** - Assignment submission requirements

---

## 🔗 Live Deployment

- **URL**: [https://assignment-2-peach.vercel.app/](https://assignment-2-peach.vercel.app/)
- **GitHub**: [Repository Link](https://github.com)

---

## 📝 License

This project is part of an academic assignment. All rights reserved.

---

## 👨‍💻 Author

Assignment 2 - Vehicle Rental System API
