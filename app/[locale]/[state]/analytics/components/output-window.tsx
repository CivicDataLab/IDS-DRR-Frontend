'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import { InfoSquare } from '@/components/InfoCircle';
import { useQuery } from '@tanstack/react-query';
import { useQueryState } from 'next-usequerystate';
import { Button, Icon, Text, Tooltip } from 'opub-ui';

import { documentationLink, Factors, RiskText } from '@/config/consts';
import { ANALYTICS_TIME_PERIODS } from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, formatDateString } from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import {
  formatNumberToIndianSystem,
  getFactorNameBySlug,
  getLatestDate,
} from '../utils/utils';
import { ScoreInfo } from './revenue-circle-accordion';
import styles from './styles.module.scss';

export function OutputWindow({
  data,
  indicatorDescriptions,
  indicator,
  boundary,
  currentState,
  onClose,
}: any) {
  const searchParams = useSearchParams();
  let processedTime = getLatestDate(
    searchParams.get('time-period')?.split(',') || []
  )?.split('-');

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

  const latestTimePeriod =
    timePeriods.data?.getDataTimePeriods[0]?.value ||
    process.env.NEXT_PUBLIC_TIME_PERIOD;

  const timePeriod = processedTime
    ? `${processedTime[0]}_${processedTime[1]}`
    : (latestTimePeriod as string);

  const formattedTimePeriod = formatDateString(timePeriod);
  const region = searchParams.get('district-code') || '';
  const view = searchParams.get('view') || '';

  const RevenueRegion = searchParams.get('revenue-code') || '';
  const isRevenueCircle = Boolean(RevenueRegion && RevenueRegion.length > 0);
  // Sub indicators under "Overall Flood Risk"
  const parentIndicatorSlugs = [
    'risk-score',
    'flood-hazard',
    'exposure',
    'vulnerability',
    'government-response',
  ];
  const isParentIndicator = Boolean(
    indicator && parentIndicatorSlugs.includes(indicator)
  );

  const [revenueCode, setDistrictCode] = useQueryState('district-code');
  const [districtCode, setRevenueCode] = useQueryState('revenue-code');

  const districtData = data?.filter((item: any) =>
    Object.hasOwnProperty.call(item, 'district')
  );

  // To filter out revenue circles from the district data boundary
  const DataBasedOnBoundary = !RevenueRegion ? districtData : data;

  const RegionName = !RevenueRegion
    ? districtData[0]?.district
    : data[0]?.[data[0].type.replace(/\s+/g, '-')];

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  function getDescription(indicatorSlug: string) {
    const descriptionObject = indicatorDescriptions.find(
      (desc: { slug: string }) => desc.slug === indicatorSlug
    );
    return descriptionObject ? descriptionObject.long_description : 'NA';
  }

  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={'#000'} />,
    vulnerability: <Vulnerability color={'#000'} />,
    'flood-hazard': <FloodHazard color={'#000'} />,
    exposure: <Exposure color={'#000'} />,
    'government-response': <GovtResponse color={'#000'} />,
  };

  const colorMap: { [key: number]: string } = {
    1: 'text-mapRiskVeryLow',
    2: 'text-mapRiskLow',
    3: 'text-mapRiskMedium',
    4: 'text-mapRiskHigh',
    5: 'text-mapRiskVeryHigh',
  };

  const [isExpanded, setIsExpanded] = React.useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // Toggle expanded state
  };

  return (
    <>
      <MediaRendering minWidth="1024" maxWidth={null}>
        {/* window  */}
        <aside
          className={cn(
            'p-4',
            'bg-surfaceDefault shadow-basicMd',
            'shadow-inset z-1 hidden min-w-[420px] max-w-[450px] shrink-0 md:block',
            'overflow-y-auto border-r-1 border-solid border-borderSubdued',
            styles.Overlay,
            region !== null &&
              region.length > 0 &&
              view === 'map' &&
              styles.OverlayActive
          )}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <Button
              className="self-start"
              onClick={() => {
                (!RevenueRegion && setDistrictCode(null),
                  RevenueRegion && setRevenueCode(null));
              }}
              kind="tertiary"
            >
              <Icon source={Icons.back} />
            </Button>
            <Button
              onClick={onClose}
              kind="tertiary"
              aria-label="Close details"
            >
              <Icon source={Icons.cross} />
            </Button>
          </div>

          {RevenueRegion &&
            DataBasedOnBoundary &&
            DataBasedOnBoundary.length > 0 &&
            DataBasedOnBoundary[0] && (
              <>
                <Text className="uppercase" variant="bodyLg">
                  {DataBasedOnBoundary[0]['district']} District
                </Text>
                <br />
                <div className="h-2"></div>
              </>
            )}

          {(data.length === 1 || districtData.length === 1) && (
            <Text
              className=" uppercase "
              variant="headingLg"
              fontWeight="semibold"
            >
              {RegionName}{' '}
              {RevenueRegion ? currentState.child_type : 'District'}
            </Text>
          )}
          <div className="flex items-center justify-between self-stretch">
            <div className="mt-4 flex items-center gap-4">
              <Text variant="bodyMd" color="subdued" fontWeight="regular">
                {indicator === 'government-response' ||
                indicator.includes('fy-cumsum')
                  ? `Cumulative for the financial year till ${formattedTimePeriod}`
                  : `Calculated for ${formattedTimePeriod}`}
              </Text>
            </div>
          </div>
          {/* //--------  */}
          <section className="mt-4">
            {DataBasedOnBoundary.map((data: any, index: any) => (
              <div key={`boundary-${index}`} className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {IconMap[indicator]}
                    <Text
                      variant="bodyLg"
                      fontWeight={
                        indicator === 'risk-score' ? 'bold' : 'regular'
                      }
                    >
                      {getFactorNameBySlug(indicatorDescriptions, indicator)}
                    </Text>
                    {!Factors.includes(indicator) && (
                      <Text variant="bodyMd" fontWeight="bold">
                        {/* {data[indicator]['value']} */}
                        {formatNumberToIndianSystem(data[indicator]['value'])}
                      </Text>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Text
                      className={cn(
                        colorMap[parseInt(data[indicator]['value'])],
                        'uppercase'
                      )}
                      fontWeight="semibold"
                    >
                      {Factors.includes(indicator) &&
                        RiskText[parseInt(data[indicator]['value'])][
                          'indicatorText'
                        ]}
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
                {Factors.includes(indicator) && (
                  <div className="mt-5 flex flex-col gap-2">
                    <Text className="text-baseGraySlateSolid11">
                      Some of the indicators contributing to{' '}
                      {getFactorNameBySlug(indicatorDescriptions, indicator)}{' '}
                      are
                    </Text>
                    <OtherFactorScores
                      factorData={indicatorDescriptions}
                      data={data}
                      boundary={boundary}
                      IconMap={IconMap}
                      indicator={indicator}
                      indicatorDescription={indicatorDescriptions}
                      getDescription={getDescription}
                    />
                  </div>
                )}
              </div>
            ))}
            <div className="px-1 py-3">
              {/* TODO: Add the source data link here dynamically from api */}
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
                  {isParentIndicator
                    ? 'Read the Documentation'
                    : 'Explore Source Data'}
                </Text>
                <Icon
                  source={Icons.IconArrowUpRight}
                  className="text-[#3E7844]"
                />
              </a>
            </div>
          </section>
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1024">
        {/* MOBILE  */}

        {view === 'map' && (
          <>
            {/* Apply conditional class for visibility */}
            <div
              className={cn(
                'pb-2 pl-4 pr-4',
                'bg-surfaceDefault shadow-basicMd',
                // 'shadow-inset min-w-[373px] max-w-[380px] shrink-0  flex-row md:block md:w-[90%]',
                'shadow-inset w-full shrink-0 flex-row md:block md:w-[90%]',
                'overflow-y-auto border-b-1 border-l-1 border-r-1 border-solid border-borderSubdued',
                styles.mobileOverlay,
                region !== null &&
                  region.length > 0 &&
                  styles.mobileOverlayActive,
                region == null ? 'hidden' : '',
                // region == null && 'hidden', // Use the 'hidden' class to hide the aside when it's not visible
                isExpanded && styles.expandedOverlay
              )}
              style={{ zIndex: '100000' }}
            >
              {/* <div className=" flex items-center">swipe up</div> */}
              {/* <div className="mb-2 flex items-center justify-center"> */}
              <div
                className="fixed left-0 right-0 m-0 flex h-[4%] w-full items-center justify-center bg-baseGreenSolid5"
                style={{ zIndex: '100008' }}
              >
                <Button onClick={toggleExpand} kind="tertiary">
                  {isExpanded ? (
                    <Icon source={Icons.down} /> // Swipe Down Icon
                  ) : (
                    <Icon source={Icons.up} /> // Swipe Up Icon
                  )}
                </Button>
              </div>
              {/* <div className="flex items-center gap-2"> */}
              <div className=" mt-14 flex h-[4%] items-center justify-between">
                <div className="flex h-[4%] items-center gap-4">
                  <Button
                    onClick={() => {
                      setDistrictCode(null);
                      setRevenueCode(null);
                      isExpanded ? setIsExpanded(false) : '';
                    }}
                    kind="tertiary"
                  >
                    <Icon source={Icons.back} />
                  </Button>

                  {(data.length === 1 || districtData.length === 1) && (
                    <Text
                      className="uppercase"
                      variant="headingLg"
                      fontWeight="semibold"
                    >
                      {RegionName}{' '}
                      {RevenueRegion ? currentState.child_type : 'District'}
                    </Text>
                  )}
                </div>
                {onClose && (
                  <Button
                    onClick={onClose}
                    kind="tertiary"
                    aria-label="Close details"
                  >
                    <Icon source={Icons.cross} />
                  </Button>
                )}
              </div>

              {/* </div> */}
              <div className="flex items-center justify-between self-stretch">
                <div className="mt-4 flex items-center gap-4">
                  {(districtCode !== null || revenueCode !== null) && (
                    <Text variant="bodyMd" color="subdued" fontWeight="regular">
                      Cumulative till {formattedTimePeriod}
                    </Text>
                  )}
                </div>
              </div>

              {/* Aside content */}
              <section className="mt-4">
                {region !== null &&
                  region.length > 0 &&
                  DataBasedOnBoundary.map((data: any, index: any) => (
                    <div key={`boundary-${index}`} className="mb-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {IconMap[indicator]}
                          <Text
                            variant="bodyLg"
                            fontWeight={
                              indicator === 'risk-score' ? 'bold' : 'regular'
                            }
                          >
                            {getFactorNameBySlug(
                              indicatorDescriptions,
                              indicator
                            )}
                          </Text>
                          {!Factors.includes(indicator) && (
                            <Text variant="bodyMd" fontWeight="bold">
                              {formatNumberToIndianSystem(
                                data[indicator]['value']
                              )}
                              {/* {data[indicator]['value']} */}
                            </Text>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <Text
                            className={cn(
                              colorMap[parseInt(data[indicator]['value'])],
                              'uppercase'
                            )}
                            fontWeight="semibold"
                          >
                            {Factors.includes(indicator) &&
                              RiskText[parseInt(data[indicator]['value'])][
                                'indicatorText'
                              ]}
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
                      {Factors.includes(indicator) && (
                        <div className="mt-5 flex flex-col gap-2">
                          <Text className="text-baseGraySlateSolid11">
                            Some of the indicators contributing to{' '}
                            {getFactorNameBySlug(
                              indicatorDescriptions,
                              indicator
                            )}{' '}
                            are
                          </Text>
                          <OtherFactorScores
                            factorData={indicatorDescriptions}
                            data={data}
                            boundary={boundary}
                            IconMap={IconMap}
                            indicator={indicator}
                            getDescription={getDescription}
                          />
                        </div>
                      )}
                    </div>
                  ))}
              </section>
            </div>
          </>
        )}
      </MediaRendering>
    </>
  );
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
  IconMap,
}: any) {
  const clonedData = structuredClone(data);
  delete clonedData[boundary];
  delete clonedData[`${boundary}-code`];
  delete clonedData[indicator];
  delete clonedData['district'];
  delete clonedData['district-code'];

  const FactorVariables = Object.keys(clonedData);

  // TODO: Change the filteration to the factor specific structure for it to work with data having objects
  return FactorVariables.filter(
    (scoreType: any) => typeof data[scoreType] === 'object'
  ).map((scoreType) => (
    <div key={scoreType} className=" flex items-center gap-4">
      {/* //change  */}
      <div className="flex-shrink-0">
        <div className="h-6 w-6">{IconMap[scoreType]}</div>
      </div>
      {indicator === 'risk-score' && (
        <Text className="shrink-1 min-w-[200px]">
          {getFactorNameBySlug(factorData, scoreType)}
        </Text>
      )}
      <ScoreInfo
        indicator={indicator}
        label={
          indicator === 'risk-score'
            ? getFactorNameBySlug(factorData, scoreType)
            : data?.[scoreType]['title']
        }
        value={data?.[scoreType]['value']}
      />{' '}
      <Tooltip
        content={getDescription(scoreType) || 'No description available'}
      >
        <div>
          <InfoSquare color="#6A6A6A" />
        </div>
      </Tooltip>
    </div>
  ));
}
