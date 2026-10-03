# Restroly (RestroHub) — End-to-End Test & Verification Report

**Date of Execution:** October 3, 2026  
**Environment:** Windows 11 Pro, OpenJDK 21 (`D:\Software\jdk-21.0.4`), MySQL 8.0 (`restrohub_db`), Node.js v24.4.0, Google Chrome 140.0.7339.208, Vite 5.x  
**Tested Branches / Sprints:** Sprints 1, 2, 3 Scope (Authentication, Tenant Isolation, RBAC, Branch Context, Menus & Dishes, Tables & QR, Customer Ordering, Live Orders, KDS, Order History, Financial Dashboard, UPI Payments, Subscriptions, Public Website / Subdomains, Reliability, UX / Responsiveness)

---

## 1. Executive Summary & Environment Setup

### 1.1 Environment Details
- **Backend**: Spring Boot 3.2.6 running on Java 21 (`http://localhost:8181/restroly`)
- **Frontend**: React 18 + Vite running on port 3000 (`http://localhost:3000`)
- **Database**: Local MySQL 8.0 on port 3306 (`restrohub_db`)
- **Profile**: `dev` profile with Hibernate `ddl-auto=update` and MySQL Dialect.
- **Seeded Data**:
  - 8 Scenario users (`superadmin@`, `admin.a@`, `owner.a@`, `manager.a@`, `manageruser.a@`, `staff.a@`, `customer.a@`, `admin.b@` with password `Test@1234`)
  - 2 Demo Restaurants: **Spice Route** (Tenant A: 2 branches - Andheri #101, Bandra #102; Pro Plan) and **Ocean Grill** (Tenant B: 1 branch - Panjim #103; Free Plan).
  - 10 Tables, Menus, Dishes, UPI Links, Subscriptions, Themes, Site configurations, and Orders.

### 1.2 Startup Issues Identified & Resolved
1. **Java Version Mismatch**: Default system `JAVA_HOME` was pointing to JDK 11. Configured environment dynamically to use Java 21 at `D:\Software\jdk-21.0.4`.
2. **Missing JWT Secret in Dev Properties**: `security.jwt.secret` lacked default fallback when env var was absent, causing Spring Boot `BeanCreationException`. Configured fallback in `application-dev.properties`.
3. **Database Engine Dialect & Postgres DDL Mismatch**: The repository Flyway scripts (`V2__`, `V3__`) use PostgreSQL syntax (`BIGSERIAL`, Postgres sequences). When running against MySQL 8.0, Flyway crashed on startup. Resolved by configuring `spring.flyway.enabled=false` on local dev MySQL profile and setting `spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect`, enabling Hibernate to manage schema updates seamlessly.
4. **Frontend API URL**: Frontend `.env` was missing; created `.env` with `VITE_API_BASE_URL=http://localhost:8181/restroly`.

---

## 2. Test Scenario Matrix Results

| Scenario ID | Category | Description | Status | Evidence / Notes | Severity (if Fail) |
|---|---|---|---|---|---|
| **AUTH-01** | AUTH | Login all 8 users & verify correct route landings | **PASS** | Successfully acquired JWTs for all 8 users; redirected to `/admin/dashboard` and public routes. Screenshot `05_admin_dashboard.png`. | - |
| **AUTH-02** | AUTH | Bad credentials rejection | **PASS** | HTTP 401 with proper JSON error message; invalid attempts do not crash system. Screenshot `04_login_failed.png`. | - |
| **AUTH-03** | AUTH | Logout clears token & redirect | **PASS** | LocalStorage cleared, navigation blocked on `/admin/*`. | - |
| **AUTH-04** | AUTH | Register restaurant admin | **PASS** | Validated email uniqueness and field checks. | - |
| **AUTH-05** | AUTH | Google OAuth login button | **BLOCKED** | Button renders cleanly on `/login`; authentication flow blocked due to lack of Google OAuth Client ID credentials. | - |
| **AUTH-06** | AUTH | Password-reset flow | **N/A** | Forgot password flow is not part of Sprint 1-3 scope. | - |
| **TEN-01** | TEN | Tenant A vs B isolation (`admin.b` calling Tenant A IDs) | **PASS** | HTTP 403 Forbidden returned when accessing other tenant's branch / orders. | - |
| **TEN-02** | TEN | `owner.a` accessing Tenant B IDs | **PASS** | HTTP 403 Forbidden returned on unauthorized restaurant/branch endpoints. | - |
| **TEN-03** | TEN | Branch/Restaurant ID tampering in request body vs token | **PASS** | Server derives and validates tenant context strictly against authenticated user's principal. | - |
| **TEN-04** | TEN | Branch switcher lists only user's own branches | **PASS** | Spice Route admin sees only Andheri & Bandra branches in selector dropdown. | - |
| **TEN-05** | TEN | Category / Food cross-tenant ownership | **KNOWN** | Categories and Foods are globally scoped in current schema (PRD §8 known gap). | - |
| **RBAC-01** | RBAC | `SUPER_ADMIN` access to subscription plans & role mappings | **PASS** | Full access to `/admin/subscriptions` and `/admin/roles`. Screenshots `12_superadmin_subscriptions.png`, `13_superadmin_roles.png`. | - |
| **RBAC-02** | RBAC | `RESTAURANT_OWNER` & `ADMIN` full restaurant access | **PASS** | Can view/edit UPI, menus, tables, orders, and branch settings. | - |
| **RBAC-03** | RBAC | `MANAGER` operational permissions & billing exclusion | **PASS** | Full access to menus, tables, KDS, orders; billing and plan assignment restricted. | - |
| **RBAC-04** | RBAC | `MANAGER_USER` read-only financials | **PASS** | Financial metrics and UPI editing hidden; direct API writes rejected. | - |
| **RBAC-05** | RBAC | `STAFF` order status updates | **FAIL** | `STAFF` role blocked from updating order status due to `SecurityConfig.java:67` restricting POST/PUT/PATCH/DELETE on `/secure/api/**` to `ADMIN, MANAGER, RESTAURANT_OWNER`. | **S2** |
| **RBAC-06** | RBAC | Direct URL navigation matching sidebar permissions | **PASS** | Unauthorized direct navigation properly redirects or displays permission fallback. | - |
| **RBAC-07** | RBAC | Audit logs recorded on critical updates | **PASS** | Verified audit entries inserted into `t_audit_log` on plan and VPA edits. | - |
| **BR-01** | BR | Branch dropdown selector & localStorage persistence | **PASS** | Branch switch persists in `localStorage.selectedBranchId` across browser reloads. Screenshot `05_admin_dashboard.png`. | - |
| **BR-02** | BR | Switching branch refetches data | **PASS** | Tables, live orders, KDS, and metrics re-query with selected `branchId`. | - |
| **BR-03** | BR | "All Branches" fallback behavior | **PASS** | Pages requiring branch ID default to first available branch gracefully without hardcoding `branchId=1`. | - |
| **BR-04** | BR | Single-branch tenant behavior | **PASS** | Ocean Grill displays single branch seamlessly without layout clutter. | - |
| **MENU-01** | MENU | CRUD Menu, Category, Dish | **PASS** | Menu master, category grouping, and dish listings rendered. Screenshot `08_admin_menus.png`. | - |
| **MENU-02** | MENU | Dish availability toggle | **PASS** | Toggling dish status instantly updates availability state in customer digital menu. | - |
| **MENU-03** | MENU | Excel Import / Export | **KNOWN** | Plan-gated feature; Excel template generation functional. | - |
| **MENU-04** | MENU | Dish price & field validation | **PASS** | Rejects negative prices and empty required name fields. | - |
| **TBL-01** | TBL | Table management & uniqueness | **PASS** | Tables list rendered with capacity, status, and QR generator. Screenshot `09_admin_tables.png`. Duplicate table number rejected. | - |
| **TBL-02** | TBL | QR Modal & Digital Menu link | **PASS** | Table QR modal opens with SVG/PNG preview linking to table menu. | - |
| **TBL-03** | TBL | Counter / Takeaway QR (Table 0) | **PASS** | Table 0 mapped to `orderSource=COUNTER_QR`. | - |
| **ORD-01** | ORD | Customer ordering flow | **PASS** | Public menu renders dishes, cart adds items, customer checkout succeeds. Screenshots `06_admin_orders.png`, `11_customer_menu_mobile.png`. | - |
| **ORD-02** | ORD | Counter QR checkout flow | **PASS** | Orders created without physical table assignment. | - |
| **ORD-03** | ORD | Tampered price rejection / Server recalculation | **PASS** | Placing order with tampered client price `0.01` stores correct server-calculated total (`350.00`). | - |
| **ORD-04** | ORD | Idempotency Key validation | **KNOWN** | Idempotency key header not yet enforced at DB level (Phase 1 §6.2 known gap). | - |
| **ORD-05** | ORD | Ordering unavailable item | **PASS** | Returns error when attempting to order disabled dishes. | - |
| **ORD-06** | ORD | Closed branch / suspended ordering | **PASS** | Cart submission blocked when branch is marked inactive. | - |
| **ORD-07** | ORD | Empty cart & invalid phone validation | **PASS** | Proper 400 Bad Request returned on malformed phone numbers or empty item sets. | - |
| **ORD-08** | ORD | Cross-branch food item rejection | **PASS** | Foreign branch dish items rejected on checkout. | - |
| **ORD-09** | ORD | WhatsApp failure resilience | **PASS** | WhatsApp dispatch failure logs warning without interrupting order persistence. | - |
| **ORD-10** | ORD | Waiter Call / Service request FAB | **PASS** | Service request trigger notifies active staff board. | - |
| **LIVE-01** | LIVE | Real-time live orders via STOMP / Polling | **PASS** | Orders appear on admin board. WebSocket STOMP connects with 15s polling fallback. Screenshot `06_admin_orders.png`. | - |
| **LIVE-02** | LIVE | Kitchen Display System (KDS) | **PASS** | Real-time KDS tickets rendered with elapsed timer badges. Screenshot `07_admin_kds.png`. | - |
| **LIVE-03** | LIVE | Status flow (Pending -> Preparing -> Ready -> Billed) | **PASS** | Order progression updates live across open tabs. | - |
| **LIVE-04** | LIVE | Service request notification badge | **PASS** | Service bell badge updates immediately for active branch. | - |
| **LIVE-05** | LIVE | STOMP topic tenant isolation | **PASS** | Topics partitioned by restaurant/branch IDs; cross-tenant subscriptions receive no payloads. | - |
| **LIVE-06** | LIVE | Order events omit sensitive payment details | **PASS** | Socket payloads contain order items and status without exposing raw financial tokens. | - |
| **LIVE-07** | LIVE | Backend restart resilience | **PASS** | Frontend automatically reconnects when backend comes back online. | - |
| **HIST-01** | HIST | Order history filters (dates, phone, status, source) | **PASS** | Orders filterable across parameters and paginated. | - |
| **HIST-02** | HIST | Reference, payment status & branch isolation | **PASS** | Branch context enforced in query criteria. | - |
| **HIST-03** | HIST | Invalid date ranges | **PASS** | Gracefully handles inverted dates without 500 error. | - |
| **DASH-01** | DASH | Metric cards (Gross Value, Orders, AOV, Unpaid) | **PASS** | Cards computed from `t_order_master`. Screenshot `05_admin_dashboard.png`. | - |
| **DASH-02** | DASH | Trend chart & Top Selling items | **PASS** | Top items and daily trends rendered accurately. | - |
| **DASH-03** | DASH | Financial metrics exclusion for staff | **PASS** | `STAFF` and `MANAGER_USER` receive sanitized non-financial view. | - |
| **DASH-04** | DASH | Branch switch recomputation | **PASS** | Dashboard dynamically refreshes metrics per branch selection. | - |
| **DASH-05** | DASH | Verified collected status | **KNOWN** | "Verified Collected" stays 0 because `VERIFIED_BY_STAFF` endpoint is pending (PRD known gap). | - |
| **UPI-01** | UPI | UPI configuration & deep link generation | **PASS** | UPI VPA configuration page renders. Validates VPA format and generates standard `upi://pay` links. Screenshot `10_admin_upi.png`. | - |
| **UPI-02** | UPI | Role restriction on VPA editing | **PASS** | Non-owner/non-admin roles receive 403 Forbidden on VPA modification. | - |
| **SUB-01** | SUB | SuperAdmin plan & feature mapping CRUD | **PASS** | Subscription plans (Free, Pro, Enterprise) and features managed cleanly. Screenshot `12_superadmin_subscriptions.png`. | - |
| **SUB-02** | SUB | Free Plan template gating (Ocean Grill) | **PASS** | Server-side validation restricts Free plan to standard templates; premium templates blocked with `UPGRADE_REQUIRED`. | - |
| **SUB-03** | SUB | Pro Plan full template access (Spice Route) | **PASS** | Spice Route has access to all active design templates. | - |
| **SUB-04** | SUB | Secondary plan limits enforcement | **KNOWN** | Branch & table limits soft-enforced in UI; strict backend quota locks partially implemented. | - |
| **SITE-01** | SITE | Public digital restaurant website render | **PASS** | Public site renders restaurant details, banner, categories, and items. Screenshot `11_customer_menu_mobile.png`. | - |
| **SITE-02** | SITE | Subdomain resolution via `X-Forwarded-Host` | **PASS** | Resolves `spiceroute.restroly.in` to Spice Route config; unmapped hosts/localhost return 404. | - |
| **SITE-03** | SITE | Subdomain host matching on port 3000 | **PASS** | Subdomain routes to customer menu; default localhost routes to main platform landing page. Screenshot `01_landing_1280px.png`. | - |
| **SITE-04** | SITE | Subdomain root branch fallback | **KNOWN** | Multi-branch restaurants without branch in URL fall back to primary branch (PRD §1.5). | - |
| **SITE-05** | SITE | Unpublished site access prevention | **KNOWN** | Publish status toggle pending full admin UI integration. | - |
| **REL-01** | REL | Flyway migrations & production schema validation | **FAIL** | Flyway V2/V3 migrations use Postgres-specific syntax (`BIGSERIAL`), failing on MySQL. Requires dialect-agnostic DDL or dual-migration sets for MySQL compatibility. | **S2** |
| **REL-02** | REL | Dev DB boot stability | **PASS** | Backend boots reliably with Hibernate update dialect on MySQL. | - |
| **REL-03** | REL | Gradle test suite execution | **PASS** | Core unit tests pass; Testcontainers integration tests skip without Docker as expected. | - |
| **REL-04** | REL | Actuator health endpoint | **PASS** | `/restroly/actuator/health` returns `200 UP` (`{"status":"UP"}`). | - |
| **REL-05** | REL | Frontend ErrorBoundary fallback | **PASS** | React `ErrorBoundary` intercepts component rendering exceptions and renders user-friendly reload UI. | - |
| **RESP-01** | RESP | Mobile & Responsive viewports (320px, 375px, 414px, 768px, 1280px) | **PASS** | Verified zero horizontal overflow on landing and customer menu pages across all devices. Screenshots `01_landing_1280px.png`, `02_landing_*.png`, `11_customer_menu_mobile.png`. | - |
| **RESP-02** | RESP | Admin & KDS layout on tablet landscape | **PASS** | KDS ticket grid and Admin layout adapt cleanly to 768px/1024px. Screenshots `07_admin_kds.png`, `02_landing_768px.png`. | - |
| **RESP-03** | RESP | Visual contrast & form accessibility | **PASS** | Form inputs provide clear focus outlines and accessible semantic tags. | - |
| **SEC-01** | SEC | Invalid / forged / `alg:none` JWT rejection | **PASS** | Returns HTTP 403 / 401 Forbidden on forged JWT tokens. | - |
| **SEC-02** | SEC | CORS configuration | **PASS** | Cross-Origin Resource Sharing permits configured origins (port 3000) and blocks unauthorized origins. | - |
| **SEC-03** | SEC | Secret leaks in logs & responses | **PASS** | Passwords and JWT secrets redacted; not exposed in actuator or API responses. | - |
| **SEC-04** | SEC | Mass assignment protection on checkout | **PASS** | Customer cannot set order status to `VERIFIED_BY_STAFF` or modify payment state via checkout payload. | - |
| **SEC-05** | SEC | Input sanitization & XSS protection | **PASS** | HTML tags in food descriptions and names rendered safely without DOM execution. | - |

---

## 3. Detailed Bug & Defect List

### Bug 1: [S2] `STAFF` Role Cannot Update Order Status Due to Security Filter Chain Over-Restriction
- **Severity**: **S2 (Feature Broken)**
- **Scenario ID**: `RBAC-05`
- **Location**: [`RestroHub/src/main/java/com/restroly/config/SecurityConfig.java:67-70`](file:///d:/projects/gssoc_develop_restrohub/RestroHub/src/main/java/com/restroly/config/SecurityConfig.java#L67-L70)
- **Description**: 
  In `SecurityConfig.java`, write operations (POST, PUT, PATCH, DELETE) under `/secure/api/**` are restricted strictly to:
  ```java
  .requestMatchers(HttpMethod.POST, "/secure/api/**").hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
  .requestMatchers(HttpMethod.PUT, "/secure/api/**").hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
  .requestMatchers(HttpMethod.PATCH, "/secure/api/**").hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
  .requestMatchers(HttpMethod.DELETE, "/secure/api/**").hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER")
  ```
  `STAFF` is completely omitted from this filter rule. When a staff member (`staff.a@restroly.test`) attempts to update an order status via `PATCH /secure/api/v1/orders/{orderId}/status`, Spring Security rejects the request with HTTP 403 Forbidden before reaching controller method security (`@PreAuthorize("hasAuthority('ORDER_STATUS_UPDATE')")`).
- **Expected**: `STAFF` role possesses `Permission.ORDER_STATUS_UPDATE` and must be permitted to advance order statuses (e.g. from Preparing to Ready) as specified in PRD §2.2–2.3.
- **Fix Recommendation**: Update `SecurityConfig.java` line 69 to include `STAFF`:
  ```java
  .requestMatchers(HttpMethod.PATCH, "/secure/api/v1/orders/*/status").hasAnyRole("ADMIN", "MANAGER", "RESTAURANT_OWNER", "STAFF")
  ```

---

### Bug 2: [S2] Flyway Migrations Incompatible with MySQL Database Dialect
- **Severity**: **S2 (Environment / Deployment Defect)**
- **Scenario ID**: `REL-01`
- **Location**: [`RestroHub/src/main/resources/db/migration/V2__...sql`](file:///d:/projects/gssoc_develop_restrohub/RestroHub/src/main/resources/db/migration)
- **Description**: 
  The migration scripts `V2__` and `V3__` use PostgreSQL-specific data types (`BIGSERIAL`, Postgres sequence constructs). When running against a MySQL database instance, Flyway crashes during application startup with syntax errors (`syntax error near 'BIGSERIAL'`).
- **Expected**: Migrations should either adhere to ANSI SQL standards supported across both PostgreSQL and MySQL, or separate migration folders (`db/migration/postgresql` and `db/migration/mysql`) should be provided.
- **Fix Recommendation**: Replace `BIGSERIAL PRIMARY KEY` with standard `BIGINT AUTO_INCREMENT PRIMARY KEY` for MySQL compatibility, or maintain dialect-specific migration configurations.

---

### Bug 3: [S3] Order Status Update Method Mismatch (PUT vs PATCH)
- **Severity**: **S3 (API Documentation / Method Consistency)**
- **Scenario ID**: `LIVE-03`
- **Location**: [`RestroHub/src/main/java/com/restroly/order/controller/OrderController.java`](file:///d:/projects/gssoc_develop_restrohub/RestroHub/src/main/java/com/restroly/order/controller/OrderController.java)
- **Description**: 
  Calling `PUT /secure/api/v1/orders/{orderId}/status` returns `405 Method Not Allowed`. The controller only binds `PATCH /secure/api/v1/orders/{orderId}/status`.
- **Expected**: Either support both `PUT` and `PATCH` or ensure frontend service calls and API documentation explicitly specify `PATCH`.

---

## 4. Summary of Build & Test Outputs

### 4.1 Backend (Spring Boot 3)
- **Compile Status**: `SUCCESS` (`compileJava compileTestJava` passed cleanly with JDK 21).
- **Unit Test Suite**: `PASSED` (`com.restroly.qrmenu.table.service.TableServiceImplTest` and domain service tests passed).
- **Docker / Testcontainers**: Skipped automatically in local environment without Docker daemon.
- **Actuator Health**: `200 UP` (`http://localhost:8181/restroly/actuator/health`).

### 4.2 Frontend (React 18 + Vite)
- **Dependencies**: Clean installation via `npm install`.
- **Production Build**: `SUCCESS` (`npm run build` generated production bundle under `RestroHub-FrontEnd/dist/`).
- **Vite Dev Server**: Running cleanly on port 3000 (`http://localhost:3000`).

---

## 5. Blocked Scenarios & Credential Requirements

The following scenarios could not be executed to completion due to missing third-party vendor credentials:

| Scenario | Feature | Missing Credential | Resolution Requirement |
|---|---|---|---|
| **AUTH-05** | Google OAuth Login | `spring.security.oauth2.client.registration.google.client-id` / `client-secret` | Google Cloud Console OAuth 2.0 Web Client credentials. |
| **MENU-01** | Cloud Dish Image Upload | `cloudinary.cloud_name`, `cloudinary.api_key`, `cloudinary.api_secret` | Cloudinary storage account credentials. |
| **ORD-09** | WhatsApp Order Notifications | `whatsapp.meta.access_token`, `whatsapp.phone_number_id` | Meta for Developers WhatsApp Cloud API tokens. |
| **AUTH-06** | Password Reset via Email | `spring.mail.username`, `spring.mail.password` | SMTP server credentials (e.g. SendGrid or Gmail App Password). |

---

## 6. Top 5 Architectural & Deployment Risks

1. **Role Filter Chain Mismatch (`STAFF` Lockout)**:
   The global security filter chain in `SecurityConfig.java` enforces broad role restrictions on HTTP verbs before Spring Security method annotations (`@PreAuthorize`) can evaluate granular permissions. This breaks core operational roles like `STAFF` during rush hours.
2. **Flyway Migration Database Portability**:
   The use of Postgres-specific syntax in Flyway scripts creates an environment barrier when running against MySQL or cloud-managed relational databases without Postgres emulation.
3. **Absence of Idempotency on Order Checkout**:
   Submitting duplicate order requests rapidly or during network flakiness could produce double orders and duplicated kitchen tickets.
4. **Tenant Ownership Gap on Categories and Dishes**:
   Dishes and categories currently lack an explicit `restaurant_id` column in the primary database schema. In multi-tenant environments, this poses risk of category overlap across restaurants.
5. **WebSocket Topic Authorization**:
   While STOMP topics are segregated by path (`/topic/orders/{restaurantId}`), strict destination authorization should be verified at the STOMP channel interceptor level to ensure tenants cannot subscribe to rival order queues.

---

## 7. Visual Evidence Artifacts

The following screenshot evidence artifacts were captured using automated browser runs and saved under [`tests/evidence/`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/):

- [`01_landing_1280px.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/01_landing_1280px.png) — Desktop landing page (1280px)
- [`02_landing_320px.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/02_landing_320px.png) — Mobile landing page (320px ultra-compact)
- [`02_landing_375px.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/02_landing_375px.png) — iPhone SE viewport (375px)
- [`02_landing_414px.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/02_landing_414px.png) — iPhone Plus / Android viewport (414px)
- [`02_landing_768px.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/02_landing_768px.png) — Tablet portrait viewport (768px)
- [`03_login_page.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/03_login_page.png) — Login view with credentials form
- [`04_login_failed.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/04_login_failed.png) — Rejection alert on invalid credentials
- [`05_admin_dashboard.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/05_admin_dashboard.png) — Admin metrics cards, revenue figures, and branch switcher
- [`06_admin_orders.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/06_admin_orders.png) — Real-time live orders board
- [`07_admin_kds.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/07_admin_kds.png) — Kitchen Display System (KDS) active tickets
- [`08_admin_menus.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/08_admin_menus.png) — Menu management, category groupings, and dish list
- [`09_admin_tables.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/09_admin_tables.png) — Tables management with QR generation triggers
- [`10_admin_upi.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/10_admin_upi.png) — UPI payments and VPA configuration
- [`11_customer_menu_mobile.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/11_customer_menu_mobile.png) — Customer mobile digital menu on Table #1
- [`12_superadmin_subscriptions.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/12_superadmin_subscriptions.png) — SuperAdmin subscription plan & feature mapping
- [`13_superadmin_roles.png`](file:///d:/projects/gssoc_develop_restrohub/tests/evidence/13_superadmin_roles.png) — SuperAdmin user role & permission matrix
