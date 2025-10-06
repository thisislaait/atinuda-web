// src/app/offline-registration/page.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

type RegisterResponse = {
  ok?: boolean;
  message?: string;
  txRef?: string;
  ticketNumber?: string;
};

export default function OfflineRegistrationPage(): React.ReactElement {
  const router = useRouter();

  // Controlled form state
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [category, setCategory] = useState<string>("Conference");

  const [submitting, setSubmitting] = useState<boolean>(false);

  // keep ref so resetForm stable in handlers
  const initialMountRef = useRef<boolean>(false);

  function resetForm(): void {
    setFullName("");
    setEmail("");
    setPhone("");
    setCompany("");
    setCategory("Conference");
    setSubmitting(false);
  }

  // Reset on first mount
  useEffect(() => {
    if (!initialMountRef.current) {
      initialMountRef.current = true;
      resetForm();
    }
  }, []);

  // Also reset when page regains focus OR when user navigates browser history (back/forward).
  // This covers client-side router.push('/offline-registration') from your success page which may not unmount the component.
  useEffect(() => {
    const onFocus = () => {
      // If there are no query params indicating a just-submitted ticket, clear form.
      // (We assume success page attaches txRef/ticketNumber/email when redirecting.)
      if (!window.location.search.includes("txRef=") && !window.location.search.includes("ticketNumber=")) {
        resetForm();
      }
    };
    const onPopstate = () => {
      if (!window.location.search.includes("txRef=") && !window.location.search.includes("ticketNumber=")) {
        resetForm();
      }
    };

    window.addEventListener("focus", onFocus);
    window.addEventListener("popstate", onPopstate);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("popstate", onPopstate);
    };
  }, []);

  // Lightweight validation
  function validate(): string | null {
    if (!fullName.trim()) return "Missing required field: full name";
    if (!email.trim()) return "Missing required field: email";
    if (!phone.trim()) return "Missing required field: phone";
    // basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return "Invalid email address";
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const v = validate();
    if (v) {
      toast.error(v);
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading("Registering attendee…");

    try {
      const payload = {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        company: company.trim() || null,
        category: category || "Conference",
      };

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // some servers return HTML on error (you saw that). try parse JSON else text.
      let json: RegisterResponse | null = null;
      const text = await res.text().catch(() => "");
      try {
        json = text ? (JSON.parse(text) as RegisterResponse) : null;
      } catch {
        // not JSON
        json = null;
      }

      if (!res.ok) {
        // show server error message when available, else a generic one
        const msg = (json && json.message) || `Server error (${res.status}). Check console/network.`;
        toast.dismiss(toastId);
        toast.error(msg);
        console.error("Registration failed raw response:", text.slice(0, 2000));
        setSubmitting(false);
        return;
      }

      // success path (server should return txRef + ticketNumber ideally)
      toast.dismiss(toastId);
      toast.success((json && json.message) || "Registration saved.");

      // navigate to the success page. include txRef/ticketNumber and minimal identity so success page can show details.
      const txRef = (json && json.txRef) || "";
      const ticketNumber = (json && json.ticketNumber) || "";

      // Clear local state before navigation to avoid persistent values if the page remains mounted
      resetForm();

      // Build QS safely
      const qsParts: string[] = [];
      if (txRef) qsParts.push(`txRef=${encodeURIComponent(txRef)}`);
      if (ticketNumber) qsParts.push(`ticketNumber=${encodeURIComponent(ticketNumber)}`);
      if (fullName) qsParts.push(`fullName=${encodeURIComponent(fullName)}`);
      if (email) qsParts.push(`email=${encodeURIComponent(email)}`);
      const qs = qsParts.length ? `?${qsParts.join("&")}` : "";

      // client-side navigation to success
      router.push(`/offline-registration/success${qs}`);
    } catch (err) {
      console.error("Registration error:", err);
      toast.dismiss(toastId);
      toast.error("Network error while registering. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900 p-6 flex items-start justify-center">
      <Toaster position="top-center" />
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">Offline Registration — Conference</h1>

        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
          <div>
            <label className="block text-sm font-medium">Full name *</label>
            <input
              value={fullName}
              onChange={(ev) => setFullName(ev.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">Email *</label>
              <input
                value={email}
                onChange={(ev) => setEmail(ev.target.value)}
                type="email"
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Phone *</label>
              <input
                value={phone}
                onChange={(ev) => setPhone(ev.target.value)}
                className="mt-1 w-full rounded border px-3 py-2"
                placeholder="+234 801 234 5678"
                autoComplete="tel"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Company</label>
            <input
              value={company}
              onChange={(ev) => setCompany(ev.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="Company / Team (optional)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
              className="mt-1 w-full rounded border px-3 py-2"
            >
              <option value="Conference">Conference</option>
              <option value="Workshop">Workshop</option>
              <option value="VIP">VIP</option>
            </select>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="text-sm text-slate-600">After submitting you will be taken to a success page with the ticket details.</div>

            <button
              type="submit"
              disabled={submitting}
              className="ml-auto rounded bg-[#1B365D] text-white px-4 py-2 font-semibold disabled:opacity-60"
            >
              {submitting ? "Submitting…" : "Register attendee"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
