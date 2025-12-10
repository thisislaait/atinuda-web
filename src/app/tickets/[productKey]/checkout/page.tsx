'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { db } from "@/firebase/config";

type Currency = "NGN" | "USD";
type TicketProduct = { id: string; title?: string; description?: string; price: number; currency: Currency; key: string };

const EVENT_SLUG = process.env.NEXT_PUBLIC_EVENT_SLUG || "martitus-retreat-2026";
const PAY_API = process.env.NEXT_PUBLIC_PAY_API_URL || "/api/pay-verify";

declare global {
  interface Window {
    FlutterwaveCheckout?: (opts: Record<string, unknown>) => void;
  }
}

export default function TicketCheckoutPage() {
  const params = useParams<{ productKey: string }>();
  const productKey = params?.productKey ?? null;
  const router = useRouter();
  const search = useSearchParams();
  const auth = getAuth();
  const [user, setUser] = useState<User | null>(auth.currentUser);
  const [product, setProduct] = useState<TicketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(Number((search?.get("q") as string | null) ?? 1));
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, [auth]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!productKey) throw new Error("Missing product key");
        const ref = doc(db, "events", EVENT_SLUG, "ticketProducts", productKey);
        const snap = await getDoc(ref);
        if (!snap.exists()) throw new Error("Ticket not found");
        const data = snap.data() as Record<string, unknown>;
        const currency = typeof data.currency === "string" ? (data.currency.toUpperCase() as Currency) : null;
        const price =
          typeof data.price === "number"
            ? data.price
            : typeof data.price === "string"
            ? Number(data.price)
            : undefined;
        if (!currency || (currency !== "NGN" && currency !== "USD") || !Number.isFinite(price)) {
          throw new Error("Invalid ticket data");
        }
        if (mounted) {
          setProduct({
            id: snap.id,
            key: snap.id,
            title: (data.title as string) ?? snap.id,
            description: (data.description as string) || undefined,
            price: price as number,
            currency,
          });
        }
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load ticket");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [productKey]);

  const amount = useMemo(() => (product ? product.price * Math.max(1, quantity) : 0), [product, quantity]);

  const handlePay = useCallback(async () => {
    if (!productKey) {
      setError("Missing product key.");
      return;
    }

    if (!user) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname + window.location.search));
      return;
    }
    if (!product || typeof window.FlutterwaveCheckout !== "function") {
      setError("Payment is unavailable. Please try again.");
      return;
    }

    const idToken = await user.getIdToken();
    const txRef = `atn-web-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const customerEmail = user.email || "guest@atinuda.africa";
    const customerName = user.displayName || customerEmail.split("@")[0];
    const customerId = (user.uid || customerEmail || "guest").replace(/[^A-Za-z0-9_-]/g, "");

    const writeLocalAttendee = async () => {
      const slug = EVENT_SLUG;
      const genTicket = () => {
        if (slug === "martitus-retreat-2026") {
          const rand = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
          return `ATNMAU-${rand}`;
        }
        const prefix = productKey ? productKey.slice(0, 4).toUpperCase() : "GEN";
        const rand = `${Date.now().toString(36).slice(-4)}${Math.random().toString(36).slice(2, 6)}`.toUpperCase();
        return `ATN-${prefix}-${rand}`;
      };
      const ticketNumber = genTicket();
      await setDoc(
        doc(db, "events", slug, "attendees", user.uid),
        {
          userId: user.uid,
          email: customerEmail,
          issuedToName: customerName,
          ticketNumber,
          ticketType: product.title ?? productKey,
          productKey,
          currency: product.currency,
          amount,
          quantity: Math.max(1, quantity),
          unitAmount: product.price,
          lastTxRef: txRef,
          status: "active",
          purchasedAt: new Date().toISOString(),
          eventSlug: slug,
        },
        { merge: true }
      );
    };

    window.FlutterwaveCheckout({
      public_key: process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY,
      tx_ref: txRef,
      amount,
      currency: product.currency,
      customer: { email: customerEmail, name: customerName, id: customerId },
      customizations: { title: "Atinuda Retreat 2026", description: product.title, logo: "/icon.png" },
      callback: async (resp: { status?: string; transaction_id?: string | number }) => {
        if (resp?.status !== "successful" || !resp.transaction_id) {
          setError("Payment was not completed.");
          return;
        }
        setVerifying(true);
        try {
          // Best-effort server verify (non-blocking UI)
          fetch(PAY_API, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
            body: JSON.stringify({
              txRef,
              transactionId: resp.transaction_id,
              eventSlug: EVENT_SLUG,
              productKey,
              quantity: Math.max(1, quantity),
              currency: product.currency,
            }),
          }).catch(() => null);

          await writeLocalAttendee();
          setVerified(true);
          router.push("/tickets/thank-you");
        } catch (err) {
          try {
            await writeLocalAttendee();
            setVerified(true);
            router.push("/tickets/thank-you");
          } catch (writeErr) {
            setError(
              err instanceof Error
                ? err.message
                : writeErr instanceof Error
                ? writeErr.message
                : "Verification failed"
            );
          }
        } finally {
          setVerifying(false);
        }
      },
      onclose: () => {
        if (verified) {
          router.push("/tickets/thank-you");
        } else {
          setVerifying(false);
        }
      },
    });
  }, [amount, product, productKey, quantity, router, user, verified]);

  if (loading) return <div className="p-6 text-white/70">Loading ticket…</div>;
  if (error) return <div className="p-6 text-red-200">{error}</div>;
  if (!product) return <div className="p-6 text-white/70">Ticket not found.</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1220] via-[#0f1528] to-[#0b1220] text-white">
      <div className="max-w-3xl mx-auto px-6 py-10 pt-24 lg:pt-28 space-y-6">
        <div className="flex items-center justify-between text-sm text-white/70">
          <span>{user ? (user.email ? `Signed in as ${user.email}` : "Signed in") : "Not signed in"}</span>
          <button
            onClick={async () => {
              if (user) {
                await auth.signOut();
                router.push("/login?next=" + encodeURIComponent(window.location.pathname + window.location.search));
              } else {
                router.push("/login?next=" + encodeURIComponent(window.location.pathname + window.location.search));
              }
            }}
            className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10"
          >
            {user ? "Sign out" : "Sign in"}
          </button>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-white/60">Checkout</p>
          <h1 className="text-3xl font-semibold hero-text mt-2">{product.title}</h1>
          {product.description && <p className="text-white/70 mt-2">{product.description}</p>}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-white/70 text-sm">Price</span>
            <span className="text-lg font-semibold">
              {product.currency === "NGN" ? "₦" : "$"}
              {product.price.toLocaleString()}
            </span>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-white/80">Quantity</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              className="w-24 rounded-lg bg-white/10 border border-white/20 px-3 py-2 text-white"
            />
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-white/70 text-sm">Total</span>
            <span className="text-xl font-bold">
              {product.currency === "NGN" ? "₦" : "$"}
              {amount.toLocaleString()}
            </span>
          </div>
        </div>

        <button
          onClick={handlePay}
          disabled={verifying}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white text-[#0b1220] font-semibold hover:bg-white/90 disabled:opacity-60"
        >
          {verifying ? "Verifying…" : "Pay with Flutterwave"}
        </button>

        {error && <div className="text-sm text-red-200">{error}</div>}
      </div>
    </div>
  );
}
