# AGENTS.md

This file provides guidance and environment instructions to Google's Jules and other AI coding agents when working with code in this repository.

---

## 1. Project Overview

**Restroly (RestroHub)** is an open-source digital menu and restaurant management platform for Indian restaurants (QR menus, UPI payments, order dashboard, analytics, JWT + Google OAuth).

It is a two-app monorepo:
- `RestroHub/` — **Backend**: Java 21, Spring Boot 3.2.6, Gradle, PostgreSQL 14+ (Flyway migrations)
- `RestroHub-FrontEnd/` — **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Axios

---

## 2. Environment Setup (Jules Cloud VM / Linux)

In Jules, the repository is automatically cloned into `/app`.

### Prerequisites
- **Java**: OpenJDK 21
- **Node.js**: 18+ or 20 LTS (`node -v`, `npm -v`)
- **Database**: PostgreSQL 14+ running locally with database `RestroHub_DB`
- **Build Tools**: Gradle wrapper (`RestroHub/gradlew`)

### Quick Setup Script
Execute `./scripts/setup_jules.sh` from the repository root, or run:
```bash
# 1. System packages
sudo apt-get update -y
sudo apt-get install -y openjdk-21-jdk postgresql postgresql-contrib curl

# 2. Configure Google Cloud Maven Central mirror (avoids HTTP 429 rate-limiting)
mkdir -p "$HOME/.gradle/init.d"
cat << 'EOF' > "$HOME/.gradle/init.d/01-maven-mirror.gradle"
gradle.settingsEvaluated { settings ->
    settings.pluginManagement {
        repositories {
            maven {
                name = 'GoogleMavenCentral'
                url = uri('https://maven-central.storage-download.googleapis.com/maven2/')
            }
            gradlePluginPortal()
            mavenCentral()
        }
    }
}
allprojects {
    buildscript {
        repositories {
            maven {
                name = 'GoogleMavenCentral'
                url = uri('https://maven-central.storage-download.googleapis.com/maven2/')
            }
            mavenCentral()
        }
    }
    repositories {
        maven {
            name = 'GoogleMavenCentral'
            url = uri('https://maven-central.storage-download.googleapis.com/maven2/')
        }
        mavenCentral()
    }
}
EOF

# 3. Start and configure PostgreSQL
sudo service postgresql start
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'RestroHub_DB'" | grep -q 1 || \
    sudo -u postgres psql -c 'CREATE DATABASE "RestroHub_DB" OWNER postgres;'

# 4. Setup Backend
cd /app/RestroHub
chmod +x gradlew
echo "rootProject.name = 'restroly'" > settings.gradle
sed -i "/org\.flywaydb:flyway-database-postgresql/d" build.gradle 2>/dev/null || true
./gradlew --no-daemon compileJava compileTestJava

# 5. Setup Frontend
cd /app/RestroHub-FrontEnd
[ ! -f .env ] && cp .env.example .env 2>/dev/null || echo "VITE_API_BASE_URL=http://localhost:8181/restroly" > .env
npm install
npm run build
```

---

## 3. Build & Test Commands

### Backend (`/app/RestroHub` or `./RestroHub`)
```bash
# Compile and build (skip tests for quick check)
./gradlew compileJava compileTestJava

# Run test suite
./gradlew test

# Run a specific test class
./gradlew test --tests "com.restroly.qrmenu.table.service.TableServiceImplTest"

# Format check / auto-format
./gradlew spotlessCheck
./gradlew spotlessApply

# Run Spring Boot backend locally (port 8181, context /restroly)
./gradlew bootRun
```

### Frontend (`/app/RestroHub-FrontEnd` or `./RestroHub-FrontEnd`)
```bash
# Install dependencies
npm install

# Lint & Format
npm run lint
npm run format:check
npm run lint:fix

# Build for production
npm run build

# Run Vite dev server (port 3000)
npm run dev -- --port 3000
```

---

## 4. Architecture & Coding Conventions

### Backend (`RestroHub/`)
- Root package: `com.restroly`.
- Layers:
  - `controller/`: REST endpoints only. Thin layer, no business logic.
  - `service/`: Business logic and transaction management.
  - `repository/`: Spring Data JPA interfaces.
  - `dto/`: Request/Response DTOs. **Never return entities directly from controllers.**
  - `model/`: JPA entities with Lombok and JPA annotations.
  - `config/`: Spring Security, CORS, Swagger, WebSocket configurations.
  - `exception/`: Custom exceptions and `@RestControllerAdvice` handlers.
- Endpoints:
  - Public: `/restroly/api/v1/**`
  - Protected (JWT required): `/restroly/secure/api/v1/**`

### Frontend (`RestroHub-FrontEnd/`)
- Source root: `src/`.
- All API calls **must** go through `services/api.js` or `services/ApiService.js` (never raw `fetch` or direct `axios` in components).
- Global state is handled via React Context API (`context/SiteContext.jsx`).

---

## 5. Branching & Contribution Workflow

- **Base Branch**: Always branch from and open PRs against **`gssoc_develop`** (never `main`).
- **Branch Naming**: `feat/`, `fix/`, `docs/`, `refactor/`, `test/` followed by a short description.
- **Commit Messages**: Conventional Commits format:
  - `feat(scope): description`
  - `fix(scope): description`
  - `test(scope): description`
  - `refactor(scope): description`
- Never hardcode or commit secrets, credentials, or `.env` files.
