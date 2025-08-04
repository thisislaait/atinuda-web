'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';

const TicketPage = () => {
  const params = useParams();
  const ticketNumber = Array.isArray(params?.ticketNumber)
    ? params.ticketNumber[0]
    : params?.ticketNumber || '';

  const [eventInfo, setEventInfo] = useState<string[]>([]);

  useEffect(() => {
    if (ticketNumber) {
      const lower = ticketNumber.toLowerCase();
      const events: string[] = [];

      if (lower.includes('conf')) events.push('📍 Conference: Oct 7–8, 10am–5pm');
      if (lower.includes('wrk')) events.push('🛠 Workshop: Oct 7, 12pm–4pm');
      if (lower.includes('exec')) events.push('💼 Executive: Full access, includes dinner');
      if (lower.includes('prem')) events.push('🌟 Premium: VIP seating + dinner');
      if (lower.includes('dine')) events.push('🍽️ Dinner Only: Oct 8, 8pm');

      setEventInfo(events);
    }
  }, [ticketNumber]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#f0f6ff] flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-2xl max-w-md w-full text-center p-8">
        <Image
          src="/assets/images/atinudalogo.png"
          alt="Atinuda Logo"
          width={64}
          height={64}
          className="mx-auto mb-4"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">🎫 Your Ticket</h1>
        <p className="text-sm text-gray-500 mb-6">
          Ticket Number: <span className="font-medium">{ticketNumber}</span>
        </p>

        {eventInfo.length > 0 ? (
          <div className="text-left space-y-2 mb-4">
            <h2 className="font-semibold text-gray-700">Event Schedule:</h2>
            {eventInfo.map((info, idx) => (
              <p key={idx} className="text-gray-600">{info}</p>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Loading event details...</p>
        )}

        <p className="text-xs text-gray-400 mt-6">
          Please show this screen at the venue for check-in.
        </p>
      </div>
    </div>
  );
};

export default TicketPage;
