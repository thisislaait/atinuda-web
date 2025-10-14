// utils/links.ts
export function ticketUrl(ticketNumber: string, fullName: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_URL || "https://www.atinuda.africa").replace(/\/+$/, "");
  return `${base}/ticket/${encodeURIComponent(ticketNumber.trim())}?name=${encodeURIComponent(fullName.trim())}`;
}
