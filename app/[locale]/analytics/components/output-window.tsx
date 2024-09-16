'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useWindowSize } from '@/hooks/use-window-size';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/public/FactorIcons';
import { InfoSquare } from '@/public/InfoCircle';
import { useQuery } from '@tanstack/react-query';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Divider,
  ProgressBar,
  Text,
  Tooltip,
  useScreenshot,
} from 'opub-ui';

import { RiskColorMap } from '@/config/consts';
import { ANALYTICS_TIME_TRENDS } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, deSlugify, formatDateString } from '@/lib/utils';
import { MediaRendering } from '@/components/media-rendering';
import { DownloadReport } from './download-report';
import { RevenueCircle, ScoreInfo } from './revenue-circle-accordion';
import styles from './styles.module.scss';
import { TimeTrends } from './time-trends';

export function OutputWindow({
  data,
  indicatorDescriptions,
  indicator,
  boundary,
}: any) {
  const searchParams = useSearchParams();
  if (!process.env.NEXT_PUBLIC_TIME_PERIOD) {
    throw new Error('TIME_PERIOD is not defined');
  }
  const DEFAULT_TIME_PERIOD: string = process.env.NEXT_PUBLIC_TIME_PERIOD;
  const timePeriod = searchParams.get('time-period') || DEFAULT_TIME_PERIOD;
  const formattedTimePeriod = formatDateString(timePeriod);
  const region = searchParams.get('region');

  const DEFAULT_PERIOD = '3M';

  const { width, height } = useWindowSize();

  const items = [
    {
      value: '3M',
      label: '3 months',
    },
    {
      value: '1Y',
      label: '1 year',
    },
    {
      value: 'ALL',
      label: 'All Data',
    },
  ];

  const [period, setPeriod] = React.useState(items[0].value || DEFAULT_PERIOD);

  const chartData = useQuery(
    [`chartData_${boundary}_${indicator}_${timePeriod}_${region}_${period}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_TRENDS,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriod, period: period },
          geoFilter: { code: region?.split(',') },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const factorData: { title: string; slug: string; description: string }[] = [];

  if (indicatorDescriptions) {
    indicatorDescriptions.map(
      (item: {
        name: string;
        slug: string;
        long_description?: string;
        short_description: string;
      }) => {
        factorData.push({
          title: item?.name,
          slug: item?.slug,
          description:
            item?.short_description || item?.long_description || 'NA',
        });
      }
    );
  }

  const districtData = data.filter((item: any) =>
    Object.hasOwnProperty.call(item, 'district')
  );
  // To filter out revenue circles from the district data boundary
  const revenueCircleData = data.filter((item: any) =>
    Object.hasOwnProperty.call(item, 'revenue circle')
  );

  const GeographyMap: { [key: string]: string } = {
    district: 'District',
    'revenue-circle': 'Revenue Circle',
  };

  const DataBasedOnBoundary = boundary === 'district' ? districtData : data;
  const RegionName =
    boundary === 'district'
      ? districtData[0]?.district
      : data[0]?.['revenue-circle'];

  const title = 'IDS DRR';
  const [svgURL, setSvgURL] = React.useState<string>('');
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const { createSvg, svgToPngURL, downloadFile, domToUrl } = useScreenshot();

  async function generateImage() {
    setIsLoading(true);

    const ele = window.document.querySelector('.opub-Tooltip ');

    const dataImgURL = await domToUrl(ele as HTMLElement, {
      width: width,
      height: height,
      backgroundColor: 'white',
    });

    const svg = await createSvg(<Template data={dataImgURL} title={title} />, {
      width: width,
    });
    const dataURL = await svgToPngURL(svg);

    setSvgURL(dataURL);
    setIsLoading(false);
  }
  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  function getDescription(indicatorSlug: string) {
    const descriptionObject = factorData.find(
      (desc: { slug: string }) => desc.slug === indicatorSlug
    );
    return descriptionObject ? descriptionObject.description : 'NA';
  }

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* window  */}
        <aside
          className={cn(
            'p-4',
            'bg-surfaceDefault shadow-basicMd',
            'shadow-inset z-1 hidden min-w-[350px] max-w-[450px] shrink-0 md:block',
            'overflow-y-auto border-r-1 border-solid border-borderSubdued',
            styles.Overlay,
            region !== null && region.length > 0 && styles.OverlayActive
          )}
        >
          <OutputWindowHeader indicator={indicator} factorData={factorData} />
          <Divider className="mt-2" />
          {(data.length === 1 || districtData.length === 1) && (
            <div className=" mb-2 mt-5 flex flex-col">
              <Text variant="heading2xl" fontWeight="regular">
                {RegionName} {GeographyMap[boundary]}
              </Text>
            </div>
          )}
          <div className="flex items-center justify-between self-stretch">
            <div className="mt-4 flex items-center gap-4">
              <Text variant="bodyMd" color="subdued" fontWeight="regular">
                Cumulative till {formattedTimePeriod}
              </Text>

              <Tooltip
                content={
                  <>
                    <Text>{getDescription(indicator)}</Text>
                  </>
                }
                side="right"
                defaultOpen={tooltipOpen}
                open={tooltipOpen}
                onOpenChange={(isOpen) => setTooltipOpen(isOpen)}
              >
                {<InfoSquare color="#6A6A6A" />}
              </Tooltip>
            </div>
          </div>
          {/* //--------  */}

          <section className="mt-4">
            <Accordion type="single" defaultValue="revenue-circle" collapsible>
              <AccordionItem value="revenue-circle" className="border-none">
                {DataBasedOnBoundary.map((data: any, index: any) => (
                  <div key={`boundary-${index}`} className="mb-4">
                    <div className="flex items-center gap-3">
                      <Text variant="bodyLg" fontWeight="bold">
                        {data[boundary]}
                      </Text>

                      <ProgressBar
                        size="small"
                        customColor={
                          RiskColorMap[parseInt(data[indicator]['value'])]
                        }
                        value={(parseInt(data[indicator]['value']) / 5) * 100}
                      />

                      <div>
                        <Text variant="heading2xl">
                          {parseInt(data?.[indicator]['value'])}
                        </Text>
                        /5
                      </div>
                      {/* <AccordionTrigger /> */}
                      {indicator === 'risk-score' ? (
                        <AccordionTrigger />
                      ) : (
                        <div style={{ width: '40px', height: '54px' }}></div>
                      )}
                    </div>
                    <AccordionContent className="px-3 pb-4 md:px-6">
                      <div className="flex flex-col gap-1">
                        <OtherFactorScores
                          factorData={factorData}
                          data={data}
                          boundary={boundary}
                          indicator={indicator}
                          indicatorDescription={indicatorDescriptions}
                          getDescription={getDescription}
                        />
                      </div>
                    </AccordionContent>
                  </div>
                ))}
              </AccordionItem>
            </Accordion>
          </section>

          <Accordion type="single" defaultValue="revenue-circle" collapsible>
            <AccordionItem value="revenue-circle" className="mt-4">
              {districtData.length === 1 && (
                <div className="mt-7">
                  <div className={styles.SidebarAccordionTitle}>
                    <Text variant="bodyLg" fontWeight="bold">
                      REVENUE CIRCLE SCORE
                    </Text>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent
                    className={cn(styles.RevenueBox, 'px-2 pb-4 md:px-4 ')}
                  >
                    <RevenueCircle
                      revenueCircleData={revenueCircleData}
                      factorData={factorData}
                      indicator={indicator}
                      indicatorDescriptions={indicatorDescriptions}
                      getDescription={getDescription}
                    />
                  </AccordionContent>
                </div>
              )}
            </AccordionItem>
            <AccordionItem value="time-trends" className="mt-4">
              <div className="mt-5">
                <div className={styles.SidebarAccordionTitle}>
                  <Text variant="bodyLg" fontWeight="bold">
                    TIME TRENDS
                  </Text>
                  <AccordionTrigger />
                </div>

                <AccordionContent
                  className={cn(styles.TrendsBox, 'px-2 pb-4 md:px-4 ')}
                >
                  <div className="mt-4 flex items-center gap-2">
                    {items.map(({ label, value: itemValue }) => {
                      const isActiveValue = itemValue === period;
                      return (
                        <button
                          key={itemValue}
                          type="button"
                          className={cn(
                            styles.TabItem,
                            isActiveValue && styles.TabItemActive
                          )}
                          onClick={() => {
                            setPeriod(itemValue);
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {chartData.isFetched ? (
                    <TimeTrends
                      chartData={chartData?.data?.getTimeTrends}
                      indicator={indicator}
                      boundary={boundary}
                    />
                  ) : null}
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1023">
        {/* MOBILE  */}
        <div className={cn('p-4', 'bg-surfaceDefault')}>
          <div className="flex items-center justify-items-stretch">
            <div className="mt-4 flex items-center justify-between gap-3">
              <Text variant="bodyMd" color="subdued" fontWeight="regular">
                Cumulative till {formattedTimePeriod}
              </Text>

              <Tooltip
                content={
                  <>
                    <Text>{getDescription(indicator)}</Text>
                  </>
                }
                side="right"
                defaultOpen={tooltipOpen}
                open={tooltipOpen}
                onOpenChange={(isOpen) => setTooltipOpen(isOpen)}
              >
                {<InfoSquare color="#6A6A6A" />}
              </Tooltip>
            </div>
          </div>

          <section className="mt-4">
            <Accordion type="single" defaultValue="revenue-circle" collapsible>
              <AccordionItem value="revenue-circle" className="border-none">
                {DataBasedOnBoundary.map((data: any, index: any) => (
                  <div key={index} className="mb-4">
                    <div className="flex items-center gap-3">
                      <Text variant="bodyLg" fontWeight="bold">
                        {data[boundary]}
                      </Text>

                      <ProgressBar
                        size="small"
                        customColor={
                          RiskColorMap[parseInt(data[indicator]['value'])]
                        }
                        value={(parseInt(data[indicator]['value']) / 5) * 100}
                      />

                      <div>
                        <Text variant="heading2xl">
                          {parseInt(data?.[indicator]['value'])}
                        </Text>
                        /5
                      </div>
                      {/* <AccordionTrigger /> */}
                      {indicator === 'risk-score' ? (
                        <AccordionTrigger />
                      ) : (
                        <div style={{ width: '40px', height: '54px' }}></div>
                      )}
                    </div>
                    <AccordionContent className="px-3 pb-4 md:px-6">
                      <div className="flex flex-col gap-1">
                        <OtherFactorScores
                          factorData={factorData}
                          data={data}
                          boundary={boundary}
                          indicator={indicator}
                          indicatorDescription={indicatorDescriptions}
                          getDescription={getDescription}
                        />
                      </div>
                    </AccordionContent>
                  </div>
                ))}
              </AccordionItem>
            </Accordion>
          </section>
          <Accordion type="single" defaultValue="revenue-circle" collapsible>
            <AccordionItem value="revenue-circle" className="mt-4">
              {districtData.length === 1 && (
                <div className="mt-7">
                  <div className={styles.SidebarAccordionTitle}>
                    <Text variant="bodyLg" fontWeight="bold">
                      REVENUE CIRCLE SCORE
                    </Text>
                    <AccordionTrigger />
                  </div>
                  <AccordionContent
                    className={cn(styles.RevenueBox, 'px-2 pb-4 md:px-4 ')}
                  >
                    <RevenueCircle
                      revenueCircleData={revenueCircleData}
                      factorData={factorData}
                      indicator={indicator}
                      indicatorDescriptions={indicatorDescriptions}
                      getDescription={getDescription}
                    />
                  </AccordionContent>
                </div>
              )}
            </AccordionItem>
            <AccordionItem value="time-trends" className="mt-4">
              <div className="mt-5">
                <div className={styles.SidebarAccordionTitle}>
                  <Text variant="bodyLg" fontWeight="bold">
                    TIME TRENDS
                  </Text>
                  <AccordionTrigger />
                </div>

                <AccordionContent
                  className={cn(styles.TrendsBox, 'px-2 pb-4 md:px-4 ')}
                >
                  <div className="mt-4 flex items-center gap-2">
                    {items.map(({ label, value: itemValue }) => {
                      const isActiveValue = itemValue === period;
                      return (
                        <button
                          key={itemValue}
                          type="button"
                          className={cn(
                            styles.TabItem,
                            isActiveValue && styles.TabItemActive
                          )}
                          onClick={() => {
                            setPeriod(itemValue);
                          }}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                  {chartData.isFetched ? (
                    <TimeTrends
                      chartData={chartData?.data?.getTimeTrends}
                      indicator={indicator}
                      boundary={boundary}
                    />
                  ) : null}
                </AccordionContent>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </MediaRendering>
    </>
  );
}

export function getFactorNameBySlug(factorData: any, slug: string) {
  const factorName = factorData?.filter(
    (factor: { slug: string }) => factor.slug === slug
  );
  return factorName[0]?.title;
}

export function OutputWindowHeader({ factorData, indicator }: any) {
  const color = '#000';
  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={color} />,
    vulnerability: <Vulnerability color={color} />,
    'flood-hazard': <FloodHazard color={color} />,
    exposure: <Exposure color={color} />,
    'government-response': <GovtResponse color={color} />,
  };

  return (
    <div className="mb-5 mt-4 flex items-center justify-between">
      <Text
        variant="heading2xl"
        fontWeight="regular"
        className="flex items-center gap-2"
      >
        {IconMap[indicator || 'risk-score']}
        {getFactorNameBySlug(factorData, indicator)}
      </Text>
      {/* <DownloadReport /> */}
    </div>
  );
}

export function OtherFactorScores({
  factorData,
  data,
  boundary,
  indicator,
  getDescription,
}: any) {
  const clonedData = structuredClone(data);
  delete clonedData[boundary];
  delete clonedData[`${boundary}-code`];
  delete clonedData[indicator];

  const FactorVariables = Object.keys(clonedData);

  return FactorVariables.map((scoreType) => (
    <div key={scoreType} className="ml-3">
      <ScoreInfo
        indicator={indicator}
        label={
          indicator === 'risk-score'
            ? getFactorNameBySlug(factorData, scoreType)
            : data?.[scoreType]['title']
        }
        value={data?.[scoreType]['value']}
        scoreType={scoreType}
        indicatorDescription={getDescription(scoreType)}
      />
    </div>
  ));
}

const Template = ({
  data,
  title,
  props,
}: {
  data: string | null;
  title: string;
  props?: {
    height: number;
    width: number;
  };
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'white',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      <p
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {title}
      </p>
      {data ? (
        <img src={data} {...props} className="w-full" alt="SVG" />
      ) : (
        'Loading...'
      )}
    </div>
  );
};
