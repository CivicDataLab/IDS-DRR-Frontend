import React from 'react';
import Image from 'next/image';
import {
  Button,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Icon,
  Text,
} from 'opub-ui';

import { handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';

interface BlogArray {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

const blogArray: BlogArray[] = [
  {
    title: 'Blog Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/logo/ASDMA.png',
    link: `https://github.com/CivicDataLab/IDS-DRR-Data-Sources/tree/main/Sources`,
  },
  {
    title: 'Blog Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/logo/ASDMA.png',
    link: `https://github.com/CivicDataLab/IDS-DRR-Data-Sources/tree/main/Sources`,
  },
  {
    title: 'Blog Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/logo/ASDMA.png',
    link: `https://github.com/CivicDataLab/IDS-DRR-Data-Sources/tree/main/Sources`,
  },
  {
    title: 'Blog Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/logo/ASDMA.png',
    link: `https://github.com/CivicDataLab/IDS-DRR-Data-Sources/tree/main/Sources`,
  },
  {
    title: 'Blog Title',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    imageUrl: '/logo/ASDMA.png',
    link: `https://github.com/CivicDataLab/IDS-DRR-Data-Sources/tree/main/Sources`,
  },
];

export function DataStories() {
  return (
    <section
      className="flex h-[549px] flex-col flex-wrap py-8 "
      aria-label="Data stories"
    >
      <div className="container mb-2 flex flex-col gap-4  ">
        <Text variant="heading2xl" fontWeight="bold" color="default" as="h2">
          Data Stories
        </Text>
        <Carousel>
          <CarouselContent>
            {blogArray.map((blog, index) => (
              <CarouselItem key={index} className="flex-none p-4">
                <div
                  key={index}
                  className="flex h-[342px] w-[315px] flex-col items-center gap-4 bg-baseIndigoSolid1 p-4"
                >
                  <Image
                    src={blog.imageUrl}
                    alt={blog.title}
                    height={80}
                    width={80}
                    className="h-auto w-full items-center object-contain "
                  />
                  <div className="flex w-full flex-col gap-4 ">
                    <div className="flex flex-row justify-between">
                      <Text variant="bodyMd" fontWeight="bold" color="default">
                        {blog.title}{' '}
                      </Text>
                      <Button
                        monochrome={true}
                        kind="tertiary"
                        onClick={(event) => handleRedirect(event, blog.link)}
                      >
                        <div className="flex items-center gap-1">
                          <Text color="interactive" variant="bodyMd">
                            Read
                          </Text>
                          <Icon source={Icons.right} color="interactive" />
                        </div>
                      </Button>
                    </div>

                    <Text
                      variant="bodySm"
                      fontWeight="regular"
                      color="subdued"
                      truncate
                    >
                      {blog.description}
                    </Text>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="z-10" />
          <CarouselNext className="z-10" />
        </Carousel>
      </div>
    </section>
  );
}
