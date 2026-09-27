# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Restroly (repo name: RestroHub) is a digital menu and restaurant management platform for Indian restaurants: QR menus, menu/category/food management, UPI payment links, auto-generated restaurant websites, an order dashboard, analytics, and JWT + Google OAuth authentication. It is an open-source GSSoC project (MIT license).

It is a two-app monorepo:

- `RestroHub/` — backend: Java 21, Spring Boot, Gradle, PostgreSQL
- `RestroHub-FrontEnd/` — frontend: React 18, Vite, Tailwind CSS, React Router v6, Axios, Context API

Request flow: Browser → React (Vite) → Spring Boot REST API → service layer → PostgreSQL.

For product scope and roadmap see `ReadMe.md`; for contribution rules see `CONTRIBUTING.md`. Do not duplicate them here.

## Branching (important)

- The working branch is **`gssoc_develop`**. Branch from it and open PRs against it, never `main`.
- Branch names: `feature/`, `fix/`, `docs/`, `refactor/`, `test/` + short-description.
- Commits use Conventional Commits: `type(scope): description` (`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`).

## Commands

### Backend (run from `RestroHub/`)

```bash
chmod +x gradlew            # first time on macOS/Linux
./gradlew clean build       # compile + test
./gradlew bootRun           # start API on :8181
./gradlew test              # tests only
./gradlew test --tests "com.restroly.SomeTest"   # single test class
```

- If `gradle/wrapper/gradle-wrapper.jar` is missing: `gradle wrapper --gradle-version 8.7`.
- Local database: PostgreSQL 14+, database named `RestroHub_DB` (case-sensitive, quote it in SQL). Default credentials `postgres`/`postgres`.
- Build output in `build/libs/` (README references a `restroly-0.0.1-SNAPSHOT-plain.war` for Tomcat deployment).

### Frontend (run from `RestroHub-FrontEnd/`)

```bash
npm install
cp .env.example .env        # then edit
npm run dev                 # http://localhost:3000 (Vite picks the next free port if busy)
npm run build               # output in dist/
```

### Added by the Docker / Flyway / lint setup (available once that change is merged)

```bash
docker compose up -d --build            # full stack; needs .env with JWT_SECRET
./gradlew spotlessCheck                 # Java format check (backend)
./gradlew spotlessApply                 # Java auto-format
npm run lint / npm run format:check     # frontend ESLint / Prettier
git config core.hooksPath .githooks     # enable the pre-commit hook
```

### Verify a running backend

- API base: `http://localhost:8181/restroly/api/v1`
- Swagger UI: `http://localhost:8181/restroly/swagger-ui.html`
- Health: `http://localhost:8181/restroly/actuator/health` → `{"status":"UP"}`

## Backend architecture

Package root `com.restroly`, layered:

| Package | Role |
|---|---|
| `controller/` | Thin REST endpoints; no business logic |
| `service/` | Business logic |
| `repository/` | Spring Data JPA access |
| `model/` | Entities |
| `dto/` | Request/response objects (never return entities from controllers) |
| `config/` | Spring configuration (security, CORS, Swagger, etc.) |
| `exception/` | Custom exceptions and handlers |

Configuration: `application.properties` → `application-dev.properties` (default active profile) / `application-prod.properties`. Server port `8181`, context path `/restroly`.

Routes: public/general endpoints under `/api/v1/**` (categories, foods, orders); owner/admin endpoints under `/secure/api/v1/**` (e.g. menus) and require a JWT.

Environment variables (never hard-code or commit values): `DB_USERNAME`, `DB_PASSWORD`, `SPRING_DATASOURCE_URL`, `JWT_SECRET`, `JWT_EXPIRATION`, `JWT_REFRESH_EXPIRATION`, `GOOGLE_OAUTH_CLIENT_ID`, `CORS_ALLOWED_ORIGINS`.

## Frontend architecture

```
src/
  components/{admin,customer,common}/   # UI by audience
  pages/{admin,customer,public}/
  services/api.js                        # Axios instance + interceptors
  services/ApiService.js                 # per-resource API functions
  context/SiteContext.jsx                # global state (Context API)
  styles/                                # global.css, landing.css, variables.css
```

All HTTP calls go through `services/api.js` / `ApiService.js`, never ad-hoc `fetch`/`axios` in components. Shared state lives in `SiteContext`.

## Conventions

**Java**
- `camelCase` methods, `PascalCase` classes, `UPPER_SNAKE_CASE` constants.
- Constructor injection only; no field-level `@Autowired`.
- Javadoc on every public service method.
- Keep controllers thin; use DTOs at the API boundary; validate input.

**React**
- Functional components and hooks only; one component per file, filename equals component name.
- Avoid prop-drilling beyond 2 levels — use `SiteContext`.
- Prefer Tailwind utility classes over custom CSS.
- Mobile-first; check responsive behavior.

## Gotchas

- `VITE_API_BASE_URL` must be `http://localhost:8181/restroly` — **no trailing slash and no `/api/v1`** (wrong value causes 404s).
- `VITE_GOOGLE_CLIENT_ID` (frontend) and `GOOGLE_OAUTH_CLIENT_ID` (backend) must be the **same** Google OAuth client ID; the frontend origin must be in the authorized origins.
- If Vite runs on a port other than 3000 (e.g. 5173), add that origin to `CORS_ALLOWED_ORIGINS`.
- Vite only exposes `VITE_*` variables, and they are baked in at build time.
- Java 21 is required; a lower JDK fails the build.
- The repo has both `ReadMe.md` and a `READMe.md` reference in the tree listing; file names are case-sensitive on Linux/macOS.
- Docs may lag the code (README has some duplicated sections); check the code and Swagger when they disagree.

## Rules for Claude

- Never commit or print secrets, `.env` files, JWT secrets or OAuth credentials; use environment variables and `.env.example`.
- Stay in scope: don't reformat, rename or move unrelated files, and don't add dependencies or frameworks without saying why.
- Don't invent endpoints, env vars or config keys — confirm they exist in the code or Swagger first.
- Compute money/order totals on the server; never trust client-supplied amounts. Use `BigDecimal` for money.
- Before finishing a change, run the relevant build (`./gradlew build` and/or `npm run build`), and update `ReadMe.md`/Swagger if behavior or setup changed.
- Contributors are responsible for AI-generated code: explain assumptions and untested areas in the PR description.
