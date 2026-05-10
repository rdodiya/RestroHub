
# 📘 Project Details — Restroly

## 🧭 Overview

**Restroly** is a backend application built using **Spring Boot** to support a **QR-based restaurant menu and ordering system**.  
It provides RESTful APIs to manage food items, categories, and future order workflows, enabling a modern **contactless dining experience**.

The project is designed to be **modular, scalable, and production-ready**, serving as a foundation for mobile apps, web dashboards, or POS integrations.

---

## 🎯 Objectives

- Enable QR-based menu browsing
- Provide clean REST APIs for menu management
- Support scalable restaurant operations
- Serve as a backend for web/mobile clients
- Follow industry best practices (DTOs, validation, mapping)

---

## 🧩 Core Features

### ✅ Implemented

- Food & Category management
- CRUD REST APIs
- DTO-based request/response handling
- MapStruct-based object mapping
- PostgreSQL persistence
- Validation & global exception handling
- Swagger / OpenAPI documentation
- Context-path aware API routing (`/restroly`)

### 🔮 Planned / Future Enhancements

- JWT-based authentication & authorization
- Role-based access (Admin, Staff)
- Order management & tracking
- WebSocket-based live order updates
- Multi-restaurant (multi-tenant) support
- Analytics & reporting dashboards

---

## 🏗️ Architecture

The project follows a **layered architecture**:

```
Controller → Service → Repository → Database
↓
DTOs ↔ MapStruct ↔ Entities
```

### Key Layers

- **Controller Layer**
    - REST endpoints
    - Request validation
- **Service Layer**
    - Business logic
    - Transaction management
- **Repository Layer**
    - JPA repositories
    - Database access
- **DTO Layer**
    - Request / Response models
- **Entity Layer**
    - JPA entities
- **Mapper Layer**
    - Conversion class between entity & dto
- **Config Layer**
    - Security, Swagger, application configs

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
| Security | Spring Security |
| Validation | Jakarta Validation |

---

## 🗄️ Database Design

- PostgreSQL as primary database
- JPA/Hibernate for ORM
- Relationships:
    - Many-to-Many between **Food** and **Category**
- Schema auto-managed using Hibernate (`ddl-auto=update`)

---

## 🌐 API Structure

- Context Path: `/restroly`
- API Versioning: `/api/v1`

Example:
```/restroly/api/v1/foods```


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
curl -X POST http://localhost:8080/api/v1/auth/login \
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

# 2. Use the token to access protected endpoints
curl -X POST http://localhost:8080/api/v1/foods \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..." \
  -d '{
    "name": "Margherita Pizza",
    "price": 12.99,
    "category": "Pizza",
    "restaurantId": 1
  }'

# 3. Refresh the token
curl -X POST http://localhost:8080/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9..."
  }'

# 4. Validate token
curl -X GET http://localhost:8080/api/v1/auth/validate \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."

# 5. Logout
curl -X POST http://localhost:8080/api/v1/auth/logout \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```
---

## ⚙️ Build & Run

```bash
./gradlew clean build
./gradlew bootRun
```
Ensure PostgreSQL is running and configured correctly.

---

## 🧪 Testing Strategy

* Unit tests with JUnit
* Service-level testing
* Future scope: Integration tests with Testcontainers

---

## 📌 Use Cases

* Restaurants wanting QR-based menus
* Hotels & cafes managing digital menus
* Backend service for food-ordering apps
* Learning reference for Spring Boot best practices

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 🧡 Conclusion

**Restroly** is a solid, extensible backend foundation for modern restaurant systems.
It emphasizes clean architecture, maintainability, and real-world scalability.

---
