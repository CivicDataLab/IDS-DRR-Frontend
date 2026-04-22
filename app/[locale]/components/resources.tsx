'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { captureException } from '@sentry/nextjs';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Spinner,
  Tag,
  Text,
} from 'opub-ui';

import { ResourcesSectionText } from '@/config/consts';
import { resources } from '@/config/site';
import { fetchDatasets } from '@/lib/api';
import { formatReferenceDate } from '@/lib/utils';

interface MetadataItem {
  label: string;
}

interface MetadataEntry {
  metadata_item: MetadataItem;
  value: string;
}

interface Dataset {
  id: string;
  metadata: MetadataEntry[];
  tags: string[];
  categories: string[];
  formats: string[];
  title: string;
  description: string;
  created: string; // ISO 8601 date string
  modified: string; // ISO 8601 date string
  organization: string | null;
}

const Resources = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchDatasets('?&size=5&page=1&sort=recent')
      .then((res: any) => {
        setData(res.results);
      })
      .catch((err: any) => {
        captureException(err);
      });
  }, []);

  function getMetadataValue(data: Dataset, label: string): string | null {
    const metadataEntry = data.metadata.find(
      (entry) => entry.metadata_item.label === label
    );
    return metadataEntry ? metadataEntry.value : null;
  }

  return (
    <section
      className="flex h-full w-full flex-col gap-10 px-5 py-6 lg:px-6 lg:py-14"
      style={{ backgroundColor: '#222136' }}
      aria-label="Various resources for data exploration"
    >
      <div className="container flex flex-col gap-4 ">
        <Text
          variant="heading3xl"
          fontWeight="bold"
          color="onBgDefault"
          as="h2"
        >
          Resources{' '}
        </Text>
        <Text variant="bodyLg" fontWeight="regular" color="onBgDefault">
          {ResourcesSectionText}
        </Text>
      </div>
      <div>
        {/* <Carousel className="flex w-full items-center justify-center"> */}
        <Carousel className="flex w-full items-center justify-center gap-2 px-2">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          {data.length > 0 ? (
            // <CarouselContent className="container flex w-full gap-4 px-4 lg:gap-4 ">
            <CarouselContent className="flex w-full justify-between gap-4  pl-4 pr-1 lg:container lg:gap-6">
              {resources.map((card) => (
                <CarouselItem
                  key={card.url}
                  className="ml-2 overflow-hidden rounded-2 bg-surfaceDefault p-6 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
                >
                  <Link href={card.url} className="w-full no-underline">
                    <div className="flex w-full flex-col items-baseline justify-between gap-4">
                      <div className=" flex flex-col gap-1 ">
                        <Text variant="bodyLg">
                          <b> {card.title}</b>
                        </Text>
                        <Text variant="bodySm">Source: {card.source}</Text>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <div className=" flex flex-col gap-1  lg:flex-row">
                          <Text
                            color="default"
                            className="text-textSubdued"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            Last Updated: {card.last_updated}
                          </Text>
                          <Text
                            color="default"
                            className="hidden text-textSubdued  lg:block"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            |
                          </Text>
                          <Text
                            color="default"
                            className="text-textSubdued"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            Update Frequency: {card.update_frequency}
                          </Text>
                        </div>
                        <Text
                          color="default"
                          className=" text-textSubdued "
                          variant="bodySm"
                          fontWeight="regular"
                        >
                          Reference Period: {card.reference_period}
                        </Text>
                      </div>
                      <div className=" flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <Tag key={tag} background-color="#E1F0FF">
                            {tag}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
              {data.map((item: any, index: any) => (
                <CarouselItem
                  key={index}
                  className="ml-2  overflow-hidden rounded-2 bg-surfaceDefault p-3 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
                >
                  <Link
                    href={`/datasets/${item.id}`}
                    className="w-full no-underline"
                  >
                    <div className="flex w-full flex-col items-baseline justify-between gap-5">
                      <div className=" flex flex-col gap-1 ">
                        <Text variant="bodyLg">
                          <b>{item.title}</b>
                        </Text>
                        <Text variant="bodySm">
                          Source: {getMetadataValue(item, 'Source') || 'NA'}
                        </Text>
                      </div>
                      <div className="flex flex-col items-start gap-1">
                        <div className=" flex flex-col gap-1  lg:flex-row">
                          <Text
                            color="default"
                            className="text-textSubdued"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            Last Updated:{' '}
                            {getMetadataValue(item, 'Last Updated') || 'NA'}
                          </Text>
                          <Text
                            color="default"
                            className="hidden text-textSubdued  lg:block"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            |
                          </Text>
                          <Text
                            color="default"
                            className="text-textSubdued"
                            variant="bodySm"
                            fontWeight="regular"
                          >
                            Update Frequency:
                            {getMetadataValue(item, 'Last Updated') || 'NA'}
                          </Text>
                        </div>
                        <Text
                          color="default"
                          className=" text-textSubdued "
                          variant="bodySm"
                          fontWeight="regular"
                        >
                          Reference Period:{' '}
                          {formatReferenceDate(
                            getMetadataValue(item, 'Period From')
                          ) || 'NA'}{' '}
                          to{' '}
                          {formatReferenceDate(
                            getMetadataValue(item, 'Period To')
                          ) || 'NA'}
                        </Text>
                      </div>
                      {item?.formats?.length > 0 && (
                        <div className=" flex gap-2">
                          {item?.formats?.map((fileType: any, index: any) => (
                            <Tag key={index} background-color="#E1F0FF">
                              {fileType}
                            </Tag>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          ) : (
            <Spinner />
          )}
          <div className="ml-2 rounded-1 bg-surfaceDefault">
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Resources;
