<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

## Executive assessment

Your PRD defines a strong **digital-menu, direct-ordering, KDS, WhatsApp, UPI, and multi-tenant platform**. The core product direction is much clearer than the earlier “QR menu only” concept, but it is **not yet equivalent to Petpooja or full restaurant POS competitors** because several operational, commercial, security, and integration requirements remain incomplete.

The most important point: **do not build every competitor feature immediately**. First finish a reliable direct-ordering product that restaurants can use daily, then validate paid demand before adding inventory, POS accounting, aggregator integrations, and advanced AI.

## What the PRD already covers

| Area | Current PRD position |
| :-- | :-- |
| Public restaurant website | Dynamic branding, hero, story, contact information, menu, language dropdown |
| Digital menu | Menus, categories, food items, availability toggle |
| Ordering | Guest checkout with name and mobile number |
| QR ordering | Table QR and counter QR with table `0` |
| Payments | UPI deep-link generation to the restaurant VPA |
| Notifications | WhatsApp order confirmation and ready reminder |
| Kitchen operations | KDS with Pending, Preparing, Ready |
| Restaurant management | Branches, tables, QR codes, active menu mapping |
| Website customization | Theme editor, content editor, live preview |
| Access control | Super Admin, Admin, Manager, Manager/User, Staff |
| SaaS governance | Plans, feature catalog, restaurant-plan assignment |
| Bulk menu operations | Excel import and export |
| Waiter assistance | Customer “Call Waiter” request |
| Multi-tenancy | Intended tenant isolation and subdomain model |

These are good foundations for a **restaurant direct-ordering SaaS**, particularly for cafés, dhabas, small restaurants, food trucks, and restaurants that want a simple branded website rather than a complex POS suite.

## Remaining items explicitly marked in PRD

### 1. Subdomain routing

**PRD item:** `restaurantname.restroly.in`.

You still need to implement:

- Wildcard DNS such as `*.restroly.in`.
- Reverse proxy or application-level host resolution.
- Tenant lookup from the HTTP `Host` header.
- Reserved-slug protection, for example `admin`, `api`, `www`, and `app`.
- Restaurant slug uniqueness.
- Slug change policy and redirects.
- HTTPS certificate handling for wildcard subdomains.
- Unknown-restaurant and suspended-restaurant pages.
- Local-development fallback such as `restaurant.restroly.local`.

This is a launch-blocking feature if the product promise includes branded restaurant websites. Until it is complete, use a path-based URL such as:

```text
restroly.in/r/restaurant-slug
```

Then add subdomains after the core ordering flow is stable.

### 2. Branch selector

**PRD item:** persistent branch switcher in the admin header.

The switcher must control the context for:

- Dashboard.
- Orders.
- KDS.
- Tables.
- Menu assignment.
- UPI settings.
- Order history.
- Branch analytics.

Do not rely only on a frontend-selected branch ID. Store the selected branch in frontend state, but validate the user’s branch assignment on every backend request.

Recommended request pattern:

```http
GET /api/v1/orders?branchId=BRANCH_ID
```

Backend validation must confirm:

1. The authenticated user belongs to the restaurant.
2. The user has access to the requested branch.
3. The requested resource belongs to that branch.

### 3. Order history

**PRD item:** date filtering, status sorting, phone search, pagination.

Add these fields and filters:

- Order ID.
- Branch.
- Table or counter.
- Customer name.
- Customer phone.
- Date and time range.
- Order status.
- Payment status: unpaid, payment claimed, paid/verified.
- Order source: table QR, counter QR, staff-created.
- Total amount.
- Pagination and export.

Recommended API:

```http
GET /api/v1/orders/history
  ?branchId=
  &from=
  &to=
  &status=
  &paymentStatus=
  &phone=
  &tableNumber=
  &page=
  &size=
```

Because you deliberately do not verify UPI through a payment gateway, do not label a deep-link click as “paid.” Use clear labels such as:

- Payment link sent.
- Payment reported by customer.
- Payment verified by staff.
- Unpaid.


### 4. Dashboard analytics integration

**PRD item:** connect backend dashboard APIs.

Required initial KPIs:

- Total orders.
- Gross sales.
- Average order value.
- Pending orders.
- Active tables.
- Orders by status.
- Orders by channel.
- Top-selling items.
- Sales by day.
- Sales by hour.
- Cancelled orders.
- Unpaid or payment-pending orders.

Important correction: the PRD should define whether “revenue” means **gross order value** or **verified collected payments**. Since RestroHub does not reconcile UPI automatically, use:

```text
Gross order value = sum of order totals
Verified collected amount = amount manually marked verified by staff
```

Do not advertise payment-derived revenue until the operational payment verification flow exists.

### 5. Free-tier template restrictions

