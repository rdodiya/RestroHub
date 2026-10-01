# Implementation Plan

## Restroly (RestroHub) — Digital Menu, Order & Multi-Tenant Restaurant Management Platform

| Field | Value |
|---|---|
| **Product** | Restroly (RestroHub) |
| **Repository** | [`rdodiya/RestroHub`]() |
| **Owner / Lead** | Raj Dodiya |
| **Status** | Active Development (GSSoC 2026, branch `gssoc_develop`) |
| **Source of Truth** | `project-flow.txt`, Codebase Analysis (`RestroHub` & `RestroHub-FrontEnd`), and PRD v2.0 |
| **Doc Version** | 2.0 (Realignment with Real Codebase & Active @Todo Backlog) |

> **Effort Sizing:**
> - **S** (Small): $< 1$ day
> - **M** (Medium): $1 - 3$ days
> - **L** (Large): $3 - 5$ days
> - **XL** (Extra Large): $> 1$ week

---

## 1. Executive Objectives

1. **Resolve Explicit Project-Flow Backlog (@Todo items)**:
   - Implement subdomain dynamic routing (`<restaurantname>.restroly.in`).
   - Add branch selection dropdown in the second top header of the Admin panel.
   - Complete Order History backend API with date-range filtering, status sorting, and pagination.
   - Wire backend API endpoints to the Admin Dashboard analytical graphs and metric cards.
   - Enforce Free subscription tier restriction limiting restaurants to 2 default marketing templates.
   - Apply granular permission guards for `Manager/User` (hide financial/UPI data) and `Staff` (order status updates only).
2. **Harden Multi-Tenant Production Architecture**:
   - Maintain clean multi-tenancy across Restaurants $\rightarrow$ Branches $\rightarrow$ Menus, Orders, Tables, and Subscriptions.
   - Implement robust real-time transport (WebSocket / SSE) for live incoming orders and table waiter assistance calls.
3. **Elevate Contributor Experience (GSSoC 2026)**:
   - Provide well-scoped, modular tasks categorized by difficulty (`good-first-issue`, `intermediate`, `advanced`) across frontend, backend, and fullstack.

---

## 2. Current State Baseline & Gap Analysis

An exhaustive review of the existing repository confirms that significant functionality is already built and working in both backend (`RestroHub`) and frontend (`RestroHub-FrontEnd`). The table below outlines the current status:

| Module / Feature | Backend Implementation | Frontend Implementation | Current Integration Status |
|---|---|---|---|
| **Authentication & Profile** | [`AuthController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/auth/controller/AuthController.java) (JWT + Google OAuth 2.0) | `Login.jsx`, `Register.jsx`, `Profile.jsx` | **Done** — Auth flow and token storage operational |
| **Super Admin RBAC** | [`RoleController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/user/controller/RoleController.java), [`UserController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/user/controller/UserController.java) | `UserRoleManagement.jsx` (Link User + Restaurant + Branch + Role) | **Done (Phase 1 §6.1, backend)** — `security/Permission.java` role matrix + `security/AccessGuard.java` tenant guard on every secured controller; financial fields stripped for Manager/User & Staff; `t_audit_log` for role/subscription/UPI changes. **Open:** Category/Food tenant ownership, per-branch assignment, restaurant-scoped user management (PRD §8 items 7–9). |
| **Subscription Plans & Features** | [`SuperAdminSubscriptionController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/subscription/controller/SuperAdminSubscriptionController.java), [`RestaurantSubscriptionController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/subscription/controller/RestaurantSubscriptionController.java) | `SubscriptionManagement.jsx` | **Done** — SuperAdmin CRUD for plans and feature assignments |
| **Multi-Branch Management** | [`BranchController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/branch/controller/BranchController.java) | `Branches.jsx`, `BranchCard.jsx`, `BranchFormModal.jsx` | **Done** — CRUD works; **@Todo**: Header branch switcher dropdown |
| **Table & QR Code Management** | [`TableController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/table/controller/TableController.java) | `Tables.jsx`, `TableQRModal.jsx`, `TableCard.jsx` | **Done** — Table CRUD and scannable QR generation with download |
| **Menu, Categories & Foods** | [`MenuController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/menu/controller/MenuController.java), [`CategoryController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/category/controller/CategoryController.java), [`FoodController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/food/controller/FoodController.java) | `Menus.jsx`, `FoodItemsGrid.jsx`, `BulkActions.jsx` | **Done** — Full CRUD, item availability toggles |
| **Excel Bulk Menu Import/Export** | [`ExcelFeatureController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/excel/controller/ExcelFeatureController.java) (Apache POI) | `BulkActions.jsx` (Import/Export buttons) | **Done** — Spreadsheet bulk operations functional |
| **Direct UPI Deeplinks** | [`UpiLinkController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/payment/controller/UpiLinkController.java) (`upi-deeplink-builder`) | `UPILinks.jsx`, `UPIFormModal.jsx`, `UPITestModal.jsx` | **Done** — VPA setup and test modal operational |
| **WhatsApp Order Notifications** | `WhatsappService.java`, `WhatsappOrderNotificationServiceImpl.java` | Triggered automatically on order placement and Ready state | **Done** — Meta Cloud API integration built |
| **Public Site & Digital Menu** | [`PublicSiteController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/template/controller/PublicSiteController.java) | `RestaurantMenu.jsx`, `HeroSection.jsx`, `MenuSection.jsx` | **Done** via path; **@Todo**: Subdomain dynamic routing (`<name>.restroly.in`) |
| **Customer Ordering & Cart** | [`PublicOrderController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/order/controller/PublicOrderController.java) | `CustomerOrderDrawer.jsx`, `TableBanner.jsx`, `ServiceFAB.jsx` | **Done** — Guest checkout (Name + Phone), Table vs Counter QR (`0`) |
| **Live Orders & KDS** | [`OrderController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/order/controller/OrderController.java) | `Orders.jsx`, `OrderCard.jsx`, `KitchenDisplaySystem.jsx` | **Done** — Daily live orders and KDS; **@Todo**: Order History API & filters |
| **Waiter Assistance Notifications** | [`ServiceRequestController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/notification/controller/ServiceRequestController.java), [`DashboardNotificationController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/notifications/controller/DashboardNotificationController.java) | Notification Bell in Admin Header, `ServiceFAB.jsx` | **Done** — Service requests logged and displayed |
| **Website Customizer** | Template and section persistence | `WebsiteWrapper.jsx`, `ThemeSelector.jsx`, `WebsitePreview.jsx` | **Done** — Theme and sections; **@Todo**: Restrict Free tier to 2 templates |
| **Analytics Dashboard** | [`DashboardController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/controller/DashboardController.java) | `Dashboard.jsx` (Recharts / Stat Cards) | **@Todo** — Connect frontend chart components to backend endpoints |

