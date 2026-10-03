#!/usr/bin/env bash
# ==============================================================================
# Restroly Backend Deployment Script to Oracle Cloud VM (Tomcat 10 / Ubuntu)
# 
# Usage:
#   ./deploy_backend.sh [options]
#
# Environment variables or CLI arguments can override defaults:
#   VM_HOST            : IP of the VM (default: 80.225.219.178)
#   VM_USER            : SSH username (default: ubuntu)
#   SSH_KEY            : Path to private SSH key (.key file)
#   PROD_PROPERTIES    : Path to prod-application.properties
#   SKIP_BUILD         : Set to "true" to skip local Gradle build
# ==============================================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$SCRIPT_DIR/RestroHub"

# Default VM credentials matching run.bat
VM_HOST="${VM_HOST:-80.225.219.178}"
VM_USER="${VM_USER:-ubuntu}"
DEFAULT_KEY="C:/Users/DELL/OneDrive/Documents/restroly/restroly-test1-private-ssh-key-2026-03-29.key"
DEFAULT_PROPS="C:/Users/DELL/OneDrive/Documents/restroly/prod-application.properties"

SSH_KEY="${SSH_KEY:-$DEFAULT_KEY}"
PROD_PROPERTIES="${PROD_PROPERTIES:-$DEFAULT_PROPS}"

echo "============================================================"
echo "          🚀 RESTROLY BACKEND DEPLOYMENT TO VM             "
echo "============================================================"
echo "  Target VM   : $VM_USER@$VM_HOST"
echo "  SSH Key     : $SSH_KEY"
echo "  Properties  : $PROD_PROPERTIES"
echo "============================================================"

# ------------------------------------------------------------------------------
# 1. Validate Prerequisites
# ------------------------------------------------------------------------------
if [ ! -f "$SSH_KEY" ]; then
    echo "❌ ERROR: SSH Key not found at '$SSH_KEY'"
    echo "Please specify SSH_KEY=/path/to/key or set VM_SSH_KEY."
    exit 1
fi

if [ ! -f "$PROD_PROPERTIES" ]; then
    echo "❌ ERROR: Properties file not found at '$PROD_PROPERTIES'"
    exit 1
fi

# Ensure correct SSH key permissions (on Linux/macOS/WSL)
chmod 400 "$SSH_KEY" 2>/dev/null || true

# ------------------------------------------------------------------------------
# 2. Java 21 Auto-Detection for Build
# ------------------------------------------------------------------------------
detect_java() {
    local NEED_JAVA=true
    if command -v java >/dev/null 2>&1; then
        CURRENT_VER=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
        if [ "$CURRENT_VER" = "21" ]; then
            NEED_JAVA=false
        fi
    fi

    if [ "$NEED_JAVA" = true ]; then
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
                break
            fi
        done
    fi
}
detect_java

# ------------------------------------------------------------------------------
# 3. Build Backend WAR Locally
# ------------------------------------------------------------------------------
if [ "$SKIP_BUILD" != "true" ]; then
    echo ""
    echo "🔨 Step 1/5: Building executable WAR with Gradle (bootWar)..."
    cd "$BACKEND_DIR"
    if [ -f "./gradlew" ]; then
        chmod +x ./gradlew
        ./gradlew clean bootWar -x test
    else
        gradle clean bootWar -x test
    fi
else
    echo "⏩ Skipping build (SKIP_BUILD=true)"
fi

WAR_PATH="$BACKEND_DIR/build/libs/restroly-0.0.1-SNAPSHOT.war"
if [ ! -f "$WAR_PATH" ]; then
    # Fallback to plain war if bootWar was not standard name
    WAR_PATH="$BACKEND_DIR/build/libs/restroly-0.0.1-SNAPSHOT-plain.war"
fi

if [ ! -f "$WAR_PATH" ]; then
    echo "❌ ERROR: No WAR file found in $BACKEND_DIR/build/libs/"
    exit 1
fi
echo "✔ Found build artifact: $WAR_PATH ($(du -h "$WAR_PATH" | cut -f1))"

# ------------------------------------------------------------------------------
# 4. Prepare Server Properties (With Tomcat Logging Fix)
# ------------------------------------------------------------------------------
echo ""
echo "📝 Step 2/5: Preparing server application-dev.properties..."
TEMP_PROPS="$BACKEND_DIR/build/application-dev.properties"
mkdir -p "$BACKEND_DIR/build"
cp "$PROD_PROPERTIES" "$TEMP_PROPS"

