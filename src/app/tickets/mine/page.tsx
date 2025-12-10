'use client';

import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";

const EVENT_SLUG = process.env.NEXT_PUBLIC_EVENT_SLUG || "martitus-retreat-2026";

type AttendeeDoc = {
  ticketType?: string;
  ticketNumber?: string;
  status?: string;
  email?: string;
  purchasedAt?: { toDate?: () => Date } | string | null;
  currency?: "NGN" | "USD";
  amount?: number;
};

export default function MyTickets() {
  const [data, setData] = useState<AttendeeDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
      setError("Please sign in to view your ticket.");
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const ref = doc(db, "events", EVENT_SLUG, "attendees", user.uid);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("No ticket found for this event.");
        setData(snap.data());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-6 text-white/70">Loading…</div>;
  if (error) return <div className="p-6 text-red-200">{error}</div>;
  if (!data) return null;

  const purchasedAtText =
    typeof data.purchasedAt === "string"
      ? data.purchasedAt
      : data.purchasedAt?.toDate?.()?.toLocaleString?.() || "—";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f1528] to-[#0b1220] text-white">
      <div className="max-w-2xl mx-auto px-6 py-10 space-y-3">
        <p className="text-xs uppercase tracking-[0.2em] text-white/60">My Ticket</p>
        <h1 className="text-3xl font-semibold hero-text">{data.ticketType || "Retreat Pass"}</h1>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
          <div>
            <div className="text-sm text-white/70">Ticket No.</div>
            <div className="text-lg font-mono">{data.ticketNumber || "TBD"}</div>
          </div>
          <div>
            <div className="text-sm text-white/70">Status</div>
            <div className="text-base font-semibold capitalize">{data.status || "active"}</div>
          </div>
          <div>
            <div className="text-sm text-white/70">Email</div>
            <div className="text-base">{data.email || "—"}</div>
          </div>
          <div>
            <div className="text-sm text-white/70">Purchased</div>
            <div className="text-base">{purchasedAtText}</div>
          </div>
          <div>
            <div className="text-sm text-white/70">Amount</div>
            <div className="text-base">
              {data.currency === "NGN" ? "₦" : "$"}
              {data.amount?.toLocaleString?.() ?? data.amount ?? "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