---

## 3. Phased Implementation Roadmap

```
Phase 1 (Immediate)           Phase 2 (Hardening)          Phase 3 (Expansion)
High-Priority @Todo Backlog → Real-Time & Infra Hardening → Advanced Growth & Integrations
(Sprints 1 - 2, 3 wks)        (Sprints 3 - 4, 3 wks)       (Sprint 5+, Ongoing)
```

---

## Phase 1 — High-Priority @Todo Backlog & Core Wiring (Sprints 1 - 2)

**Primary Focus:** Close all outstanding functional gaps explicitly documented in `project-flow.txt`.

### 1.1 Sprint 1: Admin Panel Navigation, Branch Context & Analytics Wiring

| # | Task | Component / File | Size | Acceptance Criteria |
|---|---|---|---|---|
| **1.1** | **Admin Header Branch Switcher Dropdown (`@Todo-2`)** | `AdminLayout.jsx`, `BranchContext.jsx` | M | Persistent branch selector dropdown in the top second header. Switching branch updates active branch ID in global context and filters Tables, Live Orders, KDS, and Menus accordingly. Defaults to first branch or "All Branches". |
| **1.2** | **Dashboard Analytics Backend API Integration (`@Todo-4`)** | [`DashboardController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/admin/dashboard/controller/DashboardController.java), `Dashboard.jsx` | M | Connect `Dashboard.jsx` to `/api/v1/admin/dashboard/stats`, `/trends`, and `/top-items`. Replace all dummy data. Display real metrics: Today's Revenue, Today's Orders, Average Order Value (AOV), and Active Tables scoped by active branch. |
| **1.3** | **Order History Backend API & Frontend Filter View (`@Todo-3`)** | [`OrderController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/order/controller/OrderController.java), `Orders.jsx`, `OrderHistoryModal.jsx` | L | Implement paginated endpoint `GET /api/v1/orders/history?branchId=&startDate=&endDate=&status=&phone=&page=&size=`. In `Orders.jsx`, add "Order History" view with date range pickers, status filters, phone search, and pagination. |
| **1.4** | **Free Tier Marketing Template Limiter (`@Todo-5`)** | `WebsiteWrapper.jsx`, `ThemeSelector.jsx`, `RestaurantSubscriptionService` | S | Check active subscription plan for restaurant. If plan is Free, restrict template selection to the 2 default templates (e.g. Classic Cafe & Modern Dhaba). Display upgrade badge on premium templates. |

