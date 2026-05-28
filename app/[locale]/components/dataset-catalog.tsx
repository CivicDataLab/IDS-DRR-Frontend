import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { Text } from 'opub-ui';

import { routes } from '@/lib/routes';

export const DatasetCatalog = async () => {
  const t = await getTranslations('home.datasets');
  const tFactors = await getTranslations('factors');
  const Catalog = [
    {
      key: 'hazard',
      icon: '/logo/Hazard.svg',
      category: 'Hazard',
    },
    {
      key: 'exposure',
      icon: '/logo/Exposure.svg',
      category: 'Exposure',
    },
    {
      key: 'vulnerability',
      icon: '/logo/Vulnerability.svg',
      category: 'Vulnerability',
    },
    {
      key: 'governmentResponse',
      icon: '/logo/Government_Response.svg',
      category: 'Government Response',
    },
  ] as const;
  return (
    <section
      className="flex w-full flex-col gap-9 px-5 py-6 lg:px-6 lg:py-20"
      aria-labelledby="home-datasets-heading"
    >
      <div className="container flex flex-col gap-4 ">
        <Text
          id="home-datasets-heading"
          variant="heading3xl"
          fontWeight="bold"
          color="default"
          as="h2"
        >
          {t('heading')}
        </Text>
        <Text variant="bodyLg" fontWeight="regular" color="default">
          {t('description')}
        </Text>
      </div>
      <div className="container grid grid-cols-1 gap-8 lg:grid-cols-2">
        {Catalog.map((item) => (
          <div
            key={item.key}
            className="flex h-full min-h-[150px] rounded-2 bg-surfaceDefault p-6 shadow-elementCard"
          >
            <Link
              href={routes.datasets({ category: item.category })}
              className=" flex items-center gap-4 no-underline"
            >
              <Image src={item.icon} alt="" width={66} height={66} />
              <div className=" flex flex-col justify-center gap-2">
                <Text variant="headingMd" as="h4">
                  {tFactors(`${item.key}.name`)}
                </Text>
                <Text variant="bodySm">
                  {tFactors(`${item.key}.description`)}
                </Text>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};
