'use client';

import { useState } from 'react';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/AuthModal';
// import emailjs from 'emailjs-com';
import { useRouter } from 'next/navigation';


// import { signOut } from 'firebase/auth';
// import { auth } from '@/firebase/config';


const ticketOptions = [
  { type: 'Member', price: 250000, desc: 'Discounted rate for registered members.' },
  { type: 'Non-Member', price: 295000, desc: 'Standard access for non-members.' },
  { type: 'VIP', price: 500000, desc: 'Front row seating, exclusive dinner invite.' },
  { type: 'Non-Member', price: 650000, desc: 'Standard access for non-members.' },
  { type: 'VIP', price: 250000, desc: 'Front row seating, exclusive dinner invite.' },
];

const Payment = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

   const router = useRouter();

  const { user, openAuthModal, logout } = useAuth(); 

  const selectedTicket = ticketOptions.find((t) => t.type === selected);
  const totalAmount = selectedTicket ? selectedTicket.price * quantity : 0;

  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount: totalAmount,
    currency: 'NGN',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'guest@example.com',
      phone_number: '08012345678',
      name: user?.firstName || 'Atinuda Guest',
    },
    customizations: {
      title: 'Atinuda Ticket',
      description: `${selected} Ticket x ${quantity}`,
      logo: '/assets/images/blacklogo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  return (
    <section className="w-full bg-white">
      {/* Header Banner */}
      <div className="relative w-full h-[400px]">
        <Image
          src="/assets/images/Tourism2.jpg"
          alt="Ticket Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1f2340]/60 z-10" />
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl text-white font-bold text-center hero-text">
            Reserve Your Spot at Atinuda 2025
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-sm uppercase tracking-widest text-[#ff7f41] mb-6">
          Local To Global – Creative Transformations
        </p>

        <div className="mb-8 text-gray-700">
          <p><strong>Date:</strong> October 7–9, 2025</p>
          <p><strong>Location:</strong> National Stadium, Lagos</p>
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

        <hr className="my-10 border-gray-300" />

        {/* Ticket Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {ticketOptions.map((ticket) => (
            <div
              key={ticket.type}
              className={`border p-6 rounded-lg transition-all cursor-pointer ${
                selected === ticket.type
                  ? 'border-[#ff7f41] bg-[#fff8f3]'
                  : 'border-gray-300 hover:border-[#ff7f41]'
              }`}
              onClick={() => {
                setSelected(ticket.type);
                setQuantity(1);
              }}
            >
              <h3 className="text-lg text-black font-semibold mb-2">{ticket.type} Ticket</h3>
              <p className="text-sm text-[#ff7f41]">{ticket.desc}</p>
              <p className="mt-4 text-xl font-bold text-black">
                ₦{ticket.price.toLocaleString()}
              </p>

              {selected === ticket.type && (
                <div className="mt-4 flex items-center gap-3">
                  <button
                    className="px-2 py-1 border border-gray-400 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (quantity > 1) setQuantity((q) => q - 1);
                    }}
                  >
                    −
                  </button>
                  <span className="text-base text-black font-medium">{quantity}</span>
                  <button
                    className="px-2 py-1 border border-gray-400 text-sm text-black"
                    onClick={(e) => {
                      e.stopPropagation();
                      setQuantity((q) => q + 1);
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Payment Section */}
        {selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            {/* User Info & Logout */}
            {user && (
              <div className="flex flex-col items-center mb-4 text-black">
                <p className="text-sm">
                  Hello <strong>{user.firstName || user.email?.split('@')[0]}</strong>
                </p>
                <button
                  onClick={logout}
                  className="mt-1 text-xs text-red-500 hover:underline"
                >
                  Log Out
                </button>
              </div>
            )}

            <p className="text-sm mb-4 text-black">
              Total for <strong>{quantity}</strong> {selected} ticket(s):{' '}
              <strong>₦{totalAmount.toLocaleString()}</strong>
            </p>

            <button
              onClick={() => {
                if (!user) {
                  openAuthModal();
                } else {
                  handleFlutterPayment({
                    callback: (response) => {
                      console.log('Payment success:', response);
                      closePaymentModal();
                  
                      // // Send confirmation email
                      // emailjs.send(
                      //   'service_0hr9j1c',
                      //   'template_lza9v4x',
                      //   {
                      //     user_name: user?.firstName || 'Guest',
                      //     user_email: user?.email,
                      //     ticket_type: selected,
                      //     ticket_quantity: quantity,
                      //     total_amount: totalAmount.toLocaleString(),
                      //   },
                      //   'UVyr_S1vJexPjIQ2A'
                      // ).then(() => {
                      //   console.log('Email sent successfully!');
                      // }).catch((err) => {
                      //   console.error('Email sending failed:', err);
                      // });
                  
                      router.push('/success'); // Optional redirect
                    },
                    onClose: () => {
                      console.log('Payment closed');
                    },
                  });
                  
                }
              }}
              className="relative z-50 px-8 py-3 border border-gray-600 text-black font-medium uppercase overflow-hidden group mt-4" // Added z-50 to try and fix potential overlay issue on Vercel
            >
              Proceed to Payment
            </button>
            {/* If the button is still not clickable on Vercel, inspect the element in the browser developer tools to see if another element is covering it. */}
            {/* <button
              onClick={() => signOut(auth)}
              className="text-sm hover:text-red-600 transition relative px-8 py-3 border border-gray-600 text-black font-medium uppercase overflow-hidden group mt-4"
            >
              Sign Out
            </button> */}
          </motion.div>
        )}
      </div>

      {/* Show the Auth Modal only on this page */}
      <AuthModal />
    </section>
  );
};

export default Payment;
