'use client';

import { useState, useMemo} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AccordionWithImage, { AccordionItem } from './accordion';

const ticketOptions = [
  { type: 'Conference Access',  priceNGN: 295000, priceUSD: 200, desc: 'Full access to all main conference sessions. Ideal for industry leaders and professionals seeking insights and networking.', image: '/assets/images/Conference.png' },
  { type: 'Workshop Access',    priceNGN: 250000, priceUSD: 170, desc: 'Hands-on expert-led workshops tailored for creatives and professionals. Intimate, intensive, and focused.', image: '/assets/images/masterclass.jpg' },
  { type: 'Premium Experience', priceNGN: 500000, priceUSD: 340, desc: 'Includes full Conference + Workshop access with an exclusive bundled rate. Enjoy curated content and actionable insights.', image: '/assets/images/executive2.png' },
  { type: 'Executive Access',   priceNGN: 650000, priceUSD: 440, desc: 'Everything in Premium, plus access to the private Executive Dinner with keynote guests and partners. Limited availability.', image: '/assets/images/CocktailMixer.png' },
  { type: 'Dinner Gala Only',   priceNGN: 250000, priceUSD: 170, desc: 'Invitation to the evening Gala & Executive Dinner. Enjoy a curated experience with leaders, partners, and special guests.', image: '/assets/images/Dinner.png' },
];

const Payment = () => {
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');

  const selectedTicket = useMemo(
    () => (typeof selectedIndex === 'number' ? ticketOptions[selectedIndex] : null),
    [selectedIndex]
  );

  // For display only (final price/discounts happen on /checkout)
  const unitPrice = selectedTicket
    ? currency === 'NGN'
      ? selectedTicket.priceNGN
      : selectedTicket.priceUSD
    : 0;

  const accordionItems: AccordionItem[] = ticketOptions.map((ticket, index) => ({
    id: `ticket-${index}`,
    title: (
      <div className="flex flex-col text-left">
        <span className="text-lg font-semibold text-black">{ticket.type}</span>
        <span className="text-[#ff7f41] text-sm">
          {currency === 'NGN'
            ? `₦${ticket.priceNGN.toLocaleString()}`
            : `$${ticket.priceUSD.toLocaleString()}`}
        </span>
      </div>
    ),
    image: ticket.image,
    content: (
      <div>
        <p>{ticket.desc}</p>
        <div className="flex items-center gap-3 mt-3" />
      </div>
    ),
  }));

  const goToCheckout = () => {
    if (!selectedTicket || quantity < 1) return;
    // NOTE: you’re passing price via query because your /checkout currently reads it.
    // Safer: also re-compute price on /checkout from ticketType + currency.
    const q = new URLSearchParams({
      ticketType: selectedTicket.type,
      price: String(unitPrice),
      quantity: String(quantity),
      currency,
    }).toString();

    router.push(`/checkout?${q}`);
  };

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
          <p><strong>Date:</strong> October 6th - 8th, 2025</p>
          <p><strong>Location:</strong> Lagos, Nigeria</p>
          <p><strong>Time:</strong> 10:00 AM – 6:00 PM Daily</p>
          <p className="mt-4 text-sm text-gray-500">
            Early bird pricing ends August 1st. No refunds after purchase.
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

      {/* Ticket list */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <AccordionWithImage
          items={accordionItems}
          selectedIndex={selectedIndex}
          quantity={quantity}
          onIncrement={(index) => {
            if (selectedIndex === index) {
              setQuantity((q) => q + 1);
            } else {
              setSelectedIndex(index);
              setQuantity(1);
            }
          }}
          onDecrement={(index) => {
            if (selectedIndex === index) {
              setQuantity((q) => Math.max(0, q - 1));
            }
          }}
          onCheckout={goToCheckout}
        />
      </div>
    </section>
  );
};

export default Payment;

