'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check, Minus, Plus, ShieldCheck } from 'lucide-react';
import { SUMMIT_TICKETS } from '@/data/ticketProducts';

type Currency = 'NGN' | 'USD';

const CURRENCY_OPTIONS: Array<{ label: string; value: Currency }> = [
  { label: 'Naira (NGN)', value: 'NGN' },
  { label: 'US Dollar (USD)', value: 'USD' },
];

const formatPrice = (value: number, currency: Currency) =>
  currency === 'NGN' ? `₦${value.toLocaleString('en-NG')}` : `$${value.toLocaleString('en-US')}`;

export default function Payment() {
  const router = useRouter();

  const [currency, setCurrency] = useState<Currency>('NGN');
  const [selectedKey, setSelectedKey] = useState<string>(SUMMIT_TICKETS[0]?.key ?? 'conference');
  const [quantity, setQuantity] = useState(1);

  const selectedTicket = useMemo(
    () => SUMMIT_TICKETS.find((ticket) => ticket.key === selectedKey) ?? SUMMIT_TICKETS[0],
    [selectedKey],
  );

  const unitPrice = useMemo(() => {
    if (!selectedTicket) return 0;
    return currency === 'NGN' ? selectedTicket.priceNGN : selectedTicket.priceUSD;
  }, [currency, selectedTicket]);

  const totalPrice = unitPrice * quantity;

  const handleCheckout = () => {
    if (!selectedTicket || quantity < 1) return;

    const query = new URLSearchParams({
      ticketType: selectedTicket.type,
      price: String(unitPrice),
      quantity: String(quantity),
      currency,
    }).toString();

    router.push(`/checkout?${query}`);
  };

  return (
    <section aria-label="Summit checkout" className="w-full text-[#0d1e2c]">
      <div className="grid lg:grid-cols-[1.2fr_360px] gap-8 lg:gap-10 items-start">
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-8 pb-6 border-b border-[#ece4da]">
            <div>
              <p className="nav-text text-[9px] tracking-[0.28em] text-[#ff7f41] mb-3">TICKET SELECTOR</p>
              <h3 className="text-2xl md:text-3xl leading-tight" style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}>
                Select your access level.
              </h3>
            </div>

            <div>
              <p className="nav-text text-[8px] tracking-[0.2em] text-[#0d1e2c]/35 mb-2">CURRENCY</p>
              <div className="inline-flex items-center rounded-full border border-[#d9cfc4] p-1 bg-[#faf8f5]">
                {CURRENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setCurrency(option.value)}
                    className={`px-4 py-2 rounded-full nav-text text-[9px] tracking-[0.14em] transition-all duration-200 ${
                      currency === option.value
                        ? 'bg-[#0d1e2c] text-white'
                        : 'text-[#0d1e2c]/45 hover:text-[#0d1e2c]'
                    }`}
                    aria-pressed={currency === option.value}
                  >
                    {option.label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {SUMMIT_TICKETS.map((ticket) => {
              const isSelected = ticket.key === selectedKey;
              const currentPrice = currency === 'NGN' ? ticket.priceNGN : ticket.priceUSD;

              return (
                <button
                  key={ticket.key}
                  type="button"
                  onClick={() => {
                    setSelectedKey(ticket.key);
                    setQuantity(1);
                  }}
                  className={`w-full text-left border transition-all duration-300 ${
                    isSelected
                      ? 'border-[#ff7f41]/55 bg-[#fffaf5] shadow-[0_20px_45px_-35px_rgba(13,30,44,0.55)]'
                      : 'border-[#ece4da] hover:border-[#d2c7bb] bg-white'
                  }`}
                >
                  <div className="grid sm:grid-cols-[140px_1fr] gap-5 p-4 md:p-5">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
                      <Image
                        src={ticket.image}
                        alt={ticket.type}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 140px"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="text-lg leading-tight" style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}>
                          {ticket.type}
                        </h4>
                        <span className="nav-text text-[9px] tracking-[0.14em] text-[#ff7f41]">
                          {formatPrice(currentPrice, currency)}
                        </span>
                      </div>

                      <p className="text-sm text-[#0d1e2c]/56 leading-relaxed mt-2">{ticket.desc}</p>

                      <div className="mt-4 flex items-center justify-between gap-3">
                        <span
                          className={`inline-flex items-center gap-2 nav-text text-[8px] tracking-[0.16em] ${
                            isSelected ? 'text-[#0d1e2c]/72' : 'text-[#0d1e2c]/32'
                          }`}
                        >
                          <Check size={11} className={isSelected ? 'text-[#ff7f41]' : 'text-[#0d1e2c]/20'} />
                          {isSelected ? 'SELECTED' : 'SELECT THIS PASS'}
                        </span>

                        {isSelected && (
                          <div className="inline-flex items-center border border-[#e4d9ce] bg-white">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setQuantity((prev) => Math.max(1, prev - 1));
                              }}
                              className="h-8 w-8 inline-flex items-center justify-center text-[#0d1e2c]/60 hover:text-[#0d1e2c]"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="h-8 min-w-10 inline-flex items-center justify-center text-sm text-[#0d1e2c] border-x border-[#e4d9ce]">
                              {quantity}
                            </span>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                setQuantity((prev) => prev + 1);
                              }}
                              className="h-8 w-8 inline-flex items-center justify-center text-[#0d1e2c]/60 hover:text-[#0d1e2c]"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 border border-[#0d1e2c]/12 bg-[#f7f3ee] p-6 md:p-7">
          <p className="nav-text text-[9px] tracking-[0.25em] text-[#ff7f41] mb-3">ORDER SUMMARY</p>
          <h4 className="text-xl text-[#0d1e2c]" style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}>
            {selectedTicket?.type}
          </h4>

          <div className="mt-6 space-y-3 text-sm">
            <div className="flex items-center justify-between text-[#0d1e2c]/58">
              <span>Unit price</span>
              <span>{formatPrice(unitPrice, currency)}</span>
            </div>
            <div className="flex items-center justify-between text-[#0d1e2c]/58">
              <span>Quantity</span>
              <span>{quantity}</span>
            </div>
            <div className="pt-3 mt-3 border-t border-[#ddd2c6] flex items-center justify-between text-[#0d1e2c]">
              <span className="font-medium">Total</span>
              <span className="text-lg" style={{ fontFamily: 'Orpheus Pro, "Playfair Display", serif' }}>
                {formatPrice(totalPrice, currency)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-[#0d1e2c] text-white nav-text text-[10px] tracking-[0.16em] px-6 py-4 hover:bg-[#ff7f41] transition-colors"
          >
            PROCEED TO CHECKOUT
            <ArrowRight size={12} />
          </button>

          <div className="mt-5 pt-4 border-t border-[#ddd2c6] text-[11px] text-[#0d1e2c]/46 leading-relaxed">
            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck size={12} className="text-[#ff7f41]" />
              Secure payment via Flutterwave
            </p>
            <p className="mt-2">You will receive confirmation and access details immediately after payment.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
