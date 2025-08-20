// pages/api/get-ticket.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { adminDb } from '@/utils/firebaseAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        res.setHeader('Allow', ['GET']);
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { email } = req.query;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: 'Missing or invalid email parameter.' });
    }

    try {
        const snapshot = await adminDb
        .collection('payments')
        .where('email', '==', email)
        .limit(1)
        .get();

        if (snapshot.empty) {
        return res.status(404).json({ message: 'Ticket not found for this email.' });
        }

        const ticket = snapshot.docs[0].data();

        return res.status(200).json({
        fullName: ticket.fullName,
        email: ticket.email,
        ticketType: ticket.ticketType,
        ticketNumber: ticket.ticketNumber,
        qrCode: ticket.qrCode || null, // optional
        });
    } catch (error) {
        console.error('Error fetching ticket:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}
