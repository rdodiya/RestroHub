# Rules

## Restroly (RestroHub) — Project Rules & Engineering Guidelines

> These rules apply to every contributor and to AI coding assistants working in this repo. They are based on the project `ReadMe.md` (branch `gssoc_develop`) and standard practice for the stack. Rules marked **MUST** are enforced in review; **SHOULD** are strong defaults.

---

## 1. Golden Rules

1. **MUST** branch from `gssoc_develop`, never from `main`.
2. **MUST NOT** commit secrets, `.env` files, keys or passwords.
3. **MUST** keep the build green: `./gradlew build` and `npm run build` pass before opening a PR.
4. **MUST** keep controllers thin and put business logic in services.
5. **MUST** follow Conventional Commits.
6. **MUST** update docs (README, Swagger, PRD/TechStack if scope changes) with any user-visible change.
7. **SHOULD** keep PRs small and focused: one concern per PR.

---

## 2. Repository & Branching

### 2.1 Structure (do not reorganize without discussion)

```
RestroHub/               # Backend: Java 21 / Spring Boot / Gradle
RestroHub-FrontEnd/      # Frontend: React 18 / Vite / Tailwind
scripts/                 # run_local, setup_jules, db/ seed SQL (dev only)
```

### 2.2 Branch naming

| Prefix | Use |
|---|---|
| `feature/short-description` | New feature |
| `fix/short-description` | Bug fix |
| `docs/short-description` | Documentation only |
| `refactor/short-description` | Cleanup, no behavior change |
| `test/short-description` | Tests only |

### 2.3 Workflow

1. Fork, then add `upstream` remote (`https://github.com/rdodiya/RestroHub.git`).
2. `git fetch upstream && git checkout gssoc_develop && git merge upstream/gssoc_develop`.
3. Create your branch, make changes, test locally.
4. Push and open a PR **against `gssoc_develop`**.

---

## 3. Commit Rules

Format: `type(scope): concise description in present tense`

| Type | Meaning |
|---|---|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change, no feature or fix |
| `test` | Add/update tests |
| `chore` | Maintenance, dependency updates |

Examples:
- `feat(orders): add real-time status polling`
- `fix(auth): handle expired JWT tokens gracefully`
- `docs(readme): add architecture diagram`

Rules:
- Subject line at most 72 characters, no trailing period.
- One logical change per commit; do not mix formatting sweeps with logic.
- Reference the issue in the body or PR (`Closes #123`).

---

## 4. Pull Request Rules

### 4.1 Checklist (all **MUST**)

- [ ] Branched from `gssoc_develop`
- [ ] `./gradlew build` passes
- [ ] `npm run build` passes
- [ ] Tested end to end locally
- [ ] No `.env` files or secrets committed
- [ ] README/docs updated if a feature was added
- [ ] PR title and description explain **what** and **why**
- [ ] Screenshots or short recording for UI changes (mobile and desktop)
- [ ] Linked to an issue

### 4.2 Review

- At least one maintainer approval before merge.
- Address all review comments or explain why not.
- Do not force-push after review has started unless asked; prefer follow-up commits.
- Do not self-merge non-trivial changes.

### 4.3 Scope

- Claim an issue by commenting before you start; do not work on issues assigned to others.
- Avoid drive-by refactors in feature PRs.
- No unrelated dependency upgrades in the same PR.

---

## 5. Backend Rules (Java 21 / Spring Boot)

### 5.1 Architecture

Code lives under `com.restroly.qrmenu`, organized **by feature** (`order/`, `menu/`, `food/`, `category/`, `restaurant/`, `branch/`, `table/`, `payment/`, `subscription/`, `auth/`, `user/`, `template/`, `notification/`, `notifications/`, `whatsapp/`, `excel/`, `address/`, `audit/`, `admin/`). Each feature package has its own layers; put new code in the matching feature package, not a global layer package.

| Layer | Package (inside a feature) | Responsibility | Must not |
|---|---|---|---|
| Controller | `controller/` | HTTP mapping, validation trigger, delegate to service | Contain business logic or touch repositories |
| Service | `service/` (+ `impl/`) | Business rules, transactions | Return entities directly to clients |
| Repository | `repository/` | JPA data access | Contain business logic |
| Entity | `entity/` | JPA entities / domain | Leak into API responses |
| DTO | `dto/` | Request/response objects | Contain persistence annotations |
| Mapper | `mapper/` | MapStruct entity/DTO conversion | Hold business logic |

Cross-cutting packages: `config/` (security route rules, CORS, OpenAPI, Cloudinary; no business logic), `security/` (JWT filter/provider, `AccessGuard`, `Permission`), `common/` (shared DTOs, enums, WebSocket config), `exception/` (custom exceptions and the global handler; never swallow errors silently).

### 5.2 Coding standards

