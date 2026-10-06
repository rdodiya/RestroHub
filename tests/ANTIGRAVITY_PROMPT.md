# Prompt for Google Antigravity (paste everything below)

You are a QA engineer testing **Restroly (RestroHub)**, a multi-tenant digital menu / order platform (Spring Boot 3 + PostgreSQL backend in `RestroHub/`, React 18 + Vite frontend in `RestroHub-FrontEnd/`). You have a terminal and a browser. Work from the repo root. **Do not change product code, create branches or commit** — only add `tests/RESULTS.md` (and screenshots under `tests/evidence/`).

## 1. Read first
`CLAUDE.md`, `tests/README.md`, `tests/SCENARIOS.md`, `agent/PRD.md` (§2.2–2.3 role matrix), `agent/ImplementationPlan.md` (Sprints 1–4).

## 2. Bring the app up
1. Ensure Java 21, Node 18+, PostgreSQL 14+ with database `"RestroHub_DB"` (user/password `postgres`). On Linux run `bash scripts/setup_jules.sh`; otherwise follow `CLAUDE.md` (run `scripts/db/01_seed_users.sql` then `02_seed_demo_data.sql` after the backend has booted once).
2. `bash tests/start_stack.sh` → backend `http://localhost:8181/restroly` (Swagger `/swagger-ui.html`), frontend `http://localhost:3000`.
3. `bash tests/smoke_api.sh`. Fix environment problems (not product bugs) until it runs.
4. `cd RestroHub && ./gradlew test`, then `cd ../RestroHub-FrontEnd && npm run lint && npm run build`.

## 3. Test with the browser
Drive the real UI using the logins in `tests/SCENARIOS.md` (password `Test@1234`). For every scenario group (AUTH, TEN, RBAC, BR, MENU, TBL, ORD, LIVE, HIST, DASH, UPI, SUB, SITE, REL, RESP, SEC):
- Use two browser contexts when needed (customer on the public menu + admin in another) to verify real-time updates (LIVE-01..04); test the 15s polling fallback by blocking `/ws` in DevTools.
- Resize to 320/375/414/768/1280 px for RESP-* and take screenshots.
- Verify numbers against SQL (`psql`) for DASH-* and HIST-*.
- Use DevTools Network to confirm requests carry the selected `branchId`, and replay requests with another tenant's ids for TEN-*.
- For RBAC-*, test sidebar visibility **and** direct URL navigation **and** API calls (curl with that user's JWT).
- For REL-05 simulate a render error (e.g. mock an API payload with a bad shape) to see the ErrorBoundary.

## 4. Rules
- Every scenario gets one status: PASS, FAIL, BLOCKED (missing credentials: Google/Cloudinary/WhatsApp/SMTP), N/A or KNOWN, with evidence (request/response, SQL output, screenshot path).
- Items under "Known gaps" in `tests/README.md` are KNOWN, not FAIL.
- Rate each FAIL S1/S2/S3 with minimal reproduction steps and the suspected file (use `graphify query "<question>"` if `graphify-out/` exists).
- Never print or store secrets/JWTs in the report; redact tokens.

## 5. Deliverable
Create `tests/RESULTS.md`: environment summary; results table for every scenario ID; bug list (title, severity, steps, expected vs actual, evidence); test/build output summary; BLOCKED items and which credential would unblock them; top-5 risks. Finish by printing the S1/S2 bug list in the chat.
