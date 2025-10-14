// src/utils/localStore.ts
import fs from "fs";
import path from "path";
import { promisify } from "util";

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir(): Promise<void> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function readJsonFile<T>(name: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const p = path.join(DATA_DIR, name);
  try {
    const raw = await readFile(p, { encoding: "utf8" });
    return JSON.parse(raw) as T;
  } catch {
    // If file missing or invalid, write fallback and return it
    try {
      await writeFile(p, JSON.stringify(fallback, null, 2), { encoding: "utf8" });
    } catch {
      // ignore write error
    }
    return fallback;
  }
}

export async function writeJsonFile<T>(name: string, data: T): Promise<void> {
  await ensureDataDir();
  const p = path.join(DATA_DIR, name);
  await writeFile(p, JSON.stringify(data, null, 2), { encoding: "utf8" });
}
