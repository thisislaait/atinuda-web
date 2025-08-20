import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { to, fullName, discountCode } = req.body;

    if (!to || !fullName || !discountCode) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp.hostinger.com',
            port: 465,
            secure: true, 
            auth: {
            user: process.env.HOSTINGER_EMAIL,
            pass: process.env.HOSTINGER_EMAIL_PASS,
            },
        });

        await transporter.sendMail({
        from: `"Atinuda Events" <${process.env.HOSTINGER_EMAIL}>`,
        to,
        subject: 'Your APPOEMN Discount Code',
        html: `
            <p>Hi <strong>${fullName}</strong>,</p>
            <p>Thanks for signing up as an APPOEMN member!</p>
            <p>Your exclusive discount code is:</p>
            <h2 style="color: #1a1a1a;">${discountCode}</h2>
            <p>Use this code at checkout to enjoy your discount.</p>
            <br/>
            <p>Best regards,<br/>Atinuda Team</p>
        `,
        });

        return res.status(200).json({ message: 'Email sent' });
    } catch (error) {
        console.error('Error sending discount email:', error);
        return res.status(500).json({ message: 'Email sending failed' });
    }
}
