'use client';

import * as React from 'react';
import type { GlossaryIndexItem } from '@/glossary/index';
import { glossaryTags, slugsByTag, termsBySlug } from '@/glossary/index';
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

type Props = {
  index: GlossaryIndexItem[];
};

function groupByLetter(items: GlossaryIndexItem[]) {
  const map = new Map<string, GlossaryIndexItem[]>();
  for (const item of items) {
    const key = (item.letter || '#').toUpperCase();
    const existing = map.get(key);
    if (existing) existing.push(item);
    else map.set(key, [item]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, group]) => ({
      letter,
      items: group.sort((x, y) => x.term.localeCompare(y.term)),
    }));
}

export default function GlossaryClient({ index }: Props) {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState<string>('');
  const deferredQuery = React.useDeferredValue(query);

  const { indexBySlug, termBySlugLower } = React.useMemo(() => {
    const indexBySlug: Record<string, GlossaryIndexItem> = {};
    const termBySlugLower: Record<string, string> = {};
    for (const item of index) {
      indexBySlug[item.slug] = item;
      termBySlugLower[item.slug] = (item.term ?? '').toLowerCase();
    }
    return { indexBySlug, termBySlugLower };
  }, [index]);

  const normalizedQuery = deferredQuery.trim().toLowerCase();

  const filteredIndex = React.useMemo(() => {
    const base =
      selectedTag === null
        ? index
        : (slugsByTag[selectedTag.toLowerCase()] ?? [])
            .map((s) => indexBySlug[s])
            .filter(Boolean);

    if (!normalizedQuery) return base;

    return base.filter((item) =>
      (termBySlugLower[item.slug] ?? '').includes(normalizedQuery)
    );
  }, [index, indexBySlug, normalizedQuery, selectedTag, termBySlugLower]);

  const grouped = React.useMemo(
    () => groupByLetter(filteredIndex),
    [filteredIndex]
  );
  const [openSlug, setOpenSlug] = React.useState<string | null>(null);
  const [errorSlug, setErrorSlug] = React.useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4">
      <SearchInput
        placeholder="Search"
        label="Search"
        name="search"
        className="w-full pt-10"
        defaultValue={query}
        onChange={(value) => setQuery(value)}
        onClear={() => setQuery('')}
      />

      <div className="flex gap-2">
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
            All
          </Tag>
        </div>
        {glossaryTags.map((filter) => {
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
                key={filter}
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
                const next = val || null;
                setOpenSlug(next);
                if (next) {
                  setErrorSlug(termsBySlug[next] ? null : next);
                }
              }}
              className="divide-y "
            >
              {items.map((item) => {
                const isOpen = openSlug === item.slug;
                const isError = errorSlug === item.slug;
                const full = termsBySlug[item.slug];

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
                        <Text color="subdued">{item.short}</Text>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent>
                      <div className="rounded-2 bg-baseSurfaceSubdued px-8">
                        {isError && (
                          <Text color="critical" variant="bodySm">
                            Couldn’t load details for this term.
                          </Text>
                        )}

                        {isOpen && full && (
                          <div className="mt-3 flex flex-col gap-8 py-3">
                            <div className="border bg-backgroundSolid flex flex-col gap-2 rounded-2 ">
                              <Text variant="headingMd" color="default">
                                Definition
                              </Text>

                              <Text variant="bodyMd" color="default">
                                {full.definitions.long}
                              </Text>
                            </div>

                            <div className="grid gap-3 rounded-2 bg-[#fff] md:grid-cols-3">
                              <DetailsCard
                                title="IDS-DRR Context"
                                body={full.details?.ids_drr}
                              />
                              <DetailsCard
                                title="Where You See It"
                                body={full.details?.where_seen}
                              />
                              <DetailsCard
                                title="Why It Matters"
                                body={full.details?.why_it_matters}
                              />
                            </div>

                            <ContextTabs
                              policy={full.contexts?.policy}
                              model={full.contexts?.model}
                            />

                            {full.disaster_differences?.length &&
                              full.disaster_differences.length > 0 && (
                                <div className="border flex flex-col gap-2 rounded-2 bg-baseSurfacePressed p-4">
                                  <Text variant="headingMd" color="default">
                                    How this differs across disaster contexts
                                  </Text>
                                  <div className="mt-3 grid gap-3 md:grid-cols-3">
                                    {full.disaster_differences.map(
                                      (d) =>
                                        d?.disaster_type && (
                                          <div
                                            key={d?.disaster_type}
                                            className="border flex flex-col gap-2 rounded-2 bg-[#fff] p-3"
                                          >
                                            <Text
                                              variant="headingMd"
                                              color="default"
                                            >
                                              {d?.disaster_type}
                                            </Text>
                                            <Text
                                              variant="bodyMd"
                                              color="subdued"
                                            >
                                              {d?.difference}
                                            </Text>
                                          </div>
                                        )
                                    )}
                                  </div>
                                </div>
                              )}

                            <InfoCard
                              title="Related terms"
                              body={full?.related_terms?.join(', ')}
                            />

                            {full.common_misinterpretation && (
                              <div className="border flex flex-col gap-2 rounded-2 bg-baseAlertSubued p-4">
                                <Text variant="headingMd" color="default">
                                  Common misinterpretation
                                </Text>

                                <Text variant="bodyMd" color="default">
                                  {full.common_misinterpretation}
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
            No results found
          </Text>
        </div>
      )}
    </div>
  );
}

function InfoCard({ title, body }: { title: string; body?: string }) {
  if (!body) return null;
  return (
    <div className="border flex flex-col gap-2 rounded-2 px-1 py-3">
      <Text variant="headingMd" color="default">
        {title}
      </Text>

      <div className="flex flex-wrap gap-2">
        {body.split(',').map((item) => (
          <Tag variation="filled" key={item.trim()}>
            {item.trim()}
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
  if (!policy && !model) return null;
  return (
    <div className="border flex flex-col gap-4 rounded-2 bg-baseSurfacePressed p-4">
      <Text variant="headingMd" color="default">
        Contextual interpretation
      </Text>

      <Tabs defaultValue="policy">
        <TabList>
          {policy && <Tab value="policy">In Policy</Tab>}
          {model && <Tab value="model">In Model</Tab>}
        </TabList>
        {policy && (
          <TabPanel value="policy" className="rounded-2 bg-[#fff]">
            <div className="flex flex-col gap-2 p-4">
              <Text variant="headingMd" color="default">
                Policy
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
                Model
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
