# Tech Stack

## Restroly (RestroHub) — Digital Menu & Restaurant Management Platform

> Derived from the project `ReadMe.md` and verified against `build.gradle` / `package.json` (branch `gssoc_develop`). Items marked *(planned)* are not yet implemented; items marked *(assumption)* are inferred and should be verified in the codebase.

---

## 1. At a Glance

| Layer | Technology |
|---|---|
| Frontend | React 18+, Vite, Tailwind CSS, React Router v6+, Axios, Context API |
| Backend | Java 21, Spring Boot 3.2.6, Gradle (wrapper 8.13) |
| Database | PostgreSQL 14+ (Flyway migrations) |
| Cache | Redis *(planned)* |
| Auth | JWT + Google OAuth 2.0, role/permission RBAC (`AccessGuard`) |
| Real-time | STOMP over WebSocket (`/ws`), SSE for dashboard notifications |
| API Docs | Swagger / OpenAPI |
| DevOps | Docker & Docker Compose, Vercel / Netlify, Git |

---

## 2. Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│        React 18 + Vite  │  Tailwind CSS  │  React Router v6 │
└───────────────────────────────┬──────────────────────────────┘
                                │  HTTP/REST · JSON · Axios
                                ▼
┌──────────────────────────────────────────────────────────────┐
│                      SPRING BOOT API                         │
│          Controllers  │  JWT Auth  │  Swagger / OpenAPI      │
└──────────────┬─────────────────────────────┬─────────────────┘
               │                             │
   ┌───────────┴──────────┐     ┌────────────┴───────────┐
   │   Menu · Category    │     │   Order · Payment ·    │
   │   Food Item Service  │     │   Auth · User Service  │
   └───────────┬──────────┘     └────────────┬───────────┘
               └──────────────┬──────────────┘
                              ▼
                 ┌────────────────────────┐
                 │    PostgreSQL 14+      │
                 └────────────────────────┘
