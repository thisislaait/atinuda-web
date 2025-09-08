'use client';

import { useEffect, useRef, useState, Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { generateQRCode } from '@/utils/qr';

function Content() {
  const params = useSearchParams();

  const [submitted, setSubmitted] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('TBA');
  const hasAttemptedSubmission = useRef(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  // Read all params safely
  const data = useMemo(() => {
    const get = (k: string) => params?.get(k) || '';
    return {
      fullName: get('fullName'),
      email: get('email'),
      ticketType: get('ticketType') || 'General Admission',
      quantity: Number(get('quantity') || '1'),
      currency: get('currency') || 'NGN',
      amount: Number(get('amount') || '0'),
      discount: Number(get('discount') || '0'),
      txRef: get('txRef'),
      unitPrice: Number(get('unitPrice') || '0'),
      subtotal: Number(get('subtotal') || '0'),
    };
  }, [params]);

  const getCustomMessage = (type: string | null) => {
    switch (type) {
      case 'Conference Access':
        return 'You now have full access to all conference sessions!';
      case 'Workshop Access':
        return 'You’ve secured a seat at the workshops. Get ready to build and learn!';
      case 'Premium Experience':
        return 'Premium perks await you. Enjoy an elevated event experience!';
      case 'Executive Access':
        return 'Welcome to the Executive circle. Expect top-tier access and privileges!';
      case 'Dinner Gala Only':
        return 'We look forward to having you at the dinner. Dress to impress!';
      default:
        return 'Thank you for your reservation!';
    }
  };

  // Save ticket once
  useEffect(() => {
    if (
      !submitted &&
      data.fullName &&
      data.email &&
      typeof data.ticketType === 'string' &&
      !hasAttemptedSubmission.current
    ) {
      hasAttemptedSubmission.current = true;

      const saveTicket = async () => {
        try {
          const res = await fetch('/api/save-ticket', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: data.fullName,
              email: data.email,
              ticketType: data.ticketType,
              meta: {
                quantity: data.quantity,
                currency: data.currency,
                amountPaid: data.amount,
                discountPercent: data.discount,
                txRef: data.txRef,
                unitPrice: data.unitPrice,
                subtotal: data.subtotal,
              },
            }),
          });

          const json = await res.json().catch(() => ({}));
          if (res.ok) {
            toast.success(json.message || 'Ticket saved successfully!');
            setQrCode(json.qrCode || null);
            setTicketNumber(json.ticketNumber || null);
            setLocation(json.location || 'TBA');
            setSubmitted(true);
          } else {
            toast.error(json.message || 'Failed to save ticket.');
          }
        } catch (error) {
          console.error('Error saving ticket:', error);
          toast.error('A network error occurred. Please try again later.');
        }
      };

      saveTicket();
    }
  }, [submitted, data]);

  const handleDownload = async () => {
    if (!ticketNumber) return;

    try {
      const qrCodeBase64 = await generateQRCode(ticketNumber);
      const res = await fetch('/api/download-ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          ticketNumber,
          location,
          qrCodeBase64,
        }),
      });

      if (!res.ok) throw new Error('Failed to fetch PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ticket-${ticketNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Download Error:', err);
      toast.error('Failed to download PDF.');
    }
  };

  return (
    <div
      id="hero"
      className="relative w-full min-h-screen flex flex-col justify-center items-center text-center text-white p-6 sm:p-8"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/assets/images/bannerdesign.png"
          alt="Hero Background"
          fill
          className="w-full h-full object-cover bg-[#1f2340]"
        />
        <div className="absolute inset-0 bg-[#1f2340] opacity-60" />
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl pt-20 font-serif hero-text text-white mb-4">
          Thank You for Your Purchase
        </h1>
        <p className="text-white mb-6">
          A confirmation email will be sent shortly. Please be sure to always check your mail!
        </p>

        {data.fullName && data.email && data.ticketType && (
          <div
            ref={ticketRef}
            className="relative bg-white/10 rounded-lg border border-gray-300 flex flex-col md:flex-row overflow-hidden w-full max-w-3xl shadow-lg mb-6"
          >
            {/* Left: QR Code */}
            <div className="flex items-center justify-center md:w-1/3 bg-white p-6">
              {qrCode ? (
                <div className="flex flex-col items-center justify-center">
                  <Image
                    src={qrCode}
                    alt="QR Code"
                    width={144}
                    height={144}
                    className="w-36 h-36 object-contain border border-gray-300 rounded shadow-md"
                  />
                  <p className="text-sm text-black mt-2 font-medium">Scan at entrance</p>
                </div>
              ) : (
                <div className="w-36 h-36 bg-gray-200 animate-pulse rounded" />
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-[1px] border-l-2 border-dashed border-gray-400" />

            {/* Right: Info */}
            <div className="flex-1 p-6 text-white">
              <h2 className="text-xl font-bold mb-2">🎫 Event Pass</h2>
              <p className="mb-1"><strong>Name:</strong> {data.fullName}</p>
              <p className="mb-1"><strong>Email:</strong> {data.email}</p>
              <p className="mb-1"><strong>Ticket Type:</strong> {data.ticketType}</p>

            
              {ticketNumber && (
                <p className="mt-3 font-mono text-lg text-[#FF7F41]">
                  <strong>Ticket No:</strong> {ticketNumber}
                  <br />
                  <strong>Location:</strong> {location}
                </p>
              )}
              <p className="italic mt-3">{getCustomMessage(data.ticketType)}</p>

              <button
                className="mt-4 px-4 py-2 bg-white text-[#090706] font-semibold cursor-pointer rounded hover:bg-gray-100 transition"
                onClick={handleDownload}
              >
                Download Ticket
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  );
}
