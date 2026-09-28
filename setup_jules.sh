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
fi

echo "============================================================"
echo "      🚀 RESTROHUB JULES ENVIRONMENT SETUP & SNAPSHOT       "
echo "============================================================"
echo "Working directory: $APP_DIR"

# ------------------------------------------------------------------------------
# 1. System Packages: Java 21 & PostgreSQL
# ------------------------------------------------------------------------------
echo "--- [1/5] Installing system dependencies (Java 21, PostgreSQL) ---"
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
echo "--- [2/5] Configuring Gradle repository mirrors ---"
# Google Cloud VMs share IP pools which can get HTTP 429 from Sonatype Maven Central.
# We inject Google's GCS Maven Central mirror globally into Gradle.
mkdir -p "$HOME/.gradle/init.d"
cat << 'EOF' > "$HOME/.gradle/init.d/01-maven-mirror.gradle"
allprojects {
    repositories {
        maven {
            name = 'GoogleMavenCentral'
            url = uri('https://maven-central.storage-download.googleapis.com/maven2/')
        }
    }
}
EOF
echo "✔ Configured Google Cloud Maven Central mirror in ~/.gradle/init.d/01-maven-mirror.gradle"

# ------------------------------------------------------------------------------
# 3. Node.js & npm (Ensure Node.js 18+ or 20 LTS)
# ------------------------------------------------------------------------------
echo "--- [3/5] Verifying Node.js environment ---"
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
echo "--- [4/5] Configuring PostgreSQL (RestroHub_DB) ---"
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
echo "--- [5/5] Building Backend & Frontend Dependencies ---"
cd "$APP_DIR/RestroHub"
chmod +x ./gradlew

# Strip unversioned flyway-database-postgresql if present in cloned repo
if grep -q "org\.flywaydb:flyway-database-postgresql" "$APP_DIR/RestroHub/build.gradle"; then
    echo "Fixing unversioned flyway-database-postgresql in build.gradle..."
    sed -i "/org\.flywaydb:flyway-database-postgresql/d" "$APP_DIR/RestroHub/build.gradle"
fi

echo "Compiling Spring Boot backend classes and test classes..."
./gradlew --no-daemon compileJava compileTestJava

echo "Running backend unit test suite..."
./gradlew --no-daemon test

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
