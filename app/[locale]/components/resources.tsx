import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Tag,
  Text,
} from 'opub-ui';

import { ResourcesSectionText } from '@/config/consts';

const Resources = () => {
  const Datasets = [
    {
      title: 'Rainfall data aggregate Assam',
      source: 'Indian Meteorological Department',
      last_updated: '02 Aug 2023',
      update_freq: 'monthly',
      ref_period: 'Aug 2013 to Aug2024',
      formats: ['CSV', 'XML'],
    },
    {
      title: 'Rainfall data aggregate Assam',
      source: 'Indian Meteorological Department',
      last_updated: '02 Aug 2023',
      update_freq: 'monthly',
      ref_period: 'Aug 2013 to Aug2024',
      formats: ['CSV', 'XML'],
    },
    {
      title: 'Rainfall data aggregate Assam',
      source: 'Indian Meteorological Department',
      last_updated: '02 Aug 2023',
      update_freq: 'monthly',
      ref_period: 'Aug 2013 to Aug2024',
      formats: ['CSV', 'XML'],
    },
    {
      title: 'Rainfall data aggregate Assam',
      source: 'Indian Meteorological Department',
      last_updated: '02 Aug 2023',
      update_freq: 'monthly',
      ref_period: 'Aug 2013 to Aug2024',
      formats: ['CSV', 'XML'],
    },
  ];
  return (
    <section className="flex h-full w-full flex-col gap-10 bg-backgroundSolidDark px-5 py-6 lg:px-6 lg:py-20">
      <div className=" container flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="onBgDefault">
          Resources{' '}
        </Text>
        <Text variant="headingXl" fontWeight="regular" color="onBgDefault">
          {ResourcesSectionText}
        </Text>
      </div>
      <div className=" md:container lg:container">
        <Carousel className="flex w-full items-center justify-center">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          <CarouselContent className="flex w-full gap-4 px-4 lg:gap-4 ">
            {/* Adjust padding */}
            {Datasets.map((item, index) => (
              <CarouselItem
                key={index}
                className="ml-2 flex w-fit flex-col items-baseline justify-start gap-3 overflow-hidden rounded-2 bg-surfaceDefault p-3 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
              >
                <div className=" flex flex-col gap-1 ">
                  <Text variant="bodyLg">{item.title}</Text>
                  <Text>Source: {item.source}</Text>
                </div>
                <div className="flex flex-col items-start gap-1">
                  <div className=" flex flex-col gap-1  lg:flex-row">
                    <Text
                      color="default"
                      className="text-textSubdued"
                      variant="bodySm"
                      fontWeight="regular"
                    >
                      Last Updated: {item.last_updated}
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
                      Update Frequency: {item.update_freq}
                    </Text>
                  </div>
                  <Text
                    color="default"
                    className=" text-textSubdued "
                    variant="bodySm"
                    fontWeight="regular"
                  >
                    Reference Period: {item.ref_period}
                  </Text>
                </div>
                <div className=" flex gap-2">
                  {item.formats.map((fileType, index) => (
                    <Tag key={index} background-color="#E1F0FF">
                      {fileType}
                    </Tag>
                  ))}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="ml-2 rounded-1 bg-surfaceDefault">
            <CarouselNext />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default Resources;
