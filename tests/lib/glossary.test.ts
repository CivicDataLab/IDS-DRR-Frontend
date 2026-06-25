import { parseGlossary, slugifyGlossaryTerm } from '@/lib/glossary';

describe('slugifyGlossaryTerm', () => {
  it('lowercases and hyphenates terms', () => {
    expect(slugifyGlossaryTerm('Risk Score')).toBe('risk-score');
    expect(slugifyGlossaryTerm("  Flood Hazard  ")).toBe('flood-hazard');
    expect(slugifyGlossaryTerm('"Exposure"')).toBe('exposure');
  });
});

describe('parseGlossary', () => {
  const csv = [
    'term,short,long,ids_drr,where_seen,why_it_matters,tag,policy,model,disaster_type_0,difference_0,related_terms,common_misinterpretation',
    'Alpha term,Short A,Long A,Method A,Usage A,Significance A,Tag A,Policy A,Model A,Flood,Diff A,"Beta, Gamma",Misread A',
    'Beta term,Short B,Long B,Method B,Usage B,Significance B,,,,,,',
  ].join('\n');

  it('parses CSV rows into sorted glossary terms', () => {
    const terms = parseGlossary(csv);

    expect(terms).toHaveLength(2);
    expect(terms[0].term).toBe('Alpha term');
    expect(terms[1].term).toBe('Beta term');
  });

  it('maps optional fields when present', () => {
    const [alpha] = parseGlossary(csv);

    expect(alpha).toMatchObject({
      term: 'Alpha term',
      tag: 'Tag A',
      summary: 'Short A',
      definition: 'Long A',
      methodology: 'Method A',
      usage: 'Usage A',
      significance: 'Significance A',
      misinterpretation: 'Misread A',
      related: ['Beta', 'Gamma'],
      interpretation: { policy: 'Policy A', model: 'Model A' },
      disasterMethodology: [{ disasterType: 'Flood', methodology: 'Diff A' }],
    });
  });

  it('omits optional fields when absent', () => {
    const [, beta] = parseGlossary(csv);

    expect(beta.tag).toBeUndefined();
    expect(beta.interpretation).toBeUndefined();
    expect(beta.disasterMethodology).toBeUndefined();
    expect(beta.related).toBeUndefined();
    expect(beta.misinterpretation).toBeUndefined();
  });

  it('handles quoted fields and escaped quotes', () => {
    const quotedCsv = [
      'term,short,long,ids_drr,where_seen,why_it_matters',
      '"Term, with comma","Short ""quoted""",Long,Method,Usage,Significance',
    ].join('\n');

    const [term] = parseGlossary(quotedCsv);
    expect(term.term).toBe('Term, with comma');
    expect(term.summary).toBe('Short "quoted"');
  });
});
