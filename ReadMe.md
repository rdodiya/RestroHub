<div align="center">

# 🍽️ Restroly (RestroHub)
### Digital Menu, Order & Multi-Tenant Restaurant Management Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GSSOC](https://img.shields.io/badge/GSSOC-2026-blue.svg)](https://gssoc.girlscript.tech/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](#-prerequisites)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen.svg)](#-tech-stack)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](#-prerequisites)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](#-prerequisites)
[![Gradle](https://img.shields.io/badge/Gradle-8.0+-02303A.svg)](#-prerequisites)

**Empowering Indian Restaurants to Go Digital — Simple, Fast & Powerful!**

[About](#-about) • [Features](#-features) • [System Flow & Architecture](#-system-flow--architecture) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [API Surface](#-api-documentation) • [Contributing](#-contributing) • [Support](#-contact--support)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Key Design Decisions](#-key-design-decisions)
- [Features & System Status](#-features--system-status)
- [System Flow & Architecture](#-system-flow--architecture)
- [Actors & Role-Based Access (RBAC)](#-actors--role-based-access-rbac)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start Guide](#-quick-start-guide)
  - [1. Clone & Branch](#1--clone--branch)
  - [2. Backend Setup](#2--backend-setup-spring-boot)
  - [3. Frontend Setup](#3--frontend-setup-react--vite)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing (GSSoC 2026)](#-contributing-gssoc-2026)
  - [Active @Todo Backlog & Good First Issues](#-active-todo-backlog--good-first-issues)
  - [Git Workflow & PR Standards](#-git-workflow--pr-standards)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🎯 About

**Restroly** is a full-stack, multi-tenant digital restaurant operating platform engineered specifically for Indian food establishments — from street-side dhabas, food carts, and takeaway outlets to trendy cafes and multi-branch fine-dining chains.

Restroly eliminates heavy aggregator commissions (Zomato/Swiggy) and technical barriers by providing every restaurant with:
1. **Auto-Generated Branded Website & Digital Menu** (`<restaurantname>.restroly.in`) with live theme customization, item catalog, and contact sections.
2. **Dual-Mode Contactless QR Ordering**:
   - **Table QR Codes**: Unique QR for each physical table, automatically attributing orders to that table and enabling diner waiter calls.
   - **Counter / Takeaway QR Code**: Master QR code with `table_number = 0` for direct counter ordering, takeaway menus, and business cards.
3. **Commission-Free Direct UPI Payments**: Generates instant peer-to-merchant UPI deep links via `upi-deeplink-builder` targeting the restaurant's configured UPI VPA (GPay, PhonePe, Paytm, BHIM) with zero third-party gateway deductions.
4. **Automated WhatsApp Notifications**: Dispatches WhatsApp order confirmations and UPI payment links via Meta Cloud API upon checkout and when orders transition to `Ready`.
5. **Kitchen Display System (KDS)**: Real-time ticket management for kitchen staff (`Pending`, `Preparing`, `Ready`).
6. **Multi-Branch Operations**: Centralized management of multiple branches, tables, and active menu mappings.
7. **Super Admin Platform Governance**: Multi-tenant RBAC, plan-based feature catalog, and restaurant subscription management.

---

## 💡 Key Design Decisions

The following design choices are deliberate architectural foundations of Restroly:

| Architectural Choice | Why It Matters |
|---|---|
| **Zero Gateway Overhead / No Webhook Tracking** | Restroly routes payments directly from diner to restaurant owner via UPI deep links (`upi://pay?pa=...`). Payment status is marked `Billed` / confirmed manually by staff. No PSP fees, zero merchant onboarding delays. |
| **Frictionless Guest Ordering** | Diners checkout with only **Customer Name** and **Customer Mobile Number**. No customer login, passwords, or mandatory mobile apps. |
| **No Intrusive User Tracking** | On-site diner behavioral analytics (heatmaps, bounce tracking) are intentionally out of scope to prioritize privacy and ultra-fast page loads. |
| **Subdomain Multi-Tenancy** | Public customer sites resolve dynamically via per-restaurant subdomains (`restaurantname.restroly.in`) backed by a shared multi-tenant backend. |

---

## ✨ Features & System Status

### ✅ Implemented & Working

| Module | Features |
|---|---|
| 📱 **Customer Dynamic Site & Menu** | Responsive landing page (Hero, About, Menu, Contact, Lang dropdown), table banner, guest cart drawer, and table service requests (`Call Waiter`). |
| 🪑 **Tables & Dual QR Codes** | Table CRUD per branch; downloadable/printable table QR codes; master Counter QR (`table_number = 0`). |
| 💳 **Direct UPI Payments** | Automated UPI deep link generation (`upi-deeplink-builder`) for GPay, PhonePe, Paytm, BHIM; branch UPI ID configuration and test modal. |
| 💬 **WhatsApp Notifications** | Automated order confirmation and payment link dispatch via Meta Cloud API; order ready alerts. |
| 📂 **Menu & Food Catalog** | Menus, categories, food items, dietary badges (Veg, Non-Veg, Egg, Vegan), and instant availability toggle. |
| 📊 **Excel Bulk Menu Operations** | Bulk upload and download of entire food catalogs via `.xlsx` spreadsheets (Apache POI). |
| 🏢 **Multi-Branch Store Operations** | Multi-branch CRUD per restaurant; active menu binding per branch. |
| 🍳 **Kitchen Display System (KDS)** | Live kitchen queue filtering orders across `Pending`, `Preparing`, and `Ready` states with elapsed time counter. |
| 🎨 **Marketing Website Customizer** | Real-time theme editor (colors, typography), section content editor (Hero, About, Contact), and live layout preview. |
| 🔐 **Authentication & Security** | JWT stateless auth, Google OAuth 2.0 integration, protected admin routes, CORS configuration. |
| 👑 **Super Admin Platform Governance** | Dynamic User $\leftrightarrow$ Restaurant $\leftrightarrow$ Branch $\leftrightarrow$ Role assignment; Subscription plans CRUD, feature catalog management, and restaurant plan assignments. |
| 🌓 **Admin UX & Theming** | Header notification bell with audio chimes; Dark Mode and Light Mode support. |

### 🚧 Active Backlog (@Todo Items)

The following items are actively being built and represent the current priority focus:

| ID | Task | Description |
|---|---|---|
| **`@Todo-1`** | **Subdomain Dynamic Routing** | Resolve restaurant websites dynamically from the `Host` header (`restaurantname.restroly.in`) without manual path parameters. |
| **`@Todo-2`** | **Admin Header Branch Switcher** | Add a persistent branch dropdown in the top header of the Admin panel to seamlessly switch working branch context across all views. |
| **`@Todo-3`** | **Order History API & Filtering** | Implement backend API and frontend view for historical orders with date-range filters, status sorting, diner phone search, and pagination. |
| **`@Todo-4`** | **Dashboard Analytics Backend Integration** | Connect existing `DashboardController.java` endpoints to the React `Dashboard.jsx` charts and metric cards. |
| **`@Todo-5`** | **Free Tier Marketing Template Gating** | Enforce a limit of 2 default templates for restaurants on the Free subscription plan in the website customizer. |
| **`@Todo-6`** | **Granular Role Permission Guards** | Fine-tune backend `@PreAuthorize` guards for `Manager/User` (hide financial/UPI data) and `Staff` (order status updates only). |

---

## 📐 System Flow & Architecture

### System Architecture
```
┌────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                               │
│      React 18 + Vite  │  Tailwind CSS  │  React Router v6  │  Axios     │
│   (Customer Dynamic Site  │  Admin Dashboard  │  Kitchen Display KDS)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / REST / JSON (JWT Auth)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           SPRING BOOT API                              │
│       Spring Security 6  │  JWT Filter  │  Swagger OpenAPI Docs        │
├───────────────────────────────────┬────────────────────────────────────┤
│   Public Site & Order Controller  │   Branch & Table Controllers       │
│   Menu & Category Controllers     │   Excel Feature (Apache POI)       │
│   Order & Notification Service    │   UpiLinkController (UPI Builder)  │
│   Kitchen Display Service         │   SuperAdmin Subscription Service  │
│   User & Role Controller          │   WhatsApp Service (Meta API)      │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Spring Data JPA
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                              │
│             PostgreSQL 14+ (Local MySQL dev profile maintained)        │
└────────────────────────────────────────────────────────────────────────┘
```

### End-to-End Order Flow
```
Customer scans Table/Counter QR
   │
   ▼
Opens dynamic website: <restaurantname>.restroly.in
   │
   ▼
Selects dishes → Adds to cart → Checks out with Name + Mobile
   │
   ▼
Backend creates Order (Table # or 0 for Takeaway)
   ├──► Pushes live order notification to Admin & KDS (Bell + Audio chime)
   └──► Dispatches WhatsApp message with direct UPI Payment Link (Meta API)
            │
            ▼
Customer pays directly via GPay / PhonePe / Paytm to owner's UPI VPA
   │
   ▼
Kitchen cooks order (KDS: Pending ➔ Preparing ➔ Ready)
   │
   ▼
Staff confirms receipt & marks order "Billed"
```

---

## 👥 Actors & Role-Based Access (RBAC)

Restroly uses multi-tenant role bindings managed by the Super Admin:

```
Super Admin (Platform Owner)
  └── Links: User ↔ Restaurant ↔ Branch ↔ Role
        ├── Restaurant Admin (Full store, branch, menu, table, payment, website control)
        ├── Manager (Branch operations, live orders, active menu)
        ├── Manager/User (Operational read-only; EXCLUDED from payments & revenue)
        └── Staff (Live order status updates, primary user of Kitchen Display System)
```

- **Customer / Diner**: No account required. Scans QR code, browses menu, places guest order, receives WhatsApp updates.
- **Restaurant Admin**: Full operational and financial management of their restaurant and assigned branches.
- **Manager / User**: Read-only oversight of menus and orders; cannot view or edit UPI links or financial figures.
- **Staff**: Updates order statuses (`Pending` $\rightarrow$ `Preparing` $\rightarrow$ `Ready`) on the live board and KDS.
- **Super Admin**: Platform administrator (approves registrations, assigns roles, configures subscription plans and feature flags).

---

## 🔧 Tech Stack

### Backend
| Component | Technology | Version | Purpose |
|---|---|---|---|
| Language | Java | 21 (LTS) | Core backend language |
| Framework | Spring Boot | 3.x | Application framework |
| Build Tool | Gradle | 8.0+ | Dependency management and build automation |
| Security | Spring Security + JJWT | 0.11.5 | Stateless JWT authentication & role authorization |
| Database | PostgreSQL | 14+ | Primary relational database (dev MySQL profile supported) |
| ORM | Spring Data JPA / Hibernate | 6.x | Persistence and entity mapping |
| Integrations | `upi-deeplink-builder` | 1.0.0 | Dynamic peer-to-merchant UPI payment deep links |
| Notifications | Meta WhatsApp Cloud API | — | Automated customer order confirmation & payment links |
| Spreadsheets | Apache POI | 5.2.5 | Bulk menu import and export via `.xlsx` |
| API Docs | SpringDoc OpenAPI | 2.5.0 | Interactive Swagger UI documentation |

### Frontend
| Component | Technology | Purpose |
|---|---|---|
| Library | React 18 | Declarative component-based UI |
| Build Tool | Vite | Ultra-fast local dev server and bundling |
| Styling | Tailwind CSS | Utility-first responsive design, Dark/Light mode |
| Routing | React Router v6 | Client-side routing with role-protected layouts |
| HTTP Client | Axios | REST API communication with auth interceptors |
| Auth | `@react-oauth/google` | Google OAuth 2.0 Sign-In integration |
| Icons | Lucide React | Modern, consistent icon library |
| Notifications | React Hot Toast | In-app alerts, success toasts, and error handling |

---

## 📋 Prerequisites

Before setting up Restroly locally, ensure the following are installed:

| Tool | Required Version | Verification Command | Download Link |
|---|---|---|---|
| **JDK** | 21 (LTS) | `java -version` | [Adoptium Eclipse Temurin 21](https://adoptium.net/) |
| **Gradle** | 8.0+ (or use `./gradlew`) | `gradle -version` | [Gradle Releases](https://gradle.org/releases/) |
| **Node.js** | 18.0+ | `node -version` | [Node.js Official](https://nodejs.org/) |
| **npm** | 9.0+ | `npm -version` | Included with Node.js |
| **PostgreSQL** | 14+ | `psql --version` | [PostgreSQL Downloads](https://www.postgresql.org/download/) |
| **Git** | Latest | `git --version` | [Git SCM](https://git-scm.com/) |

---

## 🚀 Quick Start Guide

### 1 · Clone & Branch

```bash
# Clone the repository
git clone https://github.com/rdodiya/RestroHub.git
cd RestroHub

# Switch to the active development branch (GSSoC 2026)
git checkout gssoc_develop
git pull origin gssoc_develop
```

---

### 2 · Backend Setup (Spring Boot)

#### A. Create the Database
```bash
# Using PostgreSQL CLI
psql -U postgres -c 'CREATE DATABASE "RestroHub_DB";'

# Or using createdb
createdb -U postgres RestroHub_DB
```

#### B. Environment Configuration
The backend loads configuration from `application.properties` and `application-dev.properties`. Configure your environment variables or update `application-dev.properties`:

```bash
# Database credentials
export DB_USERNAME=postgres
export DB_PASSWORD=your_postgres_password
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/RestroHub_DB

# Security & JWT
export JWT_SECRET=your-secure-256-bit-secret-key-for-local-development
export JWT_EXPIRATION=86400000
export JWT_REFRESH_EXPIRATION=604800000

# Google OAuth (matching frontend client ID)
export GOOGLE_OAUTH_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

#### C. Build & Run Backend
```bash
cd RestroHub

# Grant execution rights (macOS/Linux)
chmod +x gradlew

# Compile and start the Spring Boot server
./gradlew bootRun
```

The backend starts at **`http://localhost:8181/restroly`**:
- **API Base:** `http://localhost:8181/restroly/api/v1`
- **Swagger UI:** `http://localhost:8181/restroly/swagger-ui.html`
- **Health Check:** `http://localhost:8181/restroly/actuator/health`

---

### 3 · Frontend Setup (React / Vite)

Open a **new terminal window**:

```bash
cd RestroHub-FrontEnd

# Install dependencies
npm install

# Set up local environment file
cp .env.example .env
```

Edit `.env` to configure API and Google Client ID:
```env
# Spring Boot API context path (no trailing slash)
VITE_API_BASE_URL=http://localhost:8181/restroly

# Google OAuth Client ID (from Google Cloud Console)
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com

# Optional environment flags
VITE_NODE_ENV=development
```

#### Run Frontend Dev Server
```bash
npm run dev
```

The client will start at **`http://localhost:3000`** (or Vite's next available port).

---

## 📁 Project Structure

```
RestroHub/
├── RestroHub/                                 # Backend: Java / Spring Boot 3
│   ├── src/main/java/com/restroly/qrmenu/
│   │   ├── admin/dashboard/                  # Analytics & dashboard controllers
│   │   ├── auth/                             # Google OAuth, JWT authentication
│   │   ├── branch/                           # Multi-branch CRUD & menu binding
│   │   ├── category/                         # Menu categories
│   │   ├── config/                           # SecurityConfig, CorsConfig, SwaggerConfig
│   │   ├── dto/                              # Request / Response DTOs
│   │   ├── excel/                            # Excel bulk menu import & export
│   │   ├── exception/                        # Global exception handlers
│   │   ├── food/                             # Food items CRUD & availability
│   │   ├── menu/                             # Menus management
│   │   ├── model/                            # JPA domain entities
│   │   ├── notification/                     # Waiter service requests
│   │   ├── notifications/                    # Admin notification bell feed
│   │   ├── order/                            # Public & Admin order management
│   │   ├── payment/                          # UPI deep-link generation
│   │   ├── repository/                       # Spring Data JPA repositories
│   │   ├── restaurant/                       # Restaurant profile management
│   │   ├── service/                          # Business logic layer
│   │   ├── subscription/                     # SuperAdmin plans & features
│   │   ├── table/                            # Tables & QR code generation
│   │   ├── template/                         # Public dynamic website configuration
│   │   └── user/                             # User & SuperAdmin role management
│   ├── src/main/resources/
│   │   ├── application.properties            # Base properties
│   │   └── application-dev.properties        # Local development profile
│   └── build.gradle                          # Gradle build script
│
├── RestroHub-FrontEnd/                        # Frontend: React 18 / Vite / Tailwind
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                        # Admin dashboard, KDS, Orders, Menus,
│   │   │   │                                 # Tables, Branches, Subscriptions, Roles
│   │   │   ├── customer/                     # Customer dynamic site, Hero, Cart drawer
│   │   │   └── common/                       # Reusable UI components & modals
│   │   ├── context/                          # AdminThemeContext, SiteContext, ThemeContext
│   │   ├── layouts/                          # AdminLayout, CustomerLayout, PublicLayout
│   │   ├── pages/                            # Public landing, Customer menu, Auth pages
│   │   ├── routes/                           # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── services/                         # Axios instances and API services
│   │   ├── styles/                           # Global Tailwind and theme styling
│   │   ├── App.jsx                           # App entry point
│   │   └── main.jsx                          # React root
│   ├── .env.example                          # Environment template
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── agent/                                    # PRD, ImplementationPlan, Schema, Rules, TechStack, frontend-design (planning & AI-agent docs)
├── scripts/                                  # run_local.sh/.bat (local runner), setup_jules.sh
├── AGENTS.md / CLAUDE.md                     # AI agent instructions (must stay at root)
├── CONTRIBUTING.md                           # Contribution guidelines
├── LICENSE                                   # MIT License
└── ReadMe.md                                 # Main Project Readme
```

---

## 📚 API Documentation

Interactive Swagger API documentation is automatically available when the backend is running:

```
http://localhost:8181/restroly/swagger-ui.html
```

### Core API Surface

| Group | Method | Endpoint | Description | Auth |
|---|---|---|---|---|
| **Public Site** | `GET` | `/public/api/v1/sites/{siteId}/config` | Fetch dynamic website config & active menu | Public |
| **Public Orders** | `POST` | `/api/v1/public/orders` | Place guest order (Name + Mobile + Table) | Public |
| **Public Orders** | `GET` | `/api/v1/public/orders/{id}/status` | Track live order status | Public |
| **Service Requests**| `POST` | `/api/v1/service-requests` | Diner triggers "Call Waiter" assistance | Public |
| **Live Orders** | `GET` | `/api/v1/orders` | List today's live orders (Admin / KDS) | JWT |
| **Order Status** | `PUT` | `/api/v1/orders/{id}/status` | Update order status (`Pending` $\rightarrow$ `Ready`) | JWT |
| **Order History** | `GET` | `/api/v1/orders/history` | Paginated past orders with date/status filter (`@Todo`) | JWT |
| **Menus** | `GET/POST` | `/secure/api/v1/menus` | List / create restaurant menus | JWT |
| **Food Items** | `GET/POST` | `/api/v1/foods` | List / add food items with availability toggle | JWT |
| **Excel Bulk** | `POST` | `/api/v1/excel/upload` | Bulk upload menu via `.xlsx` | JWT |
| **Branches** | `GET/POST` | `/api/v1/branches` | Multi-branch CRUD and active menu mapping | JWT |
| **Tables & QR** | `GET/POST` | `/api/v1/tables` | Table CRUD & downloadable QR codes | JWT |
| **UPI Links** | `GET/POST` | `/api/v1/upi` | Configure branch UPI VPA & test links | JWT |
| **Dashboard** | `GET` | `/api/v1/admin/dashboard/stats` | Analytics KPIs, trends, top dishes (`@Todo`) | JWT |
| **SuperAdmin Sub**| `GET/POST` | `/api/v1/super-admin/subscriptions/plans` | CRUD subscription plans & feature flags | SuperAdmin |
| **Roles & Users** | `POST` | `/api/v1/roles/assign` | Link User $\leftrightarrow$ Restaurant $\leftrightarrow$ Branch $\leftrightarrow$ Role | SuperAdmin |

---

## 🤝 Contributing (GSSoC 2026)

We welcome all open-source contributions — bug fixes, UI improvements, new features, tests, and documentation!

### 🎯 Active @Todo Backlog & Good First Issues

| Issue / Feature | Area | Difficulty Tag | Description |
|---|---|---|---|
| **Branch Selector Dropdown** | Frontend | `[good-first-issue]` | Add branch selection dropdown to top header in `AdminLayout.jsx` |
| **Counter QR Code Generator** | Frontend | `[good-first-issue]` | Add quick action in `Tables.jsx` to generate master Counter QR (`0`) |
| **Free Tier Template Limiting** | Frontend | `[good-first-issue]` | Lock non-default templates on Free plan in `WebsiteWrapper.jsx` |
| **Order History API & View** | Fullstack | `[intermediate]` | Add backend paginated query & frontend filter view in `Orders.jsx` |
| **Dashboard Analytics API Wiring** | Fullstack | `[intermediate]` | Connect `DashboardController.java` to `Dashboard.jsx` charts |
| **Granular RBAC Guards** | Backend | `[intermediate]` | Add `@PreAuthorize` guards for `Manager/User` and `Staff` |
| **Dynamic Subdomain Resolution** | Backend | `[advanced]` | Extract tenant slug from `Host` header in `PublicSiteController` |
| **WebSocket Real-Time Orders** | Fullstack | `[advanced]` | Spring STOMP broker + SockJS live order board updates |

---

### 🌿 Git Workflow & PR Standards

```bash
# 1. Fork repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/RestroHub.git
cd RestroHub

# 2. Add upstream remote
git remote add upstream https://github.com/rdodiya/RestroHub.git

# 3. Pull latest changes from gssoc_develop
git fetch upstream
git checkout gssoc_develop
git merge upstream/gssoc_develop

# 4. Create your feature branch (always from gssoc_develop!)
git checkout -b feature/your-feature-name

# 5. Make changes, test thoroughly locally:
#    Backend:  cd RestroHub && ./gradlew clean build
#    Frontend: cd RestroHub-FrontEnd && npm run build

# 6. Commit using Conventional Commits
git commit -m "feat(branch): add branch selection dropdown in admin header"

# 7. Push to your fork and submit a PR to gssoc_develop
git push origin feature/your-feature-name
```

#### Commit Message Format
```
type(scope): concise description in present tense

Types:
  feat      → New feature
  fix       → Bug fix
  docs      → Documentation update
  style     → Formatting, white-space, no logic change
  refactor  → Code refactoring without behavioral change
  test      → Adding or updating tests
  chore     → Build/dependency maintenance
```

#### PR Checklist
- [ ] Branched from `gssoc_develop`
- [ ] `./gradlew build` passes with zero errors
- [ ] `npm run build` passes with zero errors
- [ ] Tested end-to-end locally (both mobile and desktop)
- [ ] No hardcoded secrets, API keys, or `.env` files committed
- [ ] PR description clearly explains *what* changed and *why*

---

## 🚀 Deployment

### Docker Setup
```bash
# Build and start all services (Backend, Frontend, PostgreSQL)
docker-compose build
docker-compose up -d

# Check service logs
docker-compose logs -f

# Shutdown services
docker-compose down
```

### Frontend Production Build
```bash
cd RestroHub-FrontEnd
npm run build
# Dist output ready for deployment on Vercel, Netlify, or Cloudflare Pages
```

### Backend Production Build
```bash
cd RestroHub
./gradlew clean bootJar
# Executable JAR generated in build/libs/
java -jar build/libs/restroly-0.0.1-SNAPSHOT.jar
```

---

## 🔧 Troubleshooting

<details>
<summary><strong>PostgreSQL connection refused</strong></summary>

```bash
# Verify PostgreSQL is running
# Linux
sudo systemctl status postgresql
sudo systemctl start postgresql

# macOS
brew services restart postgresql

# Windows
# Open Services (services.msc) -> Ensure "postgresql-x64-XX" is Running
```
</details>

<details>
<summary><strong>Port 8181 already in use</strong></summary>

```bash
# macOS / Linux
lsof -i :8181
kill -9 <PID>

# Windows (PowerShell)
netstat -ano | findstr :8181
Stop-Process -Id <PID> -Force
```
</details>

<details>
<summary><strong>Frontend API 404 errors</strong></summary>

Ensure your `.env` file does **not** end with `/api/v1`:
```env
# Correct:
VITE_API_BASE_URL=http://localhost:8181/restroly

# Incorrect:
VITE_API_BASE_URL=http://localhost:8181/restroly/api/v1
```
</details>

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📞 Contact & Support

<div align="center">

**Raj Dodiya** — Project Owner & Lead

| Channel | Link |
|---|---|
| 🐙 GitHub | [@rdodiya](https://github.com/rdodiya) |
| 💼 LinkedIn | [Raj Dodiya](https://www.linkedin.com/in/rdodiya/) |
| 📧 Email | `rdodiya2601@gmail.com` |
| 🐦 Twitter / X | [@rdodiya2001](https://x.com/rdodiya2001) |
| 📝 Bug Reports & Issues | [GitHub Issues](https://github.com/rdodiya/RestroHub/issues) |

**Made with ❤️ for Indian Restaurants**

[⬆ Back to top](#-restroly-restrohub)

</div>
