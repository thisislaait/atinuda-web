// Refactored Payment.tsx with AccordionWithImage integration and improved structure

'use client';

import { useState, useMemo } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useRouter } from 'next/navigation';
import AccordionWithImage, {AccordionItem} from './accordion';

const ticketOptions = [
  {
    type: 'Conference Access',
    priceNGN: 295000,
    priceUSD: 200,
    desc: 'Full access to all main conference sessions. Ideal for industry leaders and professionals seeking insights and networking.',
    image: '/assets/images/Conference.png',
  },
  {
    type: 'Workshop Access',
    priceNGN: 250000,
    priceUSD: 170,
    desc: 'Hands-on expert-led workshops tailored for creatives and professionals. Intimate, intensive, and focused.',
    image: '/assets/images/workshop.jpg',
  },
  {
    type: 'Premium Experience',
    priceNGN: 500000,
    priceUSD: 340,
    desc: 'Includes full Conference + Workshop access with an exclusive bundled rate. Enjoy curated content and actionable insights.',
    image: '/assets/images/premium.jpg',
  },
  {
    type: 'Executive Access',
    priceNGN: 650000,
    priceUSD: 440,
    desc: 'Everything in Premium, plus access to the private Executive Dinner with keynote guests and partners. Limited availability.',
    image: '/assets/images/executive.jpg',
  },
  {
    type: 'Dinner Gala Only',
    priceNGN: 250000,
    priceUSD: 170,
    desc: 'Invitation to the evening Gala & Executive Dinner. Enjoy a curated experience with leaders, partners, and special guests.',
    image: '/assets/images/dinner.jpg',
  },
];

const Payment = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const router = useRouter();
  const { user, openAuthModal, logout } = useAuth();

  const selectedTicket = useMemo(() =>
    typeof selectedIndex === 'number' ? ticketOptions[selectedIndex] : null,
    [selectedIndex]
  );

  const totalAmount = selectedTicket ? (currency === 'NGN' ? selectedTicket.priceNGN : selectedTicket.priceUSD) * quantity : 0;

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount: totalAmount,
    currency,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'guest@example.com',
      phone_number: '08012345678',
      name: user?.firstName || 'Atinuda Guest',
    },
    customizations: {
      title: 'Atinuda Ticket',
      description: `${selectedTicket?.type} Ticket x ${quantity}`,
      logo: '/assets/images/blacklogo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const initiatePayment = () => {
    if (!process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY) {
      console.error('Flutterwave public key is not configured.');
      alert('The payment gateway is not available at the moment. Please try again later.');
      return;
    }

    if (!user) return openAuthModal();

    handleFlutterPayment({
      callback: (response) => {
        console.log('Payment success:', response);
        closePaymentModal();
        router.push('/success');
      },
      onClose: () => console.log('Payment closed'),
    });
  };

  const accordionItems: AccordionItem[] = ticketOptions.map((ticket, index) => ({
    id: `ticket-${index}`,
    title: (
      <div className="flex flex-col text-left">
        <span className="text-lg font-semibold text-black">{ticket.type}</span>
        <span className="text-[#ff7f41] text-sm">
          {currency === 'NGN' ? `₦${ticket.priceNGN.toLocaleString()}` : `$${ticket.priceUSD.toLocaleString()}`}
        </span>
      </div>
    ),
    image: ticket.image,
    content: (
      <div>
        <p>{ticket.desc}</p>
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={() => {
              if (selectedIndex === index) setQuantity((q) => Math.max(1, q - 1));
            }}
            className="border px-2"
          >
            -
          </button>
          <span>{selectedIndex === index ? quantity : 1}</span>
          <button
            onClick={() => {
              setSelectedIndex(index);
              setQuantity((q) => q + 1);
            }}
            className="border px-2"
          >
            +
          </button>
        </div>
      </div>
    ),
  }));

  return (
    <section className="w-full bg-white">
      {/* Header */}
      <div className="relative w-full h-[400px]">
        <Image src="/assets/images/elementtwo.png" alt="Ticket Banner" fill className="object-cover" />
        <div className="absolute inset-0 z-10 bg-black/40" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold text-center hero-text">
            Reserve Your Spot at Atinuda 2025
          </h1>
        </div>
      </div>

      <div className="p-8 max-w-5xl mx-auto">
        <p className="text-sm uppercase tracking-widest text-[#ff7f41] mb-6">
          Local To Global – Creative Transformations
        </p>

        <div className="mb-8 text-gray-700">
          <p><strong>Date:</strong> October 7th & 8th, 2025</p>
          <p><strong>Location:</strong> Lagos, Nigeria</p>
          <p><strong>Time:</strong> 10:00 AM – 6:00 PM Daily</p>
          <p className="mt-4 text-sm text-gray-500">
            Early bird pricing ends July 1st. No refunds after purchase.
          </p>
          <Link
            href="https://instagram.com/atinuda_"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 text-white bg-[#ff7f41] px-5 py-2 text-sm font-semibold uppercase rounded hover:bg-[#e66a30] transition"
          >
            Follow us on Instagram
          </Link>
        </div>
      </div>

      <hr className="my-10 border-gray-300" />

      {/* Currency Switch */}
      <div className="text-center mb-6">
        <button
          onClick={() => setCurrency('NGN')}
          className={`mx-2 px-4 py-1 text-sm font-medium border rounded ${currency === 'NGN' ? 'bg-[#ff7f41] text-white' : 'border-gray-400 text-black'}`}
        >
          Naira Rates
        </button>
        <button
          onClick={() => setCurrency('USD')}
          className={`mx-2 px-4 py-1 text-sm font-medium border rounded ${currency === 'USD' ? 'bg-[#ff7f41] text-white' : 'border-gray-400 text-black'}`}
        >
          USD Rates
        </button>
      </div>

      {/* Accordion With Image */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <AccordionWithImage items={accordionItems} />

        {/* Payment Section */}
        {selectedTicket && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-10">
            {user && (
              <div className="flex flex-col items-center mb-4 text-black">
                <p className="text-sm">
                  Hello <strong>{user.firstName || user.email?.split('@')[0]}</strong>
                </p>
                <button onClick={logout} className="mt-1 text-xs text-red-500 hover:underline">
                  Log Out
                </button>
              </div>
            )}
            <p className="text-sm mb-4 text-black">
              Total for <strong>{quantity}</strong> {selectedTicket.type} ticket(s): <strong>
                {currency === 'NGN' ? `₦${totalAmount.toLocaleString()}` : `$${totalAmount.toLocaleString()}`}
              </strong>
            </p>
            <button
              onClick={initiatePayment}
              className="relative z-50 px-8 py-3 border border-gray-600 text-black font-medium uppercase overflow-hidden group mt-4"
            >
              Proceed to Payment
            </button>
          </motion.div>
        )}
      </div>

      <AuthModal />
    </section>
  );
};

export default Payment;
