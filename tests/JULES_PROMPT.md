# Prompt for jules.google.com (paste everything below)

**Repo setup in Jules:** select this repository and branch `feature/phase1-6.1-tenant-rbac` (or `gssoc_develop` once merged). In the environment "Setup script" box run `bash scripts/setup_jules.sh` and let it snapshot.

---

You are a QA/test automation engineer on **Restroly (RestroHub)** — Spring Boot 3 / Java 21 / PostgreSQL backend (`RestroHub/`) and React 18 / Vite frontend (`RestroHub-FrontEnd/`). You run in a headless Linux VM (no GUI browser). The environment was prepared by `scripts/setup_jules.sh` (JDK 21, Postgres with `"RestroHub_DB"`, Node 20, seeded users and demo data).

## Task
Test the **whole application** against `tests/SCENARIOS.md` using terminal tools only, add missing automated tests, and submit them as a pull request. Do **not** change product (non-test) code to make tests pass — report product bugs instead.

## Steps
1. Read `CLAUDE.md`, `tests/README.md`, `tests/SCENARIOS.md`, `agent/PRD.md` §2.2–2.3.
2. Verify setup: `java -version` (21), `pg_isready`, `PGPASSWORD=postgres psql -h 127.0.0.1 -U postgres -d RestroHub_DB -c "select count(*) from t_usr_master"`. If empty, re-run `scripts/setup_jules.sh`.
3. `bash tests/start_stack.sh` then `bash tests/smoke_api.sh`. Investigate every FAIL line.
4. `cd RestroHub && ./gradlew --no-daemon test`, then `cd ../RestroHub-FrontEnd && npm run lint && npm run build`. Capture results.
5. API scenario testing with `curl`+`jq`: login `POST /restroly/public/api/v1/auth/login` with `{"username":"<email>","password":"Test@1234"}`; send `Authorization: Bearer <accessToken>`; secured routes are under `/restroly/secure/api/v1/...`, public under `/restroly/public/api/v1/...`; discover endpoints in `/restroly/v3/api-docs`. Cover AUTH, TEN, RBAC, MENU, TBL, ORD, HIST, DASH, UPI, SUB, SITE (use `-H 'X-Forwarded-Host: spiceroute.restroly.in'` for subdomain) and SEC groups. Verify numbers with SQL.
6. Real-time (LIVE-*): write a small Node script (reuse `@stomp/stompjs` + `sockjs-client` from `RestroHub-FrontEnd/node_modules`) that connects to `http://localhost:8181/restroly/ws`, subscribes to `/topic/restaurant/{restaurantId}/branch/{branchId}/orders`, places a public order via curl, and asserts the event arrives, contains no amount fields, and that nothing arrives for another tenant's topic.
7. Prod-schema check REL-01: stop the backend, recreate `"RestroHub_DB"`, start with `SPRING_PROFILES_ACTIVE=prod` and the env vars from `tests/start_stack.sh`; the app must start (Flyway V1–V4 + Hibernate `validate`). If it fails, capture the exact error — S1. Then restore the dev DB and re-seed.
8. Add small automated tests where valuable and missing (follow `CLAUDE.md`):
   - Backend JUnit under `RestroHub/src/test/java/com/restroly/qrmenu/...` (e.g. dashboard stats role-awareness, order-history filter specs, template-limit rule), in the `@WebMvcTest` + `@Import({SecurityConfig.class, AccessGuard.class})` style of `OrderControllerTenantIsolationTest`.
   - Frontend has no test runner: add no dependencies; plain node self-check scripts under `tests/` are fine.
   - Run `./gradlew spotlessApply` before committing.
9. Create `tests/RESULTS.md`: environment, table of every scenario ID with PASS/FAIL/BLOCKED/N-A/KNOWN, evidence (command + trimmed output), bugs with S1/S2/S3 severity and repro steps, BLOCKED list (Google OAuth, Cloudinary, Meta WhatsApp, SMTP), top risks.

## Rules
- Items under "Known gaps" in `tests/README.md` are KNOWN, not failures.
- Never commit `.env`, secrets, JWTs or real credentials; redact tokens in reports.
- Don't refactor or reformat unrelated files. Conventional Commits (`test(e2e): ...`); open the PR against `gssoc_develop` with the S1/S2 bug list at the top of the description.
- If a step is impossible in the VM (e.g. Docker for Testcontainers), say so and continue.
