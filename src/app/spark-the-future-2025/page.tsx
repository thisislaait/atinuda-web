"use client";

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function PitchPage() {
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Ticket verification + conditional identity fields
  const [ticketValue, setTicketValue] = useState("");
  const [ticketValid, setTicketValid] = useState<boolean | undefined>(undefined);
  const [ticketChecking, setTicketChecking] = useState(false);
  const needsIdentity = ticketValue.trim() === "" || ticketValid === false;

  // Lock page scroll while modal is open
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.overflow;
    if (open) root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [open]);

  const timeline = useMemo(
    () => [
      {
        date: "Sept 8–24, 2025",
        title: "Call for applications",
        body:
          "Apply online. Confirm eligibility and share your deck. Focus on sustainability + technology in the events ecosystem.",
      },
      {
        date: "Sept 24–28, 2025",
        title: "Evaluation & shortlisting",
        body:
          "Independent reviewers score all submissions using our published rubric. Top 10 ventures advance.",
      },
      {
        date: "Sept 29, 2025",
        title: "Finalists announced",
        body:
          "Public reveal of 10 finalists. Participation agreements issued, including Nord partnership terms.",
      },
      {
        date: "Oct 2–3, 2025",
        title: "Pitch clinic at Nord HQ",
        body:
          "One-day coaching + deck polish + Q&A drills + test drives. Integrate Nord’s story into your value prop.",
      },
      {
        date: "Oct 8, 2025",
        title: "Finals on stage @ Atinuda",
        body:
          "5-minute pitch + 3-minute Q&A per finalist. Live audience + media. Winners announced on stage.",
      },
    ],
    []
  );

  async function verifyTicket(ticket: string) {
    if (!ticket.trim()) {
      setTicketValid(undefined);
      return;
    }
    setTicketChecking(true);
    try {
      const res = await fetch(`/api/verify-ticket?ticketNumber=${encodeURIComponent(ticket.trim())}`);
      const data = await res.json();
      if (data.ok) {
        setTicketValid(true);
        toast.success("✅ Ticket verified!");
      } else {
        setTicketValid(false);
        toast.error("❌ Invalid ticket number");
      }
    } catch {
      setTicketValid(false);
      toast.error("⚠️ Could not verify ticket. Try again.");
    } finally {
      setTicketChecking(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const formData = new FormData(form);
    // keep as JSON payload for your /api/spark-apply
    const data = Object.fromEntries(formData.entries());

    const toastId = toast.loading("Submitting application…");
    try {
      setSubmitting(true);
      const res = await fetch("/api/spark-apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (!res.ok || !json.ok) throw new Error(json.message || "Failed");

      setOpen(false);
      form.reset();
      setTicketValue("");
      setTicketValid(undefined);

      toast.dismiss(toastId);
      toast.success("✅ Application submitted! We’ll be in touch via email.");
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F9FB] text-slate-900">
      {/* Hero with background image */}
      <header className="relative isolate overflow-hidden bg-[#1B365D]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/assets/images/nord2.jpg"
            alt="Nord Motors hero background"
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
            <h1 className="text-5xl md:text-6xl font-bold hero-text leading-tight">Spark the Future — Pitch Competition</h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              For event innovators fusing sustainability and technology. Pitch live on stage, win a brand-new Nord
              vehicle, and unlock investors, mentorship, and media.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-[#FF7F41] px-5 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-orange-400"
              >
                Apply now
              </button>
              <a href="#timeline" className="text-sm font-semibold underline underline-offset-4">
                Key dates
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Prize + Sponsor spotlight */}
      <section id="prize" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Grand prize & sponsor spotlight</h2>
            <p className="mt-4 text-slate-600">
              Spark the Future is an innovation challenge created by Atinuda and powered by Nord Motors to
              showcase and accelerate event professionals who integrate sustainability and technology into their
              businesses. Shortlisted businesses and solutions would;
            </p>
            <ul className="mt-6 space-y-3 text-slate-700">
              <li>• Operate within the events ecosystem .</li>
              <li>• Embed sustainability across environmental, social, and economic dimensions.</li>
              <li>• Leverage technology to enhance efficiency.</li>
              <li>• Be registered in Nigeria or elsewhere in Africa and have been operational since September 2024
                or earlier.</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-lg bg-[#FF7F41] px-4 py-2 font-semibold text-slate-900 hover:bg-orange-400"
              >
                Apply now
              </button>
              <a href="#eligibility" className="rounded-lg border border-slate-300 px-4 py-2 font-semibold">
                Eligibility
              </a>
            </div>
          </div>
          <div className="relative aspect-video overflow-hidden">
            <Image
              src="/assets/images/pitchposter.png"
              alt="Nord Motors hero background"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
      </section>

      {/* Why apply */}
      <section className="bg-[#1B365D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16">
          <h2 className="text-2xl md:text-3xl hero-text font-bold">Why apply</h2>
          <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Investor access", body: "Meet active funds and angels looking for sustainable event solutions." },
              { title: "Media spotlight", body: "Get featured across press and social during the conference week." },
              { title: "Mentor network", body: "Dedicated clinic to refine your pitch, model, and story." },
              { title: "Real partnerships", body: "Nord Motors collab that lives beyond the show." },
            ].map((c, i) => (
              <div key={i} className="rounded-2xl bg-white/10 p-5 ring-1 ring-white/10">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-2 text-white/85 text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section id="timeline" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16">
          <h2 className="text-2xl md:text-3xl hero-text font-bold">Key dates</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-5">
            {timeline.map((t, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs uppercase tracking-wide text-slate-500">{t.date}</p>
                <h3 className="mt-2 font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section id="eligibility" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16">
          <h2 className="text-2xl md:text-3xl hero-text font-bold">Who should apply (eligibility)</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2 text-slate-700">
            <li className="rounded-xl border border-slate-200 p-4">Operate in the events ecosystem (production, venues, logistics, streaming, registration, catering).</li>
            <li className="rounded-xl border border-slate-200 p-4">Embed sustainability across environmental, social, and economic dimensions.</li>
            <li className="rounded-xl border border-slate-200 p-4">Use technology to enhance efficiency and impact (digital, hybrid, energy-efficient systems, circular materials, AI tools).</li>
            <li className="rounded-xl border border-slate-200 p-4">Registered in Africa and operational since Sept 2024 or earlier; ≥12 months of recurring revenue.</li>
            <li className="rounded-xl border border-slate-200 p-4">Independent venture (no franchise/spin-off); majority founder ownership/control.</li>
            <li className="rounded-xl border border-slate-200 p-4">Willing to enter a post-programme partnership with Nord Motors for 12 months.</li>
          </ul>
        </div>
      </section>

      {/* Rubric */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16">
          <h2 className="text-2xl md:text-3xl hero-text font-bold">Judging criteria (100 points)</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { w: 20, t: "Innovation", d: "Novelty and creative integration of sustainability + technology." },
              { w: 20, t: "Sustainability impact", d: "Reduction in waste/energy/carbon and triple-bottom-line alignment." },
              { w: 15, t: "Technology integration", d: "Use of digital tools, efficient equipment, and data to drive impact." },
              { w: 15, t: "Feasibility", d: "Operational viability, demand, and realistic milestones." },
              { w: 15, t: "Scalability", d: "Ability to grow regionally/internationally while maintaining impact & profit." },
              { w: 15, t: "Presentation", d: "Clarity, story, visuals, and time management in the pitch." },
            ].map((r, i) => (
              <div key={i} className="rounded-2xl border border-slate-200 p-5 shadow-sm">
                <p className="text-xs font-semibold text-[#FF7F41]">{r.w}%</p>
                <h3 className="mt-1 font-semibold">{r.t}</h3>
                <p className="mt-2 text-sm text-slate-600">{r.d}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Each pitch: 5 minutes + 3 minutes of Q&amp;A. Tie-break: higher Sustainability Impact score prevails; if still tied, head judge decides.
          </p>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-16 py-16">
          <h2 className="text-2xl md:text-3xl font-bold">FAQs</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "What sectors qualify?",
                a: "Any venture within the events ecosystem: production, venues, logistics, streaming, registration, catering, and adjacent services.",
              },
              {
                q: "Is female founder status required?",
                a: "Not required, but we track founder diversity. Indicate whether you are a female-founded venture in the application form.",
              },
              {
                q: "What do I need for the application?",
                a: "Company details, solution summary, solution link, incorporation year, founder structure, last 12-month revenue band, and your pitch deck (PDF/PPT).",
              },
              {
                q: "What happens after winning?",
                a: "A 12-month collaboration with Nord Motors: vehicle use for logistics, brand integration, and content features to amplify your growth.",
              },
            ].map((f, i) => (
              <details key={i} className="group rounded-2xl border border-slate-200 p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium">
                  <span>{f.q}</span>
                  <span className="transition group-open:rotate-45">＋</span>
                </summary>
                <p className="mt-3 text-sm text-amber-700">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Big CTA */}
      <section className="bg-[#1B365D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-5xl md:text-5xl hero-text font-bold">Ready to pitch on stage?</h2>
          <p className="mt-2 text-white/85">Applications close Sept 24, 2025. Shortlist announced Sept 29.</p>
          <div className="mt-6">
            <button onClick={() => setOpen(true)} className="rounded-xl bg-[#FF7F41] px-6 py-3 font-semibold text-slate-900 hover:bg-orange-400">
              Apply now
            </button>
          </div>
          <p className="mt-4 text-xs text-white/70">By applying, you agree to our terms and privacy policy.</p>
        </div>
      </section>

      {/* Footer mini */}
      <footer className="bg-white border-t border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Atinuda. All rights reserved.</p>
          <div className="flex items-center gap-3">
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Privacy</a>
          </div>
        </div>
      </footer>

      {/* Modal: Application Form */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-8 overflow-y-auto">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />

          {/* Dialog */}
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="stf-apply-title"
            className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-xl"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-20 flex items-start justify-between gap-4 border-b border-slate-200 bg-white/90 px-6 py-4 backdrop-blur">
              <h3 id="stf-apply-title" className="text-lg font-semibold">Spark the Future — Application</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close application form"
              >
                ✕
              </button>
            </div>

            {/* Scrollable content */}
            <div className="max-h-[85vh] overflow-y-auto px-6 py-5">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                {/* Ticket Number (optional) */}
                <div>
                  <label className="text-sm font-medium">Ticket Number (optional)</label>
                  <p id="ticket_help" className="mt-1 text-xs text-slate-500">
                    Tip: If you’re already registered for the Conference, enter your ticket number to auto-fill your details.
                    Otherwise, leave it blank.
                  </p>
                  <input
                    name="ticket_number"
                    value={ticketValue}
                    onChange={(e) => setTicketValue(e.target.value)}
                    onBlur={(e) => verifyTicket(e.target.value)}
                    aria-invalid={ticketValid === false}
                    className={`mt-1 w-full rounded-lg border px-3 py-2 ${
                      ticketValid === false ? "border-red-500" : "border-slate-300"
                    }`}
                    placeholder="e.g. WRK-ATIN47810"
                  />
                  {ticketChecking && <p className="text-xs text-slate-500">Checking ticket…</p>}
                  {ticketValid === false && (
                    <p className="text-xs text-red-600">We couldn’t verify this ticket number. Please provide your details below.</p>
                  )}
                  {!ticketChecking && ticketValid === true && (
                    <p className="text-xs text-emerald-700">Ticket verified.</p>
                  )}
                </div>

                {/* If no ticket OR invalid → ask for identity/availability */}
                {needsIdentity && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-medium">Name *</label>
                      <input
                        name="applicant_name"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="Full name"
                      />
                    </div>

                    {/* Company */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-medium">Company *</label>
                      <input
                        name="company"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="Company / Team"
                      />
                    </div>

                    {/* Email */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-medium">Email *</label>
                      <input
                        name="email"
                        type="email"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="you@company.com"
                        autoComplete="email"
                      />
                    </div>

                    {/* Mobile */}
                    <div className="sm:col-span-1">
                      <label className="text-sm font-medium">Mobile *</label>
                      <input
                        name="mobile"
                        type="tel"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        placeholder="+234 801 234 5678"
                        autoComplete="tel"
                      />
                    </div>

                    {/* Willing to attend */}
                    <div className="sm:col-span-2">
                      <label className="text-sm font-medium">Are you willing to attend the conference if shortlisted? *</label>
                      <select
                        name="willing_to_attend"
                        required
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                        defaultValue=""
                      >
                        <option value="" disabled>Select…</option>
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Main fields — always enabled (not blocked) */}
                <div>
                  <label className="text-sm font-medium">Solution (brief) *</label>
                  <textarea
                    name="solution"
                    required
                    rows={3}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="What problem do you solve, and how?"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Solution link (website, demo, etc.) *</label>
                  <input
                    name="solution_link"
                    type="url"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Year incorporated *</label>
                    <select
                      name="year_incorporated"
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="">Select...</option>
                      {Array.from({ length: 26 }, (_, i) => 2025 - i).map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Founder structure *</label>
                    <select
                      name="founder_structure"
                      required
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    >
                      <option value="">Select...</option>
                      <option value="female_founder">Female founder</option>
                      <option value="mixed_team">Mixed team</option>
                      <option value="male_founder">Male founder</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Yearly generated revenue (USD) *</label>
                  <input
                    name="annual_revenue_usd"
                    type="number"
                    min={0}
                    step={100}
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="50000"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Country of business *</label>
                  <input
                    name="country"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                    placeholder="Nigeria"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Available for 1-day pitch clinic? *</label>
                  <select
                    name="available_pitch_clinic"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Received any funding? *</label>
                  <select
                    name="received_funding"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Stage of solution *</label>
                  <select
                    name="stage"
                    required
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                  >
                    <option value="">Select...</option>
                    <option value="ideation">Ideation</option>
                    <option value="conceptualisation">Conceptualisation</option>
                    <option value="mvp">MVP</option>
                    <option value="growth">Growth</option>
                  </select>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 text-sm">
                  <input type="checkbox" name="consent" required className="mt-1" />
                  <span>
                    I agree to the competition’s terms, confidentiality notice, and
                    data-privacy policy, and consent to receive communications about
                    Atinuda × Nord Motors.
                  </span>
                </label>

                {/* Actions */}
                <div className="mt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="rounded-lg border border-slate-300 px-4 py-2 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-[#1B365D] px-5 py-2 font-semibold text-white hover:bg-[#152c4a] disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit application"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
