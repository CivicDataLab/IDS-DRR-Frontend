'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
        console.error(err);
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
      className="flex h-full w-full flex-col gap-10  px-5 py-6 lg:px-6 lg:py-14"
      style={{ backgroundColor: '#222136' }}
    >
      <div className=" container flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="onBgDefault">
          Resources{' '}
        </Text>
        <Text variant="headingXl" fontWeight="regular" color="onBgDefault">
          {ResourcesSectionText}
        </Text>
      </div>
      <div>
        <Carousel className="flex w-full items-center justify-center">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          {data.length > 0 ? (
            <CarouselContent className="container flex w-full gap-4 px-4 lg:gap-4 ">
              <CarouselItem className="ml-2  overflow-hidden rounded-2 bg-surfaceDefault p-3 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 ">
                <Link
                  href={`https://supersetv2.civicdatalab.in/superset/dashboard/p/qe6NrVOpNPz/`}
                  className="w-full"
                >
                  <div className="flex w-full flex-col items-baseline justify-between gap-3">
                    <div className=" flex flex-col gap-1 ">
                      <Text variant="bodyLg">
                        <b> Assam Tenders Dashboard</b>
                      </Text>
                      <Text variant="bodySm">
                        Source: Assam Government eProcurement System
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
                          Last Updated: NA
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
                          Update Frequency: NA
                        </Text>
                      </div>
                      <Text
                        color="default"
                        className=" text-textSubdued "
                        variant="bodySm"
                        fontWeight="regular"
                      >
                        Reference Period: January 2017 to September 2023
                      </Text>
                    </div>
                    <div className=" flex flex-wrap gap-2">
                      <Tag background-color="#E1F0FF">Financial Data</Tag>
                      <Tag background-color="#E1F0FF">Government Response</Tag>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
              {data.map((item: any, index: any) => (
                <CarouselItem
                  key={index}
                  className="ml-2  overflow-hidden rounded-2 bg-surfaceDefault p-3 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
                >
                  <Link href={`/datasets/${item.id}`} className="w-full">
                    <div className="flex w-full flex-col items-baseline justify-between gap-3">
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
                      <div className=" flex gap-2">
                        {item.formats.map((fileType: any, index: any) => (
                          <Tag key={index} background-color="#E1F0FF">
                            {fileType}
                          </Tag>
                        ))}
                      </div>
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
