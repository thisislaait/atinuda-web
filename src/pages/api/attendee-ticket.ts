// pages/api/attendee-ticket.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { ATTENDEES, type Attendee } from "@/lib/attendee";
import { generateQRCode } from "@/utils/qr";
import { generateTicketPDF } from "@/utils/pdf";
import { sendConfirmationEmail } from "@/utils/email";
import { getLocationText } from "@/utils/constants";
import { ticketUrl } from "@/utils/links";

type SendBody = {
  all?: boolean;
  emails?: string[];
  dryRun?: boolean;
  mode?: "inline" | "pdf";
};

type ResultRow = {
  email: string;
  ticketNumber: string;
  ok: boolean;
  message?: string;
};

type MailJob = {
  id: string;
  createdAt: string; // ISO
  dryRun: boolean;
  mode: "inline" | "pdf";
  attempted: number;
  skippedInvalid: number;
  sent: number;
  failed: number;
  failures: ResultRow[];
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const BAD_TOKENS = /^(tbc|nan|n\/a|null|undefined|silver\s*sponsor)$/i;

function normalizeEmail(raw?: string | null): string | null {
  if (!raw) return null;
  const s = String(raw).trim().toLowerCase();
  if (!s || BAD_TOKENS.test(s)) return null;
  const parts = s.split(/[\s,;]+/).filter(Boolean);
  for (const p of parts) {
    if (EMAIL_RE.test(p)) return p;
  }
  return null;
}

function chunk<T>(arr: T[], n: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

async function ensureDataDir(): Promise<void> {
  const dataDir = path.join(process.cwd(), "data");
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch {
    // ignore
  }
}

async function readJobsFile(): Promise<MailJob[]> {
  const filePath = path.join(process.cwd(), "data", "mailJobs.json");
  try {
    const raw = await fs.readFile(filePath, "utf8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      // basic validation shape
      return parsed.filter((p) => typeof p === "object" && p !== null) as MailJob[];
    }
    return [];
  } catch {
    return [];
  }
}

async function writeJobsFile(jobs: MailJob[]): Promise<void> {
  const filePath = path.join(process.cwd(), "data", "mailJobs.json");
  await ensureDataDir();
  const payload = JSON.stringify(jobs, null, 2);
  const tmp = filePath + ".tmp";
  await fs.writeFile(tmp, payload, "utf8");
  await fs.rename(tmp, filePath);
}

/** send to one attendee and return ResultRow */
async function sendOne(a: Attendee, mode: "inline" | "pdf", dryRun: boolean): Promise<ResultRow> {
  const to = normalizeEmail(a.email);
  if (!to) {
    return {
      email: String(a.email || ""),
      ticketNumber: String(a.ticketNumber || ""),
      ok: false,
      message: "Invalid or missing email",
    };
  }

  const ticketType = a.ticketType || "General Admission";
  const location = getLocationText(ticketType);

  const url = ticketUrl(a.ticketNumber, a.fullName);

  // generate QR data url (base64)
  let qrDataUrl: string;
  try {
    qrDataUrl = await generateQRCode(url);
  } catch {
    return { email: to, ticketNumber: a.ticketNumber, ok: false, message: "QR generation failed" };
  }

  // *Hostinger util expects a Buffer pdfBuffer.* Generate PDF (even for inline mode) so we always pass a Buffer.
  let pdfBuffer: Buffer;
  try {
    const maybe = await generateTicketPDF(a.fullName, a.ticketNumber, qrDataUrl, location);
    // ensure it's a Buffer
    if (!Buffer.isBuffer(maybe)) {
      // try to coerce if possible
      if (typeof maybe === "string") {
        pdfBuffer = Buffer.from(maybe, "utf8");
      } else {
        return { email: to, ticketNumber: a.ticketNumber, ok: false, message: "PDF generation returned unexpected type" };
      }
    } else {
      pdfBuffer = maybe;
    }
  } catch (err) {
    const em = err instanceof Error ? err.message : String(err);
    return { email: to, ticketNumber: a.ticketNumber, ok: false, message: `PDF generation failed: ${em}` };
  }

  if (!dryRun) {
    try {
      // call Hostinger email util which expects pdfBuffer (Buffer)
      await sendConfirmationEmail({
        to,
        fullName: a.fullName,
        pdfBuffer,
        ticketNumber: a.ticketNumber,
        ticketType,
        location,
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { email: to, ticketNumber: a.ticketNumber, ok: false, message: `Send failed: ${msg}` };
    }
  }

  return { email: to, ticketNumber: a.ticketNumber, ok: true };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const preview = String(req.query.preview || "") === "1";
    const limit = Math.max(1, Math.min(500, Number(req.query.limit || 10)));

    if (!preview) {
      return res.status(200).json({
        total: ATTENDEES.length,
        sampleCount: Math.min(limit, ATTENDEES.length),
        sample: ATTENDEES.slice(0, Math.min(limit, ATTENDEES.length)),
      });
    }

    const subset = ATTENDEES.slice(0, Math.min(limit, ATTENDEES.length));
    const withQr = await Promise.all(
      subset.map(async (a) => ({
        email: normalizeEmail(a.email),
        fullName: a.fullName,
        ticketNumber: a.ticketNumber,
        ticketType: a.ticketType,
        location: getLocationText(a.ticketType || ""),
        qrDataUrl: await generateQRCode(
          `http://localhost:3000/ticket/${encodeURIComponent(a.ticketNumber)}?name=${encodeURIComponent(
            a.fullName
          )}`
        ),
      }))
    );

    return res.status(200).json({
      total: ATTENDEES.length,
      previewCount: withQr.length,
      attendees: withQr,
    });
  }

  if (req.method === "POST") {
    const body = (req.body ?? {}) as SendBody;
    const dryRun = !!body.dryRun;
    const mode: "inline" | "pdf" = body.mode === "pdf" ? "pdf" : "inline";

    // Build target list
    let target: Attendee[] = [];
    if (body.all) {
      target = ATTENDEES;
    } else if (Array.isArray(body.emails) && body.emails.length) {
      const want = new Set(body.emails.map((e) => normalizeEmail(e) || ""));
      target = ATTENDEES.filter((a) => want.has(normalizeEmail(a.email) || ""));
    } else {
      return res.status(400).json({ ok: false, message: "Provide { all: true } or { emails: [...] }" });
    }

    const preFiltered = target.filter((a) => normalizeEmail(a.email));
    const skippedInvalid = target.length - preFiltered.length;

    // Send in batches of 20 (parallel within a batch)
    const BATCH_SIZE = 20;
    const DELAY_MS = 2000;

    const batches = chunk(preFiltered, BATCH_SIZE);
    const results: ResultRow[] = [];

    for (const group of batches) {
      // send the group in parallel
      const settled = await Promise.all(group.map((a) => sendOne(a, mode, dryRun)));
      results.push(...settled);

      // wait a bit between batches to avoid throttling
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, DELAY_MS));
    }

    const okCount = results.filter((r) => r.ok).length;
    const fail = results.filter((r) => !r.ok);

    // Build job record
    const job: MailJob = {
      id: `job-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      createdAt: new Date().toISOString(),
      dryRun,
      mode,
      attempted: preFiltered.length,
      skippedInvalid,
      sent: okCount,
      failed: fail.length,
      failures: fail,
    };

    // persist job (prepend)
    let writeError: string | null = null;
    try {
      const existing = await readJobsFile();
      existing.unshift(job);
      const MAX_HISTORY = 200;
      if (existing.length > MAX_HISTORY) existing.splice(MAX_HISTORY);
      await writeJobsFile(existing);
    } catch (err: unknown) {
      writeError = err instanceof Error ? err.message : String(err);
      // log but don't fail
      // eslint-disable-next-line no-console
      console.error("Failed to write mail job file:", writeError);
    }

    const resp = {
      ok: true,
      dryRun,
      mode,
      attempted: preFiltered.length,
      skippedInvalid,
      sent: okCount,
      failed: fail.length,
      failures: fail,
      jobId: job.id,
      jobSaved: writeError === null,
      jobWriteError: writeError ?? undefined,
    };

    return res.status(200).json(resp);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ ok: false, message: "Method Not Allowed" });
}
