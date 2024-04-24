import React from 'react';
import Link from 'next/link';
import {
  Ellipse,
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/public/FactorIcons';
import { Divider, Icon, ProgressBar, Text } from 'opub-ui';

import { RiskColorMap } from '@/config/consts';
import { cn, deSlugify } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import { DownloadReport } from './download-report';

export function SidebarDefaultLayout({
  chartData,
  indicatorDescriptions,
  indicator,
  boundary,
}: any) {
  const list: { title: string; slug: string; description: string }[] = [];

  const color = '#000000';

  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={color} />,
    vulnerability: <Vulnerability color={color} />,
    'flood-hazard': <FloodHazard color={color} />,
    exposure: <Exposure color={color} />,
    'government-response': <GovtResponse color={color} />,
  };

  if (indicatorDescriptions) {
    indicatorDescriptions.map(
      (item: {
        name: string;
        slug: string;
        long_description?: string;
        short_description: string;
      }) => {
        list.push({
          title: item?.name,
          slug: item?.slug,
          description:
            item?.short_description || item?.long_description || 'NA',
        });
      }
    );
  }

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        <aside
          className={cn(
            'p-4 pr-8',
            'bg-surfaceDefault shadow-basicMd',
            'shadow-inset z-1 hidden w-[500px] shrink-0 md:block',
            'border-r-1 border-solid border-borderSubdued',
            'overflow-y-auto'
          )}
        >
          <div className="mb-5 mt-4 flex items-center justify-between">
            <Text
              variant="heading2xl"
              fontWeight="regular"
              className="flex items-center gap-2"
            >
              {IconMap[indicator || 'risk-score']}
              {deSlugify(indicator)}
            </Text>
            <DownloadReport />
          </div>

          <Divider className="mt-2" />
          <RenderSidebarContent />
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="767">
        <div className="h-full bg-surfaceDefault p-4 shadow-basicMd">
          <Text
            variant="headingXl"
            fontWeight="semibold"
            className="flex items-center gap-2"
          >
            Data Insights
          </Text>
          <RenderSidebarContent />
        </div>
      </MediaRendering>
    </>
  );

  function RenderSidebarContent() {
    return (
      <>
        <div className="mb-5 mt-5 flex flex-col">
          <Text variant="headingMd" fontWeight="bold" className=" mt-3">
            HIGH RISK DISTRICTS
          </Text>
          {chartData && (
            <div className="flex flex-col pt-3">
              {chartData
                .slice(0, 5)
                .map(
                  (
                    item: { [x: string]: string },
                    index: React.Key | null | undefined
                  ): any => (
                    <DistrictBar
                      key={index}
                      district={item[boundary]}
                      value={item[indicator]}
                    />
                  )
                )}
            </div>
          )}
          <Text variant="headingMd" fontWeight="bold" className="mt-4">
            LEARN MORE
          </Text>
          <div className="mt-2">
            {list.map((indicator, index) => (
              <IndicatorDescription
                key={index}
                title={indicator.title}
                slug={indicator.slug}
                desc={indicator.description}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
}

export const DistrictBar = ({
  district,
  value,
}: {
  district: string;
  value: string;
}) => {
  const score = parseInt(value);
  return (
    <div className="mb-1 flex items-center gap-2 pl-20">
      <div className=" basis-1/4">
        <Text variant="bodySm" fontWeight="medium">
          {district}
        </Text>
      </div>

      <div className=" basis-2/4">
        <ProgressBar
          size="small"
          customColor={RiskColorMap[score]}
          value={(score / 5) * 100}
        />
      </div>
    </div>
  );
};

export const IndicatorDescription = ({
  title,
  slug,
  desc,
}: {
  title: string;
  slug: string;
  desc: string;
}) => {
  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={'#000000'} />,
    vulnerability: <Vulnerability color={'#000000'} />,
    'flood-hazard': <FloodHazard color={'#000000'} />,
    exposure: <Exposure color={'#000000'} />,
    'government-response': <GovtResponse color={'#000000'} />,
  };

  const CategoryMap: { [key: string]: string } = {
    'flood-hazard': 'Hazard',
    'government-response': 'Government Response',
    exposure: 'Exposure',
    vulnerability: 'Vulnerability',
  };

  return (
    <div className="flex flex-col">
      <div className="mb-2 mt-3 flex items-center">
        {IconMap[slug] || <Ellipse color="#000000" />}
        <Text fontWeight="bold" variant="headingMd" className="pl-2">
          {title}
        </Text>
        {Object.keys(CategoryMap).includes(slug) && (
          <Link
            className="ml-auto flex gap-2"
            href={`/datasets/?category=${CategoryMap[slug]}`}
          >
            <Icon source={Icons.link} color="interactive" />
            <Text color="interactive">Link to the datasets</Text>
          </Link>
        )}
      </div>
      <Text>{desc}</Text>
      {slug === 'government-response' && (
        <a
          className="mt-2 flex gap-2"
          target="_blank"
          href={
            'https://superset.civicdatalab.in/superset/dashboard/flood-tenders-assam/ '
          }
        >
          <Text color="interactive">View procurement data dashboard</Text>
          <Icon source={Icons.externalLink} color="interactive" />
        </a>
      )}
    </div>
  );
};
