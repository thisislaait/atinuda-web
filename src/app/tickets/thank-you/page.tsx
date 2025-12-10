'use client';

import Link from "next/link";

export default function ThankYou() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f1528] to-[#0b1220] text-white flex items-center justify-center px-6">
      <div className="max-w-xl w-full text-center space-y-4 bg-white/5 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/30">
        <div className="text-4xl">🎉</div>
        <h1 className="text-3xl font-semibold hero-text">Thank you for your purchase</h1>
        <p className="text-white/80">
          Your payment has been received. Please log in to the Atinuda app to see your ticket. We&apos;ll also email
          your receipt and follow up with your QR soon.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full bg-white text-[#0b1220] font-semibold hover:bg-white/90 transition"
          >
            Return home
          </Link>
          <Link
            href="/tickets/mine"
            className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-white/20 text-sm font-semibold hover:bg-white/10 transition"
          >
            View ticket status
          </Link>
        </div>
      </div>
    </div>
  );
}