- Naming: `camelCase` methods, `PascalCase` classes, `UPPER_SNAKE_CASE` constants.
- **MUST** use constructor injection; do not use field `@Autowired`.
- **MUST** add Javadoc to every public service method.
- **MUST** run `./gradlew spotlessApply` before committing Java (the pre-commit hook runs `spotlessCheck`).
- **MUST** expose DTOs, never JPA entities, from controllers.
- **MUST** validate input with Bean Validation (`@Valid`, `@NotBlank`, etc.).
- **MUST** use `@Transactional` at the service layer where writes span multiple operations.
- **SHOULD** use `Optional` correctly, avoid returning `null` collections, and prefer immutable DTOs (records).
- **SHOULD** use Java 21 features (records, switch expressions, pattern matching) where they improve clarity.
- **MUST NOT** use `System.out.println`; use SLF4J logging.
- **MUST NOT** log secrets, tokens, or full payment/personal data.

### 5.3 API design

- Context path `/restroly`. Public routes under `/public/api/v1/**` (a few legacy ones under `/api/v1/**`); authenticated owner/admin routes under `/secure/api/v1/**` (constants in `common/util/ApiConstants`).
- Use plural nouns and standard verbs: `GET /foods`, `POST /foods`, `PUT /foods/{id}`, `DELETE /foods/{id}`.
- Correct status codes: `200`, `201` (created), `204` (no content), `400`, `401`, `403`, `404`, `409`, `422`, `500`.
- Consistent error body: `{ "code": "...", "message": "...", "details": [...] }`.
- List endpoints **SHOULD** support pagination (`page`, `size`, `sort`).
- Every endpoint **MUST** appear accurately in Swagger/OpenAPI with request/response schemas.
- Breaking changes require a new version path (`/api/v2`) or maintainer approval.

### 5.4 Security

- **MUST** protect owner/admin operations with JWT; verify the authenticated user owns the resource (no cross-restaurant access).
- **MUST** authorize every secured endpoint with `@PreAuthorize("@access.can('<PERMISSION>') and @access.branch(#branchId)")`. `security/AccessGuard` (bean `access`) does the tenant checks and `security/Permission` is the only role-to-permission map; do not add `hasRole(...)` lists. Role names may be stored as `ROLE_X` or `X`.
- **MUST** record sensitive actions (role changes, plan changes, UPI VPA changes) through `audit/service/AuditLogService.record(...)`.
- Category and Food have no tenant owner yet (role checks only); do not assume tenant isolation there.
- **MUST** load secrets from environment variables (`JWT_SECRET`, `DB_PASSWORD`, `GOOGLE_OAUTH_CLIENT_ID`).
- **MUST** configure CORS via `CORS_ALLOWED_ORIGINS`; never use `*` in production.
- **MUST** use parameterized queries / JPA; no string-concatenated SQL.
- **MUST** hash or avoid storing any credentials; never store raw tokens.
- **SHOULD** rate-limit auth and order-creation endpoints.
- **MUST** verify Google ID tokens server-side; do not trust client-supplied identity.

### 5.5 Database

- Schema changes **MUST** go through Flyway migrations in `src/main/resources/db/migration` (currently `V1` to `V5`; `V1` is a placeholder baseline, so new migrations must not add foreign keys to Hibernate-created tables); no manual production edits.
- Dev uses `ddl-auto=update`, prod uses `validate`, so any entity change **MUST** ship with a new `V<n>__*.sql` or prod will fail to start.
- Local seed data lives in `scripts/db/*.sql` (dev only, never in `db/migration`).
- Add indexes for foreign keys and frequent filters (restaurant/branch id, order status, created date).
- Beware of N+1 queries; use fetch joins or projections.
- Money values **MUST** use `BigDecimal` (or integer paise), never `double`/`float`.
- Timestamps stored in UTC.

### 5.6 Testing

- **MUST** add unit tests for new service logic (JUnit 5 under `src/test/java/com/restroly/qrmenu/...`).
- Web-layer security tests use `@WebMvcTest` + `@Import({SecurityConfig.class, AccessGuard.class})` (see `OrderControllerTenantIsolationTest`). Spring context tests need a real PostgreSQL (H2 is not a dependency).
- **SHOULD** add integration tests for new endpoints (Testcontainers with PostgreSQL preferred).
- Tests must be deterministic and not depend on a developer's local database.
- Name tests by behavior: `shouldRejectOrderWhenMenuItemUnavailable`.

---

## 6. Frontend Rules (React 18 / Vite / Tailwind)

### 6.1 Components

- **MUST** use functional components and hooks only; no class components.
- **MUST** have one component per file; filename equals component name (`MenuCard.jsx`).
- Place components correctly: `components/admin`, `components/customer`, `components/common`; pages under `pages/admin|customer|public`; routes in `routes/index.jsx` with `ProtectedRoute.jsx`.
- Keep components small; extract logic into custom hooks (`useMenus`, `useOrders`).
- **MUST NOT** prop-drill beyond 2 levels; use `SiteContext` for shared state.

### 6.2 API access

- **MUST** route all HTTP calls through `services/common/api.js` (Axios instance with interceptors) and `services/public/ApiService.js`; no ad-hoc `fetch`/`axios` in components. Shared state lives in `context/` (`SiteContext`, `BranchContext`, ...).
- `VITE_API_BASE_URL` is `http://localhost:8181/restroly`, without trailing slash and without `/api/v1`.
- Handle loading, error and empty states for every data-driven view.
- Never hardcode API URLs, client IDs or secrets; use `import.meta.env.VITE_*`.

