# Product Requirements Document (PRD)

## Restroly (RestroHub) — Digital Menu & Restaurant Management Platform

| Field | Value |
|---|---|
| **Product** | Restroly (repo: `rdodiya/RestroHub`) |
| **Owner** | Raj Dodiya |
| **Status** | Active development (GSSoC 2026, branch `gssoc_develop`) |
| **License** | MIT |
| **Source** | Repository `ReadMe.md` (branch `gssoc_develop`) |
| **Doc version** | 1.0 |

> **Note on sourcing:** Everything below is derived from the project README. Items marked *(assumption)* are reasonable inferences that are not stated in the README and should be validated by the maintainers.

---

## 1. Overview

### 1.1 Product Summary
Restroly is a digital solution built for Indian restaurants, from street-side dhabas to fine dining. It lets a restaurant create a digital menu, accept UPI payments, manage orders and get an online presence with minimal effort and no technical expertise.

**Tagline:** *Empowering Indian Restaurants to Go Digital — Simple, Fast & Powerful.*

### 1.2 Problem Statement

| Pain point | Restroly's answer |
|---|---|
| Payment integration is complex | Direct UPI links and QR codes (GPay, PhonePe, Paytm, BHIM) |
| No digital presence | Auto-generated restaurant website with a live QR menu |
| Language barriers | Multi-language menus (25+ languages, roadmap) |
| Manual order tracking | Centralized order dashboard |
| Dependence on aggregators | Restaurant owns its menu and orders, no middleman |

### 1.3 Vision
Every Indian restaurant, regardless of size or technical skill, can run a branded digital storefront, take orders and payments, and understand its business, without depending on aggregators.

---

## 2. Goals & Non-Goals

### 2.1 Goals
1. Let a restaurant owner go live (menu + QR + website) in minutes.
2. Support India-native payments (UPI) without a payment-gateway integration burden.
3. Give owners a single place to view, manage and analyse orders.
4. Be approachable for open-source contributors (clear structure, good-first-issues).

### 2.2 Non-Goals (current phase)
- Building a consumer marketplace or discovery app that competes with Zomato/Swiggy.
- Delivery logistics / rider management *(assumption)*.
- Inventory, POS hardware or accounting integrations *(assumption)*.

---

## 3. Target Users & Personas

| Persona | Description | Key needs |
|---|---|---|
| **Restaurant Owner / Admin** | Runs one or more outlets; low-to-moderate tech skill | Easy menu setup, order visibility, payments, analytics |
| **Customer / Diner** | Scans a QR code at the table or visits the restaurant site | Fast, readable menu; simple ordering; pay via UPI |
| **Platform Admin** | Operates the Restroly platform *(assumption)* | Manage tenants, plans, support |
| **Open-source Contributor** | GSSoC and community developers | Clear setup, issues, contribution guidelines |

---

## 4. Scope & Feature Status

### 4.1 Available Now (per README)

| ID | Feature | Description |
|---|---|---|
| F-01 | QR Menu Generation | Scannable QR codes for contactless menu access |
| F-02 | Menu Management | Categories, items, images, descriptions |
| F-03 | UPI Payment Integration | Direct payment links for GPay, PhonePe, Paytm, BHIM |
| F-04 | Restaurant Website | Auto-generated landing page with live menu |
| F-05 | Order Dashboard | Centralized order management and tracking |
| F-06 | Authentication | JWT-based login for owners and admins (Google OAuth is used for login) |
| F-07 | Analytics | Orders, revenue, popular items |
| F-08 | Customizable Templates | Themes for Cafes, Dhabas, Fine Dining, etc. |

### 4.2 In Progress

| ID | Feature | Status |
|---|---|---|
| F-09 | Multi-branch support | Active development |
| F-10 | Real-time order updates | Planned |
| F-11 | Subscription tiers | Planned |

### 4.3 Roadmap

| Horizon | Goals |
|---|---|
| **Near term** | Empty-state UX polish, real-time order updates, onboarding improvements |
| **Mid term** | Subscription management, role-based access by plan |
| **Long term** | Zomato & Swiggy aggregator sync, WhatsApp notifications, AI menu translation (25+ languages) |

---

## 5. Functional Requirements

### 5.1 Authentication & Accounts
- **FR-AUTH-1:** Users can sign in with Google OAuth 2.0.
- **FR-AUTH-2:** The backend issues a JWT access token and a refresh token (configurable expirations; defaults 24h and 7d).
- **FR-AUTH-3:** Admin/owner endpoints (`/secure/...`) require a valid JWT.
- **FR-AUTH-4:** Role-based access (owner, admin), later extended by subscription plan.

### 5.2 Menu Management
- **FR-MENU-1:** Owners can create, read, update and delete menus.
- **FR-MENU-2:** Owners can create and list categories.
- **FR-MENU-3:** Owners can create, list, update and delete food items with name, description, price and image.
- **FR-MENU-4:** Menus can be filtered (e.g., a vegetarian filter is cited as a contribution example).
- **FR-MENU-5:** Menu edits appear on the public menu and website without a redeploy.

### 5.3 QR Menu & Restaurant Website
- **FR-QR-1:** The system generates a QR code that links to the restaurant's live menu.
- **FR-QR-2:** A public restaurant landing page is auto-generated from restaurant and menu data.
- **FR-QR-3:** Owners can choose a template/theme (Cafe, Dhaba, Fine Dining, others).
- **FR-QR-4:** Public pages are responsive and mobile-first, since diners use phones.

### 5.4 Ordering
- **FR-ORD-1:** Customers can place an order from the menu.
- **FR-ORD-2:** Owners can list all orders and view order details.
- **FR-ORD-3:** Order status can be tracked and updated (real-time updates are planned; polling is an interim option).

