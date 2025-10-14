import type { NextApiRequest, NextApiResponse } from "next";
import { getAll } from "@/utils/checkinsStore";

type Status = { checked: boolean; at?: string | null; by?: string | null };
type Resp = { ok: true; statuses: Record<string, Status> } | { ok: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const all = await getAll();
  const statuses: Record<string, Status> = {};
  Object.values(all).forEach((r) => {
    statuses[r.ticketNumber] = { checked: r.checkedIn, at: r.lastScanAt ?? null, by: r.lastScanBy ?? null };
  });

  return res.status(200).json({ ok: true, statuses });
}
