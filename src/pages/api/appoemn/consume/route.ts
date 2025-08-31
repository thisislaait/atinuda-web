// app/api/appoemn/consume/route.ts
import { NextResponse } from 'next/server';
import { db } from '@/firebase/config';
import { doc, updateDoc } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { uid } = await req.json();
    if (!uid) return NextResponse.json({ message: 'Missing uid' }, { status: 400 });

    await updateDoc(doc(db, 'users', uid), {
      discountUsed: true,
      discountConsumedAt: new Date().toISOString(),
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('consume error', e);
    return NextResponse.json({ ok: false, message: 'Failed to consume' }, { status: 500 });
  }
}
