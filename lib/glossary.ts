import type { GlossaryTerm } from 'ids-drr-branding-types';

type CsvRow = Record<string, string>;

function parseCsv(text: string): CsvRow[] {
  const rows: string[][] = [];
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;

  const pushField = () => {
    currentRow.push(currentField);
    currentField = '';
  };

  const pushRow = () => {
    // skip empty trailing lines
    if (currentRow.length === 1 && currentRow[0].trim() === '') {
      currentRow = [];
      return;
    }
    rows.push(currentRow);
    currentRow = [];
  };

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];

    if (ch === '"') {
      if (inQuotes && text[i + 1] === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (!inQuotes && ch === ',') {
      pushField();
      continue;
    }

    if (!inQuotes && (ch === '\n' || ch === '\r')) {
      // handle CRLF
      if (ch === '\r' && text[i + 1] === '\n') i++;
      pushField();
      pushRow();
      continue;
    }

    currentField += ch;
  }

  // final field/row
  pushField();
  if (currentRow.length > 0) pushRow();

  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());

  return rows.slice(1).map((r) => {
    const obj: CsvRow = {};
    for (let i = 0; i < headers.length; i++) {
      obj[headers[i]] = (r[i] ?? '').trim();
    }
    return obj;
  });
}

function buildDisasterMethodology(row: CsvRow) {
  const items: { disasterType: string; methodology: string }[] = [];
  for (let i = 0; i < 3; i++) {
    const t = row[`disaster_type_${i}`];
    const d = row[`difference_${i}`];
    if (t && d) items.push({ disasterType: t, methodology: d });
  }
  return items;
}

export function slugifyGlossaryTerm(term: string) {
  return term
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function parseGlossary(csv: string): GlossaryTerm[] {
  const rows = parseCsv(csv).filter((r) => r.term);

  return rows
    .map<GlossaryTerm>((r) => {
      const tag = r.tag?.trim();
      const policy = r.policy?.trim() ?? '';
      const model = r.model?.trim() ?? '';
      const interpretation = policy || model ? { policy, model } : undefined;
      const disasterMethodology = buildDisasterMethodology(r);
      const related = (r.related_terms ?? '')
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean);
      const misinterpretation = r.common_misinterpretation?.trim() ?? '';

      return {
        term: r.term,
        ...(tag ? { tag } : {}),
        summary: r.short ?? '',
        definition: r.long ?? '',
        methodology: r.ids_drr ?? '',
        usage: r.where_seen ?? '',
        significance: r.why_it_matters ?? '',
        ...(disasterMethodology.length > 0 ? { disasterMethodology } : {}),
        ...(interpretation ? { interpretation } : {}),
        ...(misinterpretation ? { misinterpretation } : {}),
        ...(related.length > 0 ? { related } : {}),
      };
    })
    .sort((a, b) =>
      a.term.localeCompare(b.term, undefined, {
        sensitivity: 'base',
        numeric: true,
      })
    );
}
