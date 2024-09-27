import Image from 'next/image';
import Link from 'next/link';
import { Text } from 'opub-ui';

import { DatasetCatalogText } from '@/config/consts';

export const DatasetCatalog = () => {
  const Catalog = [
    {
      name: 'Hazard',
      icon: '/logo/Hazard.svg',
      link: '/datasets?categories=Flood+Hazard+Score',
    },
    {
      name: 'Exposure',
      icon: '/logo/Exposure.svg',
      link: '/datasets?categories=Exposure+Score',
    },
    {
      name: 'Vulnerability',
      icon: '/logo/Vulnerability.svg',
      link: '/datasets?categories=Vulnerability+Score',
    },
    {
      name: 'Government Response',
      icon: '/logo/Government_Response.svg',
      link: '/datasets?categories=Government+Response+Score',
    },
  ];
  return (
    <section className="flex w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20">
      <div className="container flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="default">
          Dataset Catalog
        </Text>
        <Text variant="headingXl" fontWeight="regular" color="default">
          {DatasetCatalogText}
        </Text>
      </div>
      <div className="container flex w-full flex-wrap items-center justify-between gap-3">
        {Catalog.map((item, index) => (
          <div key={index} className=" text-center">
            <Link href={item.link}>
              <Image src={item.icon} alt={''} width={110} height={110} />
              <Text
                variant="headingXl"
                className="m-auto block min-w-40 max-w-40 text-center"
              >
                {item.name}
              </Text>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
