// Server-only. Bank transfer orders: the buyer says they have sent the money, staff check the bank
// and confirm, and that confirmation issues the tickets. Orders nobody pays for lapse.
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { BANK_ACCOUNTS, EVENT_LABEL, TRANSFER_HOLD_DAYS, formatDueDate } from '@/lib/atinuda7Checkout';
import {
  buildTickets,
  buyerAmount,
  esc,
  nextInstalment,
  payLink,
  sendConfirmation,
  sendInstalmentReceipt,
  sendMail,
  writeTickets,
  type OrderDoc,
} from '@/lib/atinuda7Fulfil';
import { STAFF_EMAILS } from '@/lib/staffPayments';

const SITE_URL = process.env.SITE_URL || 'https://www.atinuda.africa';

// Which payment a receipt belongs to: the next instalment, or 'full' for payment in one go.
export function receiptKey(order: OrderDoc) {
  const next = order.plan === 'instalments' ? nextInstalment(order) : null;
  return next ? String(next.n) : 'full';
}

export function transferDue(order: OrderDoc) {
  if (!order.transfer) return null;
  const next = nextInstalment(order);
  if (order.status === 'paid' || order.status === 'cancelled') return null;
  if (order.plan === 'instalments' && next) {
    return { n: next.n, amount: order.transfer.amounts[next.n - 1], declared: !!next.declaredAt };
  }
  return { n: null, amount: order.transfer.amounts.reduce((sum, a) => sum + a, 0), declared: !!order.declaredAt };
}

export async function declareTransfer(order: OrderDoc): Promise<{ ok: true } | { ok: false; message: string }> {
  const ref = adminDb.collection('orders').doc(order.txRef);
  const now = new Date().toISOString();
  const outcome = await adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(ref)).data() as OrderDoc;
    if (!['pending', 'part_paid'].includes(fresh.status)) return { blocked: true, added: false };
    if (!fresh.receipts?.[receiptKey(fresh)]) return { blocked: false, added: false, needsReceipt: true };
    if (fresh.plan === 'instalments') {
      const next = nextInstalment(fresh);
      if (!next) return { blocked: true, added: false };
      if (next.declaredAt) return { blocked: false, added: false };
      tx.set(ref, { instalments: (fresh.instalments ?? []).map((i) => (i.n === next.n ? { ...i, declaredAt: now } : i)) }, { merge: true });
      return { blocked: false, added: true, n: next.n };
    }
    if (fresh.declaredAt) return { blocked: false, added: false };
    tx.set(ref, { declaredAt: now }, { merge: true });
    return { blocked: false, added: true };
  });
  if (outcome.blocked) return { ok: false, message: 'This order has no transfer due. If you have paid, write to hello@atinuda.africa.' };
  if (outcome.needsReceipt) return { ok: false, message: 'Please attach your receipt first.' };

  // Emails go once per payment, so refreshing or pressing the button again can't send more.
  if (outcome.added) {
    const amount = buyerAmount(order, outcome.n);
    const account = BANK_ACCOUNTS[order.transfer!.currency];
    await sendMail(
      order.buyer.email,
      `We have noted your ${EVENT_LABEL} transfer`,
      `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
        <p>Hello ${esc(order.buyer.name)},</p>
        <p>Thank you. Our team will check for your transfer of ${amount} and email you as soon as it is confirmed.</p>
        <p>${account.bank}, ${account.accountName}, ${account.accountNumber}<br>Reference: <strong>${order.txRef}</strong></p>
        <p><a href="${payLink(order)}" style="color:#1B1E1C">View your order</a>. This link is private to you.</p>
        <p>Atinuda</p>
      </div>`,
    ).catch((err) => console.warn('declareTransfer: buyer email failed', err));
    await sendMail(
      STAFF_EMAILS.join(', '),
      `Transfer to confirm: ${amount} from ${order.buyer.name.slice(0, 60).replace(/[\r\n]+/g, ' ')}`,
      `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;font-size:14px">
        <p>${esc(order.buyer.name)} says they have sent <strong>${amount}</strong> to ${account.bank} for ${esc(order.productName)}.</p>
        <p>Look for a transfer from ${esc(order.buyer.name)}. The narration should show their name, or reference <strong>${order.txRef}</strong> for later instalments. Their receipt is attached on the <a href="${SITE_URL}/staff/payments" style="color:#1B1E1C">payments page</a>, where you can confirm it. Their pass is not issued until you do.</p>
      </div>`,
    ).catch((err) => console.warn('declareTransfer: staff email failed', err));
  }
  return { ok: true };
}

export type ConfirmResult =
  | { ok: true; already: boolean }
  | { ok: false; status: number; message: string };

