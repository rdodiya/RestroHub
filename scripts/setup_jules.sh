#!/usr/bin/env bash
# ==============================================================================
# RestroHub Environment Setup Script for Google Jules
# ==============================================================================
# This script sets up the system packages, database, backend, and frontend
# dependencies in the Jules Linux VM environment (repo cloned to /app).
# After successful execution, Jules will snapshot this environment.
# ==============================================================================

set -e

APP_DIR="${APP_DIR:-/app}"
if [ ! -d "$APP_DIR/RestroHub" ] && [ -d "./RestroHub" ]; then
    APP_DIR="$(pwd)"
elif [ ! -d "$APP_DIR/RestroHub" ]; then
    APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
fi

echo "============================================================"
echo "      🚀 RESTROHUB JULES ENVIRONMENT SETUP & SNAPSHOT       "
echo "============================================================"
echo "Working directory: $APP_DIR"

# ------------------------------------------------------------------------------
# 1. System Packages: Java 21 & PostgreSQL
# ------------------------------------------------------------------------------
echo "--- [1/6] Installing system dependencies (Java 21, PostgreSQL) ---"
sudo apt-get update -y
sudo apt-get install -y openjdk-21-jdk postgresql postgresql-contrib curl

# Configure JAVA_HOME to Java 21
export JAVA_HOME="/usr/lib/jvm/java-21-openjdk-amd64"
export PATH="$JAVA_HOME/bin:$PATH"

sudo update-java-alternatives --set /usr/lib/jvm/java-1.21.0-openjdk-amd64 2>/dev/null || \
sudo update-alternatives --set java /usr/lib/jvm/java-21-openjdk-amd64/bin/java 2>/dev/null || true

if [ -f "$HOME/.bashrc" ]; then
    grep -q "JAVA_HOME" "$HOME/.bashrc" || echo "export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64" >> "$HOME/.bashrc"
    grep -q "JAVA_HOME/bin" "$HOME/.bashrc" || echo "export PATH=\$JAVA_HOME/bin:\$PATH" >> "$HOME/.bashrc"
fi

echo "✔ Java version: $(java -version 2>&1 | head -n 1)"

# ------------------------------------------------------------------------------
# 2. Configure Gradle Repository Mirrors (Prevents HTTP 429 Rate Limits)
# ------------------------------------------------------------------------------
echo "--- [2/6] Configuring Gradle repository mirrors ---"
# Google Cloud VMs share IP pools which trigger HTTP 429 rate-limiting from Sonatype Maven Central.
# We inject Google's GCS Maven Central mirror globally into Gradle for plugins, buildscript, and allprojects.
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
echo "✔ Configured Google Cloud Maven Central mirror in ~/.gradle/init.d/01-maven-mirror.gradle"

# ------------------------------------------------------------------------------
# 3. Node.js & npm (Ensure Node.js 18+ or 20 LTS)
# ------------------------------------------------------------------------------
echo "--- [3/6] Verifying Node.js environment ---"
NODE_VERSION=0
if command -v node >/dev/null 2>&1; then
    NODE_VERSION=$(node -v | cut -d'.' -f1 | tr -d 'v')
fi

if [ "$NODE_VERSION" -lt 18 ]; then
    echo "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

echo "✔ Node version: $(node -v)"
echo "✔ npm version: $(npm -v)"

# ------------------------------------------------------------------------------
# 4. PostgreSQL Database Setup
# ------------------------------------------------------------------------------
echo "--- [4/6] Configuring PostgreSQL (RestroHub_DB) ---"
sudo service postgresql start

# Ensure user 'postgres' has password 'postgres'
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Ensure database 'RestroHub_DB' exists
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'RestroHub_DB'" | grep -q 1 || \
    sudo -u postgres psql -c 'CREATE DATABASE "RestroHub_DB" OWNER postgres;'

echo "✔ PostgreSQL running and RestroHub_DB ready."

# ------------------------------------------------------------------------------
# 5. Backend (RestroHub) Dependencies & Test Build
# ------------------------------------------------------------------------------
echo "--- [5/6] Building Backend & Frontend Dependencies ---"
cd "$APP_DIR/RestroHub"
chmod +x ./gradlew

