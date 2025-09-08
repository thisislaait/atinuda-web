import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/firebase/config';
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { z } from 'zod';

const Payload = z.object({
  acceptTerms: z.literal(true),
  eligibility: z.object({
    sectorFit: z.literal(true),
    incorporationBySept2024: z.literal(true),
    recurringRevenue12m: z.literal(true),
    techAndSustainability: z.literal(true),
    independentOwnership: z.literal(true),
    willingToPartnerWithNord: z.literal(true),
  }),
  applicantName: z.string().min(2),
  applicantEmail: z.string().email(),
  applicantPhone: z.string().min(6),
  companyName: z.string().min(2),
  registeredAddress: z.string().min(2),
  oneLiner: z.string().max(150),
  sector: z.enum(['production','venues','logistics','virtual_hybrid','hospitality','other']),
  incorporationDate: z.string().min(4),
  website: z.string().url().optional().or(z.literal('')),
  socialLinks: z.array(z.string().url()).optional(),
  problemSolution: z.string().max(500),
  vision5y: z.string().min(2),
  sdgs: z.array(z.string()).max(3),
  impactMetrics: z.array(z.object({ name:z.string(), baseline:z.number(), current:z.number(), unit:z.string() })).max(3),
  businessModel: z.string().min(2),
  revenueStreams: z.array(z.object({ name:z.string(), pricing:z.string() })).max(3),
  last12moRevenueBracket: z.enum(['0-10k','10k-50k','50k-200k','200k-1m','1m+']),
  femaleFounder: z.boolean().optional(),
  team: z.string().min(2),
  advisors: z.string().optional().or(z.literal('')),
  willingToPartnerWithNord: z.literal(true),
  uploads: z.object({
    slideDeckUrl: z.string().url(),
    slideDeckName: z.string(),
    slideDeckSize: z.number().max(20 * 1024 * 1024),
  }),
});

type Data = { id: string; createdAt?: number } | { error: string };

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const parsed = Payload.parse(req.body);
    const ref = await addDoc(collection(db, 'spark2025_applications'), {
      ...parsed,
      status: 'submitted',
      createdAt: serverTimestamp(),
      audit: {
        ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
        ua: req.headers['user-agent'],
      },
    });
    const snap = await getDoc(doc(db, 'spark2025_applications', ref.id));
    const createdAt: any = snap.get('createdAt');
    return res.status(200).json({ id: ref.id, createdAt: createdAt?.toMillis?.() });
  } catch (e: any) {
    console.error(e);
    return res.status(400).json({ error: e?.message || 'Invalid payload' });
  }
}
