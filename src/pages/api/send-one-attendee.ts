// pages/api/send-one-attendee.ts
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
import { ATTENDEES } from "@/lib/attendee";
import { generateQRCode } from "@/utils/qr";
import { generateTicketPDF } from "@/utils/pdf";
import { sendConfirmationEmail } from "@/utils/email";
import { getLocationText } from "@/utils/constants";

type SendOneBody = {
  ticketNumber?: string;
  dryRun?: boolean;
};

type Result = {
  ok: boolean;
  message?: string;
  ticketNumber?: string;
  email?: string;
  jobId?: string;
  jobSaved?: boolean;
  jobWriteError?: string;
};

type MailJob = {
  id: string;
  createdAt: string; // ISO
  dryRun: boolean;
  mode: "single";
  attempted: number;
  skippedInvalid: number;
  sent: number;
  failed: number;
  failures: Array<{ email: string; ticketNumber: string; ok: boolean; message?: string }>;
};

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
    if (Array.isArray(parsed)) return parsed as MailJob[];
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

function normTicketNumber(s: unknown): string {
  return String(s ?? "").trim().toUpperCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Result>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const body = (req.body ?? {}) as SendOneBody;
  const ticketNumber = normTicketNumber(body.ticketNumber);
  const dryRun = !!body.dryRun;

  if (!ticketNumber) {
    return res.status(400).json({ ok: false, message: "Missing ticketNumber" });
  }

  // Find attendee in local library
  const attendee = ATTENDEES.find((a) => String(a.ticketNumber || "").trim().toUpperCase() === ticketNumber);

  if (!attendee) {
    return res.status(404).json({ ok: false, message: `Ticket not found in local attendees: ${ticketNumber}` });
  }

  const toEmail = String(attendee.email || "").trim().toLowerCase();
  if (!toEmail) {
    return res.status(400).json({ ok: false, message: "Attendee has no email address" , ticketNumber });
  }

  // Build job record initially
  const job: MailJob = {
    id: `job-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
    createdAt: new Date().toISOString(),
    dryRun,
    mode: "single",
    attempted: 1,
    skippedInvalid: 0,
    sent: 0,
    failed: 0,
    failures: [],
  };

  // Generate QR and PDF (but don't fail the whole route if generation fails — return useful message)
  let qrDataUrl: string | null = null;
  let pdfBuffer: Buffer | null = null;
  const ticketType = attendee.ticketType || "General Admission";
  const location = getLocationText(ticketType);

  try {
    // If your ticketUrl util is different, keep your pattern; here we use the QR content that points to the ticket page
    const qrTarget = `https://www.atinuda.africa/ticket/${encodeURIComponent(attendee.ticketNumber)}?name=${encodeURIComponent(attendee.fullName || "")}`;
    qrDataUrl = await generateQRCode(qrTarget);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // record failure and return
    job.failed = 1;
    job.failures.push({
      email: toEmail,
      ticketNumber,
      ok: false,
      message: `QR generation failed: ${message}`,
    });
    // Try to save job and respond with error
    try {
      const existing = await readJobsFile();
      existing.unshift(job);
      await writeJobsFile(existing.slice(0, 200));
      return res.status(500).json({ ok: false, message: `QR generation failed: ${message}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: true });
    } catch (we) {
      return res.status(500).json({ ok: false, message: `QR generation failed: ${message}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: false, jobWriteError: (we instanceof Error ? we.message : String(we)) });
    }
  }

  try {
    pdfBuffer = await generateTicketPDF(attendee.fullName, attendee.ticketNumber, qrDataUrl, location);
  } catch {
    // If PDF generation fails we can still attempt to send without attachment, but your sendConfirmationEmail expects pdfBuffer.
    // We'll set pdfBuffer = null and record a failure if sending requires the PDF.
    pdfBuffer = null;
  }

  // If dryRun, don't actually call SMTP — just record what would have happened.
  if (dryRun) {
    job.sent = 0;
    job.failed = 0;
    job.failures = [];
    try {
      const existing = await readJobsFile();
      existing.unshift(job);
      await writeJobsFile(existing.slice(0, 200));
      return res.status(200).json({ ok: true, message: `Dry run: would send to ${toEmail}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: true });
    } catch (we) {
      return res.status(200).json({ ok: true, message: `Dry run: would send to ${toEmail}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: false, jobWriteError: (we instanceof Error ? we.message : String(we)) });
    }
  }

  // Try sending
  try {
    await sendConfirmationEmail({
      to: toEmail,
      fullName: attendee.fullName,
      pdfBuffer: pdfBuffer as Buffer, // if your email util requires a PDF, ensure generateTicketPDF returns Buffer
      ticketType,
      ticketNumber: attendee.ticketNumber,
      location,
    });

    job.sent = 1;
    job.failed = 0;
    job.failures = [];

    // persist job
    let writeError: string | undefined = undefined;
    try {
      const existing = await readJobsFile();
      existing.unshift(job);
      if (existing.length > 200) existing.splice(200);
      await writeJobsFile(existing);
    } catch (we) {
      writeError = we instanceof Error ? we.message : String(we);
    }

    return res.status(200).json({ ok: true, message: `Sent to ${toEmail}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: writeError ? false : true, jobWriteError: writeError });
  } catch (err) {
    const smtpMessage = err instanceof Error ? err.message : String(err);
    job.sent = 0;
    job.failed = 1;
    job.failures.push({ email: toEmail, ticketNumber, ok: false, message: smtpMessage });

    // save job
    let writeError: string | undefined = undefined;
    try {
      const existing = await readJobsFile();
      existing.unshift(job);
      if (existing.length > 200) existing.splice(200);
      await writeJobsFile(existing);
    } catch (we) {
      writeError = we instanceof Error ? we.message : String(we);
    }

    return res.status(500).json({ ok: false, message: `Send failed: ${smtpMessage}`, ticketNumber, email: toEmail, jobId: job.id, jobSaved: writeError ? false : true, jobWriteError: writeError });
  }
}
