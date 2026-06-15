<div align="center">

# 🍽️ Restroly
### Digital Menu & Restaurant Management Platform

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GSSOC](https://img.shields.io/badge/GSSOC-2026-blue.svg)](https://gssoc.girlscript.tech/)
[![Java](https://img.shields.io/badge/Java-21-orange.svg)](#-prerequisites)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](#-prerequisites)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791.svg)](#-prerequisites)
[![Gradle](https://img.shields.io/badge/Gradle-8.0+-02303A.svg)](#-prerequisites)

**Empowering Indian Restaurants to Go Digital — Simple, Fast & Powerful!**

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [API Docs](#-api-documentation) • [Contributing](#-contributing) • [Contact](#-contact--support)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [License](#-license)
- [Contact & Support](#-contact--support)

---

## 🎯 About

**Restroly** is a comprehensive digital solution built specifically for Indian restaurants — from street-side dhabas to fine dining establishments. It helps restaurants create digital menus, accept UPI payments, manage orders, and build an online presence with minimal effort and zero technical expertise required.

### Why Restroly?

| Pain Point | How Restroly Solves It |
|-----------|------------------------|
| 🇮🇳 Complex payment integration | Direct UPI links & QR codes — GPay, PhonePe, Paytm, BHIM |
| 📱 No digital presence | Auto-generated restaurant website with live QR menu |
| 🌐 Language barriers | Multi-language menu support (25+ languages — roadmap) |
| 📊 Manual order tracking | Centralized real-time order dashboard |
| 📦 Aggregator dependency | Own your menu & orders — no middleman |

---

## ✨ Features

### ✅ Available Now

| Feature | Description |
|---------|-------------|
| 📱 QR Menu Generation | Scannable QR codes for contactless menu access |
| 📂 Menu Management | Categories, items, images, descriptions |
| 💳 UPI Payment Integration | GPay · PhonePe · Paytm · BHIM direct payment links |
| 🌐 Restaurant Website | Auto-generated landing page with live menu |
| 📊 Order Dashboard | Centralized order management & tracking |
| 🔐 Authentication | Secure JWT-based login for owners & admins |
| 📈 Analytics | Orders, revenue, and popular item tracking |
| 🎨 Customizable Templates | Themes for Cafes, Dhabas, Fine Dining, and more |

### 🚧 In Progress

| Feature | Status |
|---------|--------|
| Multi-branch support | Active development |
| Real-time order updates | Planned |
| Subscription tiers | Planned |

### 🔜 Roadmap

| Timeline | Goals |
|----------|-------|
| **Near term** | Empty-state UX polish · real-time order updates · onboarding improvements |
| **Mid term** | Subscription management · role-based access by plan |
| **Long term** | Zomato & Swiggy aggregator sync · WhatsApp notifications · AI menu translation (25+ languages) |

---

## 🔧 Tech Stack

### Backend
| Technology | Version | Role |
|-----------|---------|------|
| Java | 21 | Primary language |
| Spring Boot | Latest stable | Application framework |
| Gradle | 8.0+ | Build tool |
| PostgreSQL | 14+ | Primary database |
| Redis | Planned | Caching layer |
| Swagger / OpenAPI | — | API documentation |

### Frontend
| Technology | Version | Role |
|-----------|---------|------|
| React | 18+ | UI framework |
| Tailwind CSS | — | Utility-first styling |
| Vite | — | Build tool & dev server |
| Axios | — | HTTP client |
| React Router | v6+ | Client-side routing |
| Context API | — | Global state management |

### DevOps
| Tool | Purpose |
|------|---------|
| Docker & Docker Compose | Containerisation |
| Vercel / Netlify | Frontend hosting |
| Git | Version control |

---

## 📋 Prerequisites

Install the following before you begin:

| Tool | Minimum Version | Download |
|------|----------------|---------|
| JDK | 21 | [Adoptium](https://adoptium.net/) |
| Gradle | 8.0 | [gradle.org](https://gradle.org/install/) |
| PostgreSQL | 14 | [postgresql.org](https://www.postgresql.org/download/) |
| Node.js | 18.0 | [nodejs.org](https://nodejs.org/) |
| npm | 9.0 | Bundled with Node.js |
| Git | Any | [git-scm.com](https://git-scm.com/) |

### Verify your setup

```bash

java -version      # expect 21+
gradle --version   # expect 8.0+
node --version     # expect 18+
npm --version      # expect 9+
psql --version     # expect 14+
git --version

- Node.js 18.0 or higher
- npm 9.0 or higher (comes with Node.js)
- Git
- Code Editor: VS Code (recommended)
```

**For Google OAuth Integration:**
```bash
- Google Cloud Console account (free)
- OAuth 2.0 Client ID from Google Cloud
```

### Verify Installation

```bash
# Check Java version
java -version

# Check Gradle version
gradle --version

# Check Node.js version
node --version

# Check npm version
npm --version

# Verify PostgreSQL (if installed locally)
psql --version

```

---

## 🚀 Quick Start

### 1 · Clone the repository

```bash
git clone https://github.com/rdodiya/RestroHub.git
cd RestroHub

# GSSoC contributors — always work from this branch
git checkout gssoc_develop
git pull origin gssoc_develop
```

---

### 2 · Backend Setup

#### Create the database *(one-time)*

```bash
# Option A
createdb RestroHub_DB

# Option B
psql -U postgres -c 'CREATE DATABASE "RestroHub_DB";'
```

The app connects as `postgres` / `postgres` by default. Override with environment variables if needed:

```bash
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/RestroHub_DB
```


> **Tip:** The active Spring profile is `dev`. Settings load from `application.properties` → `application-dev.properties`. Never commit secrets — use environment variables for `DB_PASSWORD` and `JWT_SECRET`.

#### Build & run

#### 2. Google OAuth Setup (Required for Login)

**Get Google OAuth Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project or select existing
3. Click **"Create Credentials"** → **"OAuth client ID"** → **"Web application"**
4. Add authorized URIs:
   - `http://localhost:5173` (Frontend dev)
   - `http://localhost:3000` (Alternative)
   - Your production domain
5. Copy the **Client ID**

**Set Backend Configuration:**

```bash
export GOOGLE_OAUTH_CLIENT_ID=your_client_id_from_google_cloud
export JWT_SECRET=your-256-bit-secret-key-change-in-production
export JWT_EXPIRATION=86400000
export JWT_REFRESH_EXPIRATION=604800000
```

To generate a secure JWT_SECRET:
```bash
# macOS/Linux
openssl rand -hex 32

# Or Python
python3 -c "import os; print(os.urandom(32).hex())"

# Or Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### 3. Backend configuration (optional)

Most defaults are already in `RestroHub/src/main/resources/application.properties` and `application-dev.properties`. Prefer environment variables for secrets (for example `DB_PASSWORD`, `JWT_SECRET`) instead of committing passwords.

#### 4. Build and run backend


```bash
cd RestroHub

chmod +x gradlew          # first time on macOS/Linux only

./gradlew clean build     # compile & test
./gradlew bootRun         # start the server
```

Once you see `Started` in the terminal, the backend is live:

| URL | What it does |
|-----|-------------|
| `http://localhost:8181/restroly/api/v1` | REST API base path |
| `http://localhost:8181/restroly/swagger-ui.html` | Interactive API docs |
| `http://localhost:8181/restroly/actuator/health` | Health check — expect `{"status":"UP"}` |

---

### 3 · Frontend Setup

Open a **new terminal window**, then:

```bash
cd RestroHub-FrontEnd

npm install                # install dependencies (first time)
cp .env.example .env       # create local env file
```


Edit `.env` and set:

```env
# Spring Boot context path — no trailing slash
VITE_API_BASE_URL=http://localhost:8181/restroly
#### 2. Environment configuration - Google OAuth

Create a `.env` file in `RestroHub-FrontEnd/` (see `.env.example`):

```env
# Frontend API and Google OAuth
VITE_API_BASE_URL=http://localhost:8181/restroly
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

**Important:** Use the **same Google Client ID** from Google Cloud Console as used in backend configuration.

Optional:



VITE_NODE_ENV=development
VITE_ENABLE_ANALYTICS=false
```

```bash
npm run dev
# → http://localhost:3000  (Vite auto-picks the next free port if 3000 is busy)
```

---

### ✅ Verify both services

```bash
# Backend
curl http://localhost:8181/restroly/actuator/health
# → {"status":"UP"}

# Frontend — open in browser
open http://localhost:3000
```

---

## 📐 Architecture

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
               │                             │
               └──────────────┬──────────────┘
                              ▼
                 ┌────────────────────────┐
                 │    PostgreSQL 14+      │
                 │   (Primary Database)   │
                 └────────────────────────┘
```

**Request flow:** Browser → React (Vite / CDN) → Spring Boot REST API → Service layer → PostgreSQL

---

## 📁 Project Structure

```
RestroHub/
│
├── RestroHub/                           # ● Backend — Java / Spring Boot
│   ├── src/main/
│   │   ├── java/com/restroly/
│   │   │   ├── controller/              # REST endpoints (thin layer)
│   │   │   ├── service/                 # Business logic
│   │   │   ├── repository/              # JPA data access
│   │   │   ├── model/                   # Domain / entity classes
│   │   │   ├── dto/                     # Request & response DTOs
│   │   │   ├── config/                  # Spring configuration
│   │   │   └── exception/               # Custom exceptions & handlers
│   │   └── resources/
│   │       ├── application.properties
│   │       ├── application-dev.properties
│   │       ├── application-prod.properties
│   │       └── logback-spring.xml
│   ├── build.gradle
│   └── settings.gradle
│
├── RestroHub-FrontEnd/                  # ● Frontend — React / Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/                   # Admin dashboard components
│   │   │   ├── customer/                # Customer-facing components
│   │   │   └── common/                  # Shared / reusable components
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   ├── customer/
│   │   │   └── public/
│   │   ├── services/
│   │   │   ├── api.js                   # Axios instance & interceptors
│   │   │   └── ApiService.js            # Per-resource API functions
│   │   ├── context/
│   │   │   └── SiteContext.jsx          # Global state (Context API)
│   │   ├── styles/
│   │   │   ├── global.css
│   │   │   ├── landing.css
│   │   │   └── variables.css
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── .env.example                     # Copy this → .env
│   └── .env                             # ← never commit this file
│
├── CONTRIBUTING.md
├── LICENSE
└── READMe.md
```

---

## 📚 API Documentation

Interactive docs are auto-generated by Swagger — no extra setup required.

```
http://localhost:8181/restroly/swagger-ui.html
```

### Endpoint Reference

#### Menus
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/secure/api/v1/menus` | List all menus |
| `POST` | `/secure/api/v1/menus` | Create a menu |
| `PUT` | `/secure/api/v1/menus/{id}` | Update a menu |
| `DELETE` | `/secure/api/v1/menus/{id}` | Delete a menu |

#### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/categories` | List all categories |
| `POST` | `/api/v1/categories` | Create a category |

#### Food Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/foods` | List all food items |
| `POST` | `/api/v1/foods` | Add a food item |
| `PUT` | `/api/v1/foods/{id}` | Update a food item |
| `DELETE` | `/api/v1/foods/{id}` | Delete a food item |

#### Orders
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/v1/orders` | List all orders |
| `POST` | `/api/v1/orders` | Place a new order |
| `GET` | `/api/v1/orders/{id}` | Get order details |

> Full request/response schemas, auth headers, and error codes are documented in Swagger UI.

---

## 🤝 Contributing

All contributions are welcome — bug fixes, features, tests, and docs.

### Branch naming

```
feature/short-description    # new feature
fix/short-description        # bug fix
docs/short-description       # documentation only
refactor/short-description   # code cleanup, no behaviour change
test/short-description       # adding or updating tests
```

> ⚠️ Always branch **from `gssoc_develop`**, never from `main`.

### Contribution workflow

```bash
# 1. Fork on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/RestroHub.git
cd RestroHub

# 2. Add the upstream remote
git remote add upstream https://github.com/rdodiya/RestroHub.git

# 3. Stay up to date
git fetch upstream
git checkout gssoc_develop
git merge upstream/gssoc_develop

# 4. Create your branch
git checkout -b feature/your-feature-name

# 5. Make changes & test locally
#    Backend:
cd RestroHub && ./gradlew clean build && ./gradlew bootRun
#    Frontend:
cd RestroHub-FrontEnd && npm install && npm run dev

# 6. Commit using Conventional Commits
git commit -m "feat(menu): add vegetarian filter to category list"

# 7. Push and open a PR against gssoc_develop
git push origin feature/your-feature-name
```

### Commit message format

```
type(scope): concise description in present tense

Types:
  feat      → new feature
  fix       → bug fix
  docs      → documentation only
  style     → formatting, no logic change
  refactor  → code change, no feature/fix
  test      → adding or updating tests
  chore     → maintenance, dependency updates

Examples:
  feat(orders): add real-time status polling
  fix(auth): handle expired JWT tokens gracefully
  docs(readme): add architecture diagram
```

### PR checklist

Before opening your pull request, confirm:

- [ ] Branched from `gssoc_develop`
- [ ] `./gradlew build` passes with no errors
- [ ] `npm run build` passes with no errors
- [ ] Tested end-to-end locally
- [ ] No `.env` files or secrets committed
- [ ] README updated if a new feature was added
- [ ] PR title and description explain *what* and *why*

### Code style

**Java (Backend)**
- Standard naming: `camelCase` methods, `PascalCase` classes, `UPPER_SNAKE_CASE` constants
- Controllers stay thin — all business logic goes in the service layer
- Use constructor injection; avoid field-level `@Autowired`
- Add Javadoc to every public service method

**React (Frontend)**
- Functional components and hooks only — no class components
- One component per file; filename must match the component name exactly
- Use `SiteContext` for shared state; avoid prop-drilling beyond 2 levels
- Prefer Tailwind utility classes over custom CSS

### Open issues & good first contributions

| Area | Difficulty | Impact |
|------|-----------|--------|
| Frontend ↔ Backend API integration | 🟢 Low | 🔴 High |
| Responsive UI improvements | 🟢 Low | 🔴 High |
| UPI Payment Service | 🟡 Medium | 🔴 High |
| WhatsApp Business API integration | 🟡 Medium | 🔴 High |
| Analytics Dashboard | 🟡 Medium | 🟡 Medium |
| Menu Templates (Cafe, Dhaba, Fine Dining) | 🟢 Easy | 🟡 Medium |
| Multi-language support | 🟢 Easy | 🟡 Medium |
| Aggregator Sync (Zomato / Swiggy) | 🔴 Hard | 🔴 High |

---

## 🚀 Deployment

### Docker (all-in-one)

```bash
docker-compose build          # build images
docker-compose up -d          # start all services
docker-compose logs -f        # tail logs
docker-compose down           # stop and remove containers
```

### Frontend

**Vercel**
```bash
npm install -g vercel
cd RestroHub-FrontEnd
vercel --prod
```

**Netlify**
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Backend

**Docker → Cloud (AWS / GCP / Azure)**
```bash
cd RestroHub
./gradlew build
docker build -t your-registry/restrohub:latest .
docker push your-registry/restrohub:latest
```

**Traditional server (Tomcat)**
```bash
./gradlew build
scp build/libs/restroly-0.0.1-SNAPSHOT-plain.war \
  user@server:/opt/tomcat/webapps/restroly
ssh user@server "systemctl restart tomcat"
```

---

## 🔧 Troubleshooting

### Backend

<details>
<summary><strong>PostgreSQL connection refused</strong></summary>

```bash
# Test the connection
psql -U postgres -c "SELECT version();"

# Start the service
sudo systemctl start postgresql   # Linux
brew services start postgresql    # macOS
# Windows: Start menu → Services → PostgreSQL → Start
```
</details>

<details>
<summary><strong>Port 8181 already in use</strong></summary>

```bash
# macOS / Linux
lsof -i :8181
kill -9 <PID>

# Windows
netstat -ano | findstr :8181
taskkill /PID <PID> /F
```
</details>

<details>
<summary><strong>Gradle wrapper JAR missing</strong></summary>

```bash
gradle wrapper --gradle-version 8.7
```
</details>

<details>
<summary><strong>Build fails — Java version mismatch</strong></summary>

```bash
java -version   # must be 21+
# Download JDK 21 from https://adoptium.net/ if needed
```
</details>


### Frontend

<details>
<summary><strong>npm install fails</strong></summary>

```bash
rm -rf node_modules package-lock.json
npm install
```
</details>

<details>
<summary><strong>API calls returning 404</strong></summary>

```bash
# Confirm backend is running
curl http://localhost:8181/restroly/actuator/health

# Check .env — base URL must NOT end with /api/v1
grep VITE_API_BASE_URL .env
# Correct:   VITE_API_BASE_URL=http://localhost:8181/restroly
# Incorrect: VITE_API_BASE_URL=http://localhost:8181/restroly/api/v1
```
</details>

<details>
<summary><strong>Port 3000 already in use</strong></summary>

```bash
npm run dev -- --port 5173
# Then add http://localhost:5173 to CORS_ALLOWED_ORIGINS in your backend config
```
</details>



## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

| Permission | |
|------------|--|
| ✅ Commercial use | ✅ Modification |
| ✅ Distribution | ✅ Private use |

**Requirement:** Include the original license and copyright notice in any copy or substantial portion.

---

## 📞 Contact & Support

<div align="center">

**Raj Dodiya** — Project Owner

| | |
|--|--|
| 🐙 GitHub | [@rdodiya](https://github.com/rdodiya) |
| 💼 LinkedIn | [@rdodiya](https://www.linkedin.com/in/rdodiya/) |
| 📧 Email | rdodiya2601@gmail.com |
| 🐦 Twitter / X | [@rdodiya2001](https://x.com/rdodiya2001) |
| 📝 Bug reports | [GitHub Issues](https://github.com/rdodiya/RestroHub/issues) |

</div>

When filing a bug report, please include:
1. A clear description of the problem
2. Steps to reproduce it
3. Expected vs. actual behaviour
4. Error logs or screenshots
5. Your OS, Java version, and Node.js version

---

## 🙏 Acknowledgments

- **Spring Boot Team** — for the robust backend framework
- **React Team** — for the powerful UI library
- **Tailwind CSS** — for utility-first, beautiful styling
- **PostgreSQL Community** — for a rock-solid open-source database
- **GSSoC Contributors** — for making Restroly better every day

---

<div align="center">

**Made with ❤️ for Indian Restaurants**

[⬆ Back to top](#-restroly)

</div>
