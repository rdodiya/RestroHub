# Implementation Plan

## Restroly (RestroHub) — Digital Menu & Restaurant Management Platform

> Based on the project `ReadMe.md` (branch `gssoc_develop`), and aligned with `PRD.md` and `TechStack.md`. Items marked *(assumption)* are inferred and should be confirmed by maintainers. Effort sizes: **S** = under 1 day, **M** = 1-3 days, **L** = 3-7 days, **XL** = over 1 week.

---

## 1. Objectives

1. Stabilize and harden the shipped MVP (QR menu, menu CRUD, UPI links, website, dashboard, auth, analytics, templates).
2. Deliver in-progress and near-term items: multi-branch, real-time order updates, onboarding and empty-state UX.
3. Introduce monetization: subscription tiers and plan-based RBAC.
4. Build ecosystem integrations: WhatsApp, aggregator sync, AI translation.
5. Keep the project contributor-friendly (GSSoC): small, well-scoped, labelled issues.

---

## 2. Current State Baseline

| Area | Status |
|---|---|
| Backend | Java 21, Spring Boot, Gradle, PostgreSQL; controller/service/repository layering; Swagger and Actuator |
| Frontend | React 18, Vite, Tailwind, React Router, Axios, Context API |
| Auth | JWT + Google OAuth |
| Features live | QR menu, menu management, UPI links, restaurant website, order dashboard, analytics, templates |
| In progress | Multi-branch support |
| Planned | Real-time orders, subscription tiers, Redis caching |
| Known gaps | Frontend ↔ backend integration incomplete in places; UPI service and analytics dashboard are open contribution areas; no documented test suite or CI *(assumption)* |

---

## 3. Phased Roadmap

```
Phase 0        Phase 1          Phase 2            Phase 3           Phase 4
Foundation  →  Core Hardening → Growth Features → Monetization   →  Ecosystem
(2 wks)        (3-4 wks)        (4-5 wks)          (4 wks)           (ongoing)
```

---

## Phase 0 — Foundation & Developer Experience (about 2 weeks)

**Goal:** make the repo safe and easy to change.

| # | Task | Size | Deliverable / Acceptance |
|---|---|---|---|
| 0.1 | Fix README inconsistencies (duplicate prerequisites, broken code fences, `READMe.md` vs `ReadMe.md`) | S | Clean README that renders correctly |
| 0.2 | Add `.env.example` for frontend and `application-dev.properties` template for backend | S | New contributor runs both apps following README only |
| 0.3 | Add `docker-compose.yml` (Postgres + backend + frontend) if missing or broken | M | `docker-compose up` yields working stack |
| 0.4 | Set up CI (GitHub Actions): `./gradlew build` and `npm run build` on every PR | M | PRs blocked on failing builds |
| 0.5 | Add lint/format: Checkstyle or Spotless (Java), ESLint + Prettier (JS) | M | Lint job in CI |
| 0.6 | Add PR template, issue templates (bug, feature, good-first-issue), CODEOWNERS | S | Templates appear on GitHub |
| 0.7 | Add DB migration tool (Flyway) and baseline schema | M | Schema versioned; `ddl-auto` not used in prod |
| 0.8 | Label and triage the open issues (difficulty, area, phase) | S | Every issue labelled |

**Exit criteria:** fresh clone to running app in under 15 minutes; CI green on `gssoc_develop`.

---

## Phase 1 — Core Hardening (3-4 weeks)

**Goal:** the MVP is reliable, secure and fully wired end to end.

### 1A. Backend

| # | Task | Size | Acceptance |
|---|---|---|---|
| 1.1 | Audit and finalize REST contract for Menus, Categories, Foods, Orders; publish accurate OpenAPI | M | Swagger matches behavior |
| 1.2 | Global exception handler + consistent error schema | M | All errors return `{code, message, details}` |
| 1.3 | Bean validation on all DTOs | M | Invalid input returns 400 with field errors |
| 1.4 | Security review: secured routes under `/secure/**`, ownership checks (owner can touch only own restaurant data) | L | Tests prove cross-tenant access is denied |
| 1.5 | CORS driven by `CORS_ALLOWED_ORIGINS` for dev and prod | S | No wildcard in prod |
| 1.6 | Refresh-token flow and expired-JWT handling | M | Expired token returns 401; refresh works |
| 1.7 | Unit tests (services) and integration tests (controllers + Testcontainers Postgres) | L | 70%+ coverage on service layer *(target)* |
| 1.8 | Pagination and sorting for list endpoints | M | `page`, `size`, `sort` supported |

### 1B. Frontend

