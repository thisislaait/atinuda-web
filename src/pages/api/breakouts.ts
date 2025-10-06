// pages/api/breakouts.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { adminDb } from "@/utils/firebaseAdmin";

type Selections = Record<number | string, string | null>;

type BreakoutPayload = {
  ticket_number: string | null;
  name: string | null;
  email: string | null;
  selections: Selections;
};

class HttpError extends Error {
  public status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

/** Set CORS headers for preflight and normal responses.
 *  IMPORTANT: replace '*' with your production origin (e.g. 'https://atinuda.africa') in production.
 */
function setCorsHeaders(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS, GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Max-Age", "3600");
}

/** Safe stringify for logging */
function stringifyError(e: unknown): string {
  if (e instanceof Error) return e.stack ?? e.message;
  try {
    return JSON.stringify(e, null, 2);
  } catch {
    return String(e);
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure every response has CORS headers
  setCorsHeaders(res);

  // Log incoming method for quick server-side debugging
  console.log(`[breakouts] ${req.method} ${req.url}`);

  // Respond to preflight quickly
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Friendly GET handler: avoids 405 when someone navigates to the URL
  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      message: "POST to this endpoint with JSON body { ticket_number, name, email, selections }",
      exampleCurl:
        "curl -X POST https://your-site.com/api/breakouts -H 'Content-Type: application/json' -d '{\"ticket_number\":\"ATZ-123\",\"name\":\"Jane\",\"email\":\"jane@ex.com\",\"selections\":{\"1\":\"A\"}}'",
    });
  }

  // Only accept POST for the real operation
  if (req.method !== "POST") {
    // This should not normally happen because we handled OPTIONS and GET above,
    // but we keep this guard to be explicit.
    return res.status(405).json({ ok: false, message: "Method not allowed" });
  }

  // Parse and validate JSON body
  let payload: BreakoutPayload;
  try {
    // Next.js already parses JSON body by default when Content-Type is application/json.
    // Guard against missing content-type to help callers.
    if (!req.headers["content-type"] || !String(req.headers["content-type"]).includes("application/json")) {
      return res.status(400).json({ ok: false, message: "Expected application/json content type" });
    }

    payload = req.body as BreakoutPayload;

    if (!payload || typeof payload !== "object") {
      return res.status(400).json({ ok: false, message: "Invalid payload" });
    }
    if (!payload.selections || typeof payload.selections !== "object") {
      return res.status(400).json({ ok: false, message: "Missing selections" });
    }
  } catch (parseErr: unknown) {
    console.error("pages/api/breakouts parse error:", stringifyError(parseErr));
    return res.status(400).json({ ok: false, message: "Malformed JSON" });
  }

  // Choose a deterministic doc id when ticket_number exists, otherwise generate unique id
  const docId =
    payload.ticket_number && payload.ticket_number.trim().length > 0
      ? payload.ticket_number.trim()
      : adminDb.collection("breakoutSelections").doc().id;

  const ref = adminDb.collection("breakoutSelections").doc(docId);

  try {
    // Transaction to enforce first-write-wins
    await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      if (snap.exists) {
        throw new HttpError(409, "Selections already saved for this ticket");
      }

      const docData = {
        ticketNumber: payload.ticket_number ?? null,
        name: payload.name ?? null,
        email: payload.email ?? null,
        selections: payload.selections,
        createdAt: new Date().toISOString(),
        source: "web-form",
      };

      tx.set(ref, docData);
    });

    return res.status(200).json({ ok: true, message: "Saved" });
  } catch (err: unknown) {
    if (err instanceof HttpError && err.status === 409) {
      return res.status(409).json({ ok: false, message: err.message ?? "Already saved" });
    }
    console.error("pages/api/breakouts error:", stringifyError(err));
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
