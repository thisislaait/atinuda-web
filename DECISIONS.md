# Atinuda web — engineering decisions

Retrospective inception review, 30 October 2026. The site began as a marketing site and now takes payments: the Atinuda 7.0 checkout (`/pricing/checkout`) charges cards through Flutterwave and issues tickets in Firestore. Payments are one of the changes that require this review. It should have run before the checkout shipped; this document records where things stand now.

Anything the code could not settle is marked **Open decision**. Nothing here is assumed.

> **Superseded.** The platform-wide review lives in the app repo: `~/atinuda/DECISIONS.md` (24 October 2026), and the split between app, website and shared backend in `~/atinuda/docs/platform-split.md`. Those win where they differ from this file. One correction: Firestore rules are kept in the app repo (`~/atinuda/firestore.rules`), not missing.

## Product profile

| Question | Answer |
|---|---|
| Users | Event buyers and attendees for Atinuda 7.0 (6–8 October 2027, Lagos), plus staff using the `/admin` and check-in pages. **Open decision:** expected buyers and attendees for 7.0. |
| Consumers or businesses | Mostly individuals. Companies buy group passes, but as single orders; there are no company accounts. |
| Personal data held | Names, emails, phone numbers, companies, attendee lists, check-in records, membership status (APPOEMN), menu choices. **Open decision:** whether the menu forms collect dietary or allergy data, which counts as health data. |
| Money | Yes. NGN payments through Flutterwave's hosted modal; card data never touches our servers. |
| Users' location and residency | Mostly Nigeria, so the Nigeria Data Protection Act 2023 applies. Vercel serves from Frankfurt (`fra1`). **Open decision:** the Firestore region (see Firebase console → Firestore → Location). |
| Regulations | NDPA 2023. PCI DSS stays light (SAQ A) as long as card entry stays inside Flutterwave's modal. |
| Cost of downtime | Highest during sales pushes and on event days, when check-in depends on the site. **Open decision:** an availability target. |
| Real-time | None. |
| Write pattern | Read-heavy and bursty around launches and discount deadlines (early bird ends 31 December 2026). |
| External side effects | Charges cards (via Flutterwave), sends email (Hostinger SMTP). |
| Team and on-call | **Open decision:** who is reachable when payments or check-in fail. |

## Decisions that are expensive to reverse

1. **Tenancy.** None. Group bookings are orders, not organisations. *Revisit if* companies get their own accounts or portal.
2. **Identity.** Firebase Auth (managed), used by the older flows. The new checkout is guest checkout and needs no account. *Gap:* staff accounts have no MFA requirement.
3. **Authorisation.** **Not enforced.** The `/admin/*` pages contain no access check and are publicly reachable. Several API routes return attendee data to anyone (see CHECKLIST.md, Open items 1). Client pages also write directly to Firestore, so Firestore security rules are the only protection, and those rules are not in the repo. **Decision needed:** one server-side admin check (Firebase custom claim `admin: true`, verified with `verifyIdToken`) used by every admin page and admin API.
4. **IDs.** Orders use `ATN7-<time36>-<6 hex>`. Tickets use `ATN7-<prefix>-<6 hex>`: 16.7 million combinations per pass type. A ticket number alone opens `/ticket/[ticketNumber]` and the check-in pages, so it acts as a credential. *Recommendation:* lengthen to at least 10 random characters before volume grows. Older flows use `Date.now()` plus `Math.random()`.
5. **Region.** Vercel `fra1`. Firestore region is an open decision (above).
6. **System of record for money.** The new checkout prices every order on the server (`src/lib/atinuda7Checkout.ts`) and verifies the paid amount before issuing tickets (`src/lib/atinuda7Fulfil.ts`). **The older flows do not:** `/checkout` takes its price from the URL, `pay-verify` accepts whatever amount Flutterwave reports, and `/tickets/[productKey]/checkout` writes an active ticket from the browser. All of these are still live.
7. **Idempotency.** New checkout: one order per `txRef`, and tickets are issued in a Firestore transaction that is a no-op once the order is `paid`. The browser confirmation and the webhook share that path.
8. **Audit log.** None. Order status changes overwrite the order document; admin actions leave no record. *Decision needed* before staff tooling grows: an append-only `auditLog` collection written by the server.
9. **Personal data map.** None yet. See CHECKLIST.md, Open items.
10. **Migrations.** Firestore has no schema. Collections have grown ad hoc, and `orders` now holds two shapes (legacy `save-ticket` and new `ATN7-` orders). No `firestore.rules` or `firestore.indexes.json` in the repo. *Decision:* keep rules and indexes in the repo and deploy them with `firebase deploy --only firestore`.
11. **API versioning.** N/A: only our own pages call the API.
12. **Hosting.** Vercel serverless plus Firebase. Fits the profile. The Flutterwave webhook does its work inline, which is fine at current volume.

## Pay in 3 (agreed with the client, 2 November 2026)

