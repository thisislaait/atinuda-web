# Atinuda web — feature checklist

Atinuda's public site, admin and check-in pages, and the Atinuda 7.0 checkout. It runs on Vercel serverless functions with Firebase (Auth and Firestore), takes NGN payments through Flutterwave's hosted modal, and sends email through Hostinger SMTP. It deliberately runs no servers, queues or background workers of its own yet, so items about those appear under Triggers rather than here.

Run every change through the checks below before calling it done. Decisions and the product profile are in `DECISIONS.md`.

## Checks for every feature

### Access and data
- [ ] Does the route or page show or change anyone's personal data? If so, it checks the caller on the server: the owner (Firebase ID token, `verifyIdToken`) or staff (custom claim `admin: true`). Hiding a link is not a check.
- [ ] If the browser writes to Firestore, does `firestore.rules` in the repo allow exactly that write and nothing broader?
- [ ] Is every new personal-data field added to the data map below, with where it lives and how long it is kept?
- [ ] Does any response, log line or email include more personal data than the reader needs?

### Money
- [ ] Is every price computed on the server from `src/lib/atinuda7Checkout.ts`? The browser never sends an amount the server trusts.
- [ ] Is a payment verified with Flutterwave's API, with the amount, currency and `tx_ref` all checked against the stored order, before anything is issued? (`fulfilOrder` in `src/lib/atinuda7Fulfil.ts`.)
- [ ] Can the action run twice (a double click, the browser and the webhook together, a Flutterwave retry) without issuing twice? Use a Firestore transaction keyed on the order.
- [ ] Do prices on `/pricing` still match `atinuda7Checkout.ts`?
- [ ] Does a change to payments keep pay-in-3 correct? Tickets are issued only when the final instalment clears, and a late or duplicate payment goes to `reviewPayments` rather than changing the order.

### Failure handling
- [ ] Does every outbound call (Flutterwave, SMTP, Firestore) have a timeout?
- [ ] For each dependency, is it written down what happens if it is down? For payments, fail closed: issue nothing and keep the order `pending` for the webhook or reconciliation.
- [ ] Does the route return JSON errors rather than throwing (so the client and Flutterwave see a clear status)?

### Abuse
- [ ] Can an anonymous caller trigger an email, a write or a paid API call? If so, it is rate-limited, and an email can only go to an address the system already holds.
- [ ] Is user-supplied text escaped before it goes into HTML or an email?

### Interface
- [ ] Loading, empty and error states exist for every screen.
- [ ] Keyboard path works and contrast meets WCAG 2.2 AA.
- [ ] Follows the house design system, apart from the project overrides recorded in `DECISIONS.md`.

### Release
- [ ] `npx tsc --noEmit` and `npx eslint` pass, and `npm run build` passes with the dev server stopped (the two share `.next`).
- [ ] The change can be rolled back by redeploying the previous Vercel build.

## Open items (most important first)

1. **Lock down staff pages and attendee-data APIs.** `/admin/full-attendees`, `/admin/checkins` and `/admin/speakers` load for anyone. These API routes return names and emails without a check: `full-attendees`, `attendees`, `attendees-explore`, `checkins-list`, `tickets/by-email`, `get-ticket`. Add the staff check to all of them. Then check Vercel's logs for outside use: if attendee data was pulled by someone outside the team, the NDPA may require it to be reported (72-hour window).
2. **Close the open email relay.** `/api/send-discount` sends any text to any address from the Hostinger account, and inserts `fullName` into the HTML unescaped. `/api/send-one-attendee` sends ticket emails on request. Delete them or put them behind the staff check.
3. **Retire the legacy payment flows.** `/checkout`, `/checkout2`, `/ticket-payment`, `/pay/Flutterwave` and `/tickets/[productKey]/checkout` are live. Their APIs (`pay-verify`, `flw/verify`, `save-ticket`, `pay-claim`) either trust a browser-supplied price or accept any paid amount. Remove them, or redirect to `/pricing/checkout`.
4. **Review the Firestore rules.** They live in the app repo (`~/atinuda/firestore.rules`). Eleven website pages write to Firestore directly; most of those pages are removed under `~/atinuda/docs/platform-split.md`, after which client writes to `orders`, `tickets` and `payments` should be denied.
5. **Reconnect the local folder to git.** `.git` is missing. Clone `thisislaait/atinuda-web` fresh and copy any uncommitted local files across, rather than `git init` in place.
6. **Configure the Flutterwave webhook** (URL `https://www.atinuda.africa/api/checkout/webhook`, secret hash `FLW_SECRET_HASH`), then run one real payment end to end, including closing the tab after paying.
7. **Reconciliation.** Built for Atinuda 7.0: `/staff/payments` and the morning email compare the last 30 days of Flutterwave's successful `ATN7-` transactions with `orders`. Check it against one real payment once live.
8. **Timeout on the Flutterwave verify call** in `fulfilOrder` (for example `AbortSignal.timeout(10_000)`).
9. **Rate-limit `/api/checkout/order`.** Anyone can create pending orders without limit.
10. **Security headers.** Only HSTS is sent. Add a Content Security Policy that allows Flutterwave's script and frames, plus `X-Content-Type-Options`, `Referrer-Policy` and `frame-ancestors`, in `next.config.ts`.
11. **Email authentication.** SPF is set. DMARC is `p=none`. Confirm DKIM is on in Hostinger, then move DMARC to `p=quarantine`.
12. **Error tracking and uptime.** No Sentry or equivalent, no external uptime check, no billing alerts on Vercel, Firebase or Flutterwave.
13. **CI and dependency updates.** No GitHub Actions and no Dependabot. Run typecheck, lint and build on every push to `main`.
14. **Longer ticket numbers.** Six hex characters is 16.7 million per pass type, and a ticket number alone opens its ticket page.
15. **Privacy basics under the NDPA.** A data map (below), a retention period for attendee data after the event, a way to delete or export a person's data, a processor list with agreements (Flutterwave, Google/Firebase, Vercel, Hostinger), and a breach-response owner.

### Data map (to complete)

| Data | Where | Who can read it | Kept for | Deleted how |
|---|---|---|---|---|
| Buyer name, email, phone, company | `orders` | Staff (once item 1 is done) | To define | To define |
| Attendee names and emails | `orders`, `tickets` | Staff, ticket holder | To define | To define |
| Instalment schedule, private pay token, payment records | `orders` | Buyer via private link, staff (the pay token is never sent to the staff page) | To define | To define |
| Yesterday's buyer names, passes and amounts | Daily email to staff inboxes | `STAFF_EMAILS` in `src/lib/staffPayments.ts` | To define | To define |
| Check-ins | `events/{slug}/attendees`, check-in collections | Staff | To define | To define |
| Account profiles | `users` | Owner, staff | To define | To define |

## Triggers

| Deferred item | Bring it in when |
|---|---|
| Queue for webhook and email work | Webhook processing regularly exceeds a few seconds, or email failures need retries |
| Wider audit log | Staff confirmations of bank transfers already write to `auditLog`. Extend it before the first refund, manual ticket change or other staff action |
| Feature flags | A risky change needs a staged rollout |
| Read caching | Pricing or ticket pages become slow or expensive under launch traffic |
| Public status page | Corporate buyers ask for one |
| Penetration test | A sponsor or corporate buyer requires it |
| Company accounts and roles | Group buyers need to manage their own attendees |
| Multi-region | Never for this site unless a contract requires it |
