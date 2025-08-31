'use client';

import { Suspense, useMemo, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';
import { FaUserCircle } from 'react-icons/fa';
import { FiArrowLeft } from 'react-icons/fi';

function CheckoutContent() {
  const params = useSearchParams();
  const router = useRouter();
  const { user, openAuthModal, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  // Ticket params
  const ticketType = params?.get('ticketType') || 'Ticket';
  const price = parseFloat(params?.get('price') || '0');
  const quantity = parseInt(params?.get('quantity') || '1');
  const currency = (params?.get('currency') as 'NGN' | 'USD') || 'NGN';

  const totalAmount = useMemo(() => price * quantity, [price, quantity]);

  // ---------- APPOEMN DISCOUNT LOGIC ----------
  const {
    appoemnValidated,
    appoemnRole,
    discountCode,
    discountUsed,
  } = (user || {}) as {
    appoemnValidated?: boolean;
    appoemnRole?: 'exco' | 'member';
    discountCode?: string | null;
    discountUsed?: boolean;
  };

  const discountPercent = useMemo(() => {
    if (!appoemnValidated || discountUsed) return 0;
    if (discountCode?.startsWith('APPO50')) return 50;
    if (discountCode?.startsWith('APPO20')) return 20;
    if (appoemnRole === 'exco') return 50;
    if (appoemnRole === 'member') return 20;
    return 0;
  }, [appoemnValidated, appoemnRole, discountCode, discountUsed]);

  const discountedTotal = useMemo(
    () => Math.max(0, Math.round((totalAmount * (100 - discountPercent)) / 100)),
    [totalAmount, discountPercent]
  );

  // Amount to charge
  const payAmount = discountPercent > 0 ? discountedTotal : totalAmount;

  // ---------- FLUTTERWAVE CONFIG ----------
  const config = {
    public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY || '',
    tx_ref: Date.now().toString(),
    amount: payAmount,
    currency,
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'guest@example.com',
      phone_number: '08012345678',
      name: user?.firstName || 'Atinuda Guest',
    },
    customizations: {
      title: 'Atinuda Ticket',
      description: `${ticketType} Ticket x ${quantity}`,
      logo: '/assets/images/blacklogo.png',
    },
  };

  const handleFlutterPayment = useFlutterwave(config);

  const handlePayment = () => {
    if (!user) return openAuthModal();

    setLoading(true);
    handleFlutterPayment({
      callback: async () => {
        closePaymentModal();

        // If a discount applied, mark it consumed (server should be idempotent)
        try {
          if (discountPercent > 0 && user?.uid) {
            await fetch('/api/appoemn/consume', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                uid: user.uid,
                ticketType,
                originalAmount: totalAmount,
                amountCharged: payAmount,
                consumedAt: Date.now(), 
              }),
            });
          }
        } catch (e) {
          // Non-blocking: still continue to success page
          console.warn('Failed to consume discount', e);
        }

        // Send ALL key details to success page
        const query = new URLSearchParams({
          fullName: user?.firstName || 'Atinuda Guest',
          email: user?.email || 'guest@example.com',
          ticketType,
          quantity: String(quantity),
          currency,
          amount: String(payAmount), 
          discount: String(discountPercent), 
          txRef: config.tx_ref,  
          unitPrice: String(price), 
          subtotal: String(totalAmount), 
        }).toString();

        router.push(`/success?${query}`);
      },
      onClose: () => setLoading(false),
    });
  };

  return (
    <div className="min-h-screen bg-white text-black mt-32">
      {/* Back header (kept your structure) */}
      <section id='nohero'>
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded hover:bg-gray-100 transition"
            aria-label="Go back"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Checkout</h1>
        </div>
      </section>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Auth bar */}
        <div className="w-full bg-gray-50 border border-gray-400 rounded-xl shadow-sm p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <FaUserCircle className="text-3xl text-gray-600" />
              {!user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={openAuthModal}
                    className="px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 text-sm"
                  >
                    Login
                  </button>
                  <button
                    onClick={openAuthModal}
                    className="px-3 py-1.5 rounded bg-black text-white hover:bg-gray-800 text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              ) : (
                <p className="font-semibold">
                  Hello, {user.firstName || user.email?.split('@')[0]}
                </p>
              )}
            </div>

            {user && (
              <div className="shrink-0">
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded border border-red-400 text-red-600 hover:bg-red-50 text-sm"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Unified checkout card */}
        <div className="border border-gray-400 rounded-2xl shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-5 py-4 border-b flex items-center justify-between">
            <h3 className="font-semibold text-lg">Order Summary</h3>

            {discountPercent > 0 && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                APPOEMN discount {discountPercent}% applied
              </span>
            )}
            {discountUsed && appoemnValidated && (
              <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-amber-100 text-amber-700">
                Member discount already used
              </span>
            )}
          </div>

          <div className="px-5 py-5 space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Type</span>
              <span className="font-medium">{ticketType}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Quantity</span>
              <span className="font-medium">{quantity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Unit Price</span>
              <span className="font-medium">
                {currency === 'NGN'
                  ? `₦${price.toLocaleString()}`
                  : `$${price.toLocaleString()}`}
              </span>
            </div>

            <hr className="my-2" />

            {/* Totals & slash if discount */}
            {discountPercent > 0 ? (
              <>
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-gray-600">Subtotal</span>
                  <span className="line-through text-gray-500">
                    {currency === 'NGN'
                      ? `₦${totalAmount.toLocaleString()}`
                      : `$${totalAmount.toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-base">
                  <span className="font-medium text-gray-600">
                    Discount ({discountPercent}%)
                  </span>
                  <span className="text-green-600">
                    −
                    {currency === 'NGN'
                      ? `₦${(totalAmount - discountedTotal).toLocaleString()}`
                      : `$${(totalAmount - discountedTotal).toLocaleString()}`}
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="font-semibold">Total</span>
                  <span className="font-bold">
                    {currency === 'NGN'
                      ? `₦${discountedTotal.toLocaleString()}`
                      : `$${discountedTotal.toLocaleString()}`}
                  </span>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-between text-lg">
                <span className="font-semibold">Total</span>
                <span className="font-bold">
                  {currency === 'NGN'
                    ? `₦${totalAmount.toLocaleString()}`
                    : `$${totalAmount.toLocaleString()}`}
                </span>
              </div>
            )}
          </div>

          <div className="px-5 pb-5">
            {!user && (
              <p className="text-xs text-gray-600 mb-3">
                Please sign in or sign up to continue.
              </p>
            )}
            <button
              onClick={handlePayment}
              disabled={loading}
              className={`w-full py-3 font-medium rounded-lg ${
                loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-[#ff7f41] text-white hover:bg-[#e66a30]'
              }`}
            >
              {loading ? 'Processing…' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-600">Loading checkout…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
