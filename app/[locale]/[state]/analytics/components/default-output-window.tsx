import React from 'react';
import {
  Ellipse,
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import { Button, Divider, Icon, ProgressBar, Text } from 'opub-ui';

import {
  documentationLink,
  learnMoreLink,
  RiskColorMap,
} from '@/config/consts';
import { cn, handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import NavLink from '@/components/nav-link';
import styles from './styles.module.scss';

export function DefaultWindow({
  chartData,
  indicatorDescriptions,
  indicator,
  boundary,
  onClose,
}: any) {
  const list: { title: string; slug: string; description: string }[] = [];

  if (indicatorDescriptions) {
    indicatorDescriptions.forEach(
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
            'shadow-inset z-1 hidden min-w-[420px] max-w-[450px] shrink-0 md:block',
            'overflow-y-auto border-r-1 border-solid border-borderSubdued',
            styles.Overlay,
            styles.OverlayActive
          )}
        >
          {/* State-level header with only close button (no icon/title) */}
          <div className="mb-1 flex items-start justify-end ">
            <Button
              onClick={onClose}
              kind="tertiary"
              aria-label="Close details"
            >
              <Icon source={Icons.cross} />
            </Button>
          </div>

          {/* <Divider className="mt-2" /> */}
          <AboutIndicator IndicatorData={list} onClose={onClose} />
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        <div className="h-full bg-surfaceDefault px-4">
          {/* <RenderSidebarContent /> */}
        </div>
      </MediaRendering>
    </>
  );
}

export const AboutIndicator = ({
  IndicatorData,
  onClose,
}: {
  IndicatorData: any;
  onClose?: () => void;
}) => {
  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={'#000000'} />,
    vulnerability: <Vulnerability color={'#000000'} />,
    'flood-hazard': <FloodHazard color={'#000000'} />,
    exposure: <Exposure color={'#000000'} />,
    'government-response': <GovtResponse color={'#000000'} />,
  };
  return (
    <div className="mx-1 mb-5 flex flex-col">
      <Text variant="headingMd" fontWeight="bold" className="mb-5 uppercase">
        Know your risk indicators
      </Text>
      <div className="flex flex-row items-start gap-2">
        <div className="flex flex-col">
          <Text variant="headingMd" fontWeight="semibold">
            Overall Flood Risk
          </Text>
          <Text color="subdued">
            Risk of disasters is a function of - hazard vulnerability, exposure
            & coping capacity
          </Text>
        </div>
        <div className="flex h-full items-start justify-start">
          <Icon
            source={Icons.IconSwimming}
            // color={'default'}
            stroke={2}
            size={28}
            className="text-[#000]"
          />
        </div>
      </div>
      <Text className="my-4" variant="bodyLg">
        Overall Flood Risk is calculated using:
      </Text>

      <div className="flex flex-col items-start gap-4 p-3">
        {IndicatorData.slice(1)?.map((indicator: any, index: number) => (
          <div
            key={indicator.slug ?? index}
            className="flex flex-row items-start gap-2"
          >
            <Text variant="headingMd" fontWeight="semibold">
              {index + 1 >= 1 && index + 1 < 10
                ? `0${index + 1}.`
                : `${index + 1}.`}
            </Text>
            <div className="flex flex-row items-start gap-4">
              <div className="flex flex-col gap-1">
                <Text variant="headingMd" fontWeight="semibold">
                  {indicator.title}
                </Text>
                <Text color="subdued">{indicator.description}</Text>
              </div>
              <div className="flex h-full items-start justify-start">
                {IconMap[indicator.slug] || <Ellipse color="#000000" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Read the user guide CTA */}
      <div className="mt-4 flex w-full flex-col justify-end gap-4">
        {/* TODO: Add the user guide link here */}
        <a
          // href={'#'}
          // onClick={(event: any) => handleRedirect(event, learnMoreLink)}
          // target="_blank"
          className="rounded-lg flex h-12 w-full items-center justify-between gap-2 rounded-2 bg-[#F6F6F7] px-3 py-3"
        >
          <Text
            variant="bodyMd"
            fontWeight="semibold"
            className="text-[#3E7844]"
          >
            Read the user guide
          </Text>
          <Icon source={Icons.IconArrowUpRight} className="text-[#3E7844]" />
        </a>
        <a
          href={documentationLink}
          // onClick={(event: any) => handleRedirect(event, learnMoreLink)}
          target="_blank"
          className="rounded-lg flex h-12 w-full items-center justify-between gap-2 rounded-2 bg-[#F6F6F7] px-3 py-3"
        >
          <Text
            variant="bodyMd"
            fontWeight="semibold"
            className="text-[#3E7844]"
          >
            Read the documentation
          </Text>
          <Icon source={Icons.IconArrowUpRight} className="text-[#3E7844]" />
        </a>
      </div>
    </div>
  );
};

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

  return (
    <div className="flex flex-col">
      <div className="mb-2 mt-3 flex items-center">
        {IconMap[slug] || <Ellipse color="#000000" />}
        <Text fontWeight="bold" variant="headingMd" className="pl-2">
          {title}
        </Text>
        {slug !== 'risk-score' && (
          <NavLink
            className="ml-auto flex gap-2"
            href={`/datasets/?category=${title}`}
          >
            <Icon source={Icons.link} color="interactive" />
            <Text color="interactive">Link to the datasets</Text>
          </NavLink>
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