# Append logging and profile overrides if not present
if ! grep -q "logging.file.path" "$TEMP_PROPS"; then
    cat <<EOF >> "$TEMP_PROPS"

# ===============================
# Tomcat Logging Configuration
# ===============================
logging.file.path=/opt/tomcat/logs
LOG_PATH=/opt/tomcat/logs
logging.level.com.restroly=INFO
EOF
fi
echo "✔ Server properties configured with logging fix."

# ------------------------------------------------------------------------------
# 5. Remote Backup on VM
# ------------------------------------------------------------------------------
echo ""
echo "📦 Step 3/5: Connecting to VM and creating backup of current deployment..."
TIMESTAMP=$(date +%Y-%m-%d_%H%M%S)

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" bash -s <<REMOTE_SCRIPT
    mkdir -p /home/ubuntu/bkps/$TIMESTAMP
    if [ -d "/opt/tomcat/webapps/restroly" ]; then
        sudo cp -r /opt/tomcat/webapps/restroly /home/ubuntu/bkps/$TIMESTAMP/
        echo "✔ Backed up existing webapp to /home/ubuntu/bkps/$TIMESTAMP/restroly"
    fi
REMOTE_SCRIPT

# ------------------------------------------------------------------------------
# 6. Upload WAR & Properties to VM
# ------------------------------------------------------------------------------
echo ""
echo "🚀 Step 4/5: Transferring artifacts via SCP to $VM_HOST..."
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$WAR_PATH" "$VM_USER@$VM_HOST:/home/ubuntu/restroly.war"
scp -i "$SSH_KEY" -o StrictHostKeyChecking=no "$TEMP_PROPS" "$VM_USER@$VM_HOST:/home/ubuntu/application-dev.properties"
echo "✔ Transfer complete."

# ------------------------------------------------------------------------------
# 7. Deploy & Restart Tomcat
# ------------------------------------------------------------------------------
echo ""
echo "⚙️  Step 5/5: Deploying into Tomcat and restarting service..."
ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" bash -s <<'REMOTE_DEPLOY'
    set -e
    echo "Stopping Tomcat service..."
    sudo systemctl stop tomcat

    echo "Clearing old deployment..."
    sudo rm -rf /opt/tomcat/webapps/restroly
    sudo rm -rf /opt/tomcat/webapps/restroly.war

    echo "Extracting new WAR archive to /opt/tomcat/webapps/restroly..."
    sudo mkdir -p /opt/tomcat/webapps/restroly
    sudo unzip -q /home/ubuntu/restroly.war -d /opt/tomcat/webapps/restroly

    echo "Injecting server application-dev.properties..."
    sudo cp /home/ubuntu/application-dev.properties /opt/tomcat/webapps/restroly/WEB-INF/classes/application-dev.properties

    echo "Fixing permissions for tomcat user..."
    sudo chown -R tomcat:tomcat /opt/tomcat/webapps/restroly
    sudo chmod -R 750 /opt/tomcat/webapps/restroly

    echo "Starting Tomcat service..."
    sudo systemctl start tomcat
REMOTE_DEPLOY

# ------------------------------------------------------------------------------
# 8. Health Verification
# ------------------------------------------------------------------------------
echo ""
echo "🔍 Verifying deployment (waiting 15s for Spring Boot initialization)..."
sleep 15

ssh -i "$SSH_KEY" -o StrictHostKeyChecking=no "$VM_USER@$VM_HOST" bash -s <<'REMOTE_CHECK'
    echo "--- Tomcat Service Status ---"
    sudo systemctl is-active tomcat

    echo "--- Health Endpoint Check ---"
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/restroly/actuator/health || true)
    echo "HTTP Status Code: $HTTP_STATUS"

    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Health check PASSED! Spring Boot is UP."
    else
        echo "⚠️ Health check returned HTTP $HTTP_STATUS (Tomcat may still be initializing or starting up)."
    fi

    echo ""
    echo "--- Recent Catalina Logs ---"
    sudo tail -n 25 /opt/tomcat/logs/catalina.out
REMOTE_CHECK

echo ""
echo "============================================================"
echo "          🎉 BACKEND DEPLOYMENT COMPLETED!                 "
echo "============================================================"
echo "  Public Base URL : http://$VM_HOST:8080/restroly"
echo "  Swagger UI Docs : http://$VM_HOST:8080/restroly/swagger-ui.html"
echo "  Health Endpoint : http://$VM_HOST:8080/restroly/actuator/health"
echo "============================================================"