# Remove foojay-resolver-convention from settings.gradle if present
# (Java 21 is already pre-installed; foojay-resolver triggers HTTP 429 when resolving gson from plugins.gradle.org)
echo "rootProject.name = 'restroly'" > settings.gradle

# Strip unversioned flyway-database-postgresql if present in cloned repo
sed -i "/org\.flywaydb:flyway-database-postgresql/d" build.gradle 2>/dev/null || true

echo "Compiling Spring Boot backend classes and test classes..."
./gradlew --no-daemon compileJava compileTestJava

echo "Running backend unit test suite..."
./gradlew --no-daemon test

# ------------------------------------------------------------------------------
# 6. Seed local test users + demo data (scripts/db/*.sql)
# ------------------------------------------------------------------------------
# Tables are created by Hibernate (ddl-auto=update) and Flyway on first start, so the
# backend is started once, the seed scripts run, and the backend is stopped again.
# Skip with SEED_DEMO_DATA=false. Test logins: <role>@restroly.test / Test@1234
# (see scripts/db/01_seed_users.sql).
echo "--- [6/6] Seeding test users and demo data ---"
if [ "${SEED_DEMO_DATA:-true}" = "true" ]; then
    export DB_USERNAME="${DB_USERNAME:-postgres}"
    export DB_PASSWORD="${DB_PASSWORD:-postgres}"
    export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:postgresql://127.0.0.1:5432/RestroHub_DB}"
    # Dev-only secret for this one boot; set JWT_SECRET yourself to reuse tokens.
    export JWT_SECRET="${JWT_SECRET:-$(openssl rand -hex 48 2>/dev/null || echo local-dev-only-jwt-secret-change-me-0123456789abcdef0123456789abcdef)}"
    SEED_PORT="${SEED_PORT:-8181}"

    ./gradlew --no-daemon bootWar -x test
    BOOT_WAR="$(ls build/libs/*.war | grep -v -- '-plain' | head -n 1)"
    SEED_LOG=/tmp/restroly-seed-boot.log
    SERVER_PORT="$SEED_PORT" java -jar "$BOOT_WAR" > "$SEED_LOG" 2>&1 &
    BACKEND_PID=$!

    # Wait for the startup log line, not /actuator/health: health reports DOWN locally
    # when optional integrations (e.g. mail) are not configured.
    echo "Waiting for backend to create the schema (log: $SEED_LOG)..."
    READY=false
    for _ in $(seq 1 60); do
        if grep -q "Started RestaurantApplication" "$SEED_LOG"; then
            READY=true; break
        fi
        if ! kill -0 "$BACKEND_PID" 2>/dev/null; then break; fi
        sleep 3
    done
    kill "$BACKEND_PID" 2>/dev/null || true
    wait "$BACKEND_PID" 2>/dev/null || true

    if [ "$READY" = "true" ]; then
        for SEED_SQL in "$APP_DIR/scripts/db/01_seed_users.sql" "$APP_DIR/scripts/db/02_seed_demo_data.sql"; do
            echo "Running $(basename "$SEED_SQL")..."
            PGPASSWORD="$DB_PASSWORD" psql -v ON_ERROR_STOP=1 -h 127.0.0.1 -U "$DB_USERNAME" -d RestroHub_DB -q -f "$SEED_SQL"
        done
        echo "✔ Seeded test users (password Test@1234) and demo data."
    else
        echo "⚠️  Backend did not become healthy; skipped seeding. Last log lines:"
        tail -n 30 "$SEED_LOG" || true
    fi
else
    echo "SEED_DEMO_DATA=false — skipping seed scripts."
fi

# ------------------------------------------------------------------------------
# Frontend (RestroHub-FrontEnd) Dependencies & Build
# ------------------------------------------------------------------------------
cd "$APP_DIR/RestroHub-FrontEnd"

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
    else
        echo "VITE_API_BASE_URL=http://localhost:8181/restroly" > .env
    fi
fi

echo "Installing frontend npm packages..."
npm install

echo "Verifying frontend production build..."
npm run build

echo "============================================================"
echo "✔ RestroHub setup completed successfully!"
echo "✔ The environment is now ready for Jules snapshotting."
echo "============================================================"
