import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Icon, Text } from 'opub-ui';

import { AnalyticsURL, DatasetsURL } from '@/config/consts';
import { ANALYTICS_TIME_PERIODS } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import Icons from '@/components/icons';

const content = [
  {
    district: 'Analytics Dashboard',
    scheme: 'Explore data model insight for all districts and revenue circles',
    link: AnalyticsURL,
  },
  {
    district: 'Dataset Explorer',
    scheme:
      'Explore datasets on meteorological and demographic factors, and DRR tenders',
    link: DatasetsURL,
  },
  {
    district: 'Tender Data Dashboard',
    scheme: 'Go to our dashboard for Assam DRR tenders data',
    link: '#',
  },
];

export const QuickLinks = () => {
  const timePeriods = useQuery({
    queryKey: [`timePeriods`],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS
      ),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const latestTimePeriod = timePeriods.data?.getDataTimePeriods[0]?.value;

  const linkWithTimePeriod = `${AnalyticsURL}&time-period=${latestTimePeriod}`;

  return (
    <section className="mt-6 items-start p-4 md:mt-10">
      <Text variant="headingLg" fontWeight="semibold" color="subdued">
        Quick Links
      </Text>

      <div className="w-340 mt-4 flex gap-4 md:gap-4">
        {content.map((item, index) => (
          <Link
            key={item.district + index}
            href={
              item.district === 'Analytics Dashboard'
                ? linkWithTimePeriod
                : item.link
            }
            className="flex grow flex-row gap-4 rounded-05 bg-surfaceDefault p-4 shadow-elementCard md:basis-1/3 lg:basis-1/4"
          >
            <div className="flex flex-col items-start justify-between gap-4">
              <Text variant="headingLg" fontWeight="medium">
                {item.district}kjkjnkjnkjn
              </Text>
              <Text variant="headingSm" color="subdued" fontWeight="regular">
                {item.scheme}
              </Text>
            </div>

            <div className="flex items-start justify-end gap-2">
              <Text color="interactive">Explore</Text>
              <Icon source={Icons.right} color="interactive" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
