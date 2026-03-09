'use client';

import React, { useEffect, useMemo, useState } from 'react';

type SheetKey = 'workshops' | 'meals' | 'experiences';

type ParsedCsv = {
  headers: string[];
  rows: Array<Record<string, string>>;
};

type Manifest = {
  eventSlug?: string;
  generatedAt?: string;
  counts?: {
    attendees?: number;
    workshopsRows?: number;
    mealsRows?: number;
    experiencesRows?: number;
  };
};

const SHEETS: Array<{ key: SheetKey; label: string; file: string }> = [
  {
    key: 'workshops',
    label: 'Sheet 1 · Workshops',
    file: '/exports/attendee-sheets/sheet1-workshops.csv',
  },
  {
    key: 'meals',
    label: 'Sheet 2 · Meals',
    file: '/exports/attendee-sheets/sheet2-meals.csv',
  },
  {
    key: 'experiences',
    label: 'Sheet 3 · Experiences',
    file: '/exports/attendee-sheets/sheet3-experiences.csv',
  },
];

function parseCsv(csv: string): ParsedCsv {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i] ?? '';
    const next = csv[i + 1] ?? '';

    if (inQuotes) {
      if (char === '"' && next === '"') {
        currentField += '"';
        i += 1;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        currentField += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ',') {
      currentRow.push(currentField);
      currentField = '';
      continue;
    }

    if (char === '\n') {
      currentRow.push(currentField.replace(/\r$/, ''));
      currentField = '';
      if (currentRow.some((cell) => cell.trim().length > 0)) rows.push(currentRow);
      currentRow = [];
      continue;
    }

    currentField += char;
  }

  if (currentField.length || currentRow.length) {
    currentRow.push(currentField.replace(/\r$/, ''));
    if (currentRow.some((cell) => cell.trim().length > 0)) rows.push(currentRow);
  }

  if (!rows.length) return { headers: [], rows: [] };
  const headers = rows[0] ?? [];
  const body = rows.slice(1).map((line) => {
    const record: Record<string, string> = {};
    headers.forEach((header, index) => {
      record[header] = line[index] ?? '';
    });
    return record;
  });

  return { headers, rows: body };
}