### 6.3 Styling

- **SHOULD** prefer Tailwind utility classes over custom CSS.
- Custom CSS only in `styles/` (`global.css`, `landing.css`, `variables.css`) when utilities are not enough.
- **MUST** be mobile-first and verified at 360px, 768px and 1280px.
- Maintain sufficient contrast and provide `alt` text for images; use semantic HTML and accessible labels.

### 6.4 Quality

- ESLint and Prettier clean (`npm run lint`, `npm run format:check`; the `.githooks/pre-commit` hook runs `lint-staged`).
- No `console.log` left in committed code.
- **SHOULD** add tests (Vitest + React Testing Library) for critical flows: login, menu CRUD, ordering.
- Use keys in lists, avoid unnecessary re-renders, lazy-load heavy routes and images.

---

## 7. Security & Secrets

| Rule | Detail |
|---|---|
| Never commit | `.env`, private keys, tokens, service-account JSON, real customer data |
| Use | `.env.example` with placeholder values only |
| Generate secrets | `openssl rand -hex 32` for `JWT_SECRET` |
| If leaked | Rotate immediately, then remove from history; notify maintainers |
| Dependencies | Do not add unmaintained or unnecessary libraries; justify new dependencies in the PR |
| Reporting vulnerabilities | Email the maintainer privately (rdodiya2601@gmail.com); do not open a public issue |

---

## 8. Payments (UPI) Rules

- UPI links/QR are built from the restaurant's verified UPI ID (VPA) and the exact order amount.
- **MUST** compute amounts server-side; never trust a client-provided total.
- **MUST NOT** claim a payment succeeded based only on a client redirect; status changes must be confirmed by the owner or a verified webhook.
- Do not store card/bank details; log only order IDs and status, not payer data.

---

## 9. Documentation Rules

- Update `ReadMe.md` when adding features, env variables, or setup steps.
- Keep Swagger annotations current.
- Record significant technical decisions as short ADRs in `docs/adr/` *(recommended)*.
- Keep `PRD.md`, `TechStack.md` and `ImplementationPlan.md` consistent with reality; update them in the same PR when scope changes.
- Write in clear, simple English; use code fences with language tags.

---

## 10. Issue Rules

- Search existing issues before opening a new one.
- Bug reports **MUST** include: description, steps to reproduce, expected vs actual behavior, logs or screenshots, OS, Java and Node versions.
- Feature requests **SHOULD** describe the problem, proposed solution and affected users.
- Labels: area (`backend`, `frontend`, `docs`, `devops`), difficulty (`good first issue`, `medium`, `hard`) and phase.

---

## 11. Community & Conduct (GSSoC)

- Be respectful and constructive; assume good intent.
- Give credit; do not copy code without a compatible license and attribution.
- **MUST NOT** submit AI-generated code you have not read, understood and tested. Contributors are responsible for everything in their PR.
- No spam PRs, trivial whitespace-only changes for points, or duplicate PRs for the same issue.
- Respond to review feedback in a timely manner; inactive PRs may be closed after 14 days without a reply.
- Code is released under the MIT License; contributions are made under the same license.

---

## 12. Rules for AI Coding Assistants

When an AI tool (Copilot, Claude, Cursor, etc.) edits this repo, it **MUST**:

1. Read `ReadMe.md`, `PRD.md`, `TechStack.md` and this file before making changes.
2. Follow the layered architecture (controller → service → repository) and the naming conventions above.
3. Stay within the requested scope; not rename, move or delete unrelated files.
4. Never invent endpoints, env variables or dependencies; confirm they exist or add them explicitly and document them.
5. Never write secrets or real credentials into code, tests or docs.
6. Add or update tests and docs for the change, and run the build commands before declaring work done.
7. Prefer the existing stack (Spring Boot, React, Tailwind, Axios, Context API); do not introduce new frameworks without approval.
8. Flag assumptions and uncertainties in the PR description instead of guessing silently.

---

## 13. Quick Reference

```bash
# Backend
cd RestroHub
chmod +x gradlew
./gradlew clean build
./gradlew bootRun            # http://localhost:8181/restroly

# Frontend
cd RestroHub-FrontEnd
npm install
cp .env.example .env
npm run dev                  # http://localhost:3000

# Health & docs
curl http://localhost:8181/restroly/actuator/health
open http://localhost:8181/restroly/swagger-ui.html
```

| Environment variable | Where | Note |
|---|---|---|
| `DB_USERNAME`, `DB_PASSWORD`, `SPRING_DATASOURCE_URL` | Backend | Never commit real values |
| `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION` | Backend | Secret via env only |
| `GOOGLE_OAUTH_CLIENT_ID` | Backend | Must match frontend client ID |
| `CORS_ALLOWED_ORIGINS` | Backend | Add your dev port |
| `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID` | Frontend | No `/api/v1` suffix on base URL |
