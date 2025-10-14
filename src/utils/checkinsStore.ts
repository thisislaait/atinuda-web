// // utils/checkinsStore.ts
// import fs from "fs/promises";
// import path from "path";

// export type CheckinRecord = {
//   ticketNumber: string;
//   checkedIn: boolean;
//   lastScanAt: string | null;
//   scans: number;
//   lastScanBy?: string | null;
// };

// function resolvePath(): string {
//   // Vercel: writable tmp. Local/dev: ./data/checkins.json
//   const isVercel = !!process.env.VERCEL;
//   if (isVercel) return "/tmp/checkins.json";
//   return path.join(process.cwd(), "data", "checkins.json");
// }

// async function ensureDir(p: string) {
//   try {
//     await fs.mkdir(path.dirname(p), { recursive: true });
//   } catch {}
// }

// export async function loadStore(): Promise<Record<string, CheckinRecord>> {
//   const file = resolvePath();
//   try {
//     const buf = await fs.readFile(file);
//     const json = JSON.parse(buf.toString());
//     if (json && typeof json === "object") return json as Record<string, CheckinRecord>;
//     return {};
//   } catch {
//     return {};
//   }
// }

// export async function saveStore(store: Record<string, CheckinRecord>): Promise<void> {
//   const file = resolvePath();
//   await ensureDir(file);
//   await fs.writeFile(file, JSON.stringify(store, null, 2), "utf8");
// }

// export async function getCheckin(ticketNumber: string): Promise<CheckinRecord | null> {
//   const store = await loadStore();
//   return store[ticketNumber] ?? null;
// }

// export async function setCheckin(
//   ticketNumber: string,
//   checked: boolean,
//   checkerUid: string | null = null
// ): Promise<CheckinRecord> {
//   const store = await loadStore();
//   const nowIso = new Date().toISOString();
//   const prev = store[ticketNumber];

//   const next: CheckinRecord = {
//     ticketNumber,
//     checkedIn: checked,
//     lastScanAt: checked ? nowIso : prev?.lastScanAt ?? null,
//     scans: (prev?.scans ?? 0) + 1,
//     lastScanBy: checkerUid,
//   };

//   store[ticketNumber] = next;
//   await saveStore(store);
//   return next;
// }

// export async function getAll(): Promise<Record<string, CheckinRecord>> {
//   return loadStore();
// }

// utils/checkinsStore.ts
import { adminDb, FieldValue } from "@/utils/firebaseAdmin";

export type CheckinRecord = {
  ticketNumber: string;
  checkedIn: boolean;        // convenience: true if day1 || day2
  lastScanAt: string | null; // ISO time from lastCheckinAtMs
  scans: number;             // from scanCount
  lastScanBy?: string | null;
};

// Shape we expect in Firestore. Keep all fields optional to be tolerant.
type TicketDoc = {
  ticketNumber?: string;
  fullName?: string;
  name?: string;
  email?: string;
  ticketType?: string;
  giftClaimed?: boolean;
  lastCheckinAtMs?: number;
  lastCheckinBy?: string | null;
  scanCount?: number;
  checkIn?: Record<string, unknown>; // keys like "day1", "day2" with truthy values
};

const tn = (s: string) => String(s || "").trim().toUpperCase();

export async function getCheckin(ticketNumber: string): Promise<CheckinRecord | null> {
  const snap = await adminDb
    .collection("tickets")
    .where("ticketNumber", "==", tn(ticketNumber))
    .limit(1)
    .get();

  if (snap.empty) return null;

  const d = snap.docs[0].data() as TicketDoc;

  const lastAt =
    typeof d.lastCheckinAtMs === "number" ? new Date(d.lastCheckinAtMs).toISOString() : null;

  const day1 = Boolean((d.checkIn as Record<string, unknown> | undefined)?.day1);
  const day2 = Boolean((d.checkIn as Record<string, unknown> | undefined)?.day2);

  return {
    ticketNumber: tn(ticketNumber),
    checkedIn: day1 || day2,
    lastScanAt: lastAt,
    scans: typeof d.scanCount === "number" ? d.scanCount : 0,
    lastScanBy: (d.lastCheckinBy ?? null) as string | null,
  };
}

// Convenience helper — still prefer using /api/checkins/check for event-level toggles.
export async function setCheckin(
  ticketNumber: string,
  checked: boolean,
  checkerUid: string | null = null
): Promise<CheckinRecord> {
  const q = await adminDb
    .collection("tickets")
    .where("ticketNumber", "==", tn(ticketNumber))
    .limit(1)
    .get();

  if (q.empty) throw new Error("Ticket not found");
  const ref = q.docs[0].ref;

  const now = Date.now();
  await ref.set(
    {
      "checkIn.day1": checked,
      lastCheckinAtMs: now,
      lastCheckinBy: checkerUid ?? null,
      scanCount: FieldValue.increment(1),
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return {
    ticketNumber: tn(ticketNumber),
    checkedIn: checked,
    lastScanAt: new Date(now).toISOString(),
    // exact scans requires a re-read; return 0 as placeholder to satisfy typing
    scans: 0,
    lastScanBy: checkerUid,
  };
}

export async function getAll(): Promise<Record<string, CheckinRecord>> {
  const out: Record<string, CheckinRecord> = {};
  const snap = await adminDb.collection("tickets").get();

  snap.forEach((doc) => {
    const d = doc.data() as TicketDoc;
    const id = tn(d.ticketNumber ?? "");
    if (!id) return;

    const day1 = Boolean((d.checkIn as Record<string, unknown> | undefined)?.day1);
    const day2 = Boolean((d.checkIn as Record<string, unknown> | undefined)?.day2);

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

// Legacy no-ops (kept for API compatibility)
export async function loadStore(): Promise<Record<string, never>> {
  return {};
}
export async function saveStore(_: unknown): Promise<void> {
  // no-op
}

