# Restroly UI/API QA Run — TEST_RESULTS

Run date: 2026-10-09. Frontend http://localhost:3001, backend http://localhost:8181/restroly (Swagger reachable, 200).
Run halted at step 1: registration fails with HTTP 500, so every later step has no applicant to test.

## 1. Summary

| Step | Feature | Result | HTTP |
|---|---|---|---|
| 1a | Register form: weak password (no uppercase) shows inline validation | PASS | none (client-side, no request sent) |
| 1b | Register roy26002001@gmail.com / "Roy Test Kitchen" with compliant password | FAIL | 500 |
| 1c | Login refused with "verify your email" | BLOCKED (no user exists; login returns 401 "Invalid username or password") | 401 |
| 2 | Show verification link / wait for "verified" | BLOCKED (no verification mail/link generated) | - |
| 3-7 | Pending approval, superadmin approval, role assignment, profile/restaurant/branches/categories/foods/menus/website/tables/orders, negative checks | BLOCKED (depends on step 1b) | - |

## 2. Failed / blocked steps

**1b FAIL — register**
- Did: opened /register in the visible browser, filled Roy / Tester / roy26002001@gmail.com / compliant password (upper, lower, digit, special) / "Roy Test Kitchen", clicked Sign Up.
- Saw: red toast "An unexpected error occurred. Please try again later." Network panel: `POST http://localhost:8181/restroly/public/api/v1/auth/register → 500`. Page stayed on /register; no "check your email" screen.
- Also: an earlier direct API call with the same payload (firstName, lastName, email, password, restaurantName) returned 500 with traceId `ae1075c3`; the UI call is the one retry. Login for the email afterwards returns 401 "Invalid username or password" (twice), so no user was persisted [uncertain whether a partial record exists elsewhere].
- Probable cause: unhandled server exception in register (likely email sending/SMTP or DB/role seed issue); the response is a generic 500 rather than a specific error. Needs the backend log for traceId `ae1075c3`, which I cannot read from the browser.

**1c / 2 / 3-7 BLOCKED** — no applicant account exists.

Note: the supplied test password `roy@1234123` has no uppercase letter and is rejected by the form's password rule, so a compliant variant was used (not recorded here).

## 2b. Re-run (same day, after "re-run" request)

- **1b FAIL again, different error.** Same form values via the visible UI. Toast: "Unable to send email. Please try again later." Network: `POST /restroly/public/api/v1/auth/register → 400`. Login afterwards: 401 "Invalid username or password" (traceId `5fa18ecc`), so no user was persisted (registration is rolled back when the mail send fails).
- Probable cause (updated): outbound email (SMTP/mail provider) is not configured or unreachable in the backend; the earlier 500 was probably the same fault surfacing as an unhandled error. Registration cannot succeed until mail works, so steps 1c–7 remain BLOCKED.
- Bug note: the same fault returned 500 earlier and 400 now, so the error handling for mail failure is inconsistent [uncertain whether config changed between runs].

## 3. Created data inventory

None. No user, restaurant, branch, category, food, menu or order was created. (Nothing deleted or edited either.)

## 4. Bugs found

1. **High — Register returns HTTP 500 for a valid request** (UI and API). Repro: open /register, fill valid fields with a compliant password, submit. Expect "check your email" screen; get toast "An unexpected error occurred. Please try again later." and 500 from `/public/api/v1/auth/register`.
2. **Low — Login API field is `username`, not `email`**; sending `email` gives 400 "Username is required". Not a defect if intended; noted for API consumers.
3. **Low [uncertain] — Server-side password rule unverified.** UI enforces upper/lower/digit/special; whether the API enforces it could not be tested because the API returned 500.

## 5. Untested areas and assumptions

- Everything in steps 1c through 7 is untested.
- Registration form has no phone field (UI and API schema); phone is presumably set later in profile.
- Browser pane is the app's built-in browser; fields were filled via script with ~1s pauses, submit was a real click on the Sign Up button.
- Verification link location in backend log not shown: I have no access to the backend console, and no link was generated.
- Assumed compliant password differs from the supplied one only by capitalising the first letter.
