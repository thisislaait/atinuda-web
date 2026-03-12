import type { Metadata } from "next";
import ElevationRetreatFeedbackForm from "@/components/ui/ElevationRetreatFeedbackForm";

export const metadata: Metadata = {
  title: "Elevation Retreat Reflection & Feedback",
  description: "Post-event feedback form for attendees, speakers, partners, and media.",
};

export default function ElevationRetreatFeedbackPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-10 sm:px-6 lg:px-8">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/assets/images/elevation-feedback-bg-2.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a]/45 via-[#14532d]/30 to-[#0b1120]/60" />

      <div className="relative z-10 mx-auto w-full max-w-4xl rounded-[28px] border border-white/35 bg-white/15 px-6 pb-6 pt-10 shadow-[0_20px_70px_rgba(15,23,42,0.35)] backdrop-blur-2xl sm:px-8 sm:pb-8 sm:pt-12">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#d1fae5]">Elevation Retreat</p>
        <h1 className="text-3xl text-white sm:text-4xl" style={{ fontFamily: "SaolDisplay, serif" }}>
          Reflection & Feedback
        </h1>
        <p className="mt-3 text-sm leading-6 text-[#ecfeff] sm:text-base">
          Thank you for being part of Elevation Retreat. Your reflections help us improve future editions with more
          care and excellence. This form takes about 5-8 minutes.
        </p>

        <div className="mt-8 rounded-2xl border border-white/30 bg-[#f8fafc]/18 p-4 backdrop-blur-xl sm:p-6">
          <ElevationRetreatFeedbackForm />
        </div>
      </div>
    </main>
  );
}
