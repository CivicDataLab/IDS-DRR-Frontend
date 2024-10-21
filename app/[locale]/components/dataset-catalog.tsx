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
      description:
        'Hazards or Potential of a physical event that may cause loss of life or property',
    },
    {
      name: 'Exposure',
      icon: '/logo/Exposure.svg',
      link: '/datasets?categories=Exposure+Score',
      description:
        'Hazards or Potential of a physical event that may cause loss of life or property',
    },
    {
      name: 'Vulnerability',
      icon: '/logo/Vulnerability.svg',
      link: '/datasets?categories=Vulnerability+Score',
      description:
        'Physical, Social, Economic, and Environmental vulnerabilities which increase susceptibility of an area or a community to impact of hazards',
    },
    {
      name: 'Government Response',
      icon: '/logo/Government_Response.svg',
      link: '/datasets?categories=Government+Response+Score',
      description:
        'Government Response with respect to capacities or resources that can reduce the level of risk, or the effects of disasters',
    },
  ];
  return (
    <section className="flex w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20">
      <div className="container flex flex-col gap-4 ">
        <Text variant="heading4xl" fontWeight="bold" color="default">
          Dataset Catalog
        </Text>
        <Text variant="headingMd" fontWeight="regular" color="default">
          {DatasetCatalogText}
        </Text>
      </div>
      <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Catalog.map((item, index) => (
          <div
            key={index}
            className="flex rounded-1 bg-surfaceDefault p-6 shadow-elementCard"
          >
            <Link href={item.link} className=" flex items-center gap-4">
              <Image src={item.icon} alt={''} width={66} height={66} />
              <div className=" flex flex-col justify-center gap-2">
                <Text variant="headingMd" className="  ">
                  {item.name}
                </Text>
                <Text variant="bodySm" className="">
                  {item.description}
                </Text>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
