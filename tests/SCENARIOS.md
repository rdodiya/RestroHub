# Restroly — Full Test Scenario Matrix

Logins (password `Test@1234`, use the email as username; created by `scripts/db/01_seed_users.sql`):
`superadmin@` · `admin.a@` · `owner.a@` · `manager.a@` · `manageruser.a@` · `staff.a@` · `customer.a@` · `admin.b@` + `restroly.test`.
Tenants: **Spice Route** (A: 2 branches Andheri/Bandra, Pro plan) · **Ocean Grill** (B: 1 branch Panjim, Free plan).
URLs: app `http://localhost:3000` · API `http://localhost:8181/restroly` · Swagger `/restroly/swagger-ui.html`.

Severity for failures: **S1** security/data leak/money wrong · **S2** feature broken · **S3** UX/visual.
Every scenario: record PASS/FAIL/BLOCKED/N-A/KNOWN, evidence (response/screenshot/SQL), severity.

## AUTH — Authentication
- AUTH-01 Login each of the 8 users → lands on the right page for the role; token stored.
- AUTH-02 Wrong password / unknown user → clear error, no token. Repeated failures don't crash.
- AUTH-03 Logout clears token; protected URL then redirects to login. Refresh-token flow keeps session.
- AUTH-04 Register new restaurant admin: duplicate email rejected; validation messages shown.
- AUTH-05 Google login button renders (cannot complete without real client ID — BLOCKED).
- AUTH-06 Password-reset flow if present (N/A if absent).

## TEN — Tenant isolation (S1 if broken)
- TEN-01 `admin.b` calling Branch A ids (orders, tables, menus, dashboard, UPI, service requests, history) → 403/404, never data.
- TEN-02 `owner.a` using Branch B ids → 403/404.
- TEN-03 Tamper `branchId`/`restaurantId` in body or query vs. token → rejected.
- TEN-04 Branch switcher lists only the user's own branches.
- TEN-05 Category/Food are NOT tenant-owned yet (known gap, PRD §8) — document actual behavior, mark KNOWN.

## RBAC — Roles (compare with `security/Permission.java` and PRD §2.3)
- RBAC-01 SUPER_ADMIN: plans/features, role linking, all restaurants.
- RBAC-02 RESTAURANT_OWNER / ADMIN: full access to own restaurant incl. UPI, subscriptions page, roles.
- RBAC-03 MANAGER: menus, tables, orders, KDS, dashboard; NO UPI VPA edit, NO billing/plan, NO role mgmt.
- RBAC-04 MANAGER_USER: read-only; sidebar hides financials/UPI/Subscriptions; direct URL to `/admin/upi-links` redirects; API writes → 403; responses contain no payment/UPI/revenue fields.
- RBAC-05 STAFF: only Orders, KDS, Profile; can move order status; no exports/menu edits; no revenue.
- RBAC-06 Every role: direct-URL access to each `/admin/*` route matches the sidebar (no hidden-but-reachable pages).
- RBAC-07 Audit log rows (`t_audit_log`) written on role change, plan change, UPI VPA change.

## BR — Branch context (Task 1.1)
- BR-01 Header dropdown lists branches + "All Branches"; selection persists after reload (localStorage `selectedBranchId`).
- BR-02 Switching branch refetches Tables, Live Orders, KDS, Menus, Dashboard, Order History; data differs per branch (Andheri vs Bandra).
- BR-03 "All Branches" falls back to first branch for pages needing one; no request hardcodes branchId=1.
- BR-04 Single-branch user: dropdown behaves sensibly.

## MENU — Menu / Category / Food
- MENU-01 CRUD menu, category, food; image upload (Cloudinary BLOCKED without creds).
- MENU-02 Availability toggle hides/marks item on public menu immediately.
- MENU-03 Excel import/export (valid, malformed, empty file); Free plan gating.
- MENU-04 Validation: negative price, empty name, oversize text.

## TBL — Tables & QR (Task 1.7)
- TBL-01 Create/edit/delete table; duplicate table number rejected.
- TBL-02 QR modal downloads PNG; QR URL opens the public menu bound to that table.
- TBL-03 "Counter / Takeaway QR" encodes `tableNumber=0`; ordering via it gives orderSource COUNTER_QR.

## ORD — Customer ordering & checkout (public site)
- ORD-01 Scan table QR → menu → add to cart → place order with name+phone → confirmation.
- ORD-02 Counter QR (table 0) flow.
- ORD-03 **Tampered price**: POST with price 0.01 / forged total → stored total equals server-calculated (S1 if not).
- ORD-04 **Idempotency**: same `Idempotency-Key` twice (and rapid double click) → exactly one order (PHASE1 §6.2; NOT IMPLEMENTED if absent, S2).
- ORD-05 Item made unavailable after page load → order rejected with clear message in UI.
- ORD-06 Closed branch / suspended restaurant → clear message, no crash.
- ORD-07 Empty cart, missing/invalid phone, huge/zero/negative quantity → validation errors.
- ORD-08 Order with another branch's food ids → rejected.
- ORD-09 WhatsApp send failure (no credentials) must NOT fail order creation.
- ORD-10 Service request (waiter call) FAB works; toast fits at 320px.

