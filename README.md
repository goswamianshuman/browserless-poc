
# 🍔 Food Delivery Backend API

This is a full-featured **Food Delivery Backend API** built with **NestJS**, **TypeORM**, **PostgreSQL**, and **WebSockets**. It supports **role-based access**, **real-time order updates**, and is **Dockerized** for easy local development and deployment.

---

## 🚀 Features

- 🔐 JWT Authentication with Role-based Access (`Customer`, `RestaurantOwner`, `DeliveryRider`)
- 🏪 Restaurant & Menu Management (for Restaurant Owners)
- 🛒 Order Placement & Tracking (for Customers)
- 🛵 Order Acceptance & Delivery Updates (for Delivery Riders)
- 🌐 Real-time updates via WebSocket
- 📦 Docker-based execution
- 📚 Swagger API Documentation

---

## 🧱 Tech Stack

- **Framework:** NestJS (Node.js + TypeScript)
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Auth:** JWT + Passport.js
- **Real-time:** WebSocket (Socket.io)
- **Docs:** Swagger
- **Containers:** Docker + Docker Compose

---

## ⚙️ Project Structure

```bash

📦 src/
├─ 📂 auth/                  # Authentication & Guards
├─ 📂 users/                # User entity and logic
├─ 📂 restaurants/          # Restaurant CRUD operations
├─ 📂 meals/                # Menu items (meals)
├─ 📂 orders/               # Order system (contains gateway of order as well (soket.io)
│  📂 order-items/        # Order items 
├─ 📂 common/               # Shared utilities/config
│  └─ 📂 decorators/            # decorators
│  └─ 📂 gaurds/            # common gaurds (like rolesGaurd)
├─ 📜 app.controller.ts     # Main controller
├─ 📜 app.module.ts        # Root module
├─ 📜 app.service.ts       # Main service
├─ 📜 main.ts              # App entry point
📂 test/                   # Test directory (outside src)

```

---
### 🧱 **Architecture Type: Modular Monolith**

> A **Modular Monolith** is a single application that is structured in such a way that its modules (features or domains) are cleanly separated and could potentially be extracted into microservices later if needed.

---

## 🐳 Docker Setup

### 📝 1. Configure `.env`

Create a `.env` file based on the provided `.env.example`:

```env
# Database configuration
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASS=root
DB_NAME=postgres

  

# JWT configuration
JWT_SECRET=secretKey # you can keep it this only or change it with some hashed value
JWT_EXPIRES_IN=1h

# Server configuration
PORT=8000

```
Ensure that credentials match what's used in `docker-compose.yml`.

> ⚠️ **Important Configuration Note**
> 
> Before running the project with Docker, make sure to update the following placeholders in your `docker-compose.yml` file:

```bash
# Replace these placeholders accordingly:
target: <deployment-type>      # ➤ Use either `development` or `production`
POSTGRES_USER: <username>      # ➤ Example: postgres
POSTGRES_PASSWORD: <password>  # ➤ Example: postgres
```

> 
> ✅ Your final `docker-compose.yml` should look like:
> 

```yaml

target: development 
... 
POSTGRES_USER: postgres 
POSTGRES_PASSWORD: postgres

```

---

### 🏗 2. Build & Start the Containers

Choose the target you want to build for:

#### ▶️ Development (with hot-reload)

```yaml
# docker-compose.yml
target: development
command: npm run start:dev
```

Run:

```bash
docker-compose up --build
```


#### 🚀 Production (optimized build)

```yaml
# docker-compose.yml 
target: production 
command: npm run start:prod
```

Run:

```bash
docker-compose up --build
```

___
## 📚 Swagger API Docs

Once the server is up, go to:

👉 `http://localhost:8000/api-docs`

All available endpoints are documented and grouped by module.

---

## 🔑 API Authentication

Use JWT Bearer tokens in the `Authorization` header:

```bash
Authorization: Bearer <your-token>
```
###### *note: you can set it on the top right where its return **Authorize***

Roles:

- `Customer`: Can place/view orders, browse restaurants
- `RestaurantOwner`: Can manage restaurants and meals
- `DeliveryRider`: Can accept orders and update status

---

## 🔁 WebSocket Events

- `order.status.updated` → Notifies customer of status changes (pending, accepted, picked_up, delivered)
- `order.created` → (Optional) Broadcast to restaurant dashboard when a new order is created

___
## 🧪 Testing (Optional)

```bash
# Unit tests 
npm run test

# E2E tests 
npm run test:e2e
```

---

## 🧼 Lint & Format

``` bash
npm run lint 
npm run format
```

---

## 🔐 Security Notes

- Don't forget to update `JWT_SECRET` in production
- Secure your database with proper access controls

---

## 🧩 To-Do / Future Enhancements

-  Email verification on signup
-  Admin panel
-  Geo-tracking for live rider location
-  Stripe integration for real payments

---

## 👏 Acknowledgements

Built with ❤️ using [NestJS](https://nestjs.com/),  [TypeORM](https://typeorm.io/),  [Socket.io](https://socket.io/), and Docker.

---

## 📬 Contact

Feel free to reach out for contributions, suggestions, or bugs!

---
