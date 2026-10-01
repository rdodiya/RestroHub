# Restroly / RestroHub — Phase 1 (P0 + P1) Implementation Prompt

**How to use this file:** Paste this entire document as a single task/prompt into Claude Code, Antigravity, or an equivalent repo-aware coding agent, run from the root of the `RestroHub` monorepo (the folder containing both `RestroHub/` and `RestroHub-FrontEnd/`). The agent should have file read/write and shell access to the repo. This prompt is self-contained — it does not depend on this chat.

**Required tooling (Claude Code):** the `graphify` skill (`.claude/skills/graphify`), the `ponytail`, `superpowers` and `agentmemory` plugins (§0.1), and the `fullstack-dev-skills:spring-boot-engineer` and `fullstack-dev-skills:react-expert` skills (§0.2). If a tool is missing, say so in your final summary and continue without it. Never block on it.

---

## 0. Role & Mission

You are acting as a senior full-stack engineer and technical writer embedded in the `rdodiya/RestroHub` (product name **Restroly**) codebase, working on branch `gssoc_develop`. Your mission for this task is to implement **Phase 1** of the roadmap — the **P0 (launch-blocker)** and **P1 (first-paid-release)** items identified in `PERPLEXITY_ANALYSIS.md` — across both `RestroHub/` (Spring Boot backend) and `RestroHub-FrontEnd/` (React frontend), and to keep `PRD.md`, `ImplementationPlan.md`, and `agent/Schema.md` in sync (all under `agent/`) with what you actually build.

You are not just writing code. You are also the maintainer of the product's own documentation. Every functional change you make must be reflected in these docs before you consider the task done.

---

## 0.1 Agent Toolkit: graphify, agentmemory, superpowers, ponytail

Use these four tools throughout the task. Each one has a single job:

| Tool | Job | When |
|---|---|---|
| **graphify** | Map of the codebase (`graphify-out/graph.json`, `GRAPH_REPORT.md`) | Before reading or changing code. Refresh it after each milestone. |
| **agentmemory** | Memory that persists across sessions: decisions, gotchas, progress | At the start of a session, at every decision, and at the end of each milestone |
| **superpowers** | Process: plan → TDD → execute → verify → review | Every milestone |
| **ponytail** | Keeps each change as small as it can be | Every design and code decision, and before each PR |

### graphify: orient before you read
- `graphify-out/graph.json` already exists. **Run `graphify query "<question>"` before grepping or opening source files.** Use `graphify explain "<Node>"` for a single class and `graphify path "<A>" "<B>"` to trace a flow. Open raw files only after the graph has shown you where to look, or when you need to edit or debug specific lines.
- Start with `graphify-out/GRAPH_REPORT.md`. The most-connected nodes are `Branch`, `OrderResponse`, `ResourceNotFoundException`, `Food`, `Tables`, `Category` and `Menu`. `Branch` and `Restaurant` link the most clusters, so they are where tenant scoping has to hold.
- After each milestone, run `/graphify . --update`. It re-extracts only the files that changed. Then check that any new nodes (for example `AccessGuard` or `AuditLogEntry`) are linked where you expect.
- Include the "query graphify first" rule in every subagent prompt that involves exploring code.

### agentmemory: don't repeat work across sessions
- **Session start:** run `agentmemory:handoff`, or use `agentmemory:recall` with `"phase1"`, to pick up where the last session stopped. Check which milestone is in progress and which decisions are already settled.
- **Save as you go:** use `agentmemory:remember` for each settled decision. Examples: the permission-mapping location, the idempotency-key storage, the default plan limits, the order reference format. Also save each milestone when it completes. Tag entries `phase1`, plus the milestone (`m6.1`…`m6.7`).
- **Corrections:** when the owner or a reviewer corrects your approach, record it with `agentmemory:lesson` so it comes back before similar work.
- Memory does not replace the docs. Anything the owner must see still goes in `PRD.md` §8.

### superpowers: the process for each milestone
For each milestone in §6, run this sequence:
1. `superpowers:using-git-worktrees`: open an isolated worktree or branch off `gssoc_develop`, one per milestone (e.g. `feature/phase1-6.1-tenant-rbac`).
2. `superpowers:brainstorming`: only for milestones with open design choices (§6.1 guard design, §6.3 payment-status model, §6.5 plan limits). Skip it for mechanical ones.
3. `superpowers:writing-plans`: write a short plan for the milestone, scoped by what graphify showed you.
4. `superpowers:test-driven-development`: write the failing test first. This is mandatory for tenant isolation, RBAC, idempotency, server-side pricing, payment-status transitions and WhatsApp-failure handling.
5. `superpowers:executing-plans` or `superpowers:subagent-driven-development`: use subagents only for independent work (e.g. a backend endpoint and its frontend view). Use `superpowers:dispatching-parallel-agents` when the tasks don't share files.
6. `superpowers:systematic-debugging`: use it for any failing build or test. Fix the root cause, not the symptom.
7. `superpowers:verification-before-completion`: run `./gradlew build`, `npm run build` and the new tests, and check the acceptance criteria, before claiming anything is done.
8. `superpowers:requesting-code-review` → `superpowers:receiving-code-review` → `superpowers:finishing-a-development-branch`.

