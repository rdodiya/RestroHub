# Restroly — End-to-End Test Kit

Everything an AI testing agent (Antigravity, Google Jules) or a human needs to set up, run and verify the whole app.

| File | Purpose |
|---|---|
| `SCENARIOS.md` | Full scenario matrix (IDs, expectations, severity) |
| `ANTIGRAVITY_PROMPT.md` | Paste into Google Antigravity (browser + terminal agent) |
| `JULES_PROMPT.md` | Paste into jules.google.com (headless Linux VM, no GUI) |
| `start_stack.sh` | Boots Postgres + backend :8181 + frontend :3000 |
| `smoke_api.sh` | curl/jq/psql API checks: logins, RBAC, tenant isolation, checkout |

## Steps (any environment)
1. **Setup once** — `bash scripts/setup_jules.sh` (Linux/Jules: installs JDK 21, Postgres, Node 20, builds, runs unit tests, seeds 8 users + 2 tenants). Locally on Windows/macOS use `scripts/run_local.*` and the seed commands in `CLAUDE.md`.
2. **Start** — `bash tests/start_stack.sh` (logs: `/tmp/restroly-backend.log`, `/tmp/restroly-frontend.log`).
3. **Smoke** — `bash tests/smoke_api.sh`; every line must PASS before UI testing (needs `curl`, `jq`, `psql`).
4. **Automated suites** — `cd RestroHub && ./gradlew test`; `cd RestroHub-FrontEnd && npm run lint && npm run build`.
5. **Scenarios** — walk `SCENARIOS.md` top to bottom (UI in browser, API via curl/Swagger, DB via `psql -h 127.0.0.1 -U postgres -d RestroHub_DB`).
6. **Prod-schema check (REL-01)** — recreate the DB and start with `SPRING_PROFILES_ACTIVE=prod`; the app must boot under `ddl-auto=validate`.
7. **Report** — write `tests/RESULTS.md` (table: ID, PASS/FAIL/BLOCKED/N-A/KNOWN, evidence, severity) plus bugs with repro steps. Don't change product code unless asked; never commit `.env` or secrets.

## Known gaps (record as KNOWN, not regressions)
- No endpoint sets payment status `LINK_SENT` / `VERIFIED_BY_STAFF` → "Verified Collected" stays 0.
- Category/Food have no tenant owner; per-branch manager assignment, `Accepted` order status, onboarding approval, publish toggle and plan limits beyond templates are not built (PHASE1 §6.3/6.5/6.6). Idempotency-Key / unavailable-item / closed-branch checks (§6.2) may also be missing — verify and report.
- Google login, Cloudinary upload, WhatsApp/Meta, SMTP need real credentials → BLOCKED.
- Testcontainers tests skip without Docker.
- Premium template keys in the UI (`classic_v1`, `vibrant_v1`) are placeholders.

## Review of `scripts/setup_jules.sh`
Good bootstrap: JDK 21, Gradle Maven-mirror (avoids HTTP 429), Node 20, Postgres + `"RestroHub_DB"`, compile + unit tests, one boot so Hibernate/Flyway create tables, seeds, then `npm install && npm run build`. Observations:
- It does **not start** the app at the end → use `tests/start_stack.sh`.
- It overwrites `RestroHub/settings.gradle` and `sed`-edits `build.gradle` (the flyway-database-postgresql line no longer exists, so that `sed` is a harmless no-op); both mutate tracked files inside the VM only.
- Seeding boots with the dev profile; the prod `validate` path is not exercised → covered by REL-01.
- Readiness greps `Started RestaurantApplication`; if the main class is renamed seeding silently skips (a warning is printed).
- Step labels were `[x/6]` with a frontend step after 6; now `[x/7]`.
- Needs `sudo`, internet (apt, nodesource, Maven mirror), ~5–8 min; `SEED_DEMO_DATA=false` skips seeding.
- `./gradlew test` includes the Testcontainers class, which skips without Docker (expected on Jules).