function labelize(header: string): string {
  return header
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function AttendeeSheetsPage(): React.JSX.Element {
  const [active, setActive] = useState<SheetKey>('workshops');
  const [manifest, setManifest] = useState<Manifest | null>(null);
  const [data, setData] = useState<Record<SheetKey, ParsedCsv>>({
    workshops: { headers: [], rows: [] },
    meals: { headers: [], rows: [] },
    experiences: { headers: [], rows: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let activeRun = true;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const [manifestRes, ...sheetRes] = await Promise.all([
          fetch('/exports/attendee-sheets/manifest.json', { cache: 'no-store' }),
          ...SHEETS.map((sheet) => fetch(sheet.file, { cache: 'no-store' })),
        ]);

        if (!activeRun) return;

        if (manifestRes.ok) {
          const manifestJson = (await manifestRes.json()) as Manifest;
          setManifest(manifestJson);
        }

        const nextData: Record<SheetKey, ParsedCsv> = {
          workshops: { headers: [], rows: [] },
          meals: { headers: [], rows: [] },
          experiences: { headers: [], rows: [] },
        };

        for (let i = 0; i < SHEETS.length; i += 1) {
          const sheet = SHEETS[i]!;
          const response = sheetRes[i]!;
          if (!response.ok) {
            throw new Error(`Could not load ${sheet.label}.`);
          }
          const csv = await response.text();
          nextData[sheet.key] = parseCsv(csv);
        }

        setData(nextData);
      } catch (e) {
        if (!activeRun) return;
        const message = e instanceof Error ? e.message : String(e);
        setError(message || 'Could not load attendee sheets.');
      } finally {
        if (activeRun) setLoading(false);
      }
    })();

    return () => {
      activeRun = false;
    };
  }, []);

  const currentSheet = useMemo(
    () => SHEETS.find((sheet) => sheet.key === active) ?? SHEETS[0]!,
    [active],
  );

  const currentData = data[active];

  return (
    <main style={styles.page}>
      <div style={styles.wrap}>
        <h1 style={styles.title}>Attendee Sheets</h1>
        <p style={styles.meta}>
          {manifest?.eventSlug ? `Event: ${manifest.eventSlug}` : 'Event: Mauritius Retreat'}
          {manifest?.generatedAt
            ? ` • Updated ${new Date(manifest.generatedAt).toLocaleString()}`
            : ''}
        </p>

        <div style={styles.downloads}>
          {SHEETS.map((sheet) => (
            <a key={sheet.key} href={sheet.file} download style={styles.downloadBtn}>
              Download {sheet.label}
            </a>
          ))}
        </div>

        <div style={styles.tabs}>
          {SHEETS.map((sheet) => (
            <button
              key={sheet.key}
              type="button"
              onClick={() => setActive(sheet.key)}
              style={{
                ...styles.tab,
                ...(active === sheet.key ? styles.tabActive : {}),
              }}
            >
              {sheet.label}
            </button>
          ))}
        </div>

        {loading ? <p style={styles.status}>Loading sheets...</p> : null}
        {error ? <p style={{ ...styles.status, color: '#b91c1c' }}>{error}</p> : null}

        {!loading && !error ? (
          <section style={styles.tableWrap}>
            <p style={styles.tableMeta}>
              {currentSheet.label} • {currentData.rows.length} rows
            </p>
            <div style={styles.tableScroll}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    {currentData.headers.map((header) => (
                      <th key={header} style={styles.th}>
                        {labelize(header)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.rows.map((row, idx) => (
                    <tr key={`${active}-${idx}`}>
                      {currentData.headers.map((header) => (
                        <td key={`${header}-${idx}`} style={styles.td}>
                          {row[header] ?? ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #eef2ff 0%, #f8fafc 35%)',
    padding: '24px 16px 40px',
    color: '#0f172a',
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif',
  },
  wrap: {
    maxWidth: 1400,
    margin: '0 auto',
  },
  title: {
    margin: 0,
    fontSize: 32,
    fontWeight: 800,
  },
  meta: {
    marginTop: 8,
    marginBottom: 16,
    color: '#475569',
  },
  downloads: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 14,
  },
  downloadBtn: {
    textDecoration: 'none',
    background: '#0f172a',
    color: '#fff',
    borderRadius: 10,
    padding: '10px 12px',
    fontWeight: 700,
    fontSize: 13,
  },
  tabs: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    border: '1px solid #cbd5e1',
    background: '#fff',
    color: '#0f172a',
    borderRadius: 10,
    padding: '8px 12px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  tabActive: {
    background: '#0f172a',
    color: '#fff',
    borderColor: '#0f172a',
  },
  status: {
    color: '#334155',
    marginTop: 8,
  },
  tableWrap: {
    border: '1px solid #cbd5e1',
    borderRadius: 12,
    overflow: 'hidden',
    background: '#fff',
  },
  tableMeta: {
    margin: 0,
    padding: '10px 12px',
    borderBottom: '1px solid #e2e8f0',
    color: '#475569',
    fontSize: 13,
    fontWeight: 600,
  },
  tableScroll: {
    overflow: 'auto',
    maxHeight: '72vh',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: 1200,
  },
  th: {
    position: 'sticky',
    top: 0,
    zIndex: 1,
    background: '#f1f5f9',
    borderBottom: '1px solid #cbd5e1',
    textAlign: 'left',
    padding: '10px 8px',
    fontSize: 12,
    whiteSpace: 'nowrap',
  },
  td: {
    borderBottom: '1px solid #e2e8f0',
    padding: '8px',
    fontSize: 12,
    verticalAlign: 'top',
    whiteSpace: 'pre-wrap',
  },
};
