// Server-only. Draws a buyer's confirmed passes as A5 invitations, one page per ticket.
import { PDFDocument, rgb, setCharacterSpacing, pushGraphicsState, popGraphicsState, type PDFFont, type PDFPage } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import { EVENT_LABEL, EVENT_WHEN, EVENT_WHERE } from '@/lib/atinuda7Checkout';
import type { IssuedTicket } from '@/lib/atinuda7Fulfil';

const W = 420;
const H = 595;
const GOLD = rgb(0.62, 0.43, 0.07);
const INK = rgb(0.106, 0.118, 0.11);
const SOFT = rgb(0.35, 0.38, 0.36);
const PAPER = rgb(0.957, 0.961, 0.953);
const ACROSS = 276;

export const INVITATION_STRAPLINE = 'Sub-Saharan Africa’s definitive summit for the experiential economy';
export const UNNAMED_GUEST = 'Honoured Guest';

// Single experiences already read as a name; passes need the word.
export const passLabel = (ticketType: string) =>
  /pass|access|gala/i.test(ticketType) ? ticketType : `${ticketType} pass`;

// Files live in /public, which a serverless function can only reach over the web.
function assetBase() {
  if (process.env.NODE_ENV === 'development') return `http://localhost:${process.env.PORT || 3000}`;
  return process.env.SITE_URL || 'https://www.atinuda.africa';
}

const cache = new Map<string, Promise<Uint8Array>>();
function asset(path: string) {
  let pending = cache.get(path);
  if (!pending) {
    pending = fetch(`${assetBase()}${path}`, { signal: AbortSignal.timeout(8_000) }).then(async (resp) => {
      if (!resp.ok) throw new Error(`Could not load ${path}: ${resp.status}`);
      return new Uint8Array(await resp.arrayBuffer());
    });
    pending.catch(() => cache.delete(path));
    cache.set(path, pending);
  }
  return pending;
}

function centred(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color = INK) {
  page.drawText(text, { x: (W - font.widthOfTextAtSize(text, size)) / 2, y, font, size, color });
}

function tracked(page: PDFPage, text: string, y: number, font: PDFFont, size: number, spacing: number, color = INK) {
  const width = font.widthOfTextAtSize(text, size) + spacing * (text.length - 1);
  page.pushOperators(pushGraphicsState(), setCharacterSpacing(spacing));
  page.drawText(text, { x: (W - width) / 2, y, font, size, color });
  page.pushOperators(setCharacterSpacing(0), popGraphicsState());
}

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const lines: string[] = [];
  let line = '';
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word;
    if (line && font.widthOfTextAtSize(next, size) > width) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  return [...lines, line];
}

// Many Nigerian names carry marks a script font lacks, and a missing letter must never print blank.
function fontForName(name: string, fonts: PDFFont[]) {
  for (const font of fonts) {
    const available = new Set(font.getCharacterSet());
    if ([...name].every((c) => c === ' ' || available.has(c.codePointAt(0)!))) return { font, text: name };
  }
  return { font: fonts[0], text: name.normalize('NFD').replace(/\p{M}/gu, '') };
}

export async function buildInvitationPdf(tickets: IssuedTicket[], testOnly: boolean) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);
  pdf.setTitle(`${EVENT_LABEL} invitation`);
  pdf.setAuthor('Atinuda');

  const load = (path: string) => asset(`/assets/fonts/${path}`);
  const [scriptBytes, displayBytes, plainBytes, glyphBytes] = await Promise.all([
    load('PinyonScript-Regular.ttf'),
    // Not the site's Saol: its WOFF2 files don't embed cleanly and its licence may not cover PDFs.
    load('CormorantGaramond-Medium.ttf'),
    load('FuturaPT-Light.ttf'),
    asset('/assets/images/atinuda-glyph.png'),
  ]);
  const script = await pdf.embedFont(scriptBytes, { subset: true });
  const display = await pdf.embedFont(displayBytes, { subset: true });
  const plain = await pdf.embedFont(plainBytes, { subset: true });
  const glyph = await pdf.embedPng(glyphBytes);

  for (const ticket of tickets) {
    const page = pdf.addPage([W, H]);
    page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: PAPER });

    // The arch: one fine gold line rising from the foot of the page.
    const inset = 28;
    const radius = (W - inset * 2) / 2;
    const topOfCurve = H - inset - radius;
    page.drawSvgPath(
      `M ${inset} ${H - inset} L ${inset} ${H - topOfCurve} A ${radius} ${radius} 0 0 1 ${W - inset} ${H - topOfCurve} L ${W - inset} ${H - inset} Z`,
      { x: 0, y: H, borderColor: GOLD, borderWidth: 0.7 },
    );

    const mark = 40;
    page.drawImage(glyph, { x: (W - mark) / 2, y: H - 104, width: mark, height: mark });
    tracked(page, 'ATINUDA', H - 136, display, 22, 5, GOLD);
    centred(page, 'is pleased to invite', H - 170, plain, 11.5, SOFT);

    const guest = fontForName(ticket.name.trim() || UNNAMED_GUEST, [script, display, plain]);
    let size = 38;
    while (size > 14 && guest.font.widthOfTextAtSize(guest.text, size) > ACROSS) size -= 1;
    centred(page, guest.text, H - 228, guest.font, size);

    centred(page, 'to', H - 266, plain, 11.5, SOFT);
    centred(page, EVENT_LABEL, H - 306, display, 34, GOLD);
    wrap(INVITATION_STRAPLINE, plain, 11, 205).forEach((line, i) => centred(page, line, H - 332 - i * 15, plain, 11, SOFT));

    centred(page, EVENT_WHEN, H - 392, plain, 15);
    centred(page, EVENT_WHERE, H - 412, plain, 15);

    page.drawLine({ start: { x: W / 2 - 24, y: H - 436 }, end: { x: W / 2 + 24, y: H - 436 }, thickness: 0.6, color: GOLD });
    centred(page, passLabel(ticket.ticketType), H - 462, display, 18);
    centred(page, ticket.ticketNumber, H - 482, plain, 10, SOFT);
    if (testOnly) centred(page, 'Test only. Not valid for entry.', H - 502, plain, 11, GOLD);
  }
  return pdf.save();
}
