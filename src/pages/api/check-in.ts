// // pages/api/checkin.ts
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { adminDb, FieldValue } from '@/utils/firebaseAdmin';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed' });
//   }

//   const { ticketNumber, day } = req.body;

//   if (!ticketNumber || ![1, 2].includes(day)) {
//     return res.status(400).json({ message: 'Missing or invalid ticket number or day.' });
//   }

//   try {
//     const ticketSnap = await adminDb
//       .collection('payments')
//       .where('ticketNumber', '==', ticketNumber)
//       .limit(1)
//       .get();

//     if (ticketSnap.empty) {
//       return res.status(404).json({ message: 'Ticket not found.' });
//     }

//     const ticketDoc = ticketSnap.docs[0];
//     const ticketData = ticketDoc.data();

//     const checkInStatus = ticketData.checkIn || { day1: false, day2: false };
//     const fieldKey = day === 1 ? 'checkIn.day1' : 'checkIn.day2';

//     if (checkInStatus[`day${day}`]) {
//       return res.status(200).json({
//         message: `Already checked in for Day ${day}.`,
//         alreadyCheckedIn: true,
//         fullName: ticketData.fullName,
//         ticketNumber,
//         day,
//       });
//     }

//     // Update check-in status
//     await ticketDoc.ref.update({
//       [fieldKey]: true,
//       lastCheckInTime: FieldValue.serverTimestamp(),
//     });

//     return res.status(200).json({
//       message: `Check-in successful for Day ${day}.`,
//       alreadyCheckedIn: false,
//       fullName: ticketData.fullName,
//       ticketNumber,
//       day,
//     });
//   } catch (err) {
//     console.error('Check-in error:', err);
//     return res.status(500).json({ message: 'Internal Server Error' });
//   }
// }


// pages/api/checkin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';

/**
 * POST /api/checkin
 * Body: { ticketNumber: string, event: string, status?: boolean, scannerId?: string, note?: string }
 *
 * event must be one of:
 *   'azizi' | 'day1' | 'day2' | 'dinner' | 'breakout' | 'masterclass' | 'gift'
 *
 * status: optional boolean, defaults to true (i.e. check-in). If false, will uncheck (undo).
 *
 * Response: { ok: true, alreadyCheckedIn: boolean, updated: { ...fields }, scanId?: string, ticketId, collection }
 */

const ALLOWED_EVENTS = ['azizi', 'day1', 'day2', 'dinner', 'breakout', 'masterclass', 'gift'];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' });
  }

  const { ticketNumber, event, status, scannerId, note } = req.body ?? {};

  if (!ticketNumber || typeof ticketNumber !== 'string') {
    return res.status(400).json({ ok: false, message: 'Missing or invalid ticketNumber' });
  }
  if (!event || typeof event !== 'string' || !ALLOWED_EVENTS.includes(event)) {
    return res.status(400).json({ ok: false, message: `Missing or invalid event. Must be one of: ${ALLOWED_EVENTS.join(', ')}` });
  }

  // Default action is to set flag to true (check-in)
  const desiredStatus = typeof status === 'boolean' ? status : true;
  const scanner = typeof scannerId === 'string' && scannerId.trim().length > 0 ? scannerId.trim() : 'unknown-scanner';

  try {
    // Helper to find the ticket doc in candidate collections
    const findTicketDoc = async () => {
      const collectionsToTry = ['payments', 'tickets'];
      for (const col of collectionsToTry) {
        const snap = await adminDb
          .collection(col)
          .where('ticketNumber', '==', ticketNumber)
          .limit(1)
          .get();

        if (!snap.empty) {
          return { doc: snap.docs[0], collection: col };
        }
      }
      return null;
    };

    const found = await findTicketDoc();
    if (!found) {
      return res.status(404).json({ ok: false, message: 'Ticket not found.' });
    }

    const ticketRef = found.doc.ref;
    const ticketId = ticketRef.id;
    const collectionName = found.collection;

    // Define which field to update on the ticket doc
    // - For standard events we store under "checkIn.<eventKey>"
    // - For gift we store top-level "giftClaimed"
    const isGift = event === 'gift';
    const ticketFieldPath = isGift ? 'giftClaimed' : `checkIn.${event}`;

    // Run transaction: read current, update if needed, create scan audit record
    const result = await adminDb.runTransaction(async (tx) => {
      const snap = await tx.get(ticketRef);
      if (!snap.exists) throw new Error('Ticket disappeared during transaction.');

      const data = snap.data() || {};
      const currentCheck = isGift ? Boolean(data.giftClaimed) : Boolean((data.checkIn && data.checkIn[event]) || false);

      // We'll always write a scan record (audit) — even if it's a repeated attempt.
      // But we only update the ticket doc if the requested status differs from current.
      const updates: Record<string, any> = {
        lastUpdatedBy: scanner,
        lastUpdatedAt: FieldValue.serverTimestamp(),
      };

      let didUpdate = false;
      if (currentCheck !== desiredStatus) {
        updates[ticketFieldPath] = desiredStatus;
        // Also ensure checkIn object exists when writing an event
        if (!isGift) {
          // if checkIn missing ensure it's an object (transactional set using update is fine)
          // update call with nested path will create structure as needed
        }
        didUpdate = true;
        tx.update(ticketRef, updates);
      } else {
        // still update lastUpdated metadata so we have a trace of attempts
        tx.update(ticketRef, updates);
      }

      // create a scans audit doc (auto id)
      const scanRef = adminDb.collection('scans').doc();
      const scanPayload = {
        scannedTicketNumber: ticketNumber,
        ticketId,
        ticketCollection: collectionName,
        scannerId: scanner,
        event,
        action: desiredStatus ? (didUpdate ? 'checked-in' : 'already-checked-in') : (didUpdate ? 'unchecked' : 'already-unchecked'),
        note: note || '',
        scannedAt: FieldValue.serverTimestamp(),
      };
      tx.set(scanRef, scanPayload);

      // Return the snapshot of what we changed and the scanId
      return {
        scanId: scanRef.id,
        didUpdate,
        currentCheck,
        newCheck: desiredStatus,
      };
    }); // end transaction

    return res.status(200).json({
      ok: true,
      alreadyCheckedIn: !result.didUpdate && result.currentCheck === result.newCheck,
      ticketId,
      collection: collectionName,
      updated: {
        field: ticketFieldPath,
        value: result.newCheck,
      },
      scanId: result.scanId,
    });
  } catch (err: any) {
    console.error('Check-in API error:', err);
    return res.status(500).json({ ok: false, message: err?.message || 'Internal Server Error' });
  }
}