**PRD item:** maximum two templates on the free plan.

You still need to define:

- Which templates are free.
- Whether an existing selected template remains available after downgrade.
- Whether paid templates become read-only after downgrade.
- Number of restaurants per account.
- Number of branches.
- Number of tables.
- Monthly orders.
- Monthly WhatsApp notifications.
- Staff accounts.
- Excel imports.
- Analytics retention.
- KDS access.
- Branding and Restroly watermark rules.

The restriction must be enforced in the backend, not only in `ThemeSelector.jsx`. Otherwise, a user can bypass the UI by directly calling the API.

### 6. Granular role enforcement

**PRD item:** secure Manager/User and Staff permissions using Spring Security.

This is a critical security requirement. You need:

- Backend authorization on every protected endpoint.
- Restaurant and branch ownership checks.
- Role-to-branch assignment checks.
- Resource-level authorization for orders, tables, menus, and settings.
- Frontend route guards only as a usability layer.
- Audit logs for sensitive actions.

Suggested permission model:


| Role | Recommended access |
| :-- | :-- |
| Super Admin | Platform-wide plans, features, users, assignments, suspension |
| Restaurant Admin | Full access to assigned restaurant and branches |
| Manager | Operations, menus, tables, KDS, order history; no billing-plan ownership |
| Manager/User | Read-only menus, tables, orders, and KDS; no payments or financial reports |
| Staff | View operational orders and update allowed statuses; no customer exports, settings, menus, or revenue |

The PRD currently has some uncertainty around Manager and Manager/User. Resolve this before implementing the final authorization model.

## Important PRD gaps

The six `@Todo` items are not the complete backlog. The following areas should be added to the PRD.

### A. Restaurant onboarding and activation

The PRD says that Super Admin links a user to a restaurant, branch, and role. You should specify:

- Registration validation.
- Duplicate email and restaurant handling.
- Approval and rejection states.
- Invitation email.
- Password reset.
- Email verification.
- Restaurant suspension.
- Trial start and expiry.
- Onboarding checklist.
- First-branch creation.
- Initial menu import.
- First QR generation.

A restaurant owner should be able to reach this state:

```text
Register → Approval → Create branch → Add menu → Configure UPI
→ Generate QR → Place test order → Activate website
```


### B. Subscription billing

The current PRD manages plans and feature flags, but it does not fully describe **charging restaurants**.

You need to decide whether RestroHub will use:

- Razorpay Subscriptions.
- Manual UPI payment and admin activation.
- Invoice-based billing.
- Monthly or annual plans.
- Free trial.
- Grace period.
- Automatic downgrade.
- Refunds.
- GST invoices.
- Payment failure handling.

A feature flag only controls access; it does not collect subscription revenue.

Recommended first version:

- Free plan.
- Paid plan activated manually after UPI payment.
- Admin records subscription start and expiry.
- Later integrate Razorpay recurring billing after customer demand is proven.


### C. WhatsApp compliance and delivery reliability

The PRD says Meta Cloud API will send notifications, but it should define:

- Customer opt-in.
- Approved WhatsApp templates.
- Message categories.
- Delivery, failed, and read status.
- Retry policy.
- Rate limits.
- Restaurant phone-number onboarding.
- Template language variants.
- Message cost responsibility.
- What happens if WhatsApp fails.
- Whether order placement succeeds even when notification delivery fails.

Avoid promising “free 1,000 messages” without checking Meta’s current pricing and conversation rules. WhatsApp pricing and template requirements can change.

Operational rule:

```text
Order creation must not fail just because WhatsApp delivery fails.
```

Store notification status separately:

```text
PENDING → SENT → DELIVERED → READ
                 ↘ FAILED
```


### D. UPI payment safety

The direct UPI deep-link approach is commercially attractive, but the PRD must clearly state its limitations:

- A deep link does not prove payment.
- Customers may close the UPI app without paying.
- Staff must verify payment in the merchant’s UPI app or bank statement.
- The system must not automatically mark an order as paid from a link click.
- UPI ID validation is required.
- Amount and order reference should be displayed clearly.
- Duplicate payment and refund handling are not currently automated.

Add a staff action such as:

```text
Mark payment verified
Mark payment disputed
Mark order unpaid
```

Also use an order-specific reference such as:

```text
Restroly Order RH-2026-000123
```


### E. Order reliability and concurrency

Restaurant orders are operationally sensitive. Add:

- Idempotency key for checkout.
- Duplicate-order protection.
- Server-side price calculation.
- Menu availability validation at checkout.
- Stock/availability recheck before order creation.
- Order cancellation rules.
- Restaurant closed/open status.
- Out-of-stock item handling.
- Timeout and retry behavior.
- Database transaction around order and order items.
- Immutable order-price snapshot.