### ponytail: smallest change that fully meets the criteria
- Ponytail is active for all code. Before writing anything, check in this order: is this already in the codebase? Then the stdlib or Spring/JPA? Then a dependency that's already installed? Only then write new code.
- Reuse existing pieces: `GenericMapper`, `ResourceNotFoundException`/`BusinessException`, `PageResponseDTO`, `BranchContext`, the existing SSE notification services, the `services/common/api.js` layer. Don't build parallel versions of them.
- **Ponytail never cuts** tenant scoping, server-side authorization, server-side pricing, input validation, transactional integrity, audit writes or tests. These requirements are fixed. Ponytail only limits how much code you write to meet them.
- Mark deliberate shortcuts with a `ponytail:` comment that states the limit and the upgrade path. Examples: the bounded single WhatsApp retry, check-on-access plan expiry, the polling stand-in for real-time updates.
- Before each PR, run `ponytail:ponytail-review` on the diff. At the end of the task, run `ponytail:ponytail-debt` and copy the ledger into the final summary (§9).

---

## 0.2 Stack Skills: spring-boot-engineer and react-expert

Load `fullstack-dev-skills:spring-boot-engineer` before any backend work and `fullstack-dev-skills:react-expert` before any frontend work. These skills are written for a generic stack. **This repo's actual stack and `CLAUDE.md` take precedence.** Use the skills for patterns and review discipline, and apply the adjustments below. Do not migrate the stack to match a skill's defaults.

### spring-boot-engineer (backend: `RestroHub/`, Spring Boot 3.2.6, Java 21, Gradle)

Use the skill's workflow (analyze → design → implement → secure → test → health check). Load its references only when a milestone needs them:

| Skill reference | Use it for |
|---|---|
| `references/security.md` | §6.1 access guard / `PermissionEvaluator`, `@PreAuthorize` role matrix, JWT filter changes; §6.5 entitlement checks |
| `references/data.md` | §6.1 tenant-scoped repository queries; §6.2 transactional order creation and price snapshot; §6.4 paginated history with `Specification`s (repos already extend `JpaSpecificationExecutor`) and projections for role-aware DTOs |
| `references/web.md` | Validation on every new or changed endpoint; error mapping for new business errors (unavailable item, branch closed, upgrade required, duplicate submission) |
| `references/testing.md` | `@WebMvcTest` slices for controllers, `@DataJpaTest` for tenant-scoped queries, `@SpringBootTest` integration tests for cross-tenant 403/404 and WhatsApp-failure isolation |

Apply these repo rules where they differ from the skill's defaults:
- **Build tool:** run `./gradlew test` / `./gradlew build` from `RestroHub/`, never `./mvnw`. Run `./gradlew spotlessApply` before committing, because the pre-commit hook runs `spotlessCheck`.
- **Constructor injection:** the existing convention is Lombok `@RequiredArgsConstructor` with `private final` fields, and the skill's rule is satisfied by it. Field `@Autowired` still exists in `PublicOrderController`, `OrderServiceImpl`, `DashboardController`, `AuthController`, `ExcelFeatureController`, `EmailServiceImpl`, both subscription controllers and `SubscriptionServiceImpl`. Convert it **only in classes you are already changing for a milestone**; don't open a repo-wide refactor.
- **Errors:** extend the existing `exception/GlobalExceptionHandler` (`buildErrorResponse`) and the existing `BusinessException` / `ResourceNotFoundException` / `ResourceAlreadyExistsException` hierarchy. Keep the response shape the frontend already parses (`common/dto/ApiResponse`). Don't introduce a parallel `ProblemDetail` format.
- **DTOs and mapping:** put each DTO in its feature package (`<feature>/dto`) and map with `GenericMapper` / MapStruct. Never return entities from controllers. Use records only where a module already uses them; otherwise follow the Lombok `@Data`/`@Builder` style around it.
- **Config:** new settings (WhatsApp retry delay, plan limit defaults, idempotency-key TTL) go in a `@ConfigurationProperties` class with environment-variable overrides. Never put secrets in `application*.properties`.
- **Schema:** every entity change needs a new Flyway `V{n}__*.sql` migration. Prod runs with `ddl-auto=validate`, so a missing migration breaks the deploy.
- **Tests:** Testcontainers is **not** a dependency yet, and the `test` profile points at H2, which is also not a dependency. For §6.1 cross-tenant integration tests, add `org.testcontainers:postgresql` + `junit-jupiter` (test scope only, and give the reason in the PR). If that isn't possible, use a local PostgreSQL. `src/main/java/.../auth/controller/AuthControllerTest.java` is in the wrong source set: move it to `src/test/java` if you touch auth.
- **Health:** §6.7 completes the skill's "validate `/actuator/health` returns `UP`" step. Confirm that the `db` component appears in the health details.

### react-expert (frontend: `RestroHub-FrontEnd/`, React 18, Vite, JS/JSX, Tailwind)

