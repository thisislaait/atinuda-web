import { adminDb } from "@/utils/firebaseAdmin";

export type CheckinRecord = {
  ticketNumber: string;
  checkedIn: boolean;        // true if checkIn.day1 || checkIn.day2
  lastScanAt: string | null; // ISO from lastCheckinAtMs
  scans: number;
  lastScanBy?: string | null;
};

type TicketDoc = {
  ticketNumber?: string;
  lastCheckinAtMs?: number;
  lastCheckinBy?: string | null;
  scanCount?: number;
  checkIn?: Record<string, unknown>;
};

const tn = (s: string) => String(s || "").trim().toUpperCase();

export async function getAll(): Promise<Record<string, CheckinRecord>> {
  const out: Record<string, CheckinRecord> = {};
  const snap = await adminDb.collection("tickets").get();

  snap.forEach((doc) => {
    const d = doc.data() as TicketDoc;
    const id = tn(d.ticketNumber ?? "");
    if (!id) return;

    const flags = (d.checkIn as Record<string, unknown> | undefined) || {};
    const day1 = Boolean(flags.day1);
    const day2 = Boolean(flags.day2);

    const lastAt =
      typeof d.lastCheckinAtMs === "number" ? new Date(d.lastCheckinAtMs).toISOString() : null;

    out[id] = {
      ticketNumber: id,
      checkedIn: day1 || day2,
      lastScanAt: lastAt,
      scans: typeof d.scanCount === "number" ? d.scanCount : 0,
      lastScanBy: (d.lastCheckinBy ?? null) as string | null,
    };
  });

  return out;
}
