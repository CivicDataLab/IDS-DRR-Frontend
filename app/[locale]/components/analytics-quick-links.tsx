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
import styles from './analytics-quick-links.module.css';

export const QuickLinks = () => {
  const Analytics = [
    {
      name: 'Assam',
      status: 'active',
      icon: '/logo/states/Assam.svg',
      link: `/assam${AnalyticsURL}`,
      alt: 'assam state boundary image',
    },
    {
      name: 'Himachal Pradesh',
      status: 'active',
      icon: '/logo/states/Hp.svg',
      link: `/himachal-pradesh${AnalyticsURL}`,
      alt: 'HP state boundary image',
    },
    {
      name: 'Odisha',
      status: 'active',
      icon: '/logo/states/Odisha.svg',
      link: `/odisha${AnalyticsURL}`,
      alt: 'Odisha state boundary image',
    },
    {
      name: 'Bihar',
      status: 'inactive',
      icon: '/logo/states/Bihar.svg',
      link: '',
      alt: 'Bihar state boundary image',
    },
    {
      name: 'Uttar Pradesh',
      status: 'active',
      icon: '/logo/states/Up.svg',
      link: `uttar-pradesh${AnalyticsURL}`,
      alt: 'UP state boundary image',
    },
  ];
  return (
    <section
      className=" flex h-full w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20"
      aria-label="Quick links to deep dive into different states"
    >
      <div className="container flex flex-col gap-4 ">
        <Text variant="heading3xl" fontWeight="bold" color="default" as="h2">
          Analytics Dashboard
        </Text>
        <Text variant="bodyLg" fontWeight="regular" color="default">
          {AnalyticsQuickLinksText}
        </Text>
      </div>
      <div>
        {/* <Carousel className="flex w-full items-center justify-center"> */}
        <Carousel className="flex w-full items-center justify-center gap-2 px-2">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          <CarouselContent className="container flex w-full gap-0 px-4 md:gap-6 lg:gap-2">
            {/* Adjust padding */}
            {Analytics.map((item, index) => (
              <CarouselItem
                key={index}
                className="lg flex items-center justify-center overflow-hidden px-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 xl:px-7 2xl:basis-1/5"
              >
                {item.status === 'active' ? (
                  <Link
                    href={item.link}
                    className={`cursor-pointer ${styles.stateCard}`}
                  >
                    {/* Ensure items take up flexible width */}
                    <div className="flex h-48 w-56 flex-col items-center justify-between rounded-2 bg-surfaceDefault p-4 text-center shadow-elementCard">
                      <Image
                        width={200}
                        height={160}
                        src={item.icon}
                        alt={item.alt}
                        className={`h-32 w-32 object-contain px-3 ${styles.stateIcon}`}
                      />
                      <Text
                        variant="headingLg"
                        className=" whitespace-nowrap"
                        as="h3"
                      >
                        {item.name}
                      </Text>
                    </div>
                  </Link>
                ) : (
                  <div
                    className="relative flex h-48 w-56 cursor-no-drop flex-col items-center justify-between rounded-4 p-4 text-center shadow-elementCard"
                    style={{ background: '#F9F9FB' }}
                  >
                    <Image
                      width={200}
                      height={160}
                      src={item.icon}
                      alt="blog Logo"
                      className={`h-32 w-32  object-contain px-3 opacity-25 ${styles.inactiveStateIcon}`}
                    />
                    <Text variant="headingLg" className=" whitespace-nowrap">
                      {item.name}
                    </Text>
                    <Text
                      variant="headingMd"
                      className="absolute right-0 top-0 m-2 w-fit whitespace-nowrap rounded-2 bg-basePureBlack px-3 py-1 text-surfaceDefault"
                    >
                      Coming Soon
                    </Text>
                  </div>
                )}
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