Use the skill's workflow (analyze → choose patterns → implement → validate → optimize → test) and its `hooks-patterns.md`, `state-management.md` and `performance.md` references. Apply these repo rules where they differ from the skill's defaults:
- **No TypeScript, no React 19, no Server Components or Next.js.** The app is React 18 + Vite in `.jsx`. Skip the skill's `tsc --noEmit` step. Validate with `npm run lint`, `npm run format:check` and `npm run build` instead. Don't use `use()`, `useActionState` or RSC patterns. Forms keep using the installed Formik + Yup.
- **Data fetching:** all calls go through `services/common/api.js` / `services/public/ApiService.js`. Don't add TanStack Query, SWR or Zustand for Phase 1; Context plus small custom hooks are enough. If a new dependency is clearly justified, give the reason in the PR.
- **State:** the branch switcher (§6.4) uses the existing `context/BranchContext.jsx` and passes `branchId` on every admin call. Diner cart state stays in `CustomerOrderContext`. Follow `CLAUDE.md`'s two-level prop-drilling limit.
- **Skill rules that DO apply:** stable `key`s (never the array index for orders or menu items), cleanup in every effect (polling intervals for KDS/orders, STOMP/SockJS subscriptions), semantic HTML and ARIA on new forms and dialogs (checkout consent checkbox, payment-verify buttons, onboarding checklist), no direct state mutation, and memoize callbacks only where a memoized child needs it.
- **Error boundaries:** none exist yet. Add **one** top-level `ErrorBoundary` around the admin and customer layouts as part of §6.2/§6.3, so that a failure in the KDS or checkout screen shows a fallback instead of a blank page. Don't wrap every component.
- **Tests:** there is no frontend test runner yet. The skill's React Testing Library step is optional for Phase 1. If you add one, use Vitest + RTL (they fit Vite), limit tests to checkout error handling (§6.2) and payment-status controls (§6.3), and note the new dev dependencies in the PR. Otherwise verify manually at 360px, tablet and desktop widths as §2 requires.
- **Styling:** Tailwind utility classes, mobile-first, following the tokens and patterns in `agent/frontend-design.md`.

---

## 1. Required Reading (do this before writing any code)

**Step 0, before any reading:** run `agentmemory:handoff` (or `agentmemory:recall "phase1"`) to restore earlier progress, then read `graphify-out/GRAPH_REPORT.md` to get an overview of the code. Product and planning docs are in `agent/`. `ReadMe.md`, `CLAUDE.md` and `AGENTS.md` are at the repo root.

Read, in this order, and hold their contents in working context for the whole task:

1. `ReadMe.md` (or `README.md`) — product overview and setup.
2. `agent/project-flow.txt` — the owner's original, authoritative product spec. Where anything conflicts, this file wins unless a later document explicitly supersedes it with the owner's own words.
3. `agent/PRD.md` — current product requirements (v2.0), including the **Architectural & API Surface Mapping** table (§6) and the **Outstanding Tasks (@Todo)** list (§7). Treat the controller/file paths listed there as accurate starting points, but **verify each one still exists and matches its described responsibility** before relying on it — the codebase may have moved on. Verify with `graphify explain "<ControllerName>"`, not by opening every file.
4. `agent/ImplementationPlan.md` — current phased plan and the **Current State Baseline & Gap Analysis** table (§2).
5. `agent/PERPLEXITY_ANALYSIS.md` — third-party audit of the PRD. Its **"Revised development priority"** section (P0 / P1 / P2 / P3, near the end of the file) is the priority list this task implements. Its earlier sections (numbered 1–6 and lettered A–J) give the *detail* behind each P0/P1 item — read those sections for the specifics, not just the priority list.
6. `CLAUDE.md` (if present) — repo conventions, branch/commit rules, layering rules. Follow it.
7. `agent/Schema.md` (a copy also exists at `RestroHub/Schema.md`; keep the two in sync or replace the backend copy with a link) and the Flyway migration folder `RestroHub/src/main/resources/db/migration/` (currently `V1__baseline.sql` only). These are your source of truth for the real database shape. You update `agent/Schema.md` as part of this task (see §7); don't create a separate `SCHEMA.md`.

Do not skip step 5 — the acceptance criteria in this prompt assume you have the full detail from `PERPLEXITY_ANALYSIS.md`, not just the one-line summaries below.

---

## 2. Ground Rules (non-negotiable)

