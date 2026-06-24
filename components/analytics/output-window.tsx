'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useFormatNumber } from '@/hooks/use-format-number';
import { useQuery } from '@tanstack/react-query';
import { useFormatter, useTranslations } from 'next-intl';
import { useQueryState } from 'next-usequerystate';
import { Button, Icon, Text, Tooltip } from 'opub-ui';

import {
  ANALYTICS_TIME_PERIODS,
  type Indicator,
  type State,
} from '@/config/graphql/analaytics-queries';
import { docsLink } from '@/config/site';
import { Factors } from '@/lib/analytics';
import { getFactorNameBySlug, getLatestDate } from '@/lib/analytics/utils';
import { isRootRiskIndicator } from '@/lib/analytics/root-indicator';
import { GraphQL } from '@/lib/api';
import { type JsonScalar } from '@/lib/types';
import { cn, parsePeriodString } from '@/lib/utils';
import {
  Exposure,
  FloodHazard,
  GovtResponse,
  RiskScore,
  Vulnerability,
} from '@/components/FactorIcons';
import Icons from '@/components/icons';
import { InfoSquare } from '@/components/InfoCircle';
import { MediaRendering } from '@/components/media-rendering';
import { useAnalyticsModule } from '@/hooks/use-analytics-module';
import { ScoreInfo } from './score-info';
import styles from './styles.module.scss';

