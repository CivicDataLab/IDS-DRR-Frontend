import { GlossaryTermsSource } from './terms.generated';

export type GlossaryItem = {
  letter: string;
  term: string;
  tag?: string;
  definitions: {
    short: string;
    long: string;
  };
  details: {
    ids_drr: string;
    where_seen: string;
    why_it_matters: string;
  };
  contexts?: {
    policy: string;
    model: string;
  };
  disaster_differences?: [
    GlossaryDisasterDifference?,
    GlossaryDisasterDifference?,
    GlossaryDisasterDifference?,
  ];
  related_terms?: string[];
  common_misinterpretation?: string;
};

export type GlossaryDisasterDifference = {
  disaster_type: string;
  difference: string;
};

export type GlossaryIndexItem = {
  slug: string;
  letter: string;
  term: string;
  short: string;
};

export function slugifyGlossaryTerm(term: string) {
  return term
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export const termsBySlug: Record<string, GlossaryItem> =
  GlossaryTermsSource.reduce<Record<string, GlossaryItem>>((acc, item) => {
    const slug = slugifyGlossaryTerm(item.term);
    acc[slug] = item;
    return acc;
  }, {});

export const slugsByLetter: Record<string, string[]> =
  GlossaryTermsSource.reduce<Record<string, string[]>>((acc, item) => {
    const letter = (item.letter || '#').toUpperCase();
    const slug = slugifyGlossaryTerm(item.term);
    acc[letter] = [...(acc[letter] ?? []), slug];
    return acc;
  }, {});

export const slugsByTag: Record<string, string[]> = GlossaryTermsSource.reduce<
  Record<string, string[]>
>((acc, item) => {
  const tag = (item.tag ?? '').trim();
  if (!tag) return acc;
  const key = tag.toLowerCase();
  const slug = slugifyGlossaryTerm(item.term);
  acc[key] = [...(acc[key] ?? []), slug];
  return acc;
}, {});

export const glossaryTags: string[] = (() => {
  const labelsByKey = new Map<string, string>();
  for (const item of GlossaryTermsSource) {
    const raw = (item.tag ?? '').trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!labelsByKey.has(key)) labelsByKey.set(key, raw);
  }
  return [...labelsByKey.values()].sort((a, b) => a.localeCompare(b));
})();

export function getGlossaryIndex(): GlossaryIndexItem[] {
  return Object.entries(termsBySlug).map(([slug, item]) => ({
    slug,
    letter: item.letter,
    term: item.term,
    short: item.definitions.short,
  }));
}

export function getGlossaryTags() {
  return glossaryTags;
}
