
# 📘 Project Details — Restroly

## 🧭 Overview

**Restroly** is a comprehensive digital solution designed specifically for Indian restaurants. From street-side dhabas to fine dining establishments, RestroHub helps restaurants create digital menus, accept payments, manage orders, and build their online presence with minimal effort.

The project is designed to be **modular, scalable, and production-ready**, serving as a foundation for mobile apps, web dashboards, or POS integrations.

---

## 🎯 Objectives

- Enable QR-based menu browsing
- Provide clean REST APIs for menu management
- Support scalable restaurant operations
- Serve as a backend for web/mobile clients
- Follow industry best practices (DTOs, validation, mapping)

---

## 🔄 Business Flow

Restroly follows a two-sided restaurant workflow:

1. **Public Customer View** for browsing the menu, adding items to cart, and placing orders.
2. **Admin / Manager View** for restaurant setup, menu management, order handling, and payment follow-up.

This flow is designed for contactless dining, fast order handling, and real-time updates between the customer and the restaurant team.

---

## 1) Public Customer Flow

### QR-based access

- Each table will have a QR code printed on it.
- A default QR code for **Table 0** will be placed at the counter.
- When a customer scans the QR code, the system opens a restaurant-specific URL such as:

```text
rest1.restroly.in/{branchId}?tableId=1#menuId
(frontend also serves /Restrohub/:restaurantName/:branchId; tenant subdomain handling is in `utils/subdomain.js`)
```

### Menu browsing and cart

- The website menu section loads automatically for the selected branch and table.
- Based on the selected restaurant and branch, a configured website template is rendered dynamically on the UI.
- The website template shows restaurant details first and then routes the user into the menu section.
- The website template can be changed by the admin either for a specific branch or as a common template across all branches.
- Customers can browse categories, view menu items, and add items to the cart.
- A cart button lets the customer review selected items before checkout.

### Language selection and AI translation (planned; no translation code in backend or frontend yet)

- The website template UI includes an AI translation button with a dropdown of available languages.
- English is the default language.
- When the language selection changes, the frontend sends a request to the Spring Boot backend.
- The backend forwards the request to an AI LLM along with restaurant data.
- The translated content is returned and bound back into the UI so the same menu and restaurant details render in the selected language.

### Order placement

- Before placing the order, a popup will ask for the customer’s **name** and **mobile number**.
- After confirmation, the order is submitted with the table reference and customer details.
- An order ID is generated for tracking.

### Customer notifications

- Once the order is placed, a notification is sent to the manager/admin dashboard.
- A push notification is also shown inside the web app for active order visibility.
- The customer receives a WhatsApp message with the order ID.

---

## 2) Admin / Manager Flow

### Restaurant setup

- During registration, the admin fills in the restaurant details.
- The admin can configure one or more branches for the restaurant.

### Menu management

- Add and manage food items.
- Create and maintain categories.
- Build and update menus.
- Add and manage branches.

### Order handling

- New customer orders appear in the admin dashboard order list.
- The admin can accept the order and update its status through the lifecycle:

```text
Pending -> Confirmed -> Preparing -> Ready -> Served -> Billed -> Completed
```

At any point before completion, an order can also be moved to **Cancelled**.

### Status updates and payment flow

- Every order status update is automatically sent to the customer through WhatsApp.
- When an order is marked **Billed**, the customer receives:
  - the updated order status
  - the bill amount
  - a UPI payment link for the total amount

---

## Business Rules

- Table QR codes are branch-specific and table-specific.
- Table 0 is reserved for counter orders or walk-in customers.
- Every placed order must carry customer contact details for notification delivery.
- Admin dashboard updates should be near real-time to avoid missed orders.
- WhatsApp is the main customer notification channel for order confirmation and status changes.

---

## 🧩 Core Features

### ✅ Implemented

- Food, Category and Menu management (with Excel import/export)
- Restaurant, Branch and Table management (table QR codes via ZXing)
- CRUD REST APIs with DTO-based request/response handling and MapStruct mapping
- JWT authentication (register, login, refresh, validate, logout, password reset); Google ID-token verification exists (`GoogleAuthService`) but the `/google` endpoint is currently commented out in `AuthController`
- Multi-tenant RBAC: roles `SUPER_ADMIN`, `ADMIN`, `RESTAURANT_OWNER`, `MANAGER`, `MANAGER_USER`, `STAFF`, `CUSTOMER`, enforced by `AccessGuard` + `Permission`
- Audit log for sensitive actions (role, plan and UPI VPA changes)
- Order management & tracking (status lifecycle, payment status, idempotency key, order history)
- Live updates: STOMP/WebSocket (`/ws`) and SSE dashboard notifications; table service requests
- UPI payment links per branch; WhatsApp order notifications (Cloud API, per-restaurant flag)
- Website templates / theme and section editor, served through public site endpoints
- Subscription plans and features (SuperAdmin panel, per-restaurant plan lookup)
- Admin dashboard stats, Kitchen Display System (KDS)
- PostgreSQL persistence with Flyway migrations (V1 to V5)
- Validation & global exception handling
- Swagger / OpenAPI documentation
- Context-path aware API routing (`/restroly`)

### 🔮 Planned / Future Enhancements

- AI-based menu translation (backend LLM call)
- Redis caching
- Richer analytics & reporting dashboards
- Zomato / Swiggy aggregator sync

