// pages/api/download-ticket.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import { generateTicketPDF } from '@/utils/pdf';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { fullName, ticketNumber, qrCodeBase64, location } = req.body;

  if (!fullName || !ticketNumber || !qrCodeBase64 || !location) {
    return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
    const pdfBuffer = await generateTicketPDF(
      fullName,
      ticketNumber,
      qrCodeBase64,
      location
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=ticket.pdf');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Failed to generate ticket PDF:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
}
