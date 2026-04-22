'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLockBody } from '@/hooks/use-lock-body';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Button, Icon, Menu, Text } from 'opub-ui';

import { reportsEnabled } from '@/config/site';
import { cn, copyCurrentURL, downloadStateReport } from '@/lib/utils';
import Icons from '@/components/icons';
import { getLatestDate } from '../utils/utils';
import { OutputWindowComponent } from './analytics-layout';
import { ChartView } from './chart-view';
import { AboutIndicator } from './default-output-window';
import { FactorList } from './factor-list';
import { FilterComp } from './filter-component';
import { MapComponent } from './map-component';
import { TableComponent } from './table-component';

interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string;
}

export function AnalyticsMobileLayout({
  timePeriod,
  indicator,
  mapData,
  revenueMapData,
  districtGeographiesData,
  revenueGeographiesData,
  timePeriods,
  mapIndicatorsData,
  aboutIndicatorsData,
  tableData,
  currentSelectedState,
  statesList,
}: {
  timePeriod: string;
  indicator: string;
  mapData: any;
  revenueMapData: any;
  districtGeographiesData: any;
  revenueGeographiesData: any;
  timePeriods: string[];
  mapIndicatorsData: any;
  aboutIndicatorsData: any;
  tableData: any;
  currentSelectedState: any;
  statesList: Array<any>;
}) {
  //Remove default page scroll to make only the content scrollable
  useLockBody();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unusedStatesList = statesList;

  const [, setDistrictCode] = useQueryState('district-code');
  const [, setRevenueCode] = useQueryState('revenue-code');
  const [timePeriodSelected, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const buttons = [
    {
      icon: Icons.IconMap,
      title: 'Map',
      value: 'map',
      disabled: false,
    },
    ...(process.env.NEXT_PUBLIC_BACKEND_URL
      ? [
          {
            icon: Icons.IconChartBar,
            title: 'Chart',
            value: 'chart',
            disabled: false,
          },
        ]
      : []),
    {
      icon: Icons.IconTableAlias,
      title: 'Table',
      value: 'table',
      disabled: false,
    },
    {
      icon: Icons.IconDots,
      title: 'More',
      value: 'more',
      disabled: false,
    },
  ];

  const [view, setView] = useQueryState(
    'view',
    parseAsString.withDefault('map')
  );
  const searchParams = useSearchParams();
  const region =
    searchParams.get('revenue-code') || searchParams.get('district-code');

  // Initialize dropdown options
  let RevCircleDropdownOptions: Option[] = [{ label: '', value: '' }];
  let DistrictDropDownOption: Option[] = [{ label: '', value: '' }];

  // Populate district dropdown options
  if (districtGeographiesData.data && !districtGeographiesData.isFetching) {
    districtGeographiesData.data?.getDistrictRevCircle?.forEach(
      (geography: { district: string; code: string }) => {
        DistrictDropDownOption.push({
          label: geography.district,
          value: geography.code ? geography.code : 'NA',
        });
      }
    );
  }

  // Populate revenue circle dropdown options
  if (revenueGeographiesData.data && !revenueGeographiesData.isFetching) {
    let rawData = revenueGeographiesData?.data?.getDistrictRevCircle;
    if (rawData) {
      for (const revenueCircle in rawData) {
        const revenueCircles = rawData[revenueCircle];
        revenueCircles.forEach(
          (
            circle: any
            //   {
            //   'revenue-circle': string;
            //   code: string;
            //   district_code: string;
            // }
          ) => {
            RevCircleDropdownOptions.push({
              label:
                circle[currentSelectedState.child_type] ||
                circle['revenue-circle'],
              value: circle.code,
              districtCode: circle.district_code,
            });
          }
        );
      }
    }
  }

  // Sync time period from URL on component mount
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let processedTime = getLatestDate(
      params.get('time-period')?.split(',') || []
    )?.split('-');

    const timePeriod = processedTime
      ? `${processedTime[0]}_${processedTime[1]}`
      : process.env.NEXT_PUBLIC_TIME_PERIOD;

    if (timePeriod) {
      setTimePeriod(timePeriod);
    }
  }, [setTimePeriod]);

  const [activeButton, setActiveButton] = useState(view);
  // const [activeButton, setActiveButton] = useState(''); // State for managing active buttons
  const [filteredTableData] = useState(tableData.data?.tableData);
  const [isOutputPaneOpen, setIsOutputPaneOpen] = useState(true);

  const indicatorListForAbout = React.useMemo(() => {
    const raw = aboutIndicatorsData?.data?.indicators || [];
    const uniqueBySlug = new Map<string, any>();

    for (const item of raw) {
      if (!item?.slug) continue;
      if (!uniqueBySlug.has(item.slug)) {
        uniqueBySlug.set(item.slug, item);
      }
    }

    return Array.from(uniqueBySlug.values()).map((item: any) => ({
      title: item?.name,
      slug: item?.slug,
      description: item?.short_description || item?.long_description || 'NA',
    }));
  }, [aboutIndicatorsData?.data?.indicators]);

  // Re-open mobile output pane when selection/filters change in map view
  React.useEffect(() => {
    if (view !== 'map') return;
    setIsOutputPaneOpen(true);
  }, [view, indicator, timePeriodSelected, region]);

  const RenderView = ({ selectedView }: any) => {
    switch (selectedView) {
      case 'map':
        return (
          <MapComponent
            indicator={indicator}
            mapDataloading={mapData?.isFetching}
            revenueMapDataLoading={revenueMapData?.isFetching}
            indicatorsData={mapIndicatorsData?.data?.indicators}
            setRegion={setDistrictCode}
            setRevenueRegion={setRevenueCode}
            revenueMapData={revenueMapData?.data?.revCircleMapData}
            mapData={mapData?.data?.districtMapData}
            currentSelectedState={currentSelectedState}
          />
        );

      case 'chart':
        return (
          <div className="pt-[84px]">
            <ChartView
              currentSelectedState={currentSelectedState}
              RevCircleDropdownOptions={RevCircleDropdownOptions}
              DistrictDropDownOption={DistrictDropDownOption}
              timeLimits={timePeriods}
            />
          </div>
        );

      case 'table':
        return (
          <div className="pt-[84px]">
            <TableComponent
              data={
                filteredTableData?.length > 0
                  ? filteredTableData
                  : tableData.data?.tableData
              }
              isLoading={tableData.isLoading}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-2 bg-[#FFFF]">
      <div
        className={cn(
          'relative h-[calc(100dvh_-_15vh)] w-full flex-grow flex-col gap-3 overflow-y-scroll',
          'sm:h-[calc(100dvh_-_120px)] md:h-[calc(100dvh_-_100px)]'
        )}
      >
        {/* <div className="flex w-full flex-grow flex-col overflow-y-scroll"> */}
        <div className="fixed top-[56px] z-9 flex h-[8vh] w-full items-center bg-[#FFFF] px-4 sm:h-[6%] sm:px-6 md:h-[5%] md:px-8">
          <FactorList currentState={currentSelectedState} />
          <FilterComp
            timePeriod={timePeriod}
            timePeriods={timePeriods}
            districtGeographiesData={districtGeographiesData}
            revenueGeographiesData={revenueGeographiesData}
            currentSelectedState={currentSelectedState}
            // getDistrictOptions={getDistrictOptions}
          />
        </div>

        {mapData.isLoading ? (
          <div className="p-4 text-center">Loading map data...</div>
        ) : mapData.isError || revenueMapData.isError ? (
          <div className="text-red-500 p-4 text-center">
            Error loading map data.
          </div>
        ) : (
          <RenderView selectedView={view} />
        )}
      </div>

      {/* <OutputWindowComponent /> */}
      {view === 'map' && !isOutputPaneOpen && (
        <div className="absolute right-6 top-[140px] z-[1001]">
          <Button
            kind="tertiary"
            onClick={() => setIsOutputPaneOpen(true)}
            className="border flex h-8 w-8 items-center justify-center border-borderSubdued bg-surfaceDefault shadow-basicSm"
            aria-label="Open details"
          >
            <Icon source={Icons.layoutSidebarRightCollapse} />
          </Button>
        </div>
      )}

      {view === 'map' &&
        isOutputPaneOpen &&
        (region !== null && region.length > 0 ? (
          <OutputWindowComponent
            currentState={currentSelectedState}
            time_period={timePeriodSelected}
            onClose={() => setIsOutputPaneOpen(false)}
          />
        ) : (
          <div className="fixed bottom-[8vh] left-0 right-0 z-[1000] max-h-[70vh] overflow-y-auto border-t-1 border-solid border-borderSubdued bg-surfaceDefault px-4 py-3">
            <div className="mb-2 flex justify-end">
              <Button
                onClick={() => setIsOutputPaneOpen(false)}
                kind="tertiary"
                aria-label="Close details"
              >
                <Icon source={Icons.cross} />
              </Button>
            </div>
            <AboutIndicator IndicatorData={indicatorListForAbout} />
          </div>
        ))}

      <div className="sticky bottom-0 flex h-[8vh] w-full flex-row justify-between gap-1 bg-baseIndigoSolid1 p-1 sm:p-2 md:p-3">
        {buttons.map((button, index) =>
          button.value === 'more' ? (
            // Render Menu for 'More' button
            <Menu
              key={index}
              trigger={
                <Button
                  size="slim"
                  className={cn(
                    'basis-1/3 border-t-1 py-4',
                    button.disabled && 'cursor-not-allowed opacity-50'
                  )}
                  kind="tertiary"
                  disabled={button.disabled}
                >
                  <div className="flex flex-col items-center justify-center gap-1 bg-baseIndigoSolid1 ">
                    <Icon
                      source={button.icon}
                      size={24}
                      stroke={activeButton === button.value ? 3 : 2}
                      className={button.disabled ? 'opacity-50' : ''}
                    />
                    <Text
                      variant="headingMd"
                      fontWeight={
                        activeButton === button.value ? 'bold' : 'medium'
                      }
                      className={
                        button.disabled ? 'opacity-50' : 'text-textSubdued'
                      }
                    >
                      {button.title}
                    </Text>
                  </div>
                </Button>
              }
              items={[
                {
                  content: 'Share',
                  icon: Icons.share,
                  // onAction: toggleShareOptions,
                  onAction: () => {
                    copyCurrentURL();
                  },
                },
                ...(reportsEnabled
                  ? [
                      {
                        content: 'Download Report',
                        icon: Icons.download,
                        onAction: () => {
                          const confirmation = window.confirm(
                            `Do you want to download the report for "${currentSelectedState.name}". `
                          );
                          if (confirmation) {
                            downloadStateReport(
                              `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/report?geo_code=${currentSelectedState.code}&time_period=${timePeriodSelected}`,
                              `${currentSelectedState.name}-Report`
                            );
                          }
                        },
                      },
                    ]
                  : []),
              ]}
            />
          ) : (
            // Render regular Button for other buttons
            <Button
              key={index}
              size="slim"
              className={cn(
                'basis-1/3 border-t-1 py-4',
                button.disabled && 'cursor-not-allowed opacity-50'
              )}
              kind="tertiary"
              onClick={() => {
                if (!button.disabled) {
                  setActiveButton(button.value);
                  setView(button.value, { shallow: false });
                }
              }}
              disabled={button.disabled}
            >
              <div className="flex flex-col items-center justify-center gap-1 bg-baseIndigoSolid1 ">
                <Icon
                  source={button.icon}
                  size={24}
                  stroke={activeButton === button.value ? 3 : 2}
                  className={button.disabled ? 'opacity-50' : ''}
                />
                <Text
                  variant="headingMd"
                  fontWeight={activeButton === button.value ? 'bold' : 'medium'}
                  className={
                    button.disabled ? 'opacity-50' : 'text-textSubdued'
                  }
                >
                  {button.title}
                </Text>
              </div>
            </Button>
          )
        )}
      </div>
    </section>
  );
}