Never trust the total amount sent by the browser. The backend should calculate the total from the current menu price.

### F. KDS requirements

The KDS is one of your strongest competitive features, but it needs more detail:

- Full-screen kitchen mode.
- Large text and touch buttons.
- Sound notification.
- New-order acknowledgement.
- Ticket age timer.
- Priority order.
- Station or kitchen routing.
- Item notes and customer instructions.
- Print fallback.
- Offline/reconnection behavior.
- Order status synchronization.
- Tablet support.
- Auto-refresh or WebSocket/SSE.

Recommended initial status model:

```text
PENDING → ACCEPTED → PREPARING → READY → BILLED
                    ↘ CANCELLED
```

Your current PRD uses `Pending → Preparing`; adding `Accepted` can help the kitchen distinguish unread orders from accepted orders.

### G. Restaurant website functionality

The marketing customizer is useful, but restaurants may expect more than a menu:

- Restaurant logo.
- Cover image.
- Gallery.
- Opening hours.
- Closed/temporarily unavailable banner.
- Location and map link.
- Phone and WhatsApp contact.
- Social links.
- Dietary labels.
- Veg/non-veg indicators.
- Jain-friendly, vegan, and halal tags where applicable.
- Allergen notes.
- Offers and featured items.
- SEO title and description.
- Share preview for WhatsApp.
- Mobile performance.
- RestroHub watermark control by plan.


### H. Menu and catalog depth

Add support for:

- Item variants.
- Add-ons.
- Combos.
- Size selection.
- Quantity limits.
- Preparation notes.
- Tax configuration.
- Service charge configuration.
- Discount rules.
- Meal periods.
- Branch-specific prices.
- Regional-language content.
- Food images.
- Veg/non-veg classification.
- Allergen information.

Without variants and add-ons, common orders such as “large pizza with extra cheese” or “biryani with extra raita” will be difficult to represent.

### I. Privacy, legal, and security

Because you collect customer names and mobile numbers, add:

- Privacy policy.
- Terms of service.
- Restaurant data-processing terms.
- Customer consent for WhatsApp messages.
- Data retention policy.
- Delete/export request process.
- Password hashing.
- JWT expiry and refresh strategy.
- Rate limiting.
- Login attempt protection.
- Input validation.
- File-upload validation.
- Malware-safe image handling.
- Secrets management.
- Backup and restore.
- Audit logs.
- Error monitoring.

Do not store UPI credentials; store only the merchant VPA and payee name required for the deep link.

### J. Observability and support

For a paid SaaS, you need:

- API logs.
- Error tracking.
- Health endpoint.
- Database backups.
- Uptime monitoring.
- WhatsApp delivery logs.
- Order-event audit trail.
- Admin support tickets.
- Restaurant feedback.
- Feature-usage metrics.
- Incident alerts.

The owner must be able to answer: “Why did this order not reach the kitchen?” within minutes.

## Recommended competitive scope

Do not position the first release as a complete Petpooja replacement. Position it as:

> **A commission-free direct ordering and restaurant operations platform for independent Indian restaurants.**

### Phase 1: Sellable MVP

Build these first:

1. Restaurant onboarding and approval.
2. One branch with branch context.
3. Menu, category, food CRUD.
4. Food availability toggle.
5. Guest QR ordering.
6. Table and counter QR.
7. Order board.
8. KDS.
9. WhatsApp confirmation and ready notification.
10. UPI deep link.
11. Staff payment verification.
12. Basic restaurant website.
13. Basic subscription feature enforcement.
14. Backend RBAC and tenant isolation.
15. Order history.
16. Basic dashboard KPIs.

This is enough to charge restaurants and test the business.

### Phase 2: Retention features

Add after 5–10 restaurants actively use the system:

- Multi-branch switching.
- Excel import/export.
- Staff roles.
- Table service requests.
- Sales reports.
- Top-item reports.
- Menu variants and add-ons.
- Discounts.
- Restaurant open/closed mode.
- WhatsApp message templates.
- Customer receipt PDF.
- Exportable order reports.


### Phase 3: Competitive expansion

Add only after validating demand:

- Inventory and ingredient stock.
- Purchase management.
- Vendor management.
- Cloud POS billing.
- Printer support.
- Aggregator integrations.
- Loyalty and offers.
- AI menu translation.
- Advanced analytics.
- API and integrations.
- Enterprise multi-location controls.

Aggregator integrations should not be treated as a four-week guaranteed task. They may require partner approval, commercial agreements, certification, and changing APIs. Make them a later partnership track rather than a core launch dependency.

## Suggested pricing structure

Your pricing should reflect actual feature and messaging costs, not only Oracle hosting costs.


