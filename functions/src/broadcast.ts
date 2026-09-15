// Admin broadcast, server-side (PRD-platform-uplift §5.3).
// Replaces the client fan-out that shipped Resend/Termii keys in the app
// bundle. Secrets live in Secret Manager:
//   firebase functions:secrets:set RESEND_KEY
//   firebase functions:secrets:set TERMII_KEY

import {onCall, HttpsError} from "firebase-functions/v2/https";
import {defineSecret} from "firebase-functions/params";
import {logger} from "firebase-functions/v2";
import {admin, db, isAdminIdentity} from "./shared";

const {FieldValue} = admin.firestore;

const RESEND_KEY = defineSecret("RESEND_KEY");
const TERMII_KEY = defineSecret("TERMII_KEY");

const RESEND_FROM =
  process.env.BROADCAST_FROM ?? "ATINUDA <broadcasts@atinuda.africa>";
const TERMII_SENDER = process.env.TERMII_SENDER ?? "Atinuda";

const NOTIFICATION_BATCH = 450;
const PUSH_CHUNK = 100;
const PROVIDER_CHUNK = 10;

type Channel = "push" | "whatsapp" | "email";
type ChannelResult = {sent: number; failed: number};

type BroadcastInput = {
  broadcastId?: string;
  subject?: string;
  body?: string;
  eventSlug?: string;
  audience?: "all_users" | "event_attendees" | "specific_delegates";
  specificUids?: string[];
  phase?: string;
  templateId?: string;
  channels?: Channel[];
};

/**
 * Resolves the ticket-host slug for sub-events. Mirror of the app's
 * getTicketHostSlug for the two known sub-experiences.
 * @param {string} slug Event slug.
 * @return {string} Host slug that owns the attendees collection.
 */
function ticketHostSlug(slug: string): string {
  if (slug === "ceo-dinner-2025-10-08") return "local-to-global-2025";
  if (slug === "azizi-mixer-2025-10-06") return "local-to-global-2025";
  return slug;
}

/**
 * Normalises a phone number to Termii's digits-only format.
 * @param {string} raw Raw phone value.
 * @return {string} Normalised number.
 */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("234")) return digits;
  if (digits.startsWith("0") && digits.length === 11) {
    return `234${digits.slice(1)}`;
  }
  return digits;
}

/**
 * Runs an async task over items in fixed-size chunks, tallying results.
 * @param {string[]} items Items to process.
 * @param {number} size Chunk size.
 * @param {(item: string) => Promise<void>} task Per-item task.
 * @return {Promise<ChannelResult>} Sent/failed tally.
 */
async function inChunks(
  items: string[],
  size: number,
  task: (item: string) => Promise<void>,
): Promise<ChannelResult> {
  let sent = 0;
  let failed = 0;
  for (let i = 0; i < items.length; i += size) {
    const chunk = items.slice(i, i + size);
    const results = await Promise.allSettled(chunk.map(task));
    for (const r of results) {
      if (r.status === "fulfilled") sent++;
      else failed++;
    }
  }
  return {sent, failed};
}

/**
 * Sends one email via Resend.
 * @param {string} key Resend API key.
 * @param {string} to Recipient.
 * @param {string} subject Subject line.
 * @param {string} body Plain-text body.
 */
async function sendEmail(
  key: string,
  to: string,
  subject: string,
  body: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: RESEND_FROM,
      to: [to],
      subject: subject || "Message from ATINUDA",
      text: body,
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

/**
 * Sends one WhatsApp message via Termii.
 * @param {string} key Termii API key.
 * @param {string} phone Recipient phone.
 * @param {string} body Message body.
 */
async function sendWhatsApp(
  key: string,
  phone: string,
  body: string,
): Promise<void> {
  const res = await fetch("https://api.ng.termii.com/api/sms/send", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      api_key: key,
      to: normalisePhone(phone),
      from: TERMII_SENDER,
      sms: body,
      type: "plain",
      channel: "whatsapp",
    }),
  });
  if (!res.ok) throw new Error(`Termii ${res.status}`);
}

/**
 * Sends Expo push notifications in chunks.
 * @param {string[]} tokens Expo push tokens.
 * @param {string} title Notification title.
 * @param {string} body Notification body.
 */
async function sendExpoPush(
  tokens: string[],
  title: string,
  body: string,
): Promise<void> {
  for (let i = 0; i < tokens.length; i += PUSH_CHUNK) {
    const chunk = tokens.slice(i, i + PUSH_CHUNK);
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(
        chunk.map((to) => ({to, title, body, sound: "default"})),
      ),
    }).catch(() => undefined);
  }
}

