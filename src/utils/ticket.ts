// utils/ticket.ts
export function normalizeTicketNumber(input: string | null | undefined): string {
  if (!input) return "";
  // keep hyphens, strip surrounding spaces, collapse inner spaces
  const s = String(input).trim().replace(/\s+/g, "");
  return s.toUpperCase();
}