### 1.2 Sprint 2: Dynamic Subdomain Routing & Granular RBAC Guards

| # | Task | Component / File | Size | Acceptance Criteria |
|---|---|---|---|---|
| **1.5** | **Dynamic Subdomain Resolution (`@Todo-1`)** | [`PublicSiteController.java`](/RestroHub/src/main/java/com/restroly/qrmenu/template/controller/PublicSiteController.java), `AppRoutes.jsx`, `SiteContext.jsx` | L | Configure backend to resolve restaurant site config using `Host` header (e.g. `royalbites.restroly.in`) or fallback path parameter. Frontend inspects hostname to extract restaurant slug and fetch dynamic site without manual URL entry. |
| **1.6** | **Granular Role Enforcement (`@Todo-6`)** — ✅ backend done (Phase 1 §6.1); frontend sidebar/route hiding still to align with PRD §2.3 | `SecurityConfig.java`, `ProtectedRoute.jsx`, `Sidebar.jsx` | M | - Users with `Manager/User` role have operational read-only access and are barred from accessing `/admin/upi-links`, dashboard revenue figures, and financial reports.<br>- Users with `Staff` role are restricted to viewing and transitioning live orders on `Orders.jsx` and `KitchenDisplaySystem.jsx`. Cannot edit menus or settings. |
| **1.7** | **Counter QR Code Dedicated Generation (`table_number = 0`)** | `Tables.jsx`, `TableQRModal.jsx` | S | Provide a dedicated "Generate Counter / Takeaway QR" button on Tables page that outputs a downloadable QR code encoding `table_number = 0` for restaurant counter stands and business cards. |

---

## Phase 2 — Real-Time Infrastructure & Production Hardening (Sprints 3 - 4)

**Primary Focus:** Real-time push updates for orders and kitchen operations, database migration versioning, and test coverage.

### 2.1 Sprint 3: Real-Time Transport (WebSocket / SSE)

| # | Task | Component / File | Size | Acceptance Criteria |
|---|---|---|---|---|
| **2.1** | **WebSocket / STOMP Broker Configuration** | `WebSocketConfig.java`, `OrderEventPublisher.java` | L | Configure Spring WebSocket STOMP broker. Publish events on topic `/topic/restaurant/{restaurantId}/branch/{branchId}/orders` whenever an order is created or status is updated. |
| **2.2** | **Frontend Real-Time Order & Notification Subscription** | `Orders.jsx`, `KitchenDisplaySystem.jsx`, `AdminLayout.jsx` | M | Subscribe to WebSocket STOMP topic using SockJS / `@stomp/stompjs`. Instant order card injection and audio chime without manual polling. Fallback to 15s polling if socket disconnects. |
| **2.3** | **Live Table Service Request Push** | `ServiceRequestController.java`, `AdminHeader.jsx` | S | Push waiter assistance calls directly to header notification bell in real time. Bell badge count increments immediately with sound alert. |

### 2.2 Sprint 4: Database Versioning, CI & Reliability

| # | Task | Component / File | Size | Acceptance Criteria |
|---|---|---|---|---|
| **2.4** | **Flyway Database Migrations** | `src/main/resources/db/migration/` | M | Baseline Flyway migration scripts (`V1__initial_schema.sql`, `V2__subscriptions_and_roles.sql`) for PostgreSQL. Remove `spring.jpa.hibernate.ddl-auto=update` from production configuration. |
| **2.5** | **Automated CI/CD Pipeline (GitHub Actions)** | `.github/workflows/ci.yml` | M | Workflow triggered on PRs targeting `gssoc_develop`. Runs `./gradlew test` (backend) and `npm run test` + `npm run build` (frontend). Blocks merge on failure. |
| **2.6** | **Backend Integration Tests with Testcontainers** | `src/test/java/...` | L | Integration tests verifying multi-tenant isolation, order status lifecycle transitions, and UPI deep-link generation using Testcontainers with PostgreSQL. |
| **2.7** | **Error Boundaries & Mobile Viewport Polish** | `ErrorBoundary.jsx`, `RestaurantMenu.jsx` | M | Add React Error Boundaries around complex components. Verify public menu and ordering drawer on mobile viewports (320px, 375px, 414px). |

---

## Phase 3 — Advanced Ecosystem & Growth Features (Sprint 5+, Ongoing)

**Primary Focus:** AI translation, multi-language localization, offline resiliency, and external aggregator integrations.

