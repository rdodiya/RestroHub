# syntax=docker/dockerfile:1
# ---------- Stage 1: build ----------
FROM eclipse-temurin:21-jdk AS build
WORKDIR /workspace

# Cache the Gradle wrapper + dependencies before copying sources
COPY gradlew settings.gradle build.gradle ./
COPY gradle ./gradle
RUN sed -i 's/\r$//' gradlew && chmod +x gradlew
RUN ./gradlew --no-daemon dependencies > /dev/null 2>&1 || true

COPY src ./src
# `assemble` builds the runnable archive without running tests or lint
# (tests/lint run in CI and via the git pre-commit hook).
RUN ./gradlew --no-daemon assemble -x test \
 && mkdir /out \
 && cp "$(ls build/libs/*.jar build/libs/*.war 2>/dev/null | grep -v -- '-plain' | head -n 1)" /out/app.jar

# ---------- Stage 2: runtime ----------
FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
WORKDIR /app
COPY --from=build /out/app.jar app.jar
USER app

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75" \
    SPRING_PROFILES_ACTIVE=dev
EXPOSE 8181

HEALTHCHECK --interval=15s --timeout=5s --start-period=60s --retries=10 \
  CMD wget -qO- http://localhost:8181/restroly/actuator/health | grep -q UP || exit 1

ENTRYPOINT ["sh", "-c", "exec java $JAVA_OPTS -jar /app/app.jar"]
