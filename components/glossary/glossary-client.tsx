'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import type { GlossaryTerm } from 'ids-drr-branding-types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Divider,
  SearchInput,
  Tab,
  TabList,
  TabPanel,
  Tabs,
  Tag,
  Text,
} from 'opub-ui';

import { slugifyGlossaryTerm } from '@/lib/glossary';

type Props = {
  terms: GlossaryTerm[];
};

type Indexed = GlossaryTerm & { slug: string; letter: string };

function indexTerms(terms: GlossaryTerm[]): Indexed[] {
  return terms.map((t) => ({
    ...t,
    slug: slugifyGlossaryTerm(t.term),
    letter: (t.term[0] ?? '#').toUpperCase(),
  }));
}

function groupByLetter(items: Indexed[]) {
  const map = new Map<string, Indexed[]>();
  for (const item of items) {
    const existing = map.get(item.letter);
    if (existing) existing.push(item);
    else map.set(item.letter, [item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, group]) => ({
      letter,
      items: group.sort((x, y) => x.term.localeCompare(y.term)),
    }));
}

function uniqueTags(terms: GlossaryTerm[]): string[] {
  const labelsByKey = new Map<string, string>();
  for (const t of terms) {
    const raw = t.tag?.trim();
    if (!raw) continue;
    const key = raw.toLowerCase();
    if (!labelsByKey.has(key)) labelsByKey.set(key, raw);
  }
  return [...labelsByKey.values()].sort((a, b) => a.localeCompare(b));
}