| # | Task | Component / File | Size | Notes |
|---|---|---|---|---|
| **3.1** | **Multi-Language Menu Localization (i18n)** | `RestaurantMenu.jsx`, `LanguageContext.jsx` | M | Support English, Hindi, Gujarati, Marathi, and Tamil menu labels. Dynamic translation of category names and dish descriptions. |
| **3.2** | **Redis Caching Layer for Public Sites** | `PublicSiteService.java`, Redis CacheManager | M | Cache site configuration, categories, and active menus in Redis with cache invalidation on admin catalog updates. |
| **3.3** | **PWA Support for Public Digital Menu** | `vite-plugin-pwa`, `manifest.json` | M | Offline-capable caching of restaurant branding and menu items for smooth browsing on slow or spotty 2G/3G mobile networks. |
| **3.4** | **Automated Subscription Billing (Razorpay)** | `SubscriptionBillingService.java` | L | Razorpay subscription integration for automatic plan renewals, invoices, and automated plan tier upgrades. |
| **3.5** | **Food Aggregator Sync (Zomato / Swiggy)** | `AggregatorSyncService.java` | XL | Explore webhook and catalog sync APIs for bi-directional menu and order synchronization. |

---

## 4. Definition of Done (DoD)

A task or pull request is considered **Done** and ready for merge into `gssoc_develop` only when:
- [ ] **Functional Verification**: The feature adheres strictly to `PRD.md` and fulfills all specified acceptance criteria.
- [ ] **Multi-Tenant Safety**: Queries are strictly scoped to the tenant/branch; cross-tenant data leakage is prevented.
- [ ] **Role Protection**: Endpoints and UI components enforce appropriate role authorization (`Super Admin`, `Admin`, `Manager`, `Manager/User`, `Staff`).
- [ ] **Automated Builds & Lints**: Backend `./gradlew build` and frontend `npm run build` pass with zero errors.
- [ ] **Code Hygiene**: Clean, documented code following Google Java Style and idiomatic React conventions; no unused imports or dead code.
- [ ] **Security Standards**: No hardcoded API keys, secrets, or `.env` files are committed.
- [ ] **Responsive Design**: Diner-facing and staff-facing screens render properly across mobile, tablet, and desktop viewports.
- [ ] **Documentation**: OpenAPI Swagger annotations updated; relevant markdown documentation updated.

---

## 5. Contributor Workstream Guide (GSSoC 2026)

To accelerate community contributions, backlog tasks are tagged by skill area and difficulty:

```
[good-first-issue]    Difficulty: Easy        Duration: 1-2 days
[intermediate]        Difficulty: Medium      Duration: 2-4 days
[advanced]            Difficulty: Hard        Duration: 4-7 days
```

| Area | Issue Title | Tag | Scope |
|---|---|---|---|
| **Frontend** | Branch Selector Dropdown in Admin Header (`@Todo-2`) | `[good-first-issue]` | Add dropdown to `AdminLayout.jsx`, update `BranchContext.jsx` |
| **Frontend** | Free Tier Template Limiting Badge & Gating (`@Todo-5`) | `[good-first-issue]` | Update `ThemeSelector.jsx` with plan check and locked badges |
| **Frontend** | Counter QR Code Download Button (`table_number = 0`) | `[good-first-issue]` | Add quick action in `Tables.jsx` |
| **Fullstack** | Order History View with Date & Status Filters (`@Todo-3`) | `[intermediate]` | Backend JPA query + Frontend Modal/Table in `Orders.jsx` |
| **Fullstack** | Dashboard Analytics API Integration (`@Todo-4`) | `[intermediate]` | Wire `DashboardController.java` to `Dashboard.jsx` charts |
| **Backend** | Granular RBAC Pre-Authorize Filters (`@Todo-6`) | `[intermediate]` | Annotate controllers for `Manager/User` and `Staff` |
| **Backend** | Dynamic Subdomain Host Header Resolution (`@Todo-1`) | `[advanced]` | Subdomain extraction in Spring Boot filter/controller |
| **Fullstack** | Real-Time WebSocket Order Board & Sound Alerts | `[advanced]` | Spring WebSocket STOMP + SockJS frontend listener |

---

## 6. Summary of Immediate Action Items (First 7 Days)

1. **Deploy Header Branch Selector Dropdown (`@Todo-2`)** in `AdminLayout.jsx` to unlock clean multi-branch operations for all other views.
2. **Wire Dashboard Analytics API (`@Todo-4`)** to connect existing `DashboardController.java` endpoints to `Dashboard.jsx`.
3. **Build Order History API and Frontend Filter Tab (`@Todo-3`)** in `OrderController.java` and `Orders.jsx`.
4. **Implement Free Tier Template Enforcement (`@Todo-5`)** in `WebsiteWrapper.jsx` and `ThemeSelector.jsx`.
5. **Implement Subdomain Resolution Logic (`@Todo-1`)** in `PublicSiteController.java` and frontend router.