1. **Branch discipline.** Work on a new branch off `gssoc_develop` (e.g. `feature/phase1-p0-p1`), or a set of smaller feature branches per milestone if you prefer smaller PRs. Never commit to `main`.
2. **Multi-tenant safety is the highest priority.** Every new or touched query, endpoint, or service method must be scoped so that a user linked to Restaurant A can never read, filter into, or mutate data belonging to Restaurant B or a branch they don't have access to. If you are not sure a query is tenant-scoped, add the scoping rather than assume it's fine.
3. **Backend is the source of truth for authorization and money.** Never trust a client-supplied `branchId`, `restaurantId`, order total, or role claim. Recompute prices server-side from the current menu. Validate branch/restaurant membership server-side on every request, even if the frontend already filters the UI.
4. **Don't silently redesign the product.** Some P0/P1 items (see §6.3, the order-status model) touch decisions the owner has not finalized. Where this prompt tells you to **flag** something instead of **implement** it, do exactly that — add it to `PRD.md` §8 (Open Questions) or a new "Decisions Needed" section, and do not hard-code an irreversible choice on the owner's behalf.
5. **No breaking schema changes without a migration.** If Flyway is already set up, add versioned migrations (`V{n}__description.sql`) for every schema change — never edit a migration that has already been merged. If Flyway is not set up yet, set it up as part of this task (§6.1's tenant/RBAC work and the new tables in §6.3–§6.6 need it) rather than relying on `ddl-auto=update`.
6. **Preserve what already works.** Per `ImplementationPlan.md` §2, authentication, menu CRUD, Excel import/export, UPI link generation, table/QR generation, WhatsApp order confirmation, and the website theme/content editor are already built and working. Do not rewrite these wholesale — extend and harden them.
7. **No secrets in code or docs.** Follow existing `.env` / environment-variable conventions for any new config (WhatsApp tokens, Razorpay keys if touched, etc.).
8. **Every functional PR-worthy change ships with:**
   - Backend: unit tests for new service logic; integration test for new/changed endpoints where tenant isolation or RBAC is involved.
   - Frontend: the change works and is verified at mobile (360px), tablet, and desktop widths for any diner-facing or KDS screen.
   - Docs: the relevant PRD/ImplementationPlan/SCHEMA sections updated in the same change, not deferred.
9. **Commit style:** Conventional Commits (`feat(orders): ...`, `fix(auth): ...`, `docs(prd): ...`), consistent with the rest of the repo.

---

## 3. Scope of This Task: Phase 1 = P0 + P1

Work through the milestones in §6 in order. Each milestone maps to one or more P0/P1 items from `PERPLEXITY_ANALYSIS.md`'s priority list, cross-referenced against the existing `@Todo-1` through `@Todo-6` items in `PRD.md` §7 so you don't duplicate work.

**Explicitly out of scope for this task** (leave these for later phases; do not start them even if you see related code):
- Razorpay/automated subscription billing (P2/P3) — Phase 1 only needs *manual* plan activation (§6.5).
- Aggregator sync (Zomato/Swiggy), full POS, inventory/purchasing, loyalty, AI translation (P3).
- Menu variants/add-ons/combos, multi-language menu content (P2) — you may note these as follow-ups in `ImplementationPlan.md` but don't build them now.
- WebSocket/SSE real-time transport — if `ImplementationPlan.md` §2.1 (Phase 2, Sprint 3) covers this already as a separate initiative, leave it there. Polling is an acceptable interim mechanism for anything Phase 1 needs to feel "live."

---

## 4. Priority Mapping (P0/P1 → Milestones)

| Perplexity item | Milestone below |
|---|---|
| Tenant isolation | §6.1 |
| Backend RBAC | §6.1 |
| Checkout validation | §6.2 |
| Order persistence and status flow | §6.2, §6.3 |
| KDS (harden existing) | §6.3 |
| UPI configuration and payment verification | §6.3 |
| WhatsApp failure handling | §6.3 |
| Branch context | §6.4 |
| Order history | §6.4 |
| Basic subscription enforcement | §6.5 |
| Database backups and logs | §6.7 |
| Dashboard KPI APIs | §6.4 |
| Website publishing | §6.6 |
| QR download and printing | Verify only — already done per `ImplementationPlan.md`; fix if broken |
| Menu availability | Verify only — already done; fix if broken |
| Staff permissions | §6.1 |
| Basic analytics | §6.4 |
| Restaurant onboarding | §6.6 |
| Terms, privacy, and consent | §6.6 |
| Billing activation process | §6.5 |

---

## 5. Actors & Permission Model to Implement

Use this as the working permission model for §6.1. It resolves the "Manager vs. Manager/User" ambiguity that both `PRD.md` §8.1 and `PERPLEXITY_ANALYSIS.md` §6 flag as unresolved, by adopting Perplexity's recommended model **as a default**, implemented so it can be adjusted later without a rewrite (e.g., role→permission mapping in one place, not scattered `if` checks).

| Role | Recommended access (implement this; flag as confirmed-with-owner in PRD once you do) |
|---|---|
| Super Admin | Platform-wide: plans, features, users, restaurant↔branch↔role assignments, restaurant suspension |
| Restaurant Admin | Full access to their assigned restaurant and its branches |
| Manager | Operations, menus, tables, KDS, order history — **no** billing/plan ownership, **no** UPI VPA editing |
| Manager/User | Read-only on menus, tables, orders, KDS — **no** payments, **no** financial/revenue data |
| Staff | View operational (live) orders and update only the statuses they're allowed to move to (see §6.3) — no exports, no settings, no menu edits, no revenue figures |

**Action required:** After implementing this, update `PRD.md` §2.2 and §8 to mark the Manager/Manager-User ambiguity as "Resolved (default model implemented, pending final owner sign-off)" — do not mark it as fully resolved/closed, since the owner hasn't confirmed it.

---

## 6. Detailed Milestones

**Steps for every milestone:** recall from memory → orient with graphify → load `spring-boot-engineer` and/or `react-expert` for the layers the milestone touches (§0.2) → plan → TDD → implement (ponytail) → verify → run `/graphify . --update` → `ponytail:ponytail-review` → code review → `agentmemory:remember` the result → finish the branch. The superpowers skills for each step are listed in §0.1.

**Starting graphify queries for each milestone** (adjust the wording to the graph's own terms if a query comes back thin):

| Milestone | Start with | Memory tag |
|---|---|---|
| §6.1 Tenant & RBAC | `graphify query "which services and repositories filter by restaurantId or branchId"`, `graphify explain "SecurityConfig"`, `graphify explain "JwtAuthenticationFilter"`, `graphify path "Branch" "Restaurant"` | `m6.1` |
| §6.2 Checkout | `graphify explain "PublicOrderController"`, `graphify path "PublicOrderController" "Food"`, `graphify explain "OrderBuilder"` | `m6.2` |
| §6.3 Status/Payment/WhatsApp | `graphify explain "OrderStatus"`, `graphify explain "PaymentStatus"`, `graphify path "OrderController" "WhatsappServiceImpl"`, `graphify explain "UpiLinkController"` | `m6.3` |
| §6.4 Branch/History/Dashboard | `graphify explain "BranchContext"`, `graphify explain "DashboardServiceImpl"`, `graphify query "order repository queries by branch and date"` | `m6.4` |
| §6.5 Subscriptions | `graphify query "subscription plan feature mapping enforcement"`, `graphify explain "RestaurantSubscription"`, `graphify explain "ThemeSelector"` | `m6.5` |
| §6.6 Onboarding/Website | `graphify explain "AuthController"`, `graphify explain "RoleController"`, `graphify explain "SiteConfig"`, `graphify explain "PublicSiteController"` | `m6.6` |
| §6.7 Ops | `graphify query "logging in order and notification services"`, `graphify explain "DatabaseInitializer"` | `m6.7` |

### 6.1 Multi-Tenant Isolation & Backend RBAC *(P0)*

**Goal:** No endpoint can be used to read or write another restaurant's/branch's data, regardless of role, and role checks live on the backend, not just in the React sidebar (`AdminRoute`).

Tasks:
1. **Audit pass:** For every controller listed in `PRD.md` §6 (Menu, Category, Food, Branch, Table, Order, Excel, UPI, Dashboard, Notifications, ServiceRequest, Role, Subscription controllers), confirm the service/repository layer filters by the authenticated user's `restaurantId` (and `branchId` where applicable), not just by an ID passed in the URL/body.
2. Add a reusable authorization mechanism (e.g., a `@PreAuthorize` SpEL expression backed by a custom `PermissionEvaluator`, or a service-layer `TenantGuard`/`AccessGuard` helper) that checks, for every request touching restaurant/branch-scoped data:
   - The authenticated user is linked to the restaurant being accessed.
   - If a `branchId` is involved, the user has access to that specific branch (Admin/Manager: assigned branches; Manager/User & Staff: same, read-scoped).
   - The resource being mutated (order, table, food item, etc.) actually belongs to that restaurant/branch — not just that *some* restaurant/branch of the user's matches.
3. Apply the role matrix from §5: add `@PreAuthorize` (or equivalent) on every write endpoint per the matrix, and filter list/read endpoints so Manager/User and Staff never receive payment/UPI/revenue fields in the JSON response (don't just hide them in the UI — omit them server-side via a role-aware DTO/projection).
4. Add an **audit log** for sensitive actions: role assignment/removal, subscription/plan changes, restaurant suspension, UPI VPA changes, payment-verification actions (§6.3). A simple `AuditLogEntry` table (`actorUserId`, `action`, `targetType`, `targetId`, `restaurantId`, `metadata` JSON, `createdAt`) is enough for Phase 1 — no need for a full audit UI yet, just the table and writes to it.
5. Write integration tests (Testcontainers + PostgreSQL if available, otherwise an in-memory/test profile) proving: a user from Restaurant A gets `403`/`404` (not data) when addressing Restaurant B's branch/order/menu IDs; a Manager/User's response for an order never contains payment amount/UPI fields.

**Acceptance criteria:**
- [ ] Every controller in `PRD.md` §6 has been audited; findings and fixes are listed in the PR description.
- [ ] Cross-tenant access attempts return `403`/`404`, verified by tests.
- [ ] Manager/User and Staff API responses omit financial fields (not just hide them client-side).
- [ ] `AuditLogEntry` table exists and is written to for the actions listed above.
- [ ] `PRD.md` §2.2 updated to reflect the implemented (not just "provisional") permission matrix, with a note that final scope is pending owner confirmation.

---

### 6.2 Checkout & Order Integrity *(P0)*

**Goal:** An order can't be placed twice by accident, can't be underpriced by a tampered client, and can't include unavailable items.

Tasks (backend, `PublicOrderController` and its service):
1. **Idempotency key:** Accept an `Idempotency-Key` header (or generate/require a client-supplied UUID) on `POST /api/v1/public/orders`; store it against the created order; a repeated request with the same key returns the original order instead of creating a duplicate.
2. **Server-side pricing:** Recalculate every line-item price and the order total from the current `Food` entity price at order time. Ignore any price/total sent by the client. Store an **immutable price snapshot** on each order item (`priceAtOrderTime`) so later menu price changes don't retroactively alter historical orders.
3. **Availability recheck:** Reject (with a clear error, not a generic 500) any item that is marked unavailable at the moment of order placement, even if it appeared available when the customer's page loaded.
4. **Restaurant/branch open-closed gating:** If an "open/closed" or "accepting orders" flag exists (or add a minimal one to `Branch` if it doesn't), reject new orders when the branch is closed, with a customer-facing message.
5. **Transactional integrity:** Wrap order + order-item creation in a single DB transaction so a partial order can never be persisted.
6. Frontend (`CustomerOrderDrawer.jsx` or equivalent): handle the new error responses (unavailable item, branch closed, duplicate submission) with clear customer-facing messages instead of a silent failure or crash.

**Acceptance criteria:**
- [ ] Rapid double-submit of the same order (same idempotency key) results in exactly one order server-side.
- [ ] A manually tampered client total is ignored; the persisted order total matches server-calculated prices.
- [ ] Ordering a since-unavailable item is rejected with a specific error the frontend surfaces to the customer.
- [ ] `PRD.md` FR-CUST-4 updated to describe these guarantees explicitly.

---

### 6.3 Order Status, Payment Clarity & WhatsApp Reliability *(P0)*

**Goal:** Order status and payment status are separate, clearly labeled concepts; a WhatsApp failure never blocks an order; staff — not the system — declare a payment verified.

Tasks:
1. **Do not silently change the order status enum.** `project-flow.txt` and `PRD.md` currently define `Pending → Preparing → Ready → Billed / Cancelled`. `PERPLEXITY_ANALYSIS.md` §F suggests adding an `Accepted` step between `Pending` and `Preparing`. **Flag this as a decision, don't force it:** implement the status model as-is (no `Accepted` step) for this task, but add a note to `PRD.md` §8 Open Questions proposing the `Accepted` addition for owner sign-off, with the tradeoff (lets the kitchen distinguish "seen" from "actively cooking") spelled out in one or two sentences.
2. **Add a separate `paymentStatus` field to Order**, distinct from order status, with values: `UNPAID`, `LINK_SENT`, `REPORTED_BY_CUSTOMER` (optional, only if there's a simple way for the customer to tap "I've paid" — otherwise omit this value), `VERIFIED_BY_STAFF`. Never auto-set `VERIFIED_BY_STAFF` from a link click — only a staff/admin action does this.
3. Add staff/admin endpoints and matching UI controls: **"Mark payment verified"**, **"Mark unpaid"** (and "Mark disputed" if you want, optional). These are separate actions from advancing order status, though the UI can present them together on the order card.
4. Give every order a **customer-facing readable reference** (e.g., `RH-{year}-{sequential or short id}`), used in the WhatsApp message and shown in the admin UI, instead of a raw DB ID.
5. **WhatsApp failure handling:** Wrap the WhatsApp send call so that **a WhatsApp failure never fails or rolls back order creation.** Introduce a notification status field/table tracking `PENDING → SENT → DELIVERED / FAILED` (no need for `READ` in Phase 1 unless Meta's API already gives you that signal cheaply) for each attempted message. Log failures. A simple, bounded retry (e.g., one retry after a short delay) is enough for Phase 1 — do not build a full retry/queue infrastructure unless one already exists.
6. Add "Add extra cheese"-style clarity is **out of scope** (that's the menu-variants item, P2) — don't scope-creep into it here.

**Acceptance criteria:**
- [ ] `paymentStatus` exists on Order, independent of order status, with server-side-only transitions to `VERIFIED_BY_STAFF`.
- [ ] Staff/admin can mark payment verified/unpaid from the Orders and/or KDS UI.
- [ ] Every order has a human-readable reference shown to both customer (WhatsApp message) and staff (admin UI).
- [ ] Order creation succeeds even when the WhatsApp send call throws or times out (prove with a test that simulates a WhatsApp failure).
- [ ] `PRD.md` FR-PAY/FR-NOTIF sections updated with the new payment-status model and the "order creation must not fail on WhatsApp failure" rule stated explicitly as a requirement, not just a note.
- [ ] The `Accepted` status question is logged in `PRD.md` §8 as a proposed, unconfirmed change — not implemented.

---

### 6.4 Branch Context, Order History & Dashboard APIs *(P0/P1 — closes `@Todo-2`, `@Todo-3`, `@Todo-4`)*

**Goal:** A real, backend-validated branch switcher; a fully filterable order history; a dashboard wired to real data.

Tasks:
1. **Branch switcher (`@Todo-2`):** Implement the persistent branch dropdown in the admin header (`AdminLayout.jsx` / equivalent) backed by a `BranchContext`. Every subsequent admin API call includes the selected `branchId`. Critically: **the backend must independently verify** the authenticated user has access to that `branchId` on every request — the frontend's selection is a UX convenience, not a security boundary (this reuses the guard built in §6.1).
2. **Order history (`@Todo-3`):** Implement `GET /api/v1/orders/history` supporting, at minimum: `branchId`, `from`, `to` (date range), `status`, `paymentStatus`, `phone` (customer phone search), `tableNumber`, `page`, `size`. Return total amount, order source (table QR / counter QR / staff-created — add an `orderSource` field to Order if it doesn't exist), and the customer-facing reference from §6.3. Build the matching frontend view (date range pickers, status/payment-status filters, phone search, pagination) in `Orders.jsx` or a dedicated `OrderHistoryModal.jsx`.
3. **Dashboard (`@Todo-4`):** Wire `DashboardController.java` to `Dashboard.jsx`, replacing all dummy/mock data. Minimum KPI set: total orders, **gross order value** (sum of order totals — do not call this "revenue" without qualification), average order value, pending orders, active tables, orders by status, orders by source/channel, top-selling items, sales by day, cancelled orders, and unpaid/payment-pending order count. Add a **separate** "verified collected amount" figure (sum of orders with `paymentStatus = VERIFIED_BY_STAFF`) distinct from gross order value, and label both clearly in the UI so nobody mistakes gross value for confirmed cash collected.

**Acceptance criteria:**
- [ ] Branch switcher persists selection, updates Tables/Orders/KDS/Menus/Dashboard views, and every backend call is independently branch-access-checked.
- [ ] Order history endpoint supports all filters listed above with correct pagination; frontend view is usable end to end.
- [ ] Dashboard shows real numbers from the backend, with gross order value and verified collected amount clearly distinguished.
- [ ] `PRD.md` §7 removes `@Todo-2/3/4` from the outstanding list (or marks them done) and `ImplementationPlan.md` §2 status column updated accordingly.

---

### 6.5 Subscription Enforcement & Manual Billing Activation *(P0/P1 — extends `@Todo-5`)*

**Goal:** Plan limits are enforced server-side, not just hidden in the UI; restaurants can be moved onto a paid plan without needing a payment gateway yet.

Tasks:
1. **Server-side enforcement, not just `ThemeSelector.jsx`/`WebsiteWrapper.jsx`:** For each feature/limit that already has a plan/feature flag (per `PRD.md` §3.3's feature catalog: `WHATSAPP_NOTIFICATIONS`, `KDS_ACCESS`, `MULTI_BRANCH`, `EXCEL_IMPORT_EXPORT`, `CUSTOM_WEBSITE_TEMPLATES`, `ADVANCED_ANALYTICS`), add a backend check at the point of use (e.g., attempting to enable WhatsApp, access KDS, add a second branch, import Excel, pick a non-default template) that rejects the action with a clear "upgrade required" error if the restaurant's current plan doesn't include it. A direct API call must be blocked exactly as the UI is.
2. Specifically close **`@Todo-5`**: enforce the 2-template limit for the Free plan server-side (not only in `ThemeSelector.jsx`).
3. Add explicit limits, at minimum, for: number of branches, number of tables, staff accounts, and monthly order count (pick sane Phase-1 defaults per `PERPLEXITY_ANALYSIS.md`'s suggested plan-feature table if the owner hasn't specified numbers — but log these as assumed defaults in `PRD.md`, flagged for owner confirmation, not silently treated as final).
4. **Manual billing activation (Phase 1 version — no Razorpay yet):** Add a SuperAdmin/Admin-facing flow to record: plan assigned, activation date, expiry date, and a free-text payment reference (e.g., a UPI transaction note) for a restaurant that has paid the owner directly. On expiry, the restaurant should automatically fall back to the Free plan's limits (a scheduled check or a check-on-access pattern both work — pick whichever fits the existing codebase's patterns).
5. Add a restaurant **suspension** state (separate from plan expiry) that a SuperAdmin can toggle, which blocks the public site and admin panel for that restaurant with a clear "temporarily unavailable" message instead of an error page.

**Acceptance criteria:**
- [ ] Directly calling an API to exceed a Free-plan limit (extra template, second branch, WhatsApp when not entitled, etc.) is rejected server-side with a clear error.
- [ ] SuperAdmin/Admin can manually activate/extend a paid plan with a recorded payment reference; expiry correctly reverts limits.
- [ ] SuperAdmin can suspend/unsuspend a restaurant; suspended restaurants show a clear "unavailable" state, not a crash or blank page.
- [ ] `PRD.md` §7 marks `@Todo-5` done and documents the assumed Phase-1 plan limits (flagged for confirmation) and the manual billing model.
- [ ] `ImplementationPlan.md` Phase 3 item "Automated Subscription Billing (Razorpay)" is left as-is/future — do not build it now.

---

### 6.6 Restaurant Onboarding, Website Publishing & Legal Basics *(P1)*

**Goal:** A new restaurant can reliably reach "live," and the platform meets baseline legal/consent expectations given it collects customer names and phone numbers.

Tasks:
1. **Registration validation:** Reject duplicate emails and (if restaurant name/slug must be unique for future subdomain routing) duplicate restaurant names/slugs, with clear error messages.
2. **Approval states:** Add explicit states to a restaurant/registration record — `PENDING_APPROVAL`, `APPROVED`, `REJECTED` — so the SuperAdmin's existing linking step (`RoleController`) has a clear status to act on, and an unapproved admin sees a "waiting for approval" screen instead of a broken dashboard.
3. **Email verification** for new admin accounts (if not already present) and a **password reset** flow (if not already present) — check `AuthController.java` first; only add what's missing.
4. **Onboarding checklist UI** for a newly approved admin, reflecting the flow: create branch → add menu → configure UPI → generate first table QR → place a test order → activate website. Track completion state so the checklist can disappear once done, but don't block feature access on completing it.
5. **Website publish/unpublish toggle:** Add an explicit published/unpublished state for a branch's public website (Marketing → Website), separate from having *content* configured — so an admin can finish editing before making the site live, and a newly approved-but-unconfigured restaurant doesn't show a broken public page.
6. **Legal & consent basics:**
   - Add static Privacy Policy and Terms of Service pages (content can be a reasonable placeholder — flag in `PRD.md` that legal review is still needed).
   - Add an explicit customer consent checkbox/notice at checkout for receiving WhatsApp order messages (opt-in, not assumed).
   - Link both from the public site footer and the admin registration page.

**Acceptance criteria:**
- [ ] Duplicate email/restaurant-name registration is rejected with a clear message.
- [ ] Restaurant registration has explicit approval states, and the SuperAdmin UI reflects them.
- [ ] An onboarding checklist guides a newly approved admin through the five steps listed above.
- [ ] A branch's public site cannot be reached by customers until explicitly published.
- [ ] Privacy Policy, Terms of Service, and a WhatsApp consent checkpoint exist and are linked from the relevant screens.
- [ ] `PRD.md` gains a new §"Onboarding & Activation" (or extends an existing section) documenting this flow; `ImplementationPlan.md` reflects it as done.

---

### 6.7 Baseline Reliability & Ops Hygiene *(P0, lightweight for Phase 1)*

**Goal:** When something goes wrong, the owner can find out why within minutes — without building a full observability stack yet.

Tasks:
1. Ensure key events are logged with enough context to debug a "why didn't this order reach the kitchen" question: order creation, order status transitions, payment-status transitions, WhatsApp send attempts/failures, role/subscription changes (reuse the audit log from §6.1 where it overlaps).
2. Confirm `/actuator/health` is exposed and accurate; if a readiness check for the database isn't already included, add one.
3. Document (in `agent/Schema.md`, §7 below, or a short `agent/OPERATIONS.md` if one doesn't exist) the current backup story for PostgreSQL — even if it's just "document how to run `pg_dump` on a schedule until a managed backup solution is in place." This is a documentation deliverable, not necessarily new infrastructure code, unless the project already has a place backups are automated (e.g., a Docker Compose volume + cron) — extend that if it exists.

**Acceptance criteria:**
- [ ] Log statements exist for every event listed above, findable by a reasonable search term (e.g., order ID, restaurant ID).
- [ ] `/actuator/health` reflects real DB connectivity.
- [ ] A backup runbook exists in the docs, even if minimal.

---

## 7. Documentation Deliverables (update these as you go, not at the very end)

By the end of this task, the following must all be current:

1. **`agent/PRD.md`** — Update:
   - §2.2 permission matrix (per §5 of this prompt).
   - §5 functional requirements for every FR touched (payment status, checkout integrity, order history filters, dashboard KPIs, subscription enforcement, onboarding).
   - §7 outstanding `@Todo` list — mark closed items as done (with a short note on what changed), and add any new follow-ups this task surfaced (menu variants, real-time transport, Razorpay, etc.) if they aren't already tracked in `ImplementationPlan.md`.
   - §8 open questions — add the `Accepted` status proposal (§6.3) and any assumed defaults from §6.5 that need owner confirmation. Do not delete existing unresolved questions unless you've actually resolved them.
2. **`agent/ImplementationPlan.md`** — Update the **Current State Baseline & Gap Analysis** table (§2) for every module you touched, and mark Phase 1 milestones done in the phased roadmap. Add any newly discovered follow-up work to Phase 2/3 rather than silently dropping it.
3. **`agent/Schema.md`** (already exists; update it, and keep `RestroHub/Schema.md` consistent) — A single reference document covering:
   - Every table/entity touched or added in this task (Order, OrderItem, AuditLogEntry, subscription/plan tables, restaurant approval/suspension state, website publish state, etc.), with columns, types, and key relationships.
   - The full Flyway migration history (list each `V{n}__*.sql` file with a one-line description) so a new contributor can see the schema's evolution without reading every migration file.
   - An ER-diagram-style summary (a Mermaid `erDiagram` block is a good fit if the repo already uses Mermaid elsewhere, otherwise a plain table list is fine) covering at least: Restaurant, Branch, User, Role assignment, Menu, Category, Food, Order, OrderItem, Table, Subscription Plan/Feature, AuditLogEntry.
4. **`CLAUDE.md`** (if present) — Add or update any new commands, env vars, or conventions this task introduced (e.g., how to run the new integration tests, any new required environment variables for WhatsApp failure simulation, etc.).
5. Any other markdown docs already in the repo that reference features you changed (e.g., a `CONTRIBUTING.md` mentioning old `@Todo` items) — keep them consistent; don't leave contradictions between docs.

---

## 8. Definition of Done for This Whole Task

- [ ] All acceptance criteria in §6.1–§6.7 are met.
- [ ] `./gradlew build` (backend) and `npm run build` (frontend) both pass.
- [ ] New backend logic has unit/integration test coverage, especially tenant-isolation and payment-status transition tests.
- [ ] No secrets, `.env` files, or credentials were committed.
- [ ] `PRD.md`, `ImplementationPlan.md`, and `Schema.md` are all updated and internally consistent with each other and with the code.
- [ ] Every place this prompt told you to **flag rather than decide** (Manager/Manager-User final scope, the `Accepted` status proposal, assumed Phase-1 plan limits) is recorded in `PRD.md` §8 as an open item — not silently resolved and not silently ignored.
- [ ] You produce a final summary (in the PR description or a `agent/PHASE1_SUMMARY.md`) listing: what was built, what was explicitly deferred and why, and every decision you flagged for the owner.
- [ ] `superpowers:verification-before-completion` was run for each milestone. Every "done" claim is backed by build or test output, not by assumption.
- [ ] `ponytail:ponytail-review` was run on every PR diff with no unresolved over-engineering findings. Each deliberate shortcut carries a `ponytail:` comment.
- [ ] Backend changes follow §0.2 spring-boot-engineer rules: validated input on every new or changed endpoint, `@Transactional` on multi-step writes, no new field injection, errors routed through `GlobalExceptionHandler`, a Flyway migration for each schema change, and `./gradlew spotlessCheck` passing.
- [ ] Frontend changes follow §0.2 react-expert rules: stable keys, cleanup in every effect, accessible new forms and dialogs, a top-level `ErrorBoundary` in place, and `npm run lint` passing.
- [ ] `/graphify . --update` was run after the final change, so `graphify-out/graph.json` reflects the new code.
- [ ] Each milestone's outcome and every settled decision was saved with `agentmemory:remember` (tag `phase1`), so a later session can continue via `agentmemory:handoff`.

---

## 9. Output Format Expected From You (the agent) at the End

Provide a concise summary containing:
1. A checklist mirroring §8, checked off.
2. A short list of files added/changed per milestone (§6.1–§6.7).
3. The exact list of "flagged for owner decision" items pulled from `PRD.md` §8, so the owner can scan just that list without re-reading the whole PRD.
4. Anything you could not complete and why (e.g., a dependency, credential, or external account you don't have access to — such as a real Meta WhatsApp Business account for true delivery-status testing).
5. The `ponytail:ponytail-debt` ledger: every `ponytail:` shortcut, with its limit and upgrade path, so the owner can see which simplifications were deliberate.
6. Any tool from §0.1 that was unavailable or skipped, and what you did instead.
