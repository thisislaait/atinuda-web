// src/app/offline-registration/success/page.tsx
"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useSearchParams } from "next/navigation";
import { getAuth, User as FirebaseUser } from "firebase/auth";
import { useAuth } from "@/hooks/useAuth";

type SaveResult = {
  txRef?: string;
  ticketNumber?: string;
  fullName?: string;
  email?: string;
  qrCode?: string | null;
  location?: string | null;
  ticketType?: string | null;
};

function getCustomMessage(type: string | null) {
  switch (type) {
    case "Conference Access":
      return "You now have full access to all conference sessions!";
    default:
      return "Thank you for your reservation!";
  }
}

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

export default function SuccessWrapper(): React.ReactElement {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}

function SuccessContent(): React.ReactElement {
  const params = useSearchParams();
  const { openAuthModal } = useAuth();
  const txRef = params?.get("txRef") ?? "";
  const ticketNumberFromQS = params?.get("ticketNumber") ?? "";
  const fullNameFromQS = params?.get("fullName") ?? "";
  const emailFromQS = params?.get("email") ?? "";

  const [data, setData] = useState<SaveResult>({
    txRef: txRef || undefined,
    ticketNumber: ticketNumberFromQS || undefined,
    fullName: fullNameFromQS || undefined,
    email: emailFromQS || undefined,
    qrCode: null,
    location: "Lagos Continental (TBA)",
    ticketType: "Conference Access",
  });

  const [loadingTicket, setLoadingTicket] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  // Helper: parse response safely
  async function parseJsonSafe(res: Response): Promise<unknown | null> {
    const ct = res.headers.get("content-type") ?? "";
    if (ct.includes("application/json")) {
      try {
        return await res.json();
      } catch {
        return null;
      }
    }
    // not JSON — return text for debugging
    try {
      return await res.text();
    } catch {
      return null;
    }
  }

  // Fetch ticket: try POST first (existing server), if 405 then try GET (fallback).
  useEffect(() => {
    if (!txRef) return;

    let cancelled = false;

    (async () => {
      setLoadingTicket(true);
      try {
        const idToken = await getIdTokenSafe();

        // Prepare headers (only include auth if we have a token)
        const baseHeaders: Record<string, string> = { "Content-Type": "application/json" };
        if (idToken) baseHeaders["Authorization"] = `Bearer ${idToken}`;

        // 1) Try POST (your original approach)
        let res = await fetch("/api/get-ticket", {
          method: "POST",
          headers: baseHeaders,
          body: JSON.stringify({ txRef }),
        });

        // If Method Not Allowed, try GET fallback (querystring)
        if (res.status === 405) {
          // debug log
          const textFallback = (await res.text().catch(() => "<no-body>")).slice(0, 2000);
          console.warn("get-ticket POST returned 405; falling back to GET. server body:", textFallback);

          const qs = new URLSearchParams({ txRef });
          const getUrl = `/api/get-ticket?${qs.toString()}`;
          res = await fetch(getUrl, {
            method: "GET",
            headers: idToken ? { Authorization: `Bearer ${idToken}` } : {},
          });
        }

        // If still not ok: log and bail
        if (!res.ok) {
          // parse text (fallback) for debugging
          const parsed = await parseJsonSafe(res);
          const excerpt =
            typeof parsed === "string" ? parsed.slice(0, 2000) : JSON.stringify(parsed ?? {}).slice(0, 2000);
          console.error("get-ticket failed:", res.status, excerpt);
          if (!cancelled) setLoadingTicket(false);
          return;
        }

        // Try parse JSON body; server expected shape: { ok: true, ticket: SaveResult }
        const json = (await res.json()) as { ok?: boolean; ticket?: SaveResult } | null;
        if (!json || json.ok === false || !json.ticket) {
          console.warn("get-ticket returned unexpected shape or ok:false", json);
          if (!cancelled) setLoadingTicket(false);
          return;
        }

        const ticket = json.ticket;
        if (!cancelled) {
          setData((prev) => ({
            txRef: prev.txRef ?? ticket.txRef,
            ticketNumber: ticket.ticketNumber ?? prev.ticketNumber,
            fullName: ticket.fullName ?? prev.fullName,
            email: ticket.email ?? prev.email,
            qrCode: ticket.qrCode ?? prev.qrCode ?? prev.qrCode,
            location: ticket.location ?? prev.location,
            ticketType: ticket.ticketType ?? prev.ticketType,
          }));
        }
      } catch (err) {
        console.error("Error fetching ticket:", err);
      } finally {
        if (!cancelled) setLoadingTicket(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [txRef]);

  const handleDownload = async (): Promise<void> => {
    if (!data.txRef) {
      toast.error("Missing txRef — cannot download.");
      return;
    }
    setDownloading(true);
    const toastId = toast.loading("Downloading ticket…");
    try {
      const idToken = await getIdTokenSafe();
      if (!idToken) {
        // If you want the page to open the auth modal automatically:
        if (typeof openAuthModal === "function") openAuthModal();
        toast.dismiss(toastId);
        toast.error("Sign in to download ticket PDF.");
        setDownloading(false);
        return;
      }

      const res = await fetch("/api/download-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ txRef: data.txRef }),
      });

      if (!res.ok) {
        let errText = "";
        try {
          errText = await res.text();
        } catch {}
        console.error("download-ticket failed:", res.status, errText.slice?.(0, 2000) ?? errText);
        throw new Error("Failed to fetch PDF");
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
      console.error("PDF Download Error:", err);
      toast.error("Failed to download PDF. Check console/network.");
    } finally {
      setDownloading(false);
    }
  };

  const fullName = data.fullName ?? "";
  const email = data.email ?? "";
  const ticketType = data.ticketType ?? "Conference Access";
  const location = data.location ?? "Lagos Continental (TBA)";

  const isDataUri = (s: string | undefined | null): boolean => {
    return typeof s === "string" && s.startsWith("data:");
  };

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900">
      <Toaster position="top-center" />
      <header className="relative isolate overflow-hidden bg-[#1B365D]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/images/bannerdesign.png"
            alt="Hero Background"
            fill
            className="object-cover object-bottom"
            priority
          />
          <div className="absolute inset-0 bg-[#1B365D]/70" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-white relative z-10">
          <div className="max-w-3xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
              <span>Lagos • Oct 8, 2025</span>
              <span className="text-white/70">Atinuda Conference</span>
            </p>
            <h1 className="text-4xl md:text-5xl font-bold hero-text leading-tight">Registration received</h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Ticket generated successfully — save or download below.
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold mb-1">Registration summary</h2>
              <p className="text-sm text-slate-600">Ticket generated successfully — keep this page for quick access.</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Category</span>
              <div className="mt-1 font-semibold">Conference</div>
            </div>
          </div>

          <div ref={ticketRef} className="mt-6 relative bg-white/10 rounded-lg border border-gray-300 flex flex-col md:flex-row overflow-hidden">
            <div className="flex items-center justify-center md:w-1/3 bg-white p-6">
              {loadingTicket ? (
                <div className="w-36 h-36 bg-gray-200 animate-pulse rounded" />
              ) : data.qrCode ? (
                isDataUri(data.qrCode) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.qrCode ?? undefined}
                    alt="QR Code"
                    className="w-36 h-36 object-contain border border-gray-300 rounded shadow-md"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <Image
                      src={data.qrCode ?? ""}
                      alt="QR Code"
                      width={144}
                      height={144}
                      className="w-36 h-36 object-contain border border-gray-300 rounded shadow-md"
                    />
                    <p className="text-sm text-black mt-2 font-medium">Scan at entrance</p>
                  </div>
                )
              ) : (
                <div className="w-36 h-36 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-sm text-slate-600">No QR available</span>
                </div>
              )}
            </div>

            <div className="hidden md:block w-[1px] border-l-2 border-dashed border-gray-400" />

            <div className="flex-1 p-6 text-gray-800">
              <h3 className="text-xl font-bold mb-2">🎫 Event Pass</h3>

              {fullName ? <p className="mb-1"><strong>Name:</strong> {fullName}</p> : null}
              {email ? <p className="mb-1"><strong>Email:</strong> {email}</p> : null}
              {ticketType ? <p className="mb-1"><strong>Ticket Type:</strong> {ticketType}</p> : null}

              {data.ticketNumber && (
                <p className="mt-3 font-mono text-lg text-[#FF7F41]">
                  <strong>Ticket No:</strong> {data.ticketNumber}
                  <br />
                  <strong>Location:</strong> {location}
                </p>
              )}

              <p className="italic mt-3 text-slate-700">{getCustomMessage(ticketType)}</p>

              <div className="mt-4 flex gap-3 items-center">
                <button
                  className="mt-4 px-4 py-2 bg-white text-[#090706] font-semibold cursor-pointer rounded hover:bg-gray-100 transition"
                  onClick={handleDownload}
                  disabled={downloading}
                >
                  {downloading ? "Downloading…" : "Download Ticket"}
                </button>

                {!getAuth().currentUser && (
                  <div className="text-sm text-slate-500 self-center">
                    Sign in to view/download your QR & PDF.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-slate-600">
            If you&apos;d like us to email the ticket instead, ensure the attendee&apos;s email is correct and the system will send it (subject to your backend email worker).
          </div>
        </div>
      </section>
    </main>
  );
}
