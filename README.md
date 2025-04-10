# 🍔 Food Delivery Backend API

This is a full-featured **Food Delivery Backend API** built with **NestJS**, **TypeORM**, **PostgreSQL**, and **WebSockets**. It supports **role-based access**, **real-time order updates**, and is **Dockerized** for easy local development and deployment.

## 🎥 Video Demonstration  
[Watch the demo on Dropbox](https://www.dropbox.com/scl/fi/rryii9i5m9ze8w4r02znb/browserless.io.mp4?rlkey=kce0wk6d28i2ps1ob0txz66wi&st=cn5qma5c&dl=0)

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

```
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
DB_HOST=db
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
command: npm run start:<dev || prod> # ➤ for development use `dev`, for production use `prod`
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


> ✅ **Recommended Fix**
> 
> If you're using manual **migrations and seed scripts** (like `migration.sql` & `seed.sql`):

```
TypeOrmModule.forRoot({
  // ...
  synchronize: process.env.NODE_ENV !== 'production',
  autoLoadEntities: true,
  namingStrategy: new SnakeNamingStrategy(),
});

```
> Development (NODE_ENV=development): synchronize: true will auto-create/update tables.
> Production/Docker (NODE_ENV=production): synchronize: false ensures your hand-written migrations drive schema changes.

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

## 🧩 Database: Migration & Seeding

Upon first run, two SQL scripts are applied automatically:

|File|Description|
|---|---|
|`db/migration.sql`|Creates all necessary tables, types, and triggers|
|`db/seed.sql`|Inserts initial users and restaurant/menu data|

✅ These are mounted via `docker-compose` and run automatically on container start.
___
## 🔑 Swagger API Docs

**note: if not using swagger there is postman-collection.json in code base use that in postman**


👉 Visit: **[http://localhost:8000/api-docs](http://localhost:8000/api-docs)**

All routes are grouped and documented by module. Role restrictions are noted per endpoint.

### ✅ Sample Login Credentials (for Swagger testing)

You can use these accounts to test with different roles:

|Role|Email|Password|
|---|---|---|
|Customer|customer@gmail.com|12345|
|Restaurant Owner|restaurant@gmail.com|12345|
|Delivery Rider|rider@gmail.com|12345|

> 🔐 Click **"Authorize"** at the top-right and paste the JWT token from `/auth/login`.

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

**note: if you are running the test case, please empty all the tables. as test cases run by creating data by it self for promissing senarios.**
```sql
-- Deletes must respect foreign key dependencies (child ➜ parent)
    DELETE FROM order_items;
    DELETE FROM orders;
    DELETE FROM meals;
    DELETE FROM restaurants;
    DELETE FROM users;
```

```bash
# unit tests
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
