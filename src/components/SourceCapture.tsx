'use client';

import { useEffect } from 'react';
import { rememberLeadSource } from '@/lib/leadSource';

// Internal pages and private order links are never a marketing source.
const PRIVATE = ['/staff', '/pricing/pay', '/checkin', '/admin'];

export function SourceCapture() {
  useEffect(() => {
    if (!PRIVATE.some((p) => window.location.pathname.startsWith(p))) rememberLeadSource();
  }, []);
  return null;
}