| # | Task | Size | Acceptance |
|---|---|---|---|
| 1.9 | Complete frontend ↔ backend integration for menus, categories, foods, orders | L | No mock data left in production paths |
| 1.10 | Axios interceptors: attach JWT, handle 401/refresh, global error toast | M | Consistent auth handling |
| 1.11 | Responsive pass on public menu, website and admin dashboard | M | Verified at 360px, 768px, 1280px |
| 1.12 | Empty states, loading skeletons, error boundaries | M | Every list/page has all three states |
| 1.13 | Onboarding wizard (restaurant profile → first category → first item → QR) | L | New owner reaches live menu in under 15 minutes |
| 1.14 | Frontend tests: Vitest + React Testing Library for critical flows | M | Login, menu CRUD, checkout covered |

### 1C. Payments (UPI)

| # | Task | Size | Acceptance |
|---|---|---|---|
| 1.15 | `PaymentService` generating UPI URI (`upi://pay?pa=...&am=...&tn=...`) and QR | M | Opens GPay/PhonePe/Paytm/BHIM on mobile |
| 1.16 | Restaurant UPI ID setting with validation | S | Invalid VPA rejected |
| 1.17 | Payment status model: `PENDING`, `PAID_CLAIMED`, `CONFIRMED`, `FAILED` with owner manual confirmation | M | Owner can confirm payment on dashboard |

**Exit criteria:** an owner can register via Google, build a menu, print a QR; a diner can order and pay via UPI; owner sees and confirms the order. Build, lint and tests are green.

---

## Phase 2 — Growth Features (4-5 weeks)

### 2A. Real-time order updates

| # | Task | Size | Acceptance |
|---|---|---|---|
| 2.1 | Decision record: polling vs SSE vs WebSocket (recommend SSE or STOMP over WebSocket) | S | ADR merged |
| 2.2 | Backend event publishing on order create/status change | M | Events emitted per restaurant channel |
| 2.3 | Frontend live order board with sound/visual alert | M | New order appears in under 2 seconds |
| 2.4 | Polling fallback | S | Works if socket drops |

### 2B. Multi-branch support

| # | Task | Size | Acceptance |
|---|---|---|---|
| 2.5 | Data model: `Restaurant` 1—N `Branch`; menus, orders, QR codes scoped to branch | L | Migration + entity changes |
| 2.6 | Branch CRUD APIs + authorization (owner all, manager one branch) | L | RBAC tests pass |
| 2.7 | Branch switcher in admin UI; per-branch QR and website slug | M | Independent menus per branch |
| 2.8 | Optional menu cloning between branches | M | One-click copy |

### 2C. Analytics dashboard

| # | Task | Size | Acceptance |
|---|---|---|---|
| 2.9 | Aggregation endpoints: orders/day, revenue/day, top items, peak hours | M | Date-range filter |
| 2.10 | Dashboard charts (Recharts or Chart.js *(assumption)*) | M | Branch and date filters |
| 2.11 | Cache aggregate queries with Redis | M | Cache hit ratio observable |

### 2D. Templates & language

| # | Task | Size | Acceptance |
|---|---|---|---|
| 2.12 | Formalize template system (theme tokens: colors, fonts, layout) | M | Cafe, Dhaba, Fine Dining themes selectable |
| 2.13 | i18n framework on frontend (react-i18next) and per-language menu fields on backend | L | English + Hindi + Gujarati to start |

**Exit criteria:** live order board, multi-branch working end to end, analytics with filters, three templates, initial multi-language.

---

## Phase 3 — Monetization (about 4 weeks)

| # | Task | Size | Acceptance |
|---|---|---|---|
| 3.1 | Define plans (e.g., Free / Pro / Enterprise) and feature matrix; store in config/DB | S | Product sign-off |
| 3.2 | `Subscription` entity, plan limits (branches, items, analytics depth, templates) | L | Limits enforced server-side |
| 3.3 | Plan-based RBAC and feature flags (backend guard + frontend gating) | L | Locked features show upgrade prompt |
| 3.4 | Billing integration (Razorpay recommended for India *(assumption)*), webhooks, invoices | XL | Successful checkout activates plan |
| 3.5 | Trial, upgrade, downgrade, cancellation flows | L | State machine with tests |
| 3.6 | Admin (platform) console for tenants and plans | L | Platform admin can view/adjust subscriptions |

**Exit criteria:** paid plan can be purchased, enforced and cancelled without manual intervention.

---

## Phase 4 — Ecosystem (ongoing)

