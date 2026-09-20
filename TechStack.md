# Tech Stack

## Restroly (RestroHub) — Digital Menu & Restaurant Management Platform

> Derived from the project `ReadMe.md` (branch `gssoc_develop`). Items marked *(planned)* are not yet implemented; items marked *(assumption)* are inferred and should be verified in the codebase.

---

## 1. At a Glance

| Layer | Technology |
|---|---|
| Frontend | React 18+, Vite, Tailwind CSS, React Router v6+, Axios, Context API |
| Backend | Java 21, Spring Boot, Gradle 8+ |
| Database | PostgreSQL 14+ |
| Cache | Redis *(planned)* |
| Auth | JWT + Google OAuth 2.0 |
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
| Spring Boot | Latest stable | Application framework |
| Gradle | 8.0+ (wrapper 8.7 referenced) | Build tool |
| PostgreSQL | 14+ | Primary database |
| Redis | Planned | Caching layer |
| Swagger / OpenAPI | n/a | Interactive API docs |
| Spring Actuator | n/a | Health checks (`/actuator/health`) |
| Logback | n/a | Logging (`logback-spring.xml`) |
| JPA (Spring Data) | n/a | Data access via `repository/` layer |

### 3.1 Layered structure

```
RestroHub/src/main/java/com/restroly/
├── controller/    # REST endpoints (thin)
├── service/       # Business logic
├── repository/    # JPA data access
├── model/         # Entities / domain
├── dto/           # Request & response DTOs
├── config/        # Spring configuration
└── exception/     # Custom exceptions & handlers
```

### 3.2 Configuration
- Profiles: `application.properties`, `application-dev.properties` (active by default), `application-prod.properties`.
- Server: port `8181`, context path `/restroly`; REST base `/api/v1`, secured routes under `/secure/api/v1`.
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

### 3.3 Coding conventions
- `camelCase` methods, `PascalCase` classes, `UPPER_SNAKE_CASE` constants.
- Thin controllers; business logic in services.
- Constructor injection (avoid field `@Autowired`).
- Javadoc on every public service method.

---

## 4. Frontend

| Technology | Version | Role |
|---|---|---|
| React | 18+ | UI framework |
| Vite | n/a | Build tool and dev server |
| Tailwind CSS | n/a | Utility-first styling |
| React Router | v6+ | Client-side routing |
| Axios | n/a | HTTP client |
| Context API | n/a | Global state (`SiteContext.jsx`) |
| Google OAuth (client) | n/a | Login (`VITE_GOOGLE_CLIENT_ID`) |

### 4.1 Structure

```
RestroHub-FrontEnd/src/
├── components/   # admin/, customer/, common/
├── pages/        # admin/, customer/, public/
├── services/     # api.js (Axios instance + interceptors), ApiService.js
├── context/      # SiteContext.jsx
├── styles/       # global.css, landing.css, variables.css
├── App.jsx
└── main.jsx
```

### 4.2 Environment variables

| Variable | Notes |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:8181/restroly` (no trailing slash, must not include `/api/v1`) |
| `VITE_GOOGLE_CLIENT_ID` | Same client ID as backend |
| `VITE_NODE_ENV` | Optional |
| `VITE_ENABLE_ANALYTICS` | Optional, default `false` |

### 4.3 Conventions
- Functional components and hooks only; one component per file, filename equals component name.
- Shared state through `SiteContext`; avoid prop-drilling beyond 2 levels.
- Prefer Tailwind utilities over custom CSS.

---

## 5. Data & Storage

| Concern | Choice |
|---|---|
| Primary DB | PostgreSQL 14+, database `RestroHub_DB` |
| ORM | Spring Data JPA / Hibernate *(assumption, based on "JPA data access")* |
| Caching | Redis *(planned)* |
| Image storage | Not specified in README; likely object storage or CDN *(assumption, to be decided)* |

---

## 6. Authentication & Security

- **Google OAuth 2.0** for sign-in; ID token verified by the backend.
- **JWT** access and refresh tokens for API authorization.
- Secured endpoints under `/secure/api/v1/**`.
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
| WhatsApp Business API | Long term |
| Zomato / Swiggy aggregator sync | Long term |
| AI menu translation (25+ languages) | Long term |

---

## 9. DevOps, Build & Deployment

| Area | Tooling |
|---|---|
| Containers | Docker, Docker Compose |
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
| Gradle | 8.0 |
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
| Real-time order updates | WebSockets / Server-Sent Events (Spring WebSocket) |
| Caching | Redis (already planned) |
| DB migrations | Flyway or Liquibase |
| Testing | JUnit 5 + Testcontainers (backend); Vitest + React Testing Library (frontend) |
| Media storage | S3-compatible object storage + CDN |
| Observability | Micrometer + Prometheus/Grafana |
| Translation | LLM-based translation service |
