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

import { DataStoriesText } from '@/config/consts';

const DataStories = () => {
  const Stories = [
    {
      title:
        'Using Data for Disaster Risk Reduction(DRR) and enhanced Climate Adaptation',
      description:
        'Today, it is essential that we look at Disaster Risk Reduction (DRR) that goes beyond rescue and relief for building resilient communities',
      subTitle: 'By line',
      date: '16/05/2024',
      alt: 'Flooded Houses',
      image:
        'https://miro.medium.com/v2/resize:fit:720/format:webp/1*MYJWdHX-BuGX0UB5bgEbkg.jpeg',
      link: 'https://medium.com/civicdatalab/using-data-for-disaster-risk-reduction-drr-and-enhanced-climate-adaptation-f2465a91446c',
    },
    {
      title: 'Establishing a Resilient Climate Data Environment',
      description:
        'In order to harness the potential of the data-for-public-good ecosystem for addressing the growing impact of Climate Change, data-based',
      subTitle: 'By line',
      date: '01/04/2024',
      alt: 'data image',
      link: 'https://medium.com/civicdatalab/establishing-a-resilient-climate-data-environment-ebe680ba7a9a',
      image:
        'https://miro.medium.com/v2/resize:fit:720/format:webp/1*_UlVG5lEb8ChOgFrthHp_w.jpeg',
    },
    {
      title: 'Critical Role of Local Communities for DRR',
      description:
        'Evidence based interventions for climate action and disaster risk reduction (DRR) must engage communities to ensure resilience.',
      subTitle: 'By line',
      date: '25/09/2024',
      alt: 'Cloudy Mountains',
      link: 'https://medium.com/civicdatalab/critical-role-of-local-communities-for-drr-3cae00f6c89c',
      image:
        'https://miro.medium.com/v2/resize:fit:720/format:webp/0*RWVURinKnqLkvZbZ',
    },
    {
      title:
        'Introducing ‘Intelligent (Open) Data Ecosystem for Assam — Flood Response and Management (IDEA-FRM)’',
      description:
        'How we identified and curated relevant datasets which can be used to study, model and address the issue of floods in the state of Assam.',
      subTitle: 'By line',
      date: '22/05/2023',
      alt: 'IDEA-FRM image',
      link: 'https://medium.com/civicdatalab/introducing-intelligent-open-data-ecosystem-for-assam-flood-response-and-management-ca5481908dd4',
      image:
        'https://miro.medium.com/v2/resize:fit:720/format:webp/1*KzBOx8poqVyG4m1JY4PsMQ.jpeg',
    },
  ];
  return (
    <section
      className=" flex h-full w-full flex-col gap-10 px-5 py-6 lg:w-fit lg:px-6 lg:py-14"
      // className="flex w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20"
      style={{ backgroundColor: '#222136' }}
      aria-label="Data stories carousel showcasing important publications and articles"
    >
      {/* <div className="  flex flex-col gap-4 lg:pl-12"> */}
      <div className="container flex flex-col gap-4 ">
        <Text
          variant="heading3xl"
          fontWeight="bold"
          color="onBgDefault"
          as="h2"
        >
          Data Stories{' '}
        </Text>

        <Text variant="bodyLg" fontWeight="regular" color="onBgDefault">
          {DataStoriesText}
        </Text>
      </div>
      <div className="">
        {/* <Carousel className="flex w-full items-center justify-between"> */}
        <Carousel className="flex w-full items-center justify-between gap-2 px-2">
          <div className="mr-2 rounded-1 bg-surfaceDefault">
            <CarouselPrevious />
          </div>
          {/* <CarouselContent className="flex w-full gap-4 px-4 lg:container lg:gap-6 "> */}
          <CarouselContent className="flex w-full justify-between gap-4 pl-4 pr-1 lg:container lg:gap-6">
            {/* Adjust padding */}
            {Stories.map((item, index) => (
              <CarouselItem
                key={index}
                className="ml-2 overflow-hidden rounded-2 bg-surfaceDefault p-6 md:basis-1/2 lg:ml-0 lg:basis-1/3  lg:p-6 "
              >
                <Link href={item.link} className=" w-full" target="_blank">
                  <div className="flex flex-col gap-4 ">
                    <div className="w-full">
                      <Image
                        width={180}
                        height={192}
                        src={item.image}
                        alt="banner"
                        className=" w-full object-cover"
                      />
                    </div>
                    <div className=" min-h-12">
                      <Text variant="headingLg" fontWeight="semibold" as="h3">
                        {item.title}
                      </Text>
                    </div>
                    <div className=" flex flex-wrap justify-between">
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
