import type { NextApiRequest, NextApiResponse } from "next";
import { loadStatuses } from "@/utils/checkinsFile";

type Status = { checked: boolean; at?: string | null; by?: string | null };
type Resp =
  | { ok: true; statuses: Record<string, Status>; filePath: string; source: "preferred" | "tmp" | "empty" }
  | { ok: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ ok: false, message: "Method Not Allowed" });
  }

  const { map, filePath, source } = await loadStatuses();

  const statuses: Record<string, Status> = {};
  Object.entries(map).forEach(([k, v]) => {
    statuses[k] = {
      checked: Boolean(v.checked),
      at: typeof v.at === "number" ? new Date(v.at).toISOString() : null,
      by: v.by ?? null,
    };
  });

  return res.status(200).json({ ok: true, statuses, filePath, source });
}
