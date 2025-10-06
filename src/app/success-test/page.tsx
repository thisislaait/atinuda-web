'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { getAuth, User as FirebaseUser } from 'firebase/auth';
import { useAuth } from '@/hooks/useAuth';

type OrderInfo = {
  fullName: string;
  email: string;
  ticketType: string;
};

type SaveTicketResponse = {
  message?: string;
  qrCode?: string | null;
  ticketNumber?: string | null;
  location?: string;
  primaryRoleAtPurchase?: string;
  fullName?: string;
  email?: string;
  ticketType?: string;
  alreadyIssued?: boolean;
  emailSent?: boolean;
};

// Safely get the Firebase ID token from the current user
async function getIdTokenSafe(): Promise<string | null> {
  const auth = getAuth();
  const u: FirebaseUser | null = auth.currentUser;
  if (u && typeof u.getIdToken === 'function') {
    try {
      return await u.getIdToken();
    } catch {
      return null;
    }
  }
  return null;
}

function getCustomMessage(type: string | null) {
  switch (type) {
    case 'Conference Access':
      return 'You now have full access to all conference sessions!';
    case 'Workshop Access':
      return 'You’ve secured a seat at the workshops. Get ready to build and learn!';
    case 'Premium Experience':
      return 'Premium perks await you. Enjoy an elevated event experience!';
    case 'Signature Pass':
      return 'Join industry leaders and executives who want an elevated summit!';
    case 'Executive Access':
      return 'Welcome to the Executive circle. Expect top-tier access and privileges!';
    case 'Dinner Gala Only':
      return 'We look forward to having you at the dinner. Dress to impress!';
    default:
      return 'Thank you for your reservation!';
  }
}

function Content() {
  const searchParams = useSearchParams();
  const { openAuthModal } = useAuth(); // only to prompt login if needed

  const [submitted, setSubmitted] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [location, setLocation] = useState<string>('TBA');
  const [order, setOrder] = useState<OrderInfo | null>(null);
  const hasAttemptedSubmission = useRef(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  const txRef = searchParams?.get('txRef') || '';

  // Issue/get the ticket (idempotent) using txRef
  useEffect(() => {
    if (!txRef || submitted || hasAttemptedSubmission.current) return;
    hasAttemptedSubmission.current = true;

    (async () => {
      try {
        const idToken = await getIdTokenSafe();
        if (!idToken) {
          openAuthModal?.();
          hasAttemptedSubmission.current = false; // allow retry after login
          return;
        }

        const res = await fetch('/api/save-ticket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({ txRef }),
        });

        let data: SaveTicketResponse = {};
        try {
          data = (await res.json()) as SaveTicketResponse;
        } catch {
          data = {};
        }

        if (res.ok) {
          const sent = Boolean(data.emailSent);
          toast.success(sent ? 'Ticket issued — email sent!' : 'Ticket issued — email pending.');
          setQrCode(data.qrCode ?? null);
          setTicketNumber(data.ticketNumber ?? null);
          setLocation(data.location ?? 'TBA');
          setOrder({
            fullName: data.fullName ?? '',
            email: data.email ?? '',
            ticketType: data.ticketType ?? 'General Admission',
          });
          setSubmitted(true);
        } else {
          toast.error(data.message || 'Payment not confirmed yet. If charged, we will reconcile shortly.');
          hasAttemptedSubmission.current = false; // allow retry
        }
      } catch (err) {
        console.error('Error issuing ticket:', err);
        toast.error('A network error occurred. Please refresh in a moment.');
        hasAttemptedSubmission.current = false; // allow retry
      }
    })();
  }, [txRef, submitted, openAuthModal]);

  const handleDownload = async () => {
    if (!txRef) return;
    try {
      const idToken = await getIdTokenSafe();
      if (!idToken) {
        openAuthModal?.();
        return;
      }
      const res = await fetch('/api/download-ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ txRef }),
      });

      if (!res.ok) throw new Error('Failed to fetch PDF');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Ticket-${ticketNumber ?? txRef}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('PDF Download Error:', err);
      toast.error('Failed to download PDF.');
    }
  };

  const fullName = order?.fullName ?? '';
  const email = order?.email ?? '';
  const ticketType = order?.ticketType ?? 'General Admission';

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

        {txRef && (
          <div
            ref={ticketRef}
            className="relative bg-white/10 rounded-lg border border-gray-300 flex flex-col md:flex-row overflow-hidden w-full max-w-3xl shadow-lg mb-6"
          >
            {/* Left: QR (shows when available) */}
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

              {fullName ? <p className="mb-1"><strong>Name:</strong> {fullName}</p> : null}
              {email ? <p className="mb-1"><strong>Email:</strong> {email}</p> : null}
              {ticketType ? <p className="mb-1"><strong>Ticket Type:</strong> {ticketType}</p> : null}

              {ticketNumber && (
                <p className="mt-3 font-mono text-lg text-[#FF7F41]">
                  <strong>Ticket No:</strong> {ticketNumber}
                  <br />
                  <strong>Location:</strong> {location}
                </p>
              )}

              <p className="italic mt-3">{getCustomMessage(ticketType)}</p>

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
