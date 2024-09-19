import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'opub-ui';

import { DataStoriesText } from '@/config/consts';

const DataStories = () => {
  const Stories = [
    {
      title: 'Rainfall data aggregate Assam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      subTitle: 'By line',
      date: '01/12/2001',
      link: 'https://www.google.co.in/',
    },
    {
      title: 'Rainfall data aggregate Assam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      subTitle: 'By line',
      date: '01/12/2001',
      link: 'www.fb.com',
    },
    {
      title: 'Rainfall data aggregate Assam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      subTitle: 'By line',
      date: '01/12/2001',
      link: 'www.google.com',
    },
    {
      title: 'Rainfall data aggregate Assam',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      subTitle: 'By line',
      date: '01/12/2001',
      link: 'www.google.com',
    },
  ];
  return (
    <section
      className="flex h-full w-full flex-col gap-10 px-5 py-6 lg:px-6 lg:py-14"
      style={{ backgroundColor: '#222136' }}
    >
      <div className=" container flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="onBgDefault">
          Data Stories{' '}
        </Text>
        <Text variant="headingXl" fontWeight="regular" color="onBgDefault">
          {DataStoriesText}
        </Text>
      </div>
      <div className=" md:container lg:container">
        <Carousel className="flex w-full items-center justify-between">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          <CarouselContent className="flex w-full gap-4 px-4 lg:gap-4 ">
            {/* Adjust padding */}
            {Stories.map((item, index) => (
              <CarouselItem
                key={index}
                className="ml-2 flex w-fit flex-col items-baseline justify-start gap-3 overflow-hidden rounded-2 bg-surfaceDefault p-3 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
              >
                <Link href={item.link} className=" w-full" target="_blank">
                  <div className="flex flex-col gap-4 ">
                    <div className=" w-fill h-48 bg-borderDisabled"></div>
                    <div>
                      <Text>{item.title}</Text>
                    </div>
                    <div className=" flex flex-wrap justify-between">
                      <Text>{item.subTitle}</Text>
                      <Text>{item.date}</Text>
                    </div>
                    <div>
                      <Text>{item.description}</Text>
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
  );
};

export default DataStories;
