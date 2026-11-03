// Server-only. The daily pay-in-3 sweep: reminds buyers before and after each due date, cancels
// bookings that pass the grace period, and sends the team a Monday summary of who owes what.
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';
import { EVENT_LABEL, INSTALMENT_GRACE_DAYS, formatDueDate, formatNaira } from '@/lib/atinuda7Checkout';
import { TEAM_EMAIL, buyerAmount, esc, nextInstalment, payLink, scheduleTable, sendMail, type OrderDoc } from '@/lib/atinuda7Fulfil';

const DAY_MS = 24 * 60 * 60 * 1000;

export type ReminderStage = 'upcoming' | 'due' | 'overdue';

// Days until the due date; negative once it has passed.
export function reminderStage(daysToDue: number): ReminderStage | null {
  if (daysToDue <= -3) return 'overdue';
  if (daysToDue <= 1) return 'due';
  if (daysToDue <= 7) return 'upcoming';
  return null;
}

export type SweepSummary = { checked: number; reminded: number; cancelled: number; failed: number; digest: boolean };

export async function runInstalmentSweep(now: Date = new Date()): Promise<SweepSummary> {
  const snap = await adminDb.collection('orders')
    .where('plan', '==', 'instalments')
    .where('status', '==', 'part_paid')
    .get();
  const orders = snap.docs.map((d) => d.data() as OrderDoc);
  const summary: SweepSummary = { checked: orders.length, reminded: 0, cancelled: 0, failed: 0, digest: false };

  for (const order of orders) {
    // One buyer's failed email must not stop everyone else's.
    try {
      const next = nextInstalment(order);
      if (!next) continue;
      // The buyer says this transfer is sent and staff have yet to match it: don't chase or cancel.
      if (next.declaredAt) continue;
      const daysToDue = (new Date(next.dueAt).getTime() - now.getTime()) / DAY_MS;

      if (daysToDue < -INSTALMENT_GRACE_DAYS) {
        if (await cancelOrder(order, next.n)) {
          summary.cancelled += 1;
          await sendCancellation(order);
        }
        continue;
      }

      const stage = reminderStage(daysToDue);
      const key = `${next.n}-${stage}`;
      if (!stage || order.remindersSent?.[key]) continue;
      // Sent before it is recorded: a rare repeat reminder is better than a missed one.
      if (await sendReminder(order, stage)) {
        await adminDb.collection('orders').doc(order.txRef).set(
          { remindersSent: { [key]: now.toISOString() } },
          { merge: true },
        );
        summary.reminded += 1;
      }
    } catch (err) {
      summary.failed += 1;
      console.error('instalment sweep: failed on order', order.txRef, err);
    }
  }

  const isMonday = now.getUTCDay() === 1;
  if (isMonday && orders.length > 0) {
    try {
      summary.digest = await sendDigest(orders, now);
    } catch (err) {
      summary.failed += 1;
      console.error('instalment sweep: digest failed', err);
    }
  }
  return summary;
}

// Re-checks inside a transaction, so a payment that has just landed is never cancelled.
async function cancelOrder(order: OrderDoc, overdueN: number) {
  const ref = adminDb.collection('orders').doc(order.txRef);
  return adminDb.runTransaction(async (tx) => {
    const fresh = (await tx.get(ref)).data() as OrderDoc;
    const stillUnpaid = fresh.instalments?.find((i) => i.n === overdueN)?.status !== 'paid';
    if (fresh.status !== 'part_paid' || !stillUnpaid) return false;
    tx.set(ref, { status: 'cancelled', cancelReason: 'missed instalment', cancelledAt: FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
}

function sendReminder(order: OrderDoc, stage: ReminderStage) {
  const next = nextInstalment(order)!;
  const date = formatDueDate(next.dueAt);
  const lastDay = formatDueDate(new Date(new Date(next.dueAt).getTime() + INSTALMENT_GRACE_DAYS * DAY_MS).toISOString());
  const line = stage === 'overdue'
    ? `Your payment of ${buyerAmount(order, next.n)} was due on ${date}. Please pay by ${lastDay}. After that date your booking is cancelled and your place is released.`
    : `Your next payment of ${buyerAmount(order, next.n)} is due on ${date}.`;
  return sendMail(
    order.buyer.email,
    stage === 'overdue' ? `Your ${EVENT_LABEL} payment is overdue` : `Your ${EVENT_LABEL} instalment is due on ${date}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
      <p>Hello ${esc(order.buyer.name)},</p>
      <p>${line}</p>
      ${scheduleTable(order)}
      <p><a href="${payLink(order)}" style="color:#1B1E1C">Pay now</a>. This link is private to you.</p>
      <p>Order reference: <strong>${order.txRef}</strong></p>
      <p>Atinuda</p>
    </div>`,
  );
}

async function sendCancellation(order: OrderDoc) {
  await sendMail(
    order.buyer.email,
    `Your ${EVENT_LABEL} booking has been cancelled`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C;max-width:560px">
      <p>Hello ${esc(order.buyer.name)},</p>
      <p>Your instalment was not received within ${INSTALMENT_GRACE_DAYS} days of its due date, so your ${esc(order.productName)} booking has been cancelled and your place released.</p>
      <p>If you would like to talk this through, write to hello@atinuda.africa and quote <strong>${order.txRef}</strong>.</p>
      <p>Atinuda</p>
    </div>`,
  );
  await sendMail(
    TEAM_EMAIL,
    `Instalment booking cancelled: ${order.txRef}`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C">
      <p>${esc(order.buyer.name)} (${esc(order.buyer.email)}) missed an instalment on ${esc(order.productName)} and passed the grace period. Any refund is your decision.</p>
      ${scheduleTable(order)}
    </div>`,
  );
}

function sendDigest(orders: OrderDoc[], now: Date) {
  const rows = orders.map((o) => {
    const next = nextInstalment(o);
    const late = next && new Date(next.dueAt) < now;
    const paid = (o.instalments ?? []).filter((i) => i.status === 'paid').reduce((sum, i) => sum + i.amount, 0);
    return `<tr>
      <td style="padding:6px 16px 6px 0">${esc(o.buyer.name)}<br>${esc(o.buyer.email)}</td>
      <td style="padding:6px 16px 6px 0">${esc(o.productName)}</td>
      <td style="padding:6px 16px 6px 0">${formatNaira(paid)} of ${formatNaira(o.total)}</td>
      <td style="padding:6px 16px 6px 0;color:${late ? '#8C3B2E' : '#1B1E1C'}">${next ? `${formatNaira(next.amount)} ${late ? 'overdue since' : 'due'} ${formatDueDate(next.dueAt)}` : ''}</td>
      <td style="padding:6px 0">${(o.reviewPayments?.length ?? 0) > 0 ? 'Payment to check' : ''}</td>
    </tr>`;
  }).join('');
  return sendMail(
    TEAM_EMAIL,
    `${EVENT_LABEL} instalments: ${orders.length} in progress`,
    `<div style="font-family:Helvetica,Arial,sans-serif;color:#1B1E1C"><table style="border-collapse:collapse;font-size:14px">${rows}</table></div>`,
  );
}
