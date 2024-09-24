import Image from 'next/image';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  Text,
} from 'opub-ui';

import { AnalyticsQuickLinksText, AnalyticsURL } from '@/config/consts';

export const QuickLinks = () => {
  const Analytics = [
    {
      name: 'Assam',
      status: 'active',
      icon: '/logo/statemap.svg',
      link: AnalyticsURL,
    },
    {
      name: 'Himachal Pradesh',
      status: 'inactive',
      icon: '/logo/statemap.svg',
      link: '',
    },
    {
      name: 'Odisha',
      status: 'inactive',
      icon: '/logo/statemap.svg',
      link: '',
    },
    {
      name: 'Bihar',
      status: 'inactive',
      icon: '/logo/statemap.svg',
      link: '',
    },
    {
      name: 'Uttar Pradesh',
      status: 'inactive',
      icon: '/logo/statemap.svg',
      link: '',
    },
  ];
  return (
    <section className="container flex flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20">
      <div className=" flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="default">
          Analytics Dashboard
        </Text>
        <Text variant="headingXl" fontWeight="regular" color="default">
          {AnalyticsQuickLinksText}
        </Text>
      </div>
      <div className="w-full">
        {' '}
        {/* Ensure full width for the container */}
        <Carousel className="flex w-full items-center justify-center">
          <CarouselPrevious className="hidden xl:block" />
          <CarouselContent className="flex w-full gap-0 px-4 md:gap-6 lg:gap-2">
            {/* Adjust padding */}
            {Analytics.map((item, index) => (
              <CarouselItem
                key={index}
                className="lg flex items-center justify-center overflow-hidden px-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xl:px-7 2xl:basis-1/5"
              >
                {item.status === 'active' ? (
                  <Link href={item.link} className="cursor-pointer">
                    {/* Ensure items take up flexible width */}
                    <div
                      className="flex h-48 w-56 flex-col items-center justify-between rounded-4 p-4 text-center shadow-elementCard"
                      style={{ background: '#F9F9FB' }}
                    >
                      <Image
                        width={200}
                        height={160}
                        src={item.icon}
                        alt="blog Logo"
                        className="h-32 w-32 bg-basePureWhite object-cover px-3 py-4"
                      />
                      <Text variant="headingLg">{item.name}</Text>
                    </div>
                  </Link>
                ) : (
                  <div
                    className="flex h-48 w-56 cursor-no-drop flex-col items-center justify-between rounded-4 p-4 text-center shadow-elementCard"
                    style={{ background: '#F9F9FB' }}
                  >
                    <Image
                      width={200}
                      height={160}
                      src={item.icon}
                      alt="blog Logo"
                      className="h-32 w-32 bg-basePureWhite object-cover px-3 py-4 opacity-25"
                    />
                    <Text variant="headingLg">{item.name}</Text>
                    <Text className="absolute top-1/3 w-fit text-nowrap rounded-2 bg-baseGraySlateSolid7 px-3 py-1">
                      Coming Soon
                    </Text>
                  </div>
                )}
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselNext className="hidden xl:block" />
        </Carousel>
      </div>
    </section>
  );
};