### 5.5 Payments (UPI)
- **FR-PAY-1:** The system generates UPI deep links / QR codes for an order amount and the restaurant's UPI ID.
- **FR-PAY-2:** Supported apps: Google Pay, PhonePe, Paytm, BHIM.
- **FR-PAY-3:** Payment status reconciliation is out of scope until a payment-verification approach is defined *(assumption)*.

### 5.6 Analytics
- **FR-AN-1:** Dashboard shows order count, revenue and popular items.
- **FR-AN-2:** Filter by date range *(assumption)*.

### 5.7 Multi-branch (in progress)
- **FR-BR-1:** One owner account can manage multiple branches, each with its own menu, orders and QR codes *(assumption on exact model)*.

### 5.8 Subscriptions (planned)
- **FR-SUB-1:** Plan tiers gate features (e.g., branches, analytics depth, templates).
- **FR-SUB-2:** Role-based access is tied to plan.

### 5.9 Integrations (long term)
- **FR-INT-1:** Sync menus/orders with Zomato and Swiggy.
- **FR-INT-2:** WhatsApp Business API notifications for order events.
- **FR-INT-3:** AI-based menu translation into 25+ languages.

---

## 6. API Surface (current, from README)

Base path: `http://localhost:8181/restroly` (Swagger UI at `/restroly/swagger-ui.html`).

| Resource | Endpoints |
|---|---|
| Menus | `GET/POST /secure/api/v1/menus`, `PUT/DELETE /secure/api/v1/menus/{id}` |
| Categories | `GET/POST /api/v1/categories` |
| Food items | `GET/POST /api/v1/foods`, `PUT/DELETE /api/v1/foods/{id}` |
| Orders | `GET/POST /api/v1/orders`, `GET /api/v1/orders/{id}` |
| Health | `GET /actuator/health` |

---

## 7. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Performance** | Public menu pages load fast on mid-range phones and 4G; API p95 under 500 ms for menu reads *(target, assumption)* |
| **Availability** | Health endpoint via Spring Actuator; suitable for container orchestration |
| **Security** | JWT auth, secrets only via environment variables (`JWT_SECRET`, `DB_PASSWORD`), no committed `.env`, CORS allow-list, input validation |
| **Scalability** | Stateless backend; caching layer (Redis) planned; horizontal scaling via containers |
| **Usability** | Non-technical owners can onboard without help; empty-state UX polish is a near-term goal |
| **Localization** | Menu translation in 25+ languages (roadmap); UI must support multi-language text |
| **Accessibility** | Responsive layout; readable typography and contrast *(assumption)* |
| **Maintainability** | Layered backend (controller, service, repository), thin controllers, constructor injection, Javadoc on public service methods |
| **Observability** | Logback configuration, Actuator health endpoint |
| **Compliance** | MIT-licensed; handle customer data responsibly under Indian data-protection norms *(assumption)* |

---

## 8. Success Metrics *(proposed)*

| Metric | Target idea |
|---|---|
| Restaurants onboarded | Growth per month |
| Time to first live menu | Under 15 minutes |
| QR scans per restaurant per week | Engagement indicator |
| Orders placed through platform | Adoption of ordering |
| UPI payment completion rate | Payment UX quality |
| Contributor health | Merged PRs, open good-first-issues resolved (GSSoC) |

---

## 9. Release Plan

| Phase | Focus | Contents |
|---|---|---|
| **MVP (shipped)** | Core digital menu | QR menu, menu CRUD, UPI links, website, dashboard, auth, analytics, templates |
| **Phase 2 (near term)** | Reliability & UX | Real-time order updates, empty-state polish, onboarding, multi-branch |
| **Phase 3 (mid term)** | Monetization | Subscription tiers, plan-based RBAC |
| **Phase 4 (long term)** | Ecosystem | Aggregator sync, WhatsApp notifications, AI translation |

---

## 10. Open Contribution Areas

| Area | Difficulty | Impact |
|---|---|---|
| Frontend ↔ Backend API integration | Low | High |
| Responsive UI improvements | Low | High |
| UPI Payment Service | Medium | High |
| WhatsApp Business API integration | Medium | High |
| Analytics Dashboard | Medium | Medium |
| Menu Templates (Cafe, Dhaba, Fine Dining) | Easy | Medium |
| Multi-language support | Easy | Medium |
| Aggregator Sync (Zomato / Swiggy) | Hard | High |

---

## 11. Risks & Dependencies

| Risk / Dependency | Mitigation |
|---|---|
| UPI deep links do not confirm payment status | Define a verification/reconciliation flow (manual confirm or PSP webhook) |
| Zomato/Swiggy APIs may be restricted or partner-only | Treat as long-term; validate API access early |
| WhatsApp Business API needs approval and costs | Start with a template-message pilot |
| Google OAuth misconfiguration (client ID mismatch between FE/BE) | Document setup; validate in CI/health checks |
| Contributor-driven code quality variance | PR checklist, conventional commits, code style guide |
| Multi-tenancy/data isolation errors in multi-branch work | Explicit tenant scoping in queries and tests |

---

## 12. Open Questions
1. Is Restroly single-tenant per deployment or multi-tenant SaaS?
2. How is UPI payment confirmed (manual, webhook, or PSP)?
3. Which subscription tiers and price points are planned?
4. Should customers need an account, or is ordering guest-based?
5. What is the exact data model for branches?

---

## 13. Appendix

- **Repo:** https://github.com/rdodiya/RestroHub (contribute on `gssoc_develop`)
- **Contact:** Raj Dodiya, rdodiya2601@gmail.com
- **Contribution rules:** Conventional Commits; branches `feature/`, `fix/`, `docs/`, `refactor/`, `test/`; PRs target `gssoc_develop`
