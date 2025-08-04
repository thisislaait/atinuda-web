// pages/api/checkin.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb, FieldValue } from '@/utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { ticketNumber, day } = req.body;

  if (!ticketNumber || ![1, 2].includes(day)) {
    return res.status(400).json({ message: 'Missing or invalid ticket number or day.' });
  }

  try {
    const ticketSnap = await adminDb
      .collection('payments')
      .where('ticketNumber', '==', ticketNumber)
      .limit(1)
      .get();

    if (ticketSnap.empty) {
      return res.status(404).json({ message: 'Ticket not found.' });
    }

    const ticketDoc = ticketSnap.docs[0];
    const ticketData = ticketDoc.data();

    const checkInStatus = ticketData.checkIn || { day1: false, day2: false };
    const fieldKey = day === 1 ? 'checkIn.day1' : 'checkIn.day2';

    if (checkInStatus[`day${day}`]) {
      return res.status(200).json({
        message: `Already checked in for Day ${day}.`,
        alreadyCheckedIn: true,
        fullName: ticketData.fullName,
        ticketNumber,
        day,
      });
    }

    // Update check-in status
    await ticketDoc.ref.update({
      [fieldKey]: true,
      lastCheckInTime: FieldValue.serverTimestamp(),
    });

    return res.status(200).json({
      message: `Check-in successful for Day ${day}.`,
      alreadyCheckedIn: false,
      fullName: ticketData.fullName,
      ticketNumber,
      day,
    });
  } catch (err) {
    console.error('Check-in error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