```

**Request flow:** Browser → React (Vite / CDN) → Spring Boot REST API → Service layer → PostgreSQL

---

## 3. Backend

| Technology | Version | Role |
|---|---|---|
| Java | 21 | Primary language |
| Spring Boot | 3.2.6 | Application framework (web, data-jpa, validation, security, websocket, aop, actuator, mail) |
| Gradle | wrapper 8.13 | Build tool (Spotless 6.25.0 for formatting) |
| Flyway | Boot-managed | Schema migrations (`db/migration`, V1 to V5) |
| MapStruct / Lombok | 1.6.3 / 1.18.34 | Entity-DTO mapping, boilerplate reduction |
| jjwt | 0.12.3 | JWT signing and parsing |
| google-auth-library | 1.11.0 | Google ID token verification |
| springdoc-openapi | 2.3.0 | Swagger UI |
| ZXing | 3.5.2 | Table QR code generation |
| Apache POI | 5.2.3 | Excel import/export |
| Cloudinary | 1.39.0 | Image upload |
| PostgreSQL | 14+ | Primary database |
| Redis | Planned | Caching layer |
| Spring Actuator | Boot-managed | Health checks (`/actuator/health`) |
| Logback | Boot-managed | Logging (`logback-spring.xml`, JSON encoder) |
| JPA (Spring Data) | n/a | Data access via `repository/` layer |

### 3.1 Layered structure

Organized by feature under `com.restroly.qrmenu`; each feature has its own `controller/`, `service/` (+ `impl/`), `repository/`, `entity/`, `dto/`, `mapper/`.

```
RestroHub/src/main/java/com/restroly/qrmenu/
├── auth/ user/ restaurant/ branch/ table/        # identity and tenancy
├── menu/ category/ food/ excel/                  # menu management + Excel import/export
├── order/ payment/ whatsapp/                     # orders, UPI links, WhatsApp notifications
├── subscription/ template/ address/              # plans, website templates, addresses
├── notification/ notifications/ admin/           # service requests + email, SSE dashboard, dashboard stats
├── audit/                                        # audit log (sensitive actions)
├── config/ security/ common/ exception/          # cross-cutting (SecurityConfig, JWT, AccessGuard, Permission, WebSocketConfig)
└── RestaurantApplication.java
```

### 3.2 Configuration
- Profiles: `application.properties`, `application-dev.properties` (default via `SPRING_PROFILES_ACTIVE`), `application-prod.properties`, `application-test.properties`. Dev uses `ddl-auto=update`, prod `validate`.
- Server: port `8181` (`SERVER_PORT`), context path `/restroly`; public routes under `/public/api/v1/**` (a few legacy ones under `/api/v1/**`), secured routes under `/secure/api/v1/**`.
- Schema: Flyway migrations V1 to V5 in `src/main/resources/db/migration` (V1 is a placeholder baseline; entity changes need a new `V<n>` migration).
- Secrets come from environment variables, never committed.

| Variable | Purpose |
|---|---|
| `DB_USERNAME` / `DB_PASSWORD` | Database credentials (default `postgres`/`postgres` in dev) |
| `SPRING_DATASOURCE_URL` | e.g. `jdbc:postgresql://localhost:5432/RestroHub_DB` |
| `JWT_SECRET` | 256-bit signing key |
| `JWT_EXPIRATION` | Access token TTL (default 86400000 ms = 24h) |
| `JWT_REFRESH_EXPIRATION` | Refresh token TTL (default 604800000 ms = 7d) |
| `GOOGLE_OAUTH_CLIENT_ID` | Google OAuth client ID |
| `CORS_ALLOWED_ORIGINS` | Allowed frontend origins |
| `SPRING_PROFILES_ACTIVE` | Profile (default `dev`) |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` | SMTP (password reset emails) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Image upload |
| `WHATSAPP_URL` / `PHONE_ID` / `WHATSAPP_ACCESS_TOKEN` / `WHATSAPP_ORDER_CONFIRMATION_TEMPLATE_NAME` | WhatsApp Cloud API |
| `GOOGLE_OAUTH_ENABLED` | Toggle Google sign-in |

### 3.3 Coding conventions
- `camelCase` methods, `PascalCase` classes, `UPPER_SNAKE_CASE` constants.
- Thin controllers; business logic in services.
- Constructor injection (avoid field `@Autowired`).
- Javadoc on every public service method.
- Every secured endpoint uses `@PreAuthorize("@access.can('<PERMISSION>') and @access.branch(#branchId)")`; `security/Permission` is the only role-to-permission map.

---

## 4. Frontend

| Technology | Version | Role |
|---|---|---|
| React | ^18.2 | UI framework |
| Vite | ^7.3 | Build tool and dev server |
| Tailwind CSS | ^3.4 | Utility-first styling |
| React Router | ^6.30 | Client-side routing |
| Axios | ^1.13 | HTTP client |
| Context API | n/a | Global state (`context/`: Site, Branch, CustomerOrder, Theme, AdminTheme) |
| `@react-oauth/google` | ^0.13 | Google login (`VITE_GOOGLE_CLIENT_ID`) |
| `@stomp/stompjs` + `sockjs-client` | ^7.3 / ^1.6 | Live order dashboard (WebSocket) |
| Formik + Yup | ^2.4 / ^1.7 | Forms and validation |
| Recharts | ^3.7 | Dashboard charts |
| `react-qr-code` | ^2.0 | QR rendering |
| ESLint 9, Prettier 3, lint-staged | n/a | Lint/format (pre-commit hook) |

### 4.1 Structure

```
RestroHub-FrontEnd/src/
├── components/   # admin/, customer/, common/
├── pages/        # admin/, customer/, public/
├── layouts/      # AdminLayout, CustomerLayout, PublicLayout
├── routes/       # index.jsx (route table), ProtectedRoute.jsx
├── services/     # common/api.js (Axios + interceptors), common/authStorage.js, public/ApiService.js, user/profileService.js
├── context/      # SiteContext, BranchContext, CustomerOrderContext, ThemeContext, AdminThemeContext
├── hooks/        # useAuth, useOrderStream, useWebSocketNotifications
├── utils/        # auth.js, subdomain.js
├── styles/       # global.css, landing.css, variables.css
├── App.jsx
└── index.jsx
```

### 4.2 Environment variables

| Variable | Notes |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8181/restroly` (no trailing slash, must not include `/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID` | Same client ID as backend |
| `VITE_NODE_ENV`, `VITE_ENABLE_ANALYTICS` | Listed in older docs; not referenced in `src/` or `.env.example` *(unverified, likely unused)* |

### 4.3 Conventions
- Functional components and hooks only; one component per file, filename equals component name.
- Shared state through `SiteContext` (site data) and `BranchContext` (selected branch); avoid prop-drilling beyond 2 levels.
- Prefer Tailwind utilities over custom CSS.

---

## 5. Data & Storage

| Concern | Choice |
|---|---|
| Primary DB | PostgreSQL 14+, database `RestroHub_DB` |
| ORM | Spring Data JPA / Hibernate |
| Migrations | Flyway (V1 to V5) |
| Caching | Redis *(planned)* |
| Image storage | Cloudinary |

---

## 6. Authentication & Security

- **Google OAuth 2.0** for sign-in; ID token verified by the backend.
- **JWT** access and refresh tokens for API authorization.
- Secured endpoints under `/secure/api/v1/**`; public under `/public/api/v1/**`.
- Writes on `/secure/api/**` require role `ADMIN`, `MANAGER` or `RESTAURANT_OWNER`; STAFF may update order status.
- Roles (`AppRole`): `SUPER_ADMIN`, `ADMIN`, `RESTAURANT_OWNER`, `MANAGER`, `MANAGER_USER`, `STAFF`, `CUSTOMER`. `security/Permission` maps roles to permissions; `security/AccessGuard` (bean `access`) enforces tenant checks.
- Sensitive actions are written to the audit log (`audit/` package, Flyway V2).
- CORS allow-list via `CORS_ALLOWED_ORIGINS`.
- Secrets exclusively via environment variables; `.env` files are git-ignored.

---

## 7. Payments

- **UPI deep links and QR codes** for GPay, PhonePe, Paytm and BHIM, so no payment-gateway SDK is required.
- Payment confirmation approach is an open design item.

---

## 8. Integrations (Roadmap)

| Integration | Horizon |
|---|---|
| WhatsApp Business API | Backend `whatsapp/` package exists (Cloud API config via env); per-restaurant rollout |
| Zomato / Swiggy aggregator sync | Long term |
| AI menu translation (25+ languages) | Long term |

---

## 9. DevOps, Build & Deployment

| Area | Tooling |
|---|---|
| Containers | Docker, Docker Compose (root `docker-compose.yml`: postgres 16, backend, frontend/nginx; needs `.env` with `JWT_SECRET`) |
| Frontend hosting | Vercel or Netlify |
| Backend hosting | Docker image to AWS / GCP / Azure, or WAR on Tomcat |
| VCS | Git and GitHub (branch `gssoc_develop` for contributors) |
| CI | GitHub Actions *(assumption; Actions tab exists in repo)* |

### 9.1 Local development

| Service | Command | URL |
|---|---|---|
| Backend | `cd RestroHub && ./gradlew clean build && ./gradlew bootRun` | `http://localhost:8181/restroly` |
| Swagger | n/a | `http://localhost:8181/restroly/swagger-ui.html` |
| Health | n/a | `http://localhost:8181/restroly/actuator/health` |
| Frontend | `cd RestroHub-FrontEnd && npm install && npm run dev` | `http://localhost:3000` (or next free port) |

### 9.2 Deployment commands

```bash
# All-in-one
docker-compose build && docker-compose up -d

# Frontend (Vercel)
cd RestroHub-FrontEnd && vercel --prod

# Frontend (Netlify)
npm run build && netlify deploy --prod --dir=dist

# Backend image
cd RestroHub && ./gradlew build
docker build -t your-registry/restrohub:latest .
docker push your-registry/restrohub:latest
```

---

## 10. Prerequisites

| Tool | Minimum |
|---|---|
| JDK | 21 |
| Gradle | 8.13 (wrapper) |
| PostgreSQL | 14 |
| Node.js | 18.0 |
| npm | 9.0 |
| Git | Any |
| Editor | VS Code (recommended) |
| Google Cloud account | For OAuth Client ID |

---

## 11. Developer Workflow

- **Branching:** `feature/`, `fix/`, `docs/`, `refactor/`, `test/`, always from `gssoc_develop`.
- **Commits:** Conventional Commits, e.g. `feat(menu): add vegetarian filter`.
- **PR checklist:** `./gradlew build` and `npm run build` pass, tested locally, no secrets committed, README updated for new features.

---

## 12. Common Issues

| Problem | Fix |
|---|---|
| PostgreSQL connection refused | Start the service; test with `psql -U postgres -c "SELECT version();"` |
| Port 8181 in use | Find and kill the process (`lsof -i :8181`) |
| Gradle wrapper JAR missing | `gradle wrapper --gradle-version 8.7` |
| Java version mismatch | Install JDK 21 |
| `npm install` fails | Delete `node_modules` and `package-lock.json`, reinstall |
| API 404s | `VITE_API_BASE_URL` must be `.../restroly` without `/api/v1` |
| Port 3000 busy | `npm run dev -- --port 5173` and add it to `CORS_ALLOWED_ORIGINS` |

---

## 13. Suggested Future Additions

| Need | Candidate |
|---|---|
| Real-time order updates | Done: STOMP/WebSocket (`/ws`) and SSE |
| Caching | Redis (already planned) |
| DB migrations | Done: Flyway |
| Testing | JUnit 5 + Testcontainers (backend); Vitest + React Testing Library (frontend) |
| Media storage | Done: Cloudinary |
| Observability | Micrometer + Prometheus/Grafana |
| Translation | LLM-based translation service |
