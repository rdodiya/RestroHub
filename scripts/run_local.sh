#!/usr/bin/env bash
# ==============================================================================
# Restroly Local Runner & Setup Script
# Prompts for local parameters, stores in .env.local (.gitignored),
# and launches both Spring Boot backend and React Vite frontend.
# ==============================================================================

set -e

# Project root directory
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ENV_FILE="$ROOT_DIR/.env.local"
FRONTEND_ENV="$ROOT_DIR/RestroHub-FrontEnd/.env"

echo "============================================================"
echo "           🍽️  RESTROLY LOCAL ENVIRONMENT RUNNER            "
echo "============================================================"

# ------------------------------------------------------------------------------
# 1. Java 21 Auto-Detection
# ------------------------------------------------------------------------------
detect_java() {
    local NEED_JAVA=true
    if command -v java >/dev/null 2>&1; then
        CURRENT_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
        if [ "$CURRENT_VER" = "21" ]; then
            NEED_JAVA=false
            echo "✔ Java 21 detected in PATH ($(java -version 2>&1 | head -n 1))"
        fi
    fi

    if [ "$NEED_JAVA" = true ]; then
        echo "Looking for Java 21 installation..."
        CANDIDATES=(
            "D:/Software/jdk-21.0.4"
            "/d/Software/jdk-21.0.4"
            "C:/Program Files/Java/jdk-21"
            "/c/Program Files/Java/jdk-21"
            "C:/Program Files/Java/jdk-21.0.4"
            "/c/Program Files/Java/jdk-21.0.4"
        )
        for cand in "${CANDIDATES[@]}"; do
            if [ -d "$cand" ] && [ -f "$cand/bin/java" -o -f "$cand/bin/java.exe" ]; then
                export JAVA_HOME="$cand"
                export PATH="$cand/bin:$PATH"
                echo "✔ Auto-configured JAVA_HOME=$cand"
                NEED_JAVA=false
                break
            fi
        done

        if [ "$NEED_JAVA" = true ]; then
            echo "⚠️  Java 21 not automatically found. Please ensure Java 21 is installed or set in JAVA_HOME."
        fi
    fi
}
detect_java

# ------------------------------------------------------------------------------
# 2. Check / Load / Prompt Parameters
# ------------------------------------------------------------------------------
RECONFIGURE=false

if [ -f "$ENV_FILE" ]; then
    # Source existing values
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    echo ""
    echo "Saved local configuration found in .env.local:"
    echo "------------------------------------------------------------"
    echo "  Database Type : ${DB_TYPE:-mysql}"
    echo "  Database Host : ${DB_HOST:-localhost}:${DB_PORT:-3306}"
    echo "  Database Name : ${DB_NAME:-RestroHub_DB}"
    echo "  Database User : ${DB_USERNAME:-root}"
    echo "  Google Client : ${GOOGLE_OAUTH_CLIENT_ID:0:25}..."
    echo "  Backend Port  : ${SERVER_PORT:-8181}"
    echo "  Frontend Port : ${FRONTEND_PORT:-3000}"
    echo "------------------------------------------------------------"
    read -r -p "Use saved configuration? [Y/n]: " USE_SAVED
    USE_SAVED=${USE_SAVED:-Y}
    if [[ "$USE_SAVED" =~ ^[Nn] ]]; then
        RECONFIGURE=true
    fi
else
    RECONFIGURE=true
fi

if [ "$RECONFIGURE" = true ]; then
    echo ""
    echo "Configuring local environment parameters (press Enter to accept default):"
    echo ""

    # Database Type
    read -r -p "Database Type [1=MySQL, 2=PostgreSQL] (default: 1): " DB_CHOICE
    DB_CHOICE=${DB_CHOICE:-1}
    if [ "$DB_CHOICE" = "2" ]; then
        DB_TYPE="postgresql"
        DEFAULT_PORT=5432
        DEFAULT_USER="postgres"
        DEFAULT_PASS="postgres"
    else
        DB_TYPE="mysql"
        DEFAULT_PORT=3306
        DEFAULT_USER="root"
        DEFAULT_PASS="admin@123"
    fi

    # Database Host & Port
    read -r -p "Database Host (default: localhost): " INPUT_HOST
    DB_HOST=${INPUT_HOST:-localhost}

    read -r -p "Database Port (default: $DEFAULT_PORT): " INPUT_PORT
    DB_PORT=${INPUT_PORT:-$DEFAULT_PORT}

    # Database Name
    read -r -p "Database Name (default: RestroHub_DB): " INPUT_NAME
    DB_NAME=${INPUT_NAME:-RestroHub_DB}

    # Database Username & Password
    read -r -p "Database Username (default: $DEFAULT_USER): " INPUT_USER
    DB_USERNAME=${INPUT_USER:-$DEFAULT_USER}

    read -r -p "Database Password (default: $DEFAULT_PASS): " INPUT_PASS
    DB_PASSWORD=${INPUT_PASS:-$DEFAULT_PASS}

    # Google Client ID
    DEFAULT_GOOGLE="425243821207-alrvi03ibk7ku4h8chmu53a1malssfud.apps.googleusercontent.com"
    read -r -p "Google OAuth Client ID (default: $DEFAULT_GOOGLE): " INPUT_GOOGLE
    GOOGLE_OAUTH_CLIENT_ID=${INPUT_GOOGLE:-$DEFAULT_GOOGLE}

    # Ports
    read -r -p "Backend Server Port (default: 8181): " INPUT_SERVER_PORT
    SERVER_PORT=${INPUT_SERVER_PORT:-8181}

    read -r -p "Frontend Vite Port (default: 3000): " INPUT_FRONTEND_PORT
    FRONTEND_PORT=${INPUT_FRONTEND_PORT:-3000}

    # JWT Secret
    DEFAULT_JWT="your-256-bit-secret-key-for-local-development-change-in-prod"
    read -r -p "JWT Secret (default: $DEFAULT_JWT): " INPUT_JWT
    JWT_SECRET=${INPUT_JWT:-$DEFAULT_JWT}

    # Save to .env.local
    cat <<EOF > "$ENV_FILE"
