// utils/checkinsStore.ts
import fs from "fs/promises";
import path from "path";

export type CheckinRecord = {
  ticketNumber: string;
  checkedIn: boolean;
  lastScanAt: string | null;
  scans: number;
  lastScanBy?: string | null;
};

function resolvePath(): string {
  // Vercel: writable tmp. Local/dev: ./data/checkins.json
  const isVercel = !!process.env.VERCEL;
  if (isVercel) return "/tmp/checkins.json";
  return path.join(process.cwd(), "data", "checkins.json");
}

async function ensureDir(p: string) {
  try {
    await fs.mkdir(path.dirname(p), { recursive: true });
  } catch {}
}

export async function loadStore(): Promise<Record<string, CheckinRecord>> {
  const file = resolvePath();
  try {
    const buf = await fs.readFile(file);
    const json = JSON.parse(buf.toString());
    if (json && typeof json === "object") return json as Record<string, CheckinRecord>;
    return {};
  } catch {
    return {};
  }
}

export async function saveStore(store: Record<string, CheckinRecord>): Promise<void> {
  const file = resolvePath();
  await ensureDir(file);
  await fs.writeFile(file, JSON.stringify(store, null, 2), "utf8");
}

export async function getCheckin(ticketNumber: string): Promise<CheckinRecord | null> {
  const store = await loadStore();
  return store[ticketNumber] ?? null;
}

export async function setCheckin(
  ticketNumber: string,
  checked: boolean,
  checkerUid: string | null = null
): Promise<CheckinRecord> {
  const store = await loadStore();
  const nowIso = new Date().toISOString();
  const prev = store[ticketNumber];

  const next: CheckinRecord = {
    ticketNumber,
    checkedIn: checked,
    lastScanAt: checked ? nowIso : prev?.lastScanAt ?? null,
    scans: (prev?.scans ?? 0) + 1,
    lastScanBy: checkerUid,
  };

  store[ticketNumber] = next;
  await saveStore(store);
  return next;
}

export async function getAll(): Promise<Record<string, CheckinRecord>> {
  return loadStore();
}