/** Admin broadcast across push / in-app / WhatsApp / email. */
export const sendBroadcast = onCall(
  {secrets: [RESEND_KEY, TERMII_KEY], timeoutSeconds: 540, memory: "512MiB"},
  async (request) => {
    const auth = request.auth;
    if (!auth) throw new HttpsError("unauthenticated", "Sign in required.");
    const ok = await isAdminIdentity(auth.uid, auth.token.email ?? undefined);
    if (!ok) throw new HttpsError("permission-denied", "Admins only.");

    const input = (request.data ?? {}) as BroadcastInput;
    const subject = (input.subject ?? "").trim();
    const body = (input.body ?? "").trim();
    const eventSlug = (input.eventSlug ?? "").trim();
    const audience = input.audience ?? "event_attendees";
    const channels: Channel[] =
      input.channels && input.channels.length ? input.channels : ["push"];
    if (!body) throw new HttpsError("invalid-argument", "Body is required.");
    if (!eventSlug) {
      throw new HttpsError("invalid-argument", "eventSlug is required.");
    }

    // Idempotency: claim the audit doc first; re-sends of the same id no-op.
    const auditRef = input.broadcastId ?
      db.collection("communityBroadcasts").doc(input.broadcastId) :
      db.collection("communityBroadcasts").doc();
    try {
      await auditRef.create({
        eventSlug,
        audience,
        subject,
        body,
        phase: input.phase ?? "standalone",
        channels,
        ...(input.templateId ? {templateId: input.templateId} : {}),
        sentBy: auth.token.email ?? auth.uid,
        sentAt: FieldValue.serverTimestamp(),
        status: "sending",
      });
    } catch {
      const existing = await auditRef.get();
      logger.warn("duplicate broadcast suppressed", {id: auditRef.id});
      return {
        ok: true,
        duplicate: true,
        recipientCount: existing.data()?.recipientCount ?? 0,
        channelResults: existing.data()?.channelResults ?? {},
      };
    }

    // ── Resolve recipients ──────────────────────────────────────────────
    let uids: string[];
    if (
      audience === "specific_delegates" &&
      input.specificUids &&
      input.specificUids.length
    ) {
      uids = input.specificUids;
    } else if (audience === "all_users" || eventSlug === "all") {
      const snap = await db.collection("users").select().get();
      uids = snap.docs.map((d) => d.id);
    } else {
      const snap = await db
        .collection("events")
        .doc(ticketHostSlug(eventSlug))
        .collection("attendees")
        .select()
        .get();
      uids = snap.docs.map((d) => d.id).filter((id) => !id.includes("@"));
    }
    if (uids.length === 0) {
      await auditRef.set(
        {status: "failed", error: "no recipients"},
        {merge: true},
      );
      throw new HttpsError("failed-precondition", "No recipients found.");
    }

    const message = subject ? `${subject}: ${body}` : body;
    const channelResults: Partial<Record<Channel, ChannelResult>> = {};

    // ── Push + in-app ───────────────────────────────────────────────────
    if (channels.includes("push")) {
      for (let i = 0; i < uids.length; i += NOTIFICATION_BATCH) {
        const chunk = uids.slice(i, i + NOTIFICATION_BATCH);
        const batch = db.batch();
        for (const uid of chunk) {
          const ref = db.collection(`users/${uid}/notifications`).doc();
          batch.set(ref, {
            message,
            createdAt: FieldValue.serverTimestamp(),
          });
        }
        await batch.commit();
      }

      const tokenSnaps = await db.getAll(
        ...uids.map((uid) => db.doc(`pushTokens/${uid}`)),
      );
      const tokens = tokenSnaps
        .map((s) => (s.exists ? (s.data()?.token as string) : ""))
        .filter(
          (t) =>
            t.startsWith("ExponentPushToken[") ||
            t.startsWith("ExpoPushToken["),
        );
      await sendExpoPush(tokens, subject || "ATINUDA", body);
      channelResults.push = {sent: tokens.length, failed: 0};
    }

    // ── WhatsApp / email need profiles ──────────────────────────────────
    if (channels.includes("whatsapp") || channels.includes("email")) {
      const snaps = await db.getAll(
        ...uids.map((uid) => db.doc(`users/${uid}`)),
      );
      const profiles = snaps
        .filter((s) => s.exists)
        .map((s) => s.data() as {phone?: string; email?: string});

      if (channels.includes("whatsapp")) {
        const phones = profiles
          .map((p) => p.phone?.trim())
          .filter((p): p is string => !!p);
        channelResults.whatsapp = await inChunks(
          phones,
          PROVIDER_CHUNK,
          (p) => sendWhatsApp(TERMII_KEY.value(), p, message),
        );
      }
      if (channels.includes("email")) {
        const emails = profiles
          .map((p) => p.email?.trim())
          .filter((e): e is string => !!e);
        channelResults.email = await inChunks(
          emails,
          PROVIDER_CHUNK,
          (e) => sendEmail(RESEND_KEY.value(), e, subject, body),
        );
      }
    }

    await auditRef.set(
      {
        status: "sent",
        recipientCount: uids.length,
        channelResults,
        ...(audience === "specific_delegates" ? {specificUids: uids} : {}),
      },
      {merge: true},
    );

    return {ok: true, recipientCount: uids.length, channelResults};
  },
);
