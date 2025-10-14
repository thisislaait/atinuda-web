// utils/email.ts
import nodemailer from 'nodemailer';


export const sendConfirmationEmail = async ({
  to,
  fullName,
  pdfBuffer,
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


// // utils/email.ts
// import nodemailer from "nodemailer";

// type SendArgs = {
//   to: string;
//   fullName: string;
//   pdfBuffer: Buffer;
//   ticketType?: string;
//   ticketNumber: string;
//   location?: string;
//   // optional: if you want to embed qr as data url when not attaching PDF
//   qrDataUrl?: string | null;
// };

// function envOrThrow(key: string): string {
//   const v = process.env[key];
//   if (!v) throw new Error(`Missing env ${key}`);
//   return v;
// }

// export const sendConfirmationEmail = async ({
//   to,
//   fullName,
//   pdfBuffer,
//   ticketType,
//   ticketNumber,
//   location,
//   qrDataUrl,
// }: SendArgs): Promise<void> => {
//   // Load configuration from env
//   const sender = process.env.SENDER_EMAIL || process.env.HOSTINGER_EMAIL;
//   if (!sender) throw new Error("No sender configured. Set SENDER_EMAIL (or HOSTINGER_EMAIL).");

//   // host/port/secure from env, with safe defaults for Hostinger
//   const host = process.env.EMAIL_HOST || "smtp.hostinger.com";
//   const port = Number(process.env.EMAIL_PORT || (host.includes("gmail") ? 465 : 465));
//   const secure = (process.env.EMAIL_SECURE || (port === 465 ? "true" : "false")) === "true";

//   const user = process.env.EMAIL_USER || process.env.HOSTINGER_EMAIL;
//   const pass = process.env.EMAIL_PASS || process.env.HOSTINGER_EMAIL_PASS;

//   if (!user || !pass) throw new Error("SMTP credentials missing. Set EMAIL_USER and EMAIL_PASS (or HOSTINGER_EMAIL/HOSTINGER_EMAIL_PASS).");

//   const transporter = nodemailer.createTransport({
//     host,
//     port,
//     secure,
//     auth: { user, pass },
//   });

//   // optionally verify connection first (useful in dev/debug)
//   if (process.env.EMAIL_VERIFY_ON_SEND === "1") {
//     try {
//       await transporter.verify();
//     } catch (err) {
//       // Provide helpful error so API can return it
//       const msg = err instanceof Error ? err.message : String(err);
//       throw new Error(`SMTP verification failed: ${msg}`);
//     }
//   }

//   const logoUrl = process.env.LOGO_URL || "";

//   const html = `
//     <div style="text-align:center">
//       ${logoUrl ? `<img src="${logoUrl}" alt="Logo" width="48" height="48" style="margin-bottom:16px" />` : ""}
//     </div>
//     <p>Hello <strong>${fullName}</strong>,</p>
//     <p>We can't wait to receive you at this year's <strong>Atinuda Conference</strong>.</p>
//     <p>Details:</p>
//     <ul>
//       <li><strong>Ticket Number:</strong> ${ticketNumber}</li>
//       <li><strong>Ticket Type:</strong> ${ticketType ?? "General Admission"}</li>
//       <li><strong>Location:</strong> ${location ?? "—"}</li>
//     </ul>
//     <p>Please present this at check-in.</p>
//   `;

//   const attachments: Array<{ filename: string; content: Buffer | string; contentType?: string; cid?: string }> = [];

//   // If PDF provided, attach
//   if (pdfBuffer && Buffer.isBuffer(pdfBuffer)) {
//     attachments.push({
//       filename: "atinuda-ticket.pdf",
//       content: pdfBuffer,
//       contentType: "application/pdf",
//     });
//   }

//   // If inline QR data url provided and not attaching PDF, embed as CID (or include in HTML)
//   if (qrDataUrl && typeof qrDataUrl === "string" && !attachments.length) {
//     attachments.push({
//       filename: "qr.png",
//       content: qrDataUrl.split(",")[1] ? Buffer.from(qrDataUrl.split(",")[1], "base64") : qrDataUrl,
//       contentType: "image/png",
//       cid: "qr@atinuda",
//     });
//   }

//   // Insert inline image if we have a cid qr
//   const htmlWithQr = attachments.some((a) => a.cid)
//     ? `<div style="text-align:center"><img src="cid:qr@atinuda" alt="QR" style="width:180px;height:180px"/></div>${html}`
//     : html;

//   try {
//     await transporter.sendMail({
//       from: `"Atinuda Events" <${sender}>`,
//       to,
//       subject: "Your Atinuda 2025 Ticket 🎟️",
//       text: `Hi ${fullName}, attached is your event ticket.`,
//       html: htmlWithQr,
//       attachments,
//     });
//   } catch (err) {
//     const msg = err instanceof Error ? err.message : String(err);
//     // Add provider hints to help debugging (Hostinger returns 5xx lines)
//     throw new Error(`Message failed: ${msg}`);
//   }
// };
