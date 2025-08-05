// utils/pdf.ts

import PDFDocument from 'pdfkit';
import path from 'path';

export const generateTicketPDF = (
  fullName: string,
  ticketNumber: string,
  qrCodeBase64: string,
  location: string
): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: [600, 300],
      margin: 0,
    });

    const buffers: Uint8Array[] = [];

    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers);
      resolve(pdfBuffer);
    });
    doc.on('error', reject);

    // Paths
    const fontPath = path.join(process.cwd(), 'public/assets/fonts/FuturaPT-Light.ttf');
    const logoPath = path.join(process.cwd(), 'public/assets/images/atinudalogo.png');

    // Load font
    doc.font(fontPath);

    // Background fill (elementsEven)
    doc.rect(0, 0, 600, 300).fill('#f3f4f6');

    // Outer ticket border
    doc
      .lineWidth(1)
      .strokeColor('#333')
      .roundedRect(10, 10, 580, 280, 12)
      .stroke();

    // Logo
    try {
      doc.image(logoPath, 20, 20, { width: 80 });
    } catch (err) {
      console.warn('Logo image not found or failed to load.', err);
    }

    // Title
    doc
      .fillColor('#000')
      .fontSize(22)
      .text('🎟️ ADMIT TICKET', 120, 30);

    // Ticket Details
    doc.fontSize(14).fillColor('#000');
    doc.text(`Name:`, 25, 100);
    doc.text(fullName, 100, 100);

    doc.text(`Ticket No:`, 25, 130);
    doc.text(ticketNumber, 100, 130);

    doc.text(`Location:`, 25, 160);
    doc.text(location || 'TBD', 100, 160);

    // Determine Event Time/Date
    const lowerCaseTicket = ticketNumber.toLowerCase();
    const eventLines: string[] = [];

    if (lowerCaseTicket.includes('conf')) {
      eventLines.push('Oct 7–8, 8:30am–5pm daily');
    }
    if (lowerCaseTicket.includes('wrk')) {
      eventLines.push('Oct 7–8, 12pm–5pm daily');
    }
    if (lowerCaseTicket.includes('prem')) {
      eventLines.push('Oct 7–8, 8:30am–5pm daily');
      eventLines.push('Oct 7–8, 12pm–5pm daily');
    }
    if (lowerCaseTicket.includes('exec')) {
      eventLines.push('Oct 7–8, 8:30am–5pm daily');
      eventLines.push('Oct 7–8, 12pm–5pm daily');
      eventLines.push('Oct 8, 8pm');
    }
    if (lowerCaseTicket.includes('dine')) {
      eventLines.push('Oct 8, 8pm');
    }

    if (eventLines.length > 0) {
      doc.moveDown().text(`Event Schedule:`, 25, 190);
      eventLines.forEach((line, idx) => {
        doc.text(line, 40, 210 + idx * 16);
      });
    }

    // Vertical tear line
    doc
      .moveTo(400, 20)
      .lineTo(400, 280)
      .dash(5, { space: 5 })
      .stroke()
      .undash();

    // QR Code
    const qrImage = qrCodeBase64.replace(/^data:image\/png;base64,/, '');
    doc.image(Buffer.from(qrImage, 'base64'), 430, 90, { width: 130 });

    // Footer note
    doc
      .fontSize(10)
      .fillColor('#555')
      .text('Please present this ticket at the event entrance', 25, 270);

    doc.end();
  });
};