| Plan | Suggested price | Target customer | Included |
| :-- | --: | :-- | :-- |
| Free | ₹0 | Testing and very small outlets | Digital menu, one branch, two templates, basic QR |
| Starter | ₹299/month | Stalls, cafés, small restaurants | Website, unlimited menu items, QR ordering, basic orders, UPI link |
| Growth | ₹699/month | Active dine-in restaurants | KDS, WhatsApp notifications, table QR, order history, analytics, staff access |
| Pro | ₹1,499/month | Larger restaurants and multi-branch operators | Multi-branch, advanced reports, Excel, custom branding, advanced roles |
| Enterprise | Custom | Chains and franchises | SLA, onboarding, custom integrations, account support |

Consider annual pricing:

- Starter: ₹2,990/year.
- Growth: ₹6,990/year.
- Pro: ₹14,990/year.

Avoid giving AI translation, WhatsApp, or payment features unlimited usage until you understand their cost. Use fair-use limits or pass-through pricing.

## Recommended plan-feature mapping

| Feature | Free | Starter | Growth | Pro |
| :-- | --: | --: | --: | --: |
| Digital menu | Yes | Yes | Yes | Yes |
| Website | Basic | Branded | Branded | Custom |
| Templates | 2 | 5 | 10 | All |
| Branches | 1 | 1 | 1 | Multiple |
| QR ordering | Limited/basic | Yes | Yes | Yes |
| UPI deep link | Yes | Yes | Yes | Yes |
| KDS | No | No | Yes | Yes |
| WhatsApp notifications | No or trial | Limited | Included limit | Higher limit |
| Order history | 7 days | 90 days | 1 year | Extended |
| Analytics | Basic | Basic | Standard | Advanced |
| Excel import/export | No | No | Yes | Yes |
| Staff accounts | 1 | 2 | 5 | Custom |
| AI translation | Trial | Add-on | Included limit | Included/high limit |
| Support | Community | Email | Priority | Dedicated |

### Important pricing correction

Do not claim that a ₹499 plan automatically gives restaurants “Petpooja power.” Petpooja and similar systems may include mature POS, billing, inventory, integrations, support, and hardware ecosystems. A more credible message is:

> “RestroHub gives independent restaurants a low-cost direct ordering, digital menu, KDS, WhatsApp, and UPI platform without aggregator commission.”

## Business validation targets

Before investing in advanced features, test these numbers:


| Metric | Initial target |
| :-- | --: |
| Restaurants interviewed | 30 |
| Restaurants using a pilot | 10 |
| Restaurants placing real orders | 5 |
| Paying restaurants | 3 |
| Monthly churn | Below 5% after validation |
| Time to onboard one restaurant | Under 30 minutes |
| Time to create a menu | Under 20 minutes |
| First order after onboarding | Same day |
| Order notification success | Above 98% |
| Menu load time | Under 2 seconds on Indian mobile networks |

Track **activation**, not just signups:

```text
Activated restaurant =
menu published + QR generated + first real order completed
```


## Revised development priority

### P0 — Launch blockers

- Tenant isolation.
- Backend RBAC.
- Checkout validation.
- Order persistence and status flow.
- KDS.
- UPI configuration and payment verification.
- WhatsApp failure handling.
- Branch context.
- Order history.
- Basic subscription enforcement.
- Database backups and logs.


### P1 — First paid release

- Dashboard KPI APIs.
- Website publishing.
- QR download and printing.
- Menu availability.
- Staff permissions.
- Basic analytics.
- Restaurant onboarding.
- Terms, privacy, and consent.
- Billing activation process.


### P2 — Retention and scale

- Multi-branch.
- Excel tools.
- Variants and add-ons.
- Advanced reports.
- Message templates.
- Custom domains or subdomains.
- Customer receipts.
- Inventory.


### P3 — Competitive expansion

- Aggregator integrations.
- Full POS.
- Ingredient inventory.
- Purchase/vendor management.
- Loyalty.
- AI translation.
- Enterprise controls.


## Final recommendation

Your PRD is sufficient to start building a **sellable RestroHub pilot**, but the remaining work is not only UI. The highest-risk unfinished areas are **tenant security, reliable order processing, payment-state clarity, WhatsApp compliance, onboarding, subscription enforcement, and analytics APIs**.

For the first commercial version, complete the P0 and P1 items and onboard 5–10 restaurants. Keep aggregator integrations, full inventory, and AI translation out of the critical path until restaurants demonstrate that they will pay for the core promise: **a branded website, QR ordering, kitchen workflow, WhatsApp updates, and direct UPI payments**.

<span style="display:none">[^1]</span>

<div align="center">⁂</div>

[^1]: https://github.com/rdodiya/RestroHub/blob/gssoc_develop/PRD.md
