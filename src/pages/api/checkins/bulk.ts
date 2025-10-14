import type { NextApiRequest, NextApiResponse } from "next";
import { setCheckedBulk } from "@/utils/checkinsFile";

type Resp =
  | { ok: true; message: string; count: number; storedIn: "preferred" | "tmp"; filePath: string }
  | { ok: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const { ticketNumbers, checker } = (req.body ?? {}) as { ticketNumbers?: unknown; checker?: unknown };

  if (!Array.isArray(ticketNumbers) || ticketNumbers.length === 0) {
    return res.status(400).json({ ok: false, message: "ticketNumbers[] is required" });
  }

  const list = ticketNumbers
    .map((t) => (typeof t === "string" ? t.trim() : String(t ?? "").trim()))
    .filter((t) => t.length > 0);

  if (list.length === 0) {
    return res.status(400).json({ ok: false, message: "ticketNumbers[] is empty" });
  }

  const by = typeof checker === "string" && checker.trim() ? checker.trim() : "bulk";

  try {
    const { storedIn, filePath } = await setCheckedBulk(list, by);
    return res.status(200).json({ ok: true, message: "Bulk check-in complete", count: list.length, storedIn, filePath });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return res.status(500).json({ ok: false, message: msg });
  }
}