| # | Task | Size | Notes |
|---|---|---|---|
| 4.1 | WhatsApp Business API notifications (order received, ready, payment link) | L | Requires Meta approval and template messages |
| 4.2 | AI menu translation (25+ languages) with human-review step | L | LLM-backed service, cache results |
| 4.3 | Zomato/Swiggy aggregator sync | XL | Validate partner API access before committing |
| 4.4 | Public SEO improvements for restaurant websites (meta, sitemap, structured data) | M | Better discoverability |
| 4.5 | PWA/offline menu | M | Menu opens on poor networks |

---

## 4. Cross-Cutting Workstreams

| Stream | Ongoing activities |
|---|---|
| **Security** | Dependency scanning (Dependabot), secret scanning, OWASP top-10 review each phase, rate limiting on auth and order endpoints |
| **Quality** | Coverage gates in CI, contract tests for API, regression checklist per release |
| **Performance** | Index review, N+1 query checks, image optimization, Lighthouse budget for public pages |
| **Observability** | Structured logs, Actuator metrics, error tracking (e.g., Sentry *(assumption)*) |
| **Documentation** | Keep README, Swagger, `PRD.md`, `TechStack.md` in sync; ADRs in `/docs/adr` |
| **Community** | Weekly issue triage, "good first issue" pipeline, contributor recognition |

---

## 5. Suggested Milestones & Timeline

| Milestone | Target | Contents |
|---|---|---|
| **M0 — Ready to Contribute** | Week 2 | Phase 0 complete |
| **M1 — MVP Hardened** | Week 6 | Phase 1 complete |
| **M2 — v1.0 Public Release** | Week 11 | Phase 2 complete |
| **M3 — Monetization Beta** | Week 15 | Phase 3 complete |
| **M4 — Ecosystem** | Week 16+ | Phase 4 items as capacity allows |

Timeline assumes a small team plus GSSoC contributors; adjust after the first sprint's velocity is known.

---

## 6. Suggested Sprint Breakdown (2-week sprints)

| Sprint | Focus |
|---|---|
| S1 | Phase 0 |
| S2 | Backend hardening 1.1-1.6 |
| S3 | Frontend integration 1.9-1.12, tests 1.7/1.14 |
| S4 | UPI + onboarding 1.13, 1.15-1.17 |
| S5 | Real-time orders 2.1-2.4, analytics 2.9-2.11 |
| S6 | Multi-branch 2.5-2.8 |
| S7 | Templates + i18n 2.12-2.13, release prep for v1.0 |
| S8-S9 | Subscriptions and billing 3.1-3.6 |
| S10+ | Ecosystem items |

---

## 7. Definition of Done

A task is done when:
- [ ] Code merged to `gssoc_develop` via reviewed PR
- [ ] `./gradlew build` and `npm run build` pass; lint clean
- [ ] Unit/integration tests added or updated
- [ ] Swagger/OpenAPI and docs updated
- [ ] No secrets or `.env` committed
- [ ] Verified on mobile viewport (for UI work)
- [ ] Acceptance criteria demonstrated in the PR description

---

## 8. Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| UPI deep links give no payment confirmation | Wrong order state | Manual owner confirmation in v1; PSP webhook later |
| Multi-branch retrofits tenant scoping into existing data | Data leaks or migration bugs | Flyway migration, tenant-scoped repositories, cross-tenant tests |
| Aggregator APIs are partner-only | Roadmap blocked | Validate access early; keep as stretch |
| WhatsApp approval delays | Slipped notifications | Start template approval in Phase 2 |
| Contributor churn / inconsistent quality | Tech debt | CI gates, style guide, CODEOWNERS, PR checklist |
| Scope creep | Delays | Phase gates; changes go through PRD update |

---

## 9. Dependencies Map

```
Flyway + CI (0.x)
   └─► API contract & tests (1.1-1.8)
          ├─► Frontend integration (1.9-1.14)
          │      └─► Onboarding (1.13)
          ├─► UPI service (1.15-1.17)
          └─► Multi-branch (2.5-2.8) ─► Analytics per branch (2.9-2.10)
                                     └─► Subscriptions limits (3.2-3.3) ─► Billing (3.4)
Real-time orders (2.1-2.4) ─► WhatsApp notifications (4.1)
i18n (2.13) ─► AI translation (4.2)
```

---

## 10. Immediate Next Steps (first 7 days)

1. Fix README formatting issues and add `.env.example` files.
2. Add the CI workflow (backend + frontend builds).
3. Label all open issues by phase and difficulty.
4. Write the ADR for real-time transport and the payment-status model.
5. Break Phase 1 into GitHub issues with acceptance criteria and assign "good first issue" tags where applicable.
