import { adminDb } from "@/utils/firebaseAdmin"; // <-- use Admin SDK
import Link from "next/link";

// keep dynamic/revalidate as is

type Row = {
  id: string;
  rsvp: string;
  ticketNumber: string;
  mobile: string;
  respondedAt: string;
};

export default async function AdminRsvpPage() {
  const snap = await adminDb
    .collection("Azizi")
    .orderBy("respondedAt", "desc")
    .get();

  const rows: Row[] = snap.docs.map(
    (d: FirebaseFirestore.QueryDocumentSnapshot<FirebaseFirestore.DocumentData>) => {
      const data = d.data();
      return {
        id: d.id,
        rsvp: String(data.rsvp ?? ""),
        ticketNumber: String(data.ticketNumber ?? ""),
        mobile: String(data.mobile ?? ""),
        respondedAt: data.respondedAt?.toDate?.()
          ? data.respondedAt.toDate().toLocaleString()
          : "",
      };
    }
  );

  return (
    <main className="mx-auto max-w-5xl p-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Azizi RSVPs</h1>
        <Link
          href="/api/rsvps"
          className="rounded-lg border border-black/10 bg-black/5 px-3 py-2 text-sm hover:bg-black/10"
        >
          View JSON
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-black/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-black/5 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2">When</th>
              <th className="px-3 py-2">RSVP</th>
              <th className="px-3 py-2">Ticket #</th>
              <th className="px-3 py-2">Mobile</th>
              <th className="px-3 py-2">Doc ID</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td className="px-3 py-4" colSpan={5}>No RSVPs yet.</td>
              </tr>
            ) : (
              rows.map((r) => (
                <tr key={r.id} className="odd:bg-white even:bg-black/[0.02]">
                  <td className="px-3 py-2 whitespace-nowrap">{r.respondedAt}</td>
                  <td className="px-3 py-2">{r.rsvp}</td>
                  <td className="px-3 py-2 font-mono">{r.ticketNumber}</td>
                  <td className="px-3 py-2 font-mono">{r.mobile}</td>
                  <td className="px-3 py-2 text-xs text-black/60 font-mono">{r.id}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-black/60">
        Tip: hit <code className="rounded bg-black/10 px-1">/api/rsvps</code> for raw data, or connect this endpoint to Sheets/Make/n8n.
      </p>
    </main>
  );
}
