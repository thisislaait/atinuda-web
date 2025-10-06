// src/pages/api/offline-registration/page.tsx
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { getAuth, User as FirebaseUser } from "firebase/auth";

type SaveResult = {
  txRef?: string;
  ticketNumber?: string;
  fullName?: string;
  email?: string;
  qrCode?: string | null;
  location?: string | null;
};

async function getIdTokenSafe(): Promise<string | null> {
  const auth = getAuth();
  const u: FirebaseUser | null = auth.currentUser;
  if (u && typeof u.getIdToken === "function") {
    try {
      return await u.getIdToken();
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * This page component is intentionally defensive:
 * - fetches canonical ticket info for a txRef (if present)
 * - stores/loading state and uses next/image for QR rendering
 * - avoids unused variables / eslint complaints
 */
export default function OfflineRegistrationSuccessPage(): React.ReactElement {
  return (
    <Suspense fallback={<div className="p-8">Loading…</div>}>
      <Content />
    </Suspense>
  );
}

function Content(): React.ReactElement {
  // We read txRef from query in a robust way (works in pages or app router)
  const [data, setData] = useState<SaveResult>({
    txRef: undefined,
    ticketNumber: undefined,
    fullName: undefined,
    email: undefined,
    qrCode: null,
    location: "Lagos Continental (TBA)",
  });

  const [loadingTicket, setLoadingTicket] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  // Try to discover txRef from location.search (this file is in pages/ so use window)
  useEffect(() => {
    // only run in browser
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const txRef = params.get("txRef") ?? undefined;
    const ticketNumber = params.get("ticketNumber") ?? undefined;
    const fullName = params.get("fullName") ?? undefined;
    const email = params.get("email") ?? undefined;

    // merge initial querystring values
    setData((prev) => ({
      ...prev,
      txRef,
      ticketNumber: ticketNumber ?? prev.ticketNumber,
      fullName: fullName ?? prev.fullName,
      email: email ?? prev.email,
    }));

    // if we have txRef+email, attempt to fetch canonical ticket (get stored qrCode etc.)
    if (txRef && email) {
      fetchTicket(txRef, email);
    } else if (txRef && !email) {
      // If txRef present but no email, try to fetch by txRef via an endpoint (if you have one);
      // here we attempt by txRef using /api/get-ticket-from-txref (optional server route).
      // If you don't have it, skip automatic fetch — UI will show query values only.
      fetchTicketByTxRef(txRef).catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTicket(txRef: string, email: string) {
    setLoadingTicket(true);
    try {
      const idToken = await getIdTokenSafe();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

      // prefer GET /api/get-ticket?email=... (you already had that endpoint)
      const q = new URLSearchParams({ email });
      const res = await fetch(`/api/get-ticket?${q.toString()}`, { method: "GET", headers });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("get-ticket failed:", res.status, txt.slice?.(0, 2000) ?? txt);
        setLoadingTicket(false);
        return;
      }

      const parsed = await res.json();
      // expected shape: { fullName, email, ticketType, ticketNumber, qrCode, location? }
      setData((prev) => ({
        ...prev,
        fullName: parsed.fullName ?? prev.fullName,
        email: parsed.email ?? prev.email,
        ticketNumber: parsed.ticketNumber ?? prev.ticketNumber,
        qrCode: parsed.qrCode ?? prev.qrCode,
        location: parsed.location ?? prev.location,
      }));
    } catch (err) {
      console.error("Error fetching ticket:", err);
    } finally {
      setLoadingTicket(false);
    }
  }

  // Optional: attempt a txRef-based fetch for setups that have a /api/get-ticket-by-txref endpoint
  async function fetchTicketByTxRef(txRef: string) {
    setLoadingTicket(true);
    try {
      const idToken = await getIdTokenSafe();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

      const res = await fetch("/api/get-ticket-by-txref", {
        method: "POST",
        headers,
        body: JSON.stringify({ txRef }),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("get-ticket-by-txref failed:", res.status, txt.slice?.(0, 2000) ?? txt);
        return;
      }

      const json = await res.json();
      setData((prev) => ({
        ...prev,
        fullName: json.fullName ?? prev.fullName,
        email: json.email ?? prev.email,
        ticketNumber: json.ticketNumber ?? prev.ticketNumber,
        qrCode: json.qrCode ?? prev.qrCode,
        location: json.location ?? prev.location,
      }));
    } catch (err) {
      console.error("fetchTicketByTxRef error:", err);
    } finally {
      setLoadingTicket(false);
    }
  }

  const handleDownload = async (): Promise<void> => {
    if (!data.txRef) {
      toast.error("Missing txRef — cannot download.");
      return;
    }
    setDownloading(true);
    const toastId = toast.loading("Downloading ticket…");
    try {
      const idToken = await getIdTokenSafe();
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (idToken) headers["Authorization"] = `Bearer ${idToken}`;

      const res = await fetch("/api/download-ticket", {
        method: "POST",
        headers,
        body: JSON.stringify({ txRef: data.txRef }),
      });

      if (!res.ok) {
        let errText = "";
        try {
          errText = await res.text();
        } catch {}
        console.error("download-ticket failed:", res.status, errText.slice?.(0, 2000) ?? errText);
        throw new Error("PDF download failed");
      }

      const blob = await res.blob();
      const filename = `Ticket-${data.ticketNumber ?? data.txRef}.pdf`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("Ticket downloaded.");
    } catch (err) {
      toast.dismiss(toastId);
      console.error("Ticket download error:", err);
      toast.error((err instanceof Error && err.message) || "Failed to download PDF. Check console/network.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900 p-6 flex items-center justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-3xl">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-1">Registration received</h1>
              <p className="text-sm text-slate-600">Ticket generated successfully — save or download below.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Category</span>
              <div className="mt-1 font-semibold">Conference</div>
            </div>
          </div>

          <div ref={ticketRef} className="mt-6 relative bg-white/10 rounded-lg border border-gray-300 flex overflow-hidden">
            <div className="flex items-center justify-center md:w-1/3 bg-white p-6">
              {loadingTicket ? (
                <div className="w-36 h-36 bg-gray-200 rounded animate-pulse" />
              ) : data.qrCode ? (
                // Next/Image works for base64/data URIs and remote URLs if unoptimized; use unoptimized for reliability
                // (You can remove unoptimized if you prefer Next to optimize and you allowed remote domain).
                <div className="w-36 h-36">
                  <Image
                    src={data.qrCode as string}
                    alt="QR Code"
                    width={144}
                    height={144}
                    className="w-36 h-36 object-contain border border-gray-300 rounded"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="w-36 h-36 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm text-slate-600">No QR available</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-6">
              <h2 className="text-xl font-semibold">🎫 Event Pass</h2>
              {data.fullName ? <p className="mt-2"><strong>Name:</strong> {data.fullName}</p> : null}
              {data.email ? <p className="mt-1"><strong>Email:</strong> {data.email}</p> : null}
              {data.ticketNumber ? (
                <p className="mt-3 font-mono text-lg text-[#FF7F41]">
                  <strong>Ticket No:</strong> {data.ticketNumber}
                </p>
              ) : null}
              <p className="mt-2 italic text-slate-700">You now have full access to all conference sessions.</p>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleDownload}
                  disabled={downloading}
                  className="px-4 py-2 bg-[#1B365D] text-white rounded font-semibold disabled:opacity-60"
                >
                  {downloading ? "Downloading…" : "Download Ticket (PDF)"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            If you&apos;d like us to email the ticket instead, ensure the attendee&apos;s email is correct and the system will send it (subject to your backend email worker).
          </div>
        </div>
      </div>
    </main>
  );
}
