import fs from "fs/promises";
import path from "path";
import os from "os";

export type StatusEntry = {
  checked: boolean;
  at?: number;           // epoch ms
  by?: string | null;
};

// ticketNumber (UPPERCASE) -> status entry
type StatusMap = Record<string, StatusEntry>;

function resolvePreferredDir(): string {
  const dirEnv = (process.env.CHECKINS_DIR || "").trim();
  // If user set CHECKINS_DIR, use it (supports relative or absolute)
  if (dirEnv) return path.resolve(process.cwd(), dirEnv);
  // Default to <repo>/data
  return path.join(process.cwd(), "data");
}

function preferredFile(): string {
  return path.join(resolvePreferredDir(), "checkins.json");
}
function tmpFile(): string {
  return path.join(os.tmpdir(), "checkins.json");
}

async function ensureDirFor(file: string): Promise<void> {
  await fs.mkdir(path.dirname(file), { recursive: true });
}

async function readJson(file: string): Promise<StatusMap> {
  try {
    const txt = await fs.readFile(file, "utf8");
    if (!txt) return {};
    const json = JSON.parse(txt) as unknown;
    return (json && typeof json === "object") ? (json as StatusMap) : {};
  } catch {
    return {};
  }
}

async function atomicWrite(file: string, data: StatusMap): Promise<void> {
  await ensureDirFor(file);
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

/** Read combined map, preferring preferredFile then /tmp. Also return which file was used. */
export async function loadStatuses(): Promise<{ map: StatusMap; filePath: string; source: "preferred" | "tmp" | "empty" }> {
  const preferred = preferredFile();
  const m1 = await readJson(preferred);
  if (Object.keys(m1).length > 0) return { map: m1, filePath: preferred, source: "preferred" };

  const tmp = tmpFile();
  const m2 = await readJson(tmp);
  if (Object.keys(m2).length > 0) return { map: m2, filePath: tmp, source: "tmp" };

  // default: empty preferred path
  return { map: {}, filePath: preferred, source: "empty" };
}

/** Save to preferredFile first; if that fails, save to /tmp. Return which file was used. */
export async function saveStatuses(map: StatusMap): Promise<{ storedIn: "preferred" | "tmp"; filePath: string }> {
  const preferred = preferredFile();
  try {
    await atomicWrite(preferred, map);
    return { storedIn: "preferred", filePath: preferred };
  } catch {
    const tmp = tmpFile();
    await atomicWrite(tmp, map);
    return { storedIn: "tmp", filePath: tmp };
  }
}

const norm = (s: string) => String(s || "").trim().toUpperCase();

export async function setChecked(ticketNumber: string, by: string | null = null) {
  const tn = norm(ticketNumber);
  const { map } = await loadStatuses();
  map[tn] = { checked: true, at: Date.now(), by };
  return saveStatuses(map); // returns { storedIn, filePath }
}

export async function setCheckedBulk(ticketNumbers: string[], by: string | null = null) {
  const { map } = await loadStatuses();
  const now = Date.now();
  ticketNumbers.forEach((t) => {
    const tn = norm(t);
    if (!tn) return;
    map[tn] = { checked: true, at: now, by };
  });
  return saveStatuses(map);
}