# ==============================================================================
# Restroly Local Environment Parameters (DO NOT COMMIT - GITIGNORED)
# Generated on $(date)
# ==============================================================================
DB_TYPE=$DB_TYPE
DB_HOST=$DB_HOST
DB_PORT=$DB_PORT
DB_NAME=$DB_NAME
DB_USERNAME=$DB_USERNAME
DB_PASSWORD=$DB_PASSWORD
GOOGLE_OAUTH_CLIENT_ID=$GOOGLE_OAUTH_CLIENT_ID
SERVER_PORT=$SERVER_PORT
FRONTEND_PORT=$FRONTEND_PORT
JWT_SECRET=$JWT_SECRET
EOF

    echo "✔ Saved parameters to $ENV_FILE"
fi

# ------------------------------------------------------------------------------
# 3. Synchronize Frontend .env
# ------------------------------------------------------------------------------
mkdir -p "$ROOT_DIR/RestroHub-FrontEnd"
cat <<EOF > "$FRONTEND_ENV"
# Generated automatically by run_local.sh
VITE_API_BASE_URL=http://localhost:${SERVER_PORT}/restroly
VITE_GOOGLE_CLIENT_ID=${GOOGLE_OAUTH_CLIENT_ID}
VITE_NODE_ENV=development
EOF
echo "✔ Synchronized $FRONTEND_ENV"

# ------------------------------------------------------------------------------
# 4. Construct Backend Environment Variables
# ------------------------------------------------------------------------------
if [ "$DB_TYPE" = "mysql" ]; then
    SPRING_DATASOURCE_URL="jdbc:mysql://${DB_HOST}:${DB_PORT}/${DB_NAME}?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC"
    DB_DRIVER="com.mysql.cj.jdbc.Driver"
    HIBERNATE_DIALECT="org.hibernate.dialect.MySQL8Dialect"
else
    SPRING_DATASOURCE_URL="jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}"
    DB_DRIVER="org.postgresql.Driver"
    HIBERNATE_DIALECT="org.hibernate.dialect.PostgreSQLDialect"
fi

export SPRING_DATASOURCE_URL
export DB_USERNAME
export DB_PASSWORD
export DB_DRIVER
export SPRING_DATASOURCE_DRIVER_CLASS_NAME="$DB_DRIVER"
export HIBERNATE_DIALECT
export GOOGLE_OAUTH_CLIENT_ID
export JWT_SECRET
export SERVER_PORT
export CORS_ALLOWED_ORIGINS="http://localhost:${FRONTEND_PORT},http://localhost:5173"
export SPRING_PROFILES_ACTIVE="dev"

echo "------------------------------------------------------------"
echo "Starting Restroly stack:"
echo "  Backend  : http://localhost:${SERVER_PORT}/restroly (Swagger: http://localhost:${SERVER_PORT}/restroly/swagger-ui.html)"
echo "  Frontend : http://localhost:${FRONTEND_PORT}"
echo "------------------------------------------------------------"
echo "Press Ctrl+C to stop both servers."
echo ""

# ------------------------------------------------------------------------------
# 5. Launch Backend and Frontend with Clean Process Trapping
# ------------------------------------------------------------------------------
cleanup() {
    echo ""
    echo "Shutting down Restroly servers..."
    if [ -n "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    wait 2>/dev/null || true
    echo "Servers stopped cleanly."
    exit 0
}

trap cleanup INT TERM EXIT

# Start Backend
cd "$ROOT_DIR/RestroHub"
if [ -f "./gradlew" ]; then
    chmod +x ./gradlew
    ./gradlew bootRun &
    BACKEND_PID=$!
else
    gradle bootRun &
    BACKEND_PID=$!
fi

# Start Frontend
cd "$ROOT_DIR/RestroHub-FrontEnd"
npm run dev -- --port "$FRONTEND_PORT" &
FRONTEND_PID=$!

# Wait on background processes
wait $BACKEND_PID $FRONTEND_PID
