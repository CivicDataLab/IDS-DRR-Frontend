'use client';

import Link from 'next/link';
import { useFormatter, useTranslations } from 'next-intl';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'opub-ui';

import { stories } from '@/config/site';

export const Stories = () => {
  const t = useTranslations('home.stories');
  const format = useFormatter();
  return (
    <div
      className="flex w-full justify-center"
      style={{ backgroundColor: '#222136' }}
    >
      <section
        className="flex h-full w-full flex-col gap-10 px-5 py-6 lg:w-fit lg:px-6 lg:py-14"
        aria-labelledby="stories-heading"
      >
        <div className="container flex flex-col gap-4">
          <Text
            id="stories-heading"
            variant="heading3xl"
            fontWeight="bold"
            color="onBgDefault"
            as="h2"
          >
            {t('heading')}
          </Text>
          <Text variant="bodyLg" fontWeight="regular" color="onBgDefault">
            {t('description')}
          </Text>
        </div>
        <div>
          <Carousel className="flex w-full items-center justify-between gap-2 px-2">
            <div className="mr-2 rounded-1 bg-surfaceDefault">
              <CarouselPrevious />
            </div>
            <CarouselContent className="flex w-full justify-between gap-4 pl-4 pr-1 lg:container lg:gap-6">
              {stories.map((story) => (
                <CarouselItem
                  key={story.url}
                  className="ml-2 overflow-hidden rounded-2 bg-surfaceDefault p-6 md:basis-1/2 lg:ml-0 lg:basis-1/3 lg:p-6"
                >
                  <Link
                    href={story.url}
                    className="w-full no-underline"
                    target="_blank"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          width={180}
                          height={192}
                          src={story.image}
                          alt=""
                          className="w-full object-cover"
                        />
                      </div>
                      <div className="min-h-12">
                        <Text variant="headingLg" fontWeight="semibold" as="h3">
                          {story.title}
                        </Text>
                      </div>
                      <div className="flex flex-wrap justify-between">
                        <Text>{format.dateTime(new Date(story.date), 'longDate')}</Text>
                      </div>
                      <div>
                        <Text>{story.description}</Text>
                      </div>
                    </div>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="ml-2 rounded-1 bg-surfaceDefault">
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>
    </div>
  );
};
