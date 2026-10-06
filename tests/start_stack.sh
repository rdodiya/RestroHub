#!/usr/bin/env bash
# Starts PostgreSQL (if needed), backend (:8181) and frontend (:3000) in the background
# for end-to-end testing. Run AFTER scripts/setup_jules.sh (or a local setup). Logs: /tmp/restroly-*.log
set -e
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export DB_USERNAME="${DB_USERNAME:-postgres}" DB_PASSWORD="${DB_PASSWORD:-postgres}"
export SPRING_DATASOURCE_URL="${SPRING_DATASOURCE_URL:-jdbc:postgresql://127.0.0.1:5432/RestroHub_DB}"
export JWT_SECRET="${JWT_SECRET:-local-dev-only-jwt-secret-change-me-0123456789abcdef0123456789abcdef}"
export CORS_ALLOWED_ORIGINS="${CORS_ALLOWED_ORIGINS:-http://localhost:3000,http://localhost:5173}"
[ -d /usr/lib/jvm/java-21-openjdk-amd64 ] && export JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64 PATH=/usr/lib/jvm/java-21-openjdk-amd64/bin:$PATH

sudo service postgresql start 2>/dev/null || true

cd "$ROOT/RestroHub"
./gradlew --no-daemon bootWar -x test -q
WAR="$(ls build/libs/*.war | grep -v -- '-plain' | head -n 1)"
nohup java -jar "$WAR" > /tmp/restroly-backend.log 2>&1 &
echo $! > /tmp/restroly-backend.pid
for _ in $(seq 1 60); do grep -q "Started RestaurantApplication" /tmp/restroly-backend.log && break; sleep 3; done
grep -q "Started RestaurantApplication" /tmp/restroly-backend.log || { tail -30 /tmp/restroly-backend.log; echo "backend failed"; exit 1; }
echo "backend up: http://localhost:8181/restroly/swagger-ui.html"

cd "$ROOT/RestroHub-FrontEnd"
[ -f .env ] || cp .env.example .env
nohup npm run dev -- --host 0.0.0.0 --port 3000 > /tmp/restroly-frontend.log 2>&1 &
echo $! > /tmp/restroly-frontend.pid
for _ in $(seq 1 30); do curl -sf http://localhost:3000 >/dev/null && break; sleep 2; done
curl -sf http://localhost:3000 >/dev/null && echo "frontend up: http://localhost:3000" || { tail -20 /tmp/restroly-frontend.log; exit 1; }
