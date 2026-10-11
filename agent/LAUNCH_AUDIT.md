# Launch readiness audit

Date: 2026-10-08. Audited commit: 4407e97 (plus the contrast fixes in this task). Frontend only (`RestroHub-FrontEnd`, production build served with `vite preview` on :4173). The Java spam-filter files (`RestroHub/.../security/spam/`, related test and `application.properties`) are uncommitted by the owner's choice and were not part of this audit.

## Scores (Lighthouse, desktop default run, headless Chrome 154)

| Page | Perf | A11y | Best practices | SEO |
|---|---|---|---|---|
| `/` | 83 | 79 -> 85 | 81 | 100 |
| `/login` | 84 | 95 -> 98 | 81 | 100 |
| `/register` | 84 | 82 -> 86 | 81 | 100 |
| `/privacy-policy` | 83 | 96 | 81 | 100 |

A11y "after" values are from a re-run of the accessibility category only after the fixes below.
`@axe-core/cli` could not run: its bundled ChromeDriver supports Chrome 155 but the installed Chrome is 154.0.8037.98 (`session not created`). No driver or browser was installed. Lighthouse's accessibility category runs axe-core, so its color-contrast, button-name and target-size results were used instead.

## Remaining issues, ranked

1. A11y: icon-only buttons without an accessible name. Landing (a `p-2 text-slate-700` button, likely the mobile menu toggle) and Register (password show/hide toggles, `absolute right-4 ... text-gray-400`, ~Register.jsx:387, 427). Fix: `aria-label`.
2. A11y: no `<main>` landmark on any audited page (`landmark-one-main`); Landing also fails heading-order.
3. A11y (Register): show/hide toggle target is under 24px spacing (`target-size`).
4. Performance: FCP 3.5 s, LCP 3.5 s (lighthouse default throttling). Unused JS ~440 KiB per page; a single >500 kB main chunk (no route code-splitting); render-blocking resources ~900 ms.
5. Best practices 81: a deprecation warning, missing source maps (`valid-source-maps`), bfcache blocked (1 reason).
6. Dead endpoints (below), which break flows at runtime.

## Dead links (internal `to=`/`href=`/`navigate`)

Every internal target was matched against `src/routes/index.jsx`: `/`, `/login`, `/register` (also with `?plan=`), `/forgot-password`, `/privacy-policy`, `/terms-of-service`, `/refund-policy`, `/admin/*` (dashboard, menus, orders, kds, store/branches, store/branches/:id/tables, marketing/website, upi-links, subscriptions, role-management, profile) and Landing anchors `#features #how-it-works #pricing #testimonials` all resolve. `/Restrohub/:restaurantName/:branchId` is the only dynamic public route.
Dead: none. Soft issues:
- `Landing.jsx:367-370` footer: "About Us" points to `#features` and "Contact" to `#testimonials` (not their own sections; a `#contact` section exists at Landing.jsx:931).
- `/admin/marketing/qr-display` is commented out in both the route and Sidebar (not a live link).
- `LiveOrders.jsx:138` uses a plain `href="/admin/orders"` (full page reload) instead of `Link`.

## Frontend API calls without a Spring mapping

| Call | Where | Finding |
|---|---|---|
| `POST /public/api/v1/auth/resend-verification` | Register.jsx:196 | No backend endpoint. |
| `POST /public/api/v1/auth/google` | Login.jsx:263 | Backend `@PostMapping("/google")` is commented out in AuthController.java:144 (Google login returns 404/401). |
| `POST /public/api/v1/reservations` | ApiService.js:101 (used by ReservationsSection.jsx:63) | No controller. |
| `GET /public/api/v1/availability` | ApiService.js:123 | No controller. |
| `POST /public/api/v1/contact` | ApiService.js:149 | No controller. |

Verified present: `auth/register, login, logout, forgot-password, verify-reset-code, reset-password`, `/public/api/v1/orders`, `/public/api/v1/service-requests`, `/public/api/v1/restaurants/{id}`, `/public/api/v1/sites/{id}/config`, `/secure/api/v1/users/fetchRestaurantId`.

## Form validation gaps (client vs backend)

| Form / field | Client | Backend DTO |
|---|---|---|
| Login username | required | `@NotBlank`, `@Size(3-50)` |
| Login password | required (no length) | `@NotBlank`, `@Size(6-100)` |
| Register firstName/lastName/restaurantName | required, min 2 | `@NotBlank` only |
| Register email | required, email format | `@NotBlank`, `@Email` |
| Register password | required, min 8, upper/lower/digit/special | `@NotBlank` only (no strength or length rule) |
| Register confirmPassword | must match | not sent/not validated |
| ForgotPassword email | required, email | `@NotBlank`, `@Email` |
| ForgotPassword code | required, exactly 6 digits | `@NotBlank` only |
| ForgotPassword newPassword | required, 8+, upper/lower/digit/special | `@NotBlank` + `@Pattern` |

Gaps:
- `@Valid @RequestBody` is present on register, login, forgot-password (JSON), verify-reset-code (JSON), reset-password (JSON). The form/query variants of forgot-password, verify-reset-code and reset-password take `@RequestParam` with no validation, and reset-password's variant accepts `newPassword` as a plain param, bypassing the `@Pattern` check.
- Register password strength is enforced client-side only; the API accepts any non-blank password and any name length.
- Login: client lets 1-2 char username/short passwords through, backend rejects them with a generic validation error.
- Reset-password special-character sets differ: client accepts e.g. `;`, `{`, `}`, `[`, `]`, `\`, `|`, `'`, `"`, `:`, `/`, `?`, backtick (and any other char); backend allows only `@$!%*?&~#^()_-+=<>.,` and only A-Za-z0-9 otherwise, so a password the UI accepts can be rejected by the server.
- No `maxLength` on Register/Login inputs.

## Fixed in this task (color-contrast only, Tailwind class changes)

- Landing.jsx footer bottom bar (2 `<p>`): `text-slate-500` -> `text-slate-400` on `#0f172a` (3.75:1 -> passes).
- Login.jsx and Register.jsx "back" link: `text-gray-400 hover:text-gray-300` -> `text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300` (2.53:1 on white -> passes).
- Login.jsx "or" divider label: `text-gray-400` -> `text-gray-600` (keeps `dark:text-gray-500`).
Re-run result: Lighthouse color-contrast audit now passes on `/`, `/login`, `/register`. Prettier/lint-staged may add line-ending noise to these three files.

## Mobile (375px)

Not run at 375px. The only mobile-relevant tooling output: the default Lighthouse run's `target-size` failure on Register (above). Viewport meta and SEO passed (SEO 100).

## Not checked

- axe CLI (driver mismatch, see above); non-contrast axe rules were seen only via Lighthouse.
- Mobile emulation / tap targets at 375px beyond the item above; Lighthouse mobile-profile scores.
- Authenticated and customer pages (`/admin/*`, `/Restrohub/...`), dark mode, keyboard navigation, screen readers.
- Backend behaviour (endpoints verified by reading controller annotations only, not by calling a running server).
- Cookie banner / GA flows, Turnstile mode, and `/terms-of-service`, `/refund-policy`, `/forgot-password` Lighthouse scores.
- Known gap: `docker-compose.yml` does not pass the new `VITE_*` build args or the `SPAM_*` / `TURNSTILE_*` env vars.