## LIVE — Orders, KDS, real-time (Tasks 2.1–2.3)
- LIVE-01 Place a customer order while admin Orders page is open → card appears without reload (STOMP), chime plays; with socket blocked, appears within ~15s (polling fallback).
- LIVE-02 KDS shows the same; indicator shows "Polling every 15s" when disconnected.
- LIVE-03 Status flow Pending→Preparing→Ready→Billed and Cancel; other open tabs update.
- LIVE-04 Service request → bell badge increments immediately + sound; only for the selected branch.
- LIVE-05 Topic isolation: a Restaurant B user subscribing to A's topic must not receive A's orders (S1 if data arrives; note STOMP topics may not be authorized — record result).
- LIVE-06 Events carry no amounts/UPI fields.
- LIVE-07 Kill backend mid-session → UI degrades gracefully, recovers on restart.

## HIST — Order history (Task 1.3)
- HIST-01 Filters singly and combined: dates, status, phone, paymentStatus, tableNumber, orderSource; pagination first/last/out-of-range.
- HIST-02 Reference/source/payment status shown in rows. Branch isolation holds.
- HIST-03 Invalid dates (end < start), odd phone input → handled.

## DASH — Dashboard (Task 1.2)
- DASH-01 Cards: Today's Orders, Gross Order Value, AOV, Pending, Active Tables, Unpaid, Verified Collected — compare each with SQL on `t_order_master`. Cancelled orders excluded from gross.
- DASH-02 Trend chart (Today/7D/30D) and Top Items match SQL.
- DASH-03 MANAGER_USER/STAFF: financial cards/chart absent (and API omits fields).
- DASH-04 Branch switch recomputes. Empty branch shows zeros, not NaN.
- DASH-05 KNOWN: no endpoint sets LINK_SENT/VERIFIED_BY_STAFF yet → verified collected stays 0.

## UPI — Payments
- UPI-01 Create/edit UPI link; invalid VPA rejected; test modal builds a `upi://pay` deeplink with server-computed amount.
- UPI-02 MANAGER and below cannot edit VPA (403); audit log row written for owner edit.

## SUB — Subscriptions (Task 1.4)
- SUB-01 SuperAdmin plan/feature CRUD and assignment.
- SUB-02 Free restaurant (Ocean Grill): only `modern_v2`, `luxury_v1` selectable; premium shows Upgrade badge; **direct API** save with another `templateKey` → 403 `UPGRADE_REQUIRED` (S1/S2 if accepted).
- SUB-03 Pro restaurant (Spice Route): all templates allowed.
- SUB-04 Other plan limits (branches, tables, staff, WhatsApp, KDS, Excel) — record which are enforced server-side and which are not.

## SITE — Public website & subdomain (Task 1.5)
- SITE-01 Path URL `/Restrohub/<slug>` renders site, sections, theme.
- SITE-02 `curl -H 'X-Forwarded-Host: spiceroute.restroly.in' $API/public/api/v1/sites/resolve/config` → Spice Route config; `localhost`, IP, `www` → 404; unknown slug → 404.
- SITE-03 Browser with hosts entry `127.0.0.1 spiceroute.restroly.in` (port 3000) → root shows the restaurant site; localhost root shows landing.
- SITE-04 Known gap: ordering from a subdomain root has no branch in URL — record result.
- SITE-05 Unpublished site not reachable (NOT IMPLEMENTED if absent).

## REL — Reliability & schema (Tasks 2.4, 2.6, 2.7)
- REL-01 Fresh DB: recreate `RestroHub_DB`, boot with `SPRING_PROFILES_ACTIVE=prod` (ddl-auto=validate) → Flyway V1–V4 run and app starts. FAIL = S1. Columns `payment_status`, `order_source` exist on orders.
- REL-02 Re-run on existing dev DB: Flyway does not fail.
- REL-03 `./gradlew test` green; `OrderFlowIntegrationTest` runs when Docker is available (else skipped).
- REL-04 `/actuator/health` reports db component.
- REL-05 Force a render error in a React page → ErrorBoundary fallback with Reload (admin and customer layouts), not a blank page.

## RESP — Responsive / UX / a11y (S3)
- RESP-01 Public menu + ordering drawer at 320, 360, 375, 414, 768, 1280 px: no horizontal scroll, usable drawer, tap targets ≥ 40px.
- RESP-02 Admin pages at tablet; KDS at tablet landscape.
- RESP-03 Dark/light theme; keyboard focus order in drawer/dialogs; `role="alert"` on errors.

## SEC — Security spot-checks
- SEC-01 Expired/forged/`alg:none` JWT → 401.
- SEC-02 CORS: disallowed origin gets no Access-Control-Allow-Origin.
- SEC-03 No secrets in responses/logs/`git ls-files` (`.env`, keys).
- SEC-04 Mass assignment: extra fields (role, restaurantId, paymentStatus=VERIFIED_BY_STAFF) in order create are ignored.
- SEC-05 Fuzz: 10k-char strings, unicode, HTML/script in names → escaped on render (XSS), no 500s.