---

## 🏗️ Architecture

The project follows a **layered architecture**:

```
Controller → Service → Repository → Database
↓
DTOs ↔ MapStruct ↔ Entities
```

### Key Layers

Code is organized **by feature** under `com.restroly.qrmenu` (`auth`, `user`, `restaurant`, `branch`, `table`, `menu`, `category`, `food`, `order`, `payment`, `subscription`, `template`, `notification`, `notifications`, `whatsapp`, `excel`, `address`, `audit`, `admin`). Each feature package contains its own layers:

- **Controller Layer** (`controller/`)
    - REST endpoints
    - Request validation
- **Service Layer** (`service/`, `service/impl/`)
    - Business logic
    - Transaction management
- **Repository Layer** (`repository/`)
    - JPA repositories
    - Database access
- **DTO Layer** (`dto/`)
    - Request / Response models
- **Entity Layer** (`entity/`)
    - JPA entities
- **Mapper Layer** (`mapper/`)
    - Conversion class between entity & dto

Cross-cutting packages:

- `config/` - `SecurityConfig` (route rules), CORS, OpenAPI, Cloudinary
- `security/` - JWT filter/provider, `AccessGuard` (tenant checks), `Permission` (role to permission map), `AppRole`
- `common/` - shared DTOs, enums, `WebSocketConfig`
- `exception/` - custom exceptions and global handler

---

## 🧠 Technology Stack

| Layer | Technology |
|-----|-----------|
| Language | Java 21 |
| Framework | Spring Boot |
| Database | PostgreSQL |
| ORM | Spring Data JPA |
| Mapper | MapStruct |
| Build Tool | Gradle |
| API Docs | SpringDoc OpenAPI |
| Security | Spring Security, JWT (jjwt), method security (`@PreAuthorize`) |
| Migrations | Flyway |
| Frontend | React 18, Vite, Tailwind CSS (see `TechStack.md`) |
| Validation | Jakarta Validation |

---

## 🗄️ Database Design

- PostgreSQL as primary database
- JPA/Hibernate for ORM
- Relationships:
    - Many-to-Many between **Food** and **Category**
- Dev: schema auto-managed by Hibernate (`ddl-auto=update`); prod: `ddl-auto=validate`
- Flyway migrations in `src/main/resources/db/migration`: V1 baseline (placeholder), V2 audit log, V3 core schema baseline, V4 order payment status and source, V5 order idempotency key
- Entity changes must ship with a new `V<n>__*.sql` migration
- Multi-tenant model: users are linked to restaurants/branches with a role; see `RestroHub/Schema.md`

---

## 🌐 API Structure

- Context Path: `/restroly`
- API Versioning: `/api/v1`
- Public routes: `/public/api/v1/**` (auth, orders, restaurants, sites); a few legacy ones under `/api/v1/**`
- Owner/admin routes: `/secure/api/v1/**` (branches, menus, foods, categories, orders, restaurants, users, upi-links, excel, dashboard, subscriptions). Writes need role `ADMIN`, `MANAGER` or `RESTAURANT_OWNER` (STAFF may update order status); each endpoint is further guarded by `@access.can(...)` / `@access.branch(...)`.

Examples:
```/restroly/public/api/v1/auth/login```
```/restroly/secure/api/v1/foods```


This allows:
- Clean versioning
- Future backward compatibility

---

## 📘 Swagger & API Docs

Swagger UI is enabled for easy API testing and documentation.
```/restroly/swagger-ui.html```

Swagger is explicitly configured to respect the context path.
---
## AUTH APIS
```bash
# 1. Login and get tokens
curl -X POST http://localhost:8181/restroly/public/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'

# Response:
# {
#   "success": true,
#   "message": "Login successful",
#   "data": {
#     "accessToken": "eyJhbGciOiJIUzI1NiJ9...",
#     "refreshToken": "eyJhbGciOiJIUzI1NiJ9...",
#     "tokenType": "Bearer",
#     "expiresIn": 86400,
#     "username": "admin",
#     "roles": ["ROLE_ADMIN", "ROLE_USER"]
#   }
# }

# 2. Use the token to access protected endpoints (body is illustrative; see Swagger for the real schema)
curl -X POST http://localhost:8181/restroly/secure/api/v1/foods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "name": "Margherita Pizza",
    "price": 12.99,
    "category": "Pizza",
    "restaurantId": 1
  }'

# 3. Refresh the token
curl -X POST http://localhost:8181/restroly/public/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
  }'

# 4. Validate token
curl -X GET http://localhost:8181/restroly/public/api/v1/auth/validate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# 5. Logout
curl -X POST http://localhost:8181/restroly/public/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```
---

## 🧪 Testing Strategy

* Unit tests with JUnit 5 (service-level), under `src/test/java/com/restroly/qrmenu/...`
* Web-layer security tests with `@WebMvcTest` (e.g. `OrderControllerTenantIsolationTest`, `AccessGuardTest`)
* Spring context tests need a real PostgreSQL (H2 is not a dependency)
* Future scope: Integration tests with Testcontainers

---

## 📌 Use Cases

* Restaurants wanting QR-based menus
* Hotels & cafes managing digital menus
* Backend service for food-ordering apps
* Learning reference for Spring Boot best practices


---