export default function GlossaryClient({ terms }: Props) {
  const t = useTranslations('glossary');
  const tFilters = useTranslations('common.filters');

  const indexed = React.useMemo(() => indexTerms(terms), [terms]);
  const tags = React.useMemo(() => uniqueTags(terms), [terms]);

  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const [openSlug, setOpenSlug] = React.useState<string | null>(null);
  const deferredQuery = React.useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filtered = React.useMemo(() => {
    const tagKey = selectedTag?.toLowerCase();
    return indexed.filter((item) => {
      if (tagKey && item.tag?.toLowerCase() !== tagKey) return false;
      if (
        normalizedQuery &&
        !item.term.toLowerCase().includes(normalizedQuery) &&
        !item.definition.toLowerCase().includes(normalizedQuery)
      )
        return false;
      return true;
    });
  }, [indexed, selectedTag, normalizedQuery]);

  const grouped = React.useMemo(() => groupByLetter(filtered), [filtered]);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <SearchInput
        placeholder={t('search.placeholder')}
        label={t('search.label')}
        name="search"
        className="w-full pt-10"
        defaultValue={query}
        onChange={(value) => setQuery(value)}
        onClear={() => setQuery('')}
      />

      <div className="flex flex-wrap gap-2">
        <div
          onClick={() => {
            setSelectedTag(null);
          }}
          className="cursor-pointer"
        >
          <Tag
            variation={'filled'}
            fillColor={selectedTag ? '#f6f6f7' : '#96d1ba'}
            color="standard"
          >
            {tFilters('all')}
          </Tag>
        </div>
        {tags.map((filter) => {
          const isActive = selectedTag?.toLowerCase() === filter.toLowerCase();
          return (
            <div
              key={filter}
              onClick={() => {
                setSelectedTag(filter);
                setOpenSlug(null);
              }}
              className="cursor-pointer"
            >
              <Tag
                variation={'filled'}
                fillColor={isActive ? '#96d1ba' : '#f6f6f7'}
              >
                {filter}
              </Tag>
            </div>
          );
        })}
      </div>

      {grouped.length > 0 ? (
        grouped.map(({ letter, items }) => (
          <section
            key={letter}
            className="border overflow-hidden rounded-2 py-4"
          >
            <div className="bg-successBackground ">
              <Text variant="headingXl" color="default">
                {letter}
              </Text>
            </div>
            <Divider className="my-3  h-[0.2px] " />

            <Accordion
              type="single"
              collapsible
              value={openSlug ?? ''}
              onValueChange={(val) => {
                setOpenSlug(val || null);
              }}
              className="divide-y "
            >
              {items.map((item) => {
                const isOpen = openSlug === item.slug;
                return (
                  <AccordionItem
                    key={item.slug}
                    value={item.slug}
                    className="my-5 rounded-2 bg-[#fff]"
                  >
                    <AccordionTrigger className=" px-8 hover:no-underline">
                      <div className="flex min-w-0 flex-col items-start justify-between gap-2">
                        <div className="font-semibold text-textDefault">
                          {item.term}
                        </div>
                        <Text color="subdued">{item.summary}</Text>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="rounded-2 bg-baseSurfaceSubdued px-8">
                        {isOpen && (
                          <div className="mt-3 flex flex-col gap-8 py-3">
                            <div className="border bg-backgroundSolid flex flex-col gap-2 rounded-2 ">
                              <Text variant="headingMd" color="default">
                                {t('detail.headings.definition')}
                              </Text>
                              <Text variant="bodyMd" color="default">
                                {item.definition}
                              </Text>
                            </div>

                            <div className="grid gap-3 rounded-2 bg-[#fff] md:grid-cols-3">
                              <DetailsCard
                                title={t('detail.headings.methodology')}
                                body={item.methodology}
                              />
                              <DetailsCard
                                title={t('detail.headings.usage')}
                                body={item.usage}
                              />
                              <DetailsCard
                                title={t('detail.headings.significance')}
                                body={item.significance}
                              />
                            </div>

                            <ContextTabs
                              policy={item.interpretation?.policy}
                              model={item.interpretation?.model}
                            />

                            {item.disasterMethodology &&
                              item.disasterMethodology.length > 0 && (
                                <div className="border flex flex-col gap-2 rounded-2 bg-baseSurfacePressed p-4">
                                  <Text variant="headingMd" color="default">
                                    {t('detail.headings.disasterMethodology')}
                                  </Text>
                                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                                    {item.disasterMethodology.map((d) => (
                                      <div
                                        key={d.disasterType}
                                        className="border flex flex-col gap-2 rounded-2 bg-[#fff] p-3"
                                      >
                                        <Text
                                          variant="headingMd"
                                          color="default"
                                        >
                                          {d.disasterType}
                                        </Text>
                                        <Text variant="bodyMd" color="subdued">
                                          {d.methodology}
                                        </Text>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {item.related && item.related.length > 0 && (
                              <InfoCard
                                title={t('detail.headings.related')}
                                items={item.related}
                              />
                            )}

                            {item.misinterpretation && (
                              <div className="border flex flex-col gap-2 rounded-2 bg-baseAlertSubued p-4">
                                <Text variant="headingMd" color="default">
                                  {t('detail.headings.misinterpretation')}
                                </Text>
                                <Text variant="bodyMd" color="default">
                                  {item.misinterpretation}
                                </Text>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </section>
        ))
      ) : (
        <div className="flex h-20 flex-col items-center justify-center">
          <Text variant="headingLg" color="default">
            {t('empty')}
          </Text>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="border flex flex-col gap-2 rounded-2 px-1 py-3">
      <Text variant="headingMd" color="default">
        {title}
      </Text>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Tag variation="filled" key={item}>
            {item}
          </Tag>
        ))}
      </div>
    </div>
  );
}

function DetailsCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border flex flex-col gap-2 rounded-2 p-6">
      <Text variant="headingMd" color="default">
        {title}
      </Text>
      <Text variant="bodyMd" color="default">
        {body}
      </Text>
    </div>
  );
}

function ContextTabs({ policy, model }: { policy?: string; model?: string }) {
  const t = useTranslations('glossary.detail');
  if (!policy && !model) return null;
  return (
    <div className="border flex flex-col gap-4 rounded-2 bg-baseSurfacePressed p-4">
      <Text variant="headingMd" color="default">
        {t('headings.interpretation')}
      </Text>

      <Tabs defaultValue="policy">
        <TabList>
          {policy && <Tab value="policy">{t('tabs.policy.title')}</Tab>}
          {model && <Tab value="model">{t('tabs.model.title')}</Tab>}
        </TabList>
        {policy && (
          <TabPanel value="policy" className="rounded-2 bg-[#fff]">
            <div className="flex flex-col gap-2 p-4">
              <Text variant="headingMd" color="default">
                {t('tabs.policy.heading')}
              </Text>
              <Text variant="bodyMd" color="default">
                {policy}
              </Text>
            </div>
          </TabPanel>
        )}
        {model && (
          <TabPanel value="model" className="rounded-2 bg-[#fff]">
            <div className="flex flex-col gap-2 p-4">
              <Text variant="headingMd" color="default">
                {t('tabs.model.heading')}
              </Text>
              <Text variant="bodyMd" color="default">
                {model}
              </Text>
            </div>
          </TabPanel>
        )}
      </Tabs>
    </div>
  );
}
