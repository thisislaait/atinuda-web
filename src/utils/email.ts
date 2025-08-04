// utils/email.ts
import nodemailer from 'nodemailer';
import Image from 'next/image';
import { getLocationText } from './constants';

export const sendConfirmationEmail = async ({
  to,
  fullName,
  pdfBuffer,
  ticketType,
  ticketNumber,
  location,
}: {
  to: string;
  fullName: string;
  pdfBuffer: Buffer;
  ticketType: string;
  ticketNumber: string;
  location: string;
}) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.hostinger.com',
    port: 465,
    secure: true, 
    auth: {
      user: process.env.HOSTINGER_EMAIL,
      pass: process.env.HOSTINGER_EMAIL_PASS,
    },
  });

  const logoUrl = process.env.LOGO_URL;

  await transporter.sendMail({
    from: `"Atinuda Events" <${process.env.HOSTINGER_EMAIL}>`,
    to,
    subject: 'Your Atinuda 2025 Ticket 🎟️',
    text: `Hi ${fullName}, Attached is your event ticket.`,
    html: `
      <div style="text-align: center;">
        <img src="${logoUrl}" alt="Atinuda Logo" width="32" height="32" style="margin-bottom: 16px;" />
      </div>
      <p>Hello <strong>${fullName}</strong>,</p>
      <p>We can't wait to receive you at this year's <strong>Atinuda Conference:</strong> <em>Local To Global</em>.</p>
      <p>See your details below:</p>
      <ul>
        <li><strong>Ticket Number:</strong> ${ticketNumber}</li>
        <li><strong>Happening Where:</strong> ${location}</li>
      </ul>
      <p>Please present this at check-in to get registered on the conference day. Check-in starts at <strong>8:30 AM</strong> on both days.</p>
      <p>See you there! 🎉</p>
    `,
    attachments: [
      {
        filename: 'atinuda-ticket.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
};
