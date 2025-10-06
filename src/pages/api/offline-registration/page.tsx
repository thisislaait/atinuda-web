// app/register/page.tsx
"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";

/**
 * Registration page: simple form fields:
 *  - name, email, phone, company
 *  - ticketType fixed to "Conference Access"
 *
 * POSTs to /api/register and displays the returned ticket details.
 */

type RegisterResponse = {
  ok: boolean;
  message?: string;
  txRef?: string;
  ticketNumber?: string;
  qrCode?: string | null;
  location?: string;
  ticketType?: string;
  emailSent?: boolean;
};

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [result, setResult] = useState<RegisterResponse | null>(null);
  const mountedRef = useRef(true);

  React.useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  function validate(): string | null {
    if (!name.trim()) return "Please enter your full name.";
    if (!email.trim()) return "Please enter an email address.";
    // simple email check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Please enter a valid email address.";
    if (!phone.trim()) return "Please enter a phone number.";
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate();
    if (err) {
      toast.error(err);
      return;
    }

    const payload = {
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      company: company.trim() || null,
      ticketType: "Conference Access",
    };

    setSubmitting(true);
    const toastId = toast.loading("Registering and issuing ticket…");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // Defensive: read text then parse JSON to avoid Unexpected '<' errors
      const text = await res.text();
      let json: RegisterResponse | null = null;
      try {
        json = text ? (JSON.parse(text) as RegisterResponse) : null;
      } catch {
        console.error("Non-JSON response from /api/register:", text.slice(0, 2000));
        toast.dismiss(toastId);
        toast.error("Server returned an unexpected response. Check console/network.");
        setSubmitting(false);
        return;
      }

      if (!res.ok || !json) {
        toast.dismiss(toastId);
        toast.error(json?.message ?? "Registration failed.");
        setSubmitting(false);
        return;
      }

      toast.dismiss(toastId);
      toast.success("Registration complete — ticket issued.");
      setResult(json);
      // optionally clear form
      setName("");
      setEmail("");
      setPhone("");
      setCompany("");
    } catch (err) {
      console.error("Registration error:", err);
      toast.dismiss(toastId);
      toast.error("Network error during registration. Try again.");
    } finally {
      if (mountedRef.current) setSubmitting(false);
    }
  }

  async function handleDownloadPdf() {
    if (!result?.txRef) return;
    try {
      const res = await fetch("/api/download-ticket-from-txref", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ txRef: result.txRef }),
      });
      if (!res.ok) throw new Error("PDF download failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Ticket-${result.ticketNumber ?? result.txRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download ticket PDF.");
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900 py-12">
      <Toaster position="top-center" />
      <div className="max-w-3xl mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Conference Registration</h1>
          <p className="mt-2 text-slate-600">Register for Conference Access and receive your ticket instantly.</p>
        </header>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow">
            <div>
              <label className="block text-sm font-medium">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Email</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="+234 801 234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Company (optional)</label>
              <input
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                placeholder="Company or team"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                value="Conference"
                readOnly
                className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-[#1B365D] px-5 py-2 text-white hover:bg-[#152c4a] disabled:opacity-60"
              >
                {submitting ? "Registering…" : "Register & Generate Ticket"}
              </button>
            </div>
          </form>
        ) : (
          <section className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Registration successful</h2>
            <p className="text-sm text-slate-600 mb-4">We issued your ticket. Use the controls below to download or forward the ticket.</p>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/3 bg-gray-50 p-4 rounded">
                {result.qrCode ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={result.qrCode} width={220} height={220} className="mx-auto" alt="QR Code" />
                ) : (
                  <div className="w-44 h-44 bg-gray-200 mx-auto rounded animate-pulse" />
                )}
              </div>

              <div className="flex-1">
                <p><strong>Ticket No:</strong> <span className="text-[#FF7F41]">{result.ticketNumber ?? "—"}</span></p>
                <p><strong>Location:</strong> {result.location ?? "Lagos Continental"}</p>
                <p><strong>Category:</strong> {result.ticketType ?? "Conference Access"}</p>
                <p className="mt-2 text-sm text-slate-600">An email was {result.emailSent ? "sent" : "queued / not sent"} to {email}.</p>

                <div className="mt-4 flex gap-3">
                  <button className="rounded-lg border px-4 py-2" onClick={handleDownloadPdf}>Download PDF</button>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