// `n` is the instalment being confirmed, or null for an order paid in one go. It must be the next
// one due, so a double click or a stale screen can't mark a later payment as received.
export async function confirmTransfer(orderRef: string, n: number | null, staff: { uid: string; email?: string }): Promise<ConfirmResult> {
  const ref = adminDb.collection('orders').doc(orderRef);
  const by = staff.email ?? staff.uid;
  const at = new Date().toISOString();

  const outcome = await adminDb.runTransaction(async (tx) => {
    const order = (await tx.get(ref)).data() as OrderDoc | undefined;
    if (!order || order.method !== 'transfer') return { kind: 'missing' as const };
    if (order.status === 'paid') return { kind: 'already' as const };
    if (!['pending', 'part_paid', 'lapsed'].includes(order.status)) return { kind: 'blocked' as const, status: order.status };

    const audit = (amount: number, instalment: number | null) =>
      tx.set(adminDb.collection('auditLog').doc(), {
        action: 'transfer_confirmed',
        orderRef,
        instalment,
        amountNaira: amount,
        by,
        uid: staff.uid,
        at,
      });

    if (order.plan === 'instalments') {
      const next = nextInstalment(order);
      if (!next || next.n !== n) return { kind: 'already' as const };
      const instalments = (order.instalments ?? []).map((i) =>
        i.n === next.n ? { ...i, status: 'paid' as const, paidAt: at, confirmedBy: by } : i,
      );
      const complete = instalments.every((i) => i.status === 'paid');
      const tickets = complete ? buildTickets(order) : [];
      if (complete) writeTickets(tx, order, tickets);
      tx.set(
        ref,
        {
          instalments,
          status: complete ? 'paid' : 'part_paid',
          amountPaid: instalments.filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0),
          ...(complete ? { tickets, paidAt: FieldValue.serverTimestamp() } : {}),
        },
        { merge: true },
      );
      audit(next.amount, next.n);
      const updated: OrderDoc = { ...order, instalments, status: complete ? 'paid' : 'part_paid', ...(complete ? { tickets } : {}) };
      return complete
        ? { kind: 'complete' as const, order: updated, tickets }
        : { kind: 'progress' as const, order: updated, paid: next };
    }

    if (n !== null) return { kind: 'already' as const };
    const tickets = buildTickets(order);
    writeTickets(tx, order, tickets);
    tx.set(
      ref,
      { status: 'paid', tickets, amountPaid: order.total, confirmedBy: by, paidAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    audit(order.total, null);
    return { kind: 'complete' as const, order: { ...order, status: 'paid' as const, tickets }, tickets };
  });

  switch (outcome.kind) {
    case 'missing':
      return { ok: false, status: 404, message: 'That bank transfer order was not found.' };
    case 'blocked':
      return { ok: false, status: 409, message: `This order is ${outcome.status}, so it can't be confirmed here.` };
    case 'already':
      return { ok: true, already: true };
    case 'complete':
      await sendConfirmation(outcome.order, outcome.tickets).catch((err) => console.warn('confirmTransfer: email failed', err));
      return { ok: true, already: false };
    case 'progress':
      await sendInstalmentReceipt(outcome.order, outcome.paid).catch((err) => console.warn('confirmTransfer: email failed', err));
      return { ok: true, already: false };
  }
}

// Runs from the daily job. A lapsed order can still be confirmed if the money turns up late.
export async function lapseTransfers(now: Date = new Date()) {
  const snap = await adminDb.collection('orders').where('method', '==', 'transfer').where('status', '==', 'pending').get();
  let lapsed = 0;
  for (const doc of snap.docs) {
    const order = doc.data() as OrderDoc;
    if (!order.holdUntil || new Date(order.holdUntil) > now) continue;
    try {
      const changed = await adminDb.runTransaction(async (tx) => {
        const fresh = (await tx.get(doc.ref)).data() as OrderDoc;
        if (fresh.status !== 'pending') return false;
        tx.set(doc.ref, { status: 'lapsed', lapsedAt: now.toISOString() }, { merge: true });
        return true;
      });
      if (!changed) continue;
      lapsed += 1;
      // Only someone who said they paid hears about it; an abandoned checkout gets no email.
      const declared = order.declaredAt || order.instalments?.[0]?.declaredAt;
      if (declared) {
        await sendMail(
          order.buyer.email,
          `Your ${EVENT_LABEL} order needs attention`,
          `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
            <p>Hello ${esc(order.buyer.name)},</p>
            <p>We have not been able to match your transfer for ${esc(order.productName)} (${buyerAmount(order, order.plan === 'instalments' ? 1 : undefined)}) by ${formatDueDate(order.holdUntil)}, so the ${TRANSFER_HOLD_DAYS}-day hold on your order has ended.</p>
            <p>If you have paid, reply to this email with your receipt and quote <strong>${order.txRef}</strong>, and we will sort it out.</p>
            <p>Atinuda</p>
          </div>`,
        );
      }
    } catch (err) {
      console.error('lapseTransfers: failed on order', order.txRef, err);
    }
  }
  return lapsed;
}