export function OutputWindow({
  data,
  indicatorDescriptions,
  indicator,
  boundary,
  currentState,
  onClose,
}: {
  data: JsonScalar;
  indicatorDescriptions: Indicator[] | undefined;
  indicator: string;
  boundary: string;
  currentState: State;
  onClose?: () => void;
}) {
  const t = useTranslations('analytics.detail');
  const tCommon = useTranslations('common');
  const tRisk = useTranslations('analytics.risk');
  const tAnalytics = useTranslations('analytics');
  const format = useFormatter();
  const formatNumber = useFormatNumber();
  const searchParams = useSearchParams();
  const processedTime = getLatestDate(
    searchParams.get('time-period')?.split(',') || []
  )?.split('-');

  const sourceDataLink = useMemo(() => {
    if ((indicatorDescriptions?.length ?? 0) > 0) {
      return indicatorDescriptions?.[0]?.IDS_dataSpace;
    }
    return undefined;
  }, [indicatorDescriptions]);

  const analyticsModule = useAnalyticsModule();

  const timePeriods = useQuery({
    queryKey: [`timePeriods`, analyticsModule],
    queryFn: () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS,
        { module: analyticsModule }
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

  const timePeriodDate = parsePeriodString(timePeriod);
  const formattedTimePeriod = timePeriodDate
    ? format.dateTime(timePeriodDate, 'monthYearShort')
    : '';
  const region = searchParams.get('district-code') || '';
  const view = searchParams.get('view') || '';
  const isMapView = !view || view === 'map';

  const RevenueRegion = searchParams.get('revenue-code') || '';
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

  const districtData = data?.filter((item: JsonScalar) =>
    Object.hasOwnProperty.call(item, 'district')
  );

  // To filter out revenue circles from the district data boundary
  const DataBasedOnBoundary = !RevenueRegion ? districtData : data;

  // `data` may briefly be [] during a district-to-subdistrict transition.
  // The optional chaining yields undefined instead of throwing on `replace()`.
  const RegionName = !RevenueRegion
    ? districtData?.[0]?.district
    : data?.[0]?.[data?.[0]?.type?.replace(/\s+/g, '-')];

  const [tooltipOpen, setTooltipOpen] = React.useState(false);

  function getDescription(indicatorSlug: string) {
    const descriptionObject = indicatorDescriptions?.find(
      (desc) => desc.slug === indicatorSlug
    );
    return descriptionObject
      ? descriptionObject.long_description
      : tCommon('na');
  }

  const IconMap: { [key: string]: React.ReactNode } = {
    'risk-score': <RiskScore color={'#000'} />,
    'heat-risk-score': <RiskScore color={'#000'} />,
    vulnerability: <Vulnerability color={'#000'} />,
    'flood-hazard': <FloodHazard color={'#000'} />,
    'heat-hazard': <FloodHazard color={'#000'} />,
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
              isMapView &&
              styles.OverlayActive
          )}
        >
          <div className="mb-2 flex items-start justify-between gap-2">
            <Button
              className="self-start"
              onClick={() => {
                if (RevenueRegion) {
                  setRevenueCode(null);
                } else {
                  setDistrictCode(null);
                }
              }}
              kind="tertiary"
            >
              <Icon source={Icons.back} />
            </Button>
            <Button onClick={onClose} kind="tertiary" aria-label={t('close')}>
              <Icon source={Icons.cross} />
            </Button>
          </div>

          {RevenueRegion &&
            DataBasedOnBoundary &&
            DataBasedOnBoundary.length > 0 &&
            DataBasedOnBoundary[0] && (
              <>
                <Text className="uppercase" variant="bodyLg">
                  {tAnalytics('divisionHeading', {
                    name: DataBasedOnBoundary[0]['district'],
                  })}
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
              {RevenueRegion
                ? tAnalytics('subdivisionHeading', {
                    name: RegionName,
                    type: currentState.child_type ?? '',
                  })
                : tAnalytics('divisionHeading', { name: RegionName })}
            </Text>
          )}
          <div className="flex items-center justify-between self-stretch">
            <div className="mt-4 flex items-center gap-4">
              <Text variant="bodyMd" color="subdued" fontWeight="regular">
                {indicator === 'government-response' ||
                indicator.includes('fy-cumsum')
                  ? t('cumulativeFiscalYearUntil', {
                      date: formattedTimePeriod,
                    })
                  : t('calculatedFor', { date: formattedTimePeriod })}
              </Text>
            </div>
          </div>
          {/* //--------  */}
          <section className="mt-4">
            {DataBasedOnBoundary.map((data: JsonScalar, index: number) => (
              <div key={`boundary-${index}`} className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {IconMap[indicator]}
                    <Text
                      variant="bodyLg"
                      fontWeight={
                        isRootRiskIndicator(indicator) ? 'bold' : 'regular'
                      }
                    >
                      {getFactorNameBySlug(indicatorDescriptions, indicator)}
                    </Text>
                    {!Factors.includes(indicator) && (
                      <Text variant="bodyMd" fontWeight="bold">
                        {/* {data[indicator]['value']} */}
                        {formatNumber(data[indicator]['value'])}
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
                        tRisk(
                          String(
                            parseInt(data[indicator]['value'])
                          ) as RiskLevel
                        )}
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
                      {t('contributingIndicators', {
                        name: getFactorNameBySlug(
                          indicatorDescriptions,
                          indicator
                        ),
                      })}
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
            {(docsLink || (sourceDataLink && !isParentIndicator)) && (
              <div className="px-1 py-3">
                {/* TODO: Add the source data link here dynamically from api */}
                <a
                  href={
                    isParentIndicator ? docsLink : (sourceDataLink ?? docsLink)
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg flex h-12 w-full items-center justify-between gap-2 rounded-2 bg-[#F6F6F7] px-3 py-3"
                >
                  <Text
                    variant="bodyMd"
                    fontWeight="semibold"
                    className="text-[#3E7844]"
                  >
                    {isParentIndicator || !sourceDataLink
                      ? t('docsLink')
                      : t('sourceLink')}
                  </Text>
                  <Icon
                    source={Icons.IconArrowUpRight}
                    className="text-[#3E7844]"
                  />
                </a>
              </div>
            )}
          </section>
        </aside>
      </MediaRendering>
      <MediaRendering minWidth={null} maxWidth="1024">
        {/* MOBILE  */}

        {isMapView && (
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
                      if (isExpanded) {
                        setIsExpanded(false);
                      }
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
                      {RevenueRegion
                        ? tAnalytics('subdivisionHeading', {
                            name: RegionName,
                            type: currentState.child_type ?? '',
                          })
                        : tAnalytics('divisionHeading', { name: RegionName })}
                    </Text>
                  )}
                </div>
                {onClose && (
                  <Button
                    onClick={onClose}
                    kind="tertiary"
                    aria-label={t('close')}
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
                      {t('cumulativeUntil', { date: formattedTimePeriod })}
                    </Text>
                  )}
                </div>
              </div>

              {/* Aside content */}
              <section className="mt-4">
                {region !== null &&
                  region.length > 0 &&
                  DataBasedOnBoundary.map((data: JsonScalar, index: number) => (
                    <div key={`boundary-${index}`} className="mb-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {IconMap[indicator]}
                          <Text
                            variant="bodyLg"
                            fontWeight={
                              isRootRiskIndicator(indicator)
                                ? 'bold'
                                : 'regular'
                            }
                          >
                            {getFactorNameBySlug(
                              indicatorDescriptions,
                              indicator
                            )}
                          </Text>
                          {!Factors.includes(indicator) && (
                            <Text variant="bodyMd" fontWeight="bold">
                              {formatNumber(data[indicator]['value'])}
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
                              tRisk(
                                String(
                                  parseInt(data[indicator]['value'])
                                ) as RiskLevel
                              )}
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
                            {t('contributingIndicators', {
                              name: getFactorNameBySlug(
                                indicatorDescriptions,
                                indicator
                              ),
                            })}
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

function OtherFactorScores({
  factorData,
  data,
  boundary,
  indicator,
  getDescription,
  IconMap,
}: {
  factorData: Indicator[] | undefined;
  data: JsonScalar;
  boundary: string;
  indicator: string;
  getDescription: (slug: string) => string | null | undefined;
  IconMap: { [key: string]: React.ReactNode };
}) {
  const clonedData = structuredClone(data);
  delete clonedData[boundary];
  delete clonedData[`${boundary}-code`];
  delete clonedData[indicator];
  delete clonedData['district'];
  delete clonedData['district-code'];

  const FactorVariables = Object.keys(clonedData);

  // TODO: Change the filteration to the factor specific structure for it to work with data having objects
  return FactorVariables.filter(
    (scoreType) => typeof data[scoreType] === 'object'
  ).map((scoreType) => (
    <div key={scoreType} className=" flex items-center gap-4">
      {/* //change  */}
      <div className="flex-shrink-0">
        <div className="h-6 w-6">{IconMap[scoreType]}</div>
      </div>
      {isRootRiskIndicator(indicator) && (
        <Text className="shrink-1 min-w-[200px]">
          {getFactorNameBySlug(factorData, scoreType)}
        </Text>
      )}
      <ScoreInfo
        indicator={indicator}
        label={
          isRootRiskIndicator(indicator)
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