Single-pass orders only, booked by 31 July 2027: 50% at checkout, 25% after 30 days, 25% after 60. Each instalment is a separate Flutterwave payment made through an emailed private link, with no automatic debit, so bank transfer and USSD buyers can use it. Amounts are fixed on the order, so the early bird rate holds while the buyer stays on schedule. Tickets are issued after the final payment. A payment more than 7 days late cancels the booking; refunds are decided case by case by the team.

A daily Vercel Cron job (`/api/checkout/instalment-reminders`, needs `CRON_SECRET`) sends reminders and cancellations. Staff also see progress through a Monday email to `hello@atinuda.africa`. *Revisit* that email now `/staff/payments` shows the same information.

## Staff payments page

`/staff/payments` shows money received on Atinuda 7.0, so staff don't need Flutterwave access to see who paid. It reads `orders` where `eventSlug` is `atinuda-7`, so the 79 Atinuda 6 orders from 2025 are not counted. Each paid instalment is its own payment, and totals are money received with no refunds deducted, because refunds are not recorded here. Payments held for review are listed but not counted until someone checks them.

Access is the Firebase custom claim `admin: true`, checked on the server by `requireStaff` in `src/lib/staffGuards.ts` and granted with `scripts/grant-staff-access.mjs`. This settles the authorisation decision above for new staff routes. The claim was chosen over the app's `@atinuda.africa` rule because that rule does not check the address is verified.

A morning email goes to `STAFF_EMAILS` at 08:00 Lagos time from `/api/staff/daily-summary` (needs `CRON_SECRET`). `staffDigests/{day}` stops a repeated cron delivery from sending twice.

**Local development:** Firebase Admin fails with "Premature close" on Node 22.23, so run the dev server and scripts on Node 20. Production is not affected.

## Bank transfer while Flutterwave is on hold

Flutterwave refuses payments with "Compliance status failure" (seen 3 November 2026), so buyers pay by bank transfer and Flutterwave stays visible but disabled. `FLUTTERWAVE_OPEN` in `src/lib/atinuda7Checkout.ts` turns it back on for every pass, including the ₦200 test pass.

Choosing bank transfer shows the account details straight away, at the owner's request. The order is only created when the buyer presses "I've made the transfer", so a first payment carries the buyer's name as its narration, not an order reference.

Accounts confirmed by the owner: GT Bank `0009210368` for naira, Access Bank `0022136364` for dollars, both Oaken Events Limited. Dollar prices convert at ₦1,400 to $1. Rounding up to the whole dollar is an implementation choice, not something the client specified. Staff totals stay in naira at the order's naira price.

An order holds its price for 3 days, then lapses, but staff can still confirm it if the money arrives late. Buyers must attach a screenshot or receipt before a transfer is marked as sent. Files reach staff only through a staff-checked route. The live storage rules end with a catch-all that lets anyone read and list the bucket, which a more specific rule can't override, so receipts are encrypted with AES-256-GCM before upload and named at random. The key derives from `FIREBASE_SERVICE_ACCOUNT_B64`, so replacing that service account makes stored receipts unreadable.

**Open decision:** the same catch-all exposes `users/` and the signed-in-only speaker files in `events/`. It should be narrowed to the public gallery folders. The rules are not in either repository, only live in Firebase.

Instalments are allowed; staff track them on a spreadsheet and confirm each payment on `/staff/payments`. Only a staff confirmation issues tickets, and each one is written to `auditLog`.

## Invitations

A confirmed order's private page shows each ticket as an invitation, downloadable as an A5 PDF from `/api/checkout/invitation`. Pinyon Script sets the guest's name and Cormorant Garamond the headings, both under the SIL Open Font License. Saol isn't used because its WOFF2 files don't embed cleanly and its licence may not cover PDFs. Names with letters the script lacks fall back to another font, so no letter prints blank. Orders paid through Flutterwave in one go have no private token, so they need one added before they can download an invitation.

## Project-specific overrides of the house design system

The house standard in `~/.claude/CLAUDE.md` is the default. This project deliberately departs from it where the brand requires:

- **Typefaces.** Hanken Grotesk and SaolDisplay site-wide, instead of system sans and Source Serif 4.
- **Accent.** Copper (`#b5622a`) is the brand accent. Forest green stays the colour for savings and success.
- **Staff dashboard.** `/staff/*` is an app, not part of the editorial site, at the owner's request ("a modern SaaS like Mono or Plaid", 2 November 2026). It has its own sidebar, cool white panels, rounded corners and sans-serif figures, and hides the site's nav, footer and cookie notice. The public site keeps the house style.
- **Depth on the checkout.** Soft shadows on the checkout cards and pass tiles, at the owner's request ("not flat", 19 October 2026). Shadows stay off the rest of the site.

## Repository state

As of 30 October 2026 the local folder `/Users/ugoa/atinuda-web` has no `.git` directory. The code matches the last pushed commit (`219e8a1` on `thisislaait/atinuda-web`), so nothing is lost, but the folder is no longer linked to the repository.
