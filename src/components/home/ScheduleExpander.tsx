'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type ScheduleDay = {
  day: string;
  label: string;
  title: string;
  slots: string[];
};

export default function ScheduleExpander({
  schedule,
  ticketUrl,
}: {
  schedule: ScheduleDay[];
  ticketUrl: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? schedule : schedule.slice(0, 4);

  return (
    <div>
      <div className="border border-dashed border-[#d1d5db] rounded-3xl overflow-hidden">
        {visible.map((day, idx) => (
          <div
            key={day.day}
            className={`grid grid-cols-[130px_1fr] md:grid-cols-[180px_1fr] ${
              idx < visible.length - 1 ? 'border-b border-dashed border-[#d1d5db]' : ''
            }`}
          >
            {/* Day label column */}
            <div className="border-r border-dashed border-[#d1d5db] px-4 py-6 bg-[#f5f5f3] flex flex-col justify-center gap-1">
              <p className="nav-text text-xs tracking-[0.15em] uppercase text-[#6b7280]">
                {day.day}
              </p>
              <p className="text-xs font-medium text-[#4b5563] leading-snug mt-1">
                {day.label}
              </p>
            </div>

            {/* Content column */}
            <div className="px-5 py-6 space-y-3">
              <h3 className="hero-text text-lg font-semibold text-[#0d2010]">
                {day.title}
              </h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {day.slots.map((slot) => (
                  <div
                    key={slot}
                    className="border border-dashed border-[#d1d5db] rounded-xl px-4 py-3 text-sm text-[#4b5563] leading-snug"
                  >
                    {slot}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-6">
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-[#0d2010]/20 text-sm font-semibold text-[#0d2010] hover:bg-[#0d2010]/5 transition-colors"
        >
          {expanded ? 'Collapse schedule' : 'View all 7 days'}
          <ArrowRight
            size={14}
            className={`transition-transform ${expanded ? 'rotate-90' : ''}`}
          />
        </button>

        <Link
          href={ticketUrl}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[#0d2010] text-white text-sm font-semibold hover:bg-[#1a3d1e] transition-colors"
        >
          Secure your retreat pass
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}
