// utils/qr.ts
import QRCode from 'qrcode';

export const generateQRCode = async (text: string) => {

  
  try {
    return await QRCode.toDataURL(text); // returns a base64 image
  } catch {
    throw new Error('QR code generation failed');
  }
};
