// pages/api/appoemn/validate.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getRoleByMemberId } from '@/types/appoemnAllowlist';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  const { memberId } = req.body || {};
  if (!memberId) {
    return res.status(400).json({ ok: false, message: 'memberId is required' });
  }

  const role = getRoleByMemberId(memberId);
  if (!role) return res.status(404).json({ ok: false, message: 'Member not found' });

  return res.status(200).json({ ok: true, role }); // 'exco' | 'member'
}

