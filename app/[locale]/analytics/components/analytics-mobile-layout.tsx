'use client';

import React, { useEffect, useState } from 'react';
import { useLockBody } from '@/hooks/use-lock-body';
import { type TypedDocumentNode } from '@graphql-typed-document-node/core';
import { useQuery } from '@tanstack/react-query';
import {
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from 'next-usequerystate';
import { Button, Icon, Menu, Text } from 'opub-ui';

import {
  ANALYTICS_DISTRICT_MAP_DATA,
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_INDICATORS,
  ANALYTICS_REVENUE_MAP_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { cn, copyCurrentURL, formatDate, handleRedirect } from '@/lib/utils';
import Icons from '@/components/icons';
import { constructRegionOptions } from '../utils/utils';
import {
  AnalyticsDashboardLayout,
  OutputWindowComponent,
} from './analytics-sidebar-layout';
import { FactorList } from './factor-list';
import { FilterComp } from './filter-component';
import { MapComponent } from './map-component';

const currentURL = typeof window !== 'undefined' ? window.location.href : '';

interface Option {
  disabled?: boolean;
  value: string;
  label: string;
  districtCode?: string;
}

export function AnalyticsMobileLayout({
  timePeriod,
  indicator,
  boundary,
}: {
  timePeriod: string;
  indicator: string;
  boundary: string;
}) {
  //Remove default page scroll to make only the content scrollable
  useLockBody();

  const [districtCode, setDistrictCode] = useQueryState('district-code');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');
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
    {
      icon: Icons.IconChartBar,
      title: 'Bar',
      value: 'bar',
      disabled: true,
    },
    {
      icon: Icons.IconTableAlias,
      title: 'Table',
      value: 'table',
      disabled: true,
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

  const mapData = useQuery(
    [`mobile_mapQuery_district_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_DISTRICT_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const revenueMapData = useQuery(
    [`mobile_mapQuery_revenue-circle_${indicator}_${timePeriodSelected}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_REVENUE_MAP_DATA,
        {
          indcFilter: { slug: indicator },
          dataFilter: { dataPeriod: timePeriodSelected },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const districtGeographiesData = useQuery(
    [`mobile_geographies_data_district`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: 'district' },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onError: (error) => {
        console.error('Error fetching district geographies:', error);
      },
    }
  );

  const revenueGeographiesData = useQuery(
    [`mobile_geographies_data_revenue`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: { type: 'revenue-circle' },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onError: (error) => {
        console.error('Error fetching revenue geographies:', error);
      },
    }
  );

  const timePeriods = useQuery(
    [`mobile_timePeriods`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_TIME_PERIODS
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const indicatorsData = useQuery(
    [`mobile_indicators_${indicator}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_INDICATORS,
        {
          indcFilter: { slug: indicator },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  let minDate, maxDate;
  if (timePeriods.data) {
    const datesArray = timePeriods?.data?.getDataTimePeriods.map((date) => {
      const [year, month] = date.value.split('_');
      return new Date(parseInt(year), parseInt(month));
    });
    const timestamps = datesArray.map((date) => date.getTime());
    // Find the minimum and maximum timestamps
    const minTimestamp = Math.min(...timestamps);
    const maxTimestamp = Math.max(...timestamps);

    // Convert the timestamps back to dates
    minDate = formatDate(minTimestamp, true);
    maxDate = formatDate(maxTimestamp, true);
  }

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
          (circle: {
            'revenue-circle': string;
            code: string;
            district_code: string;
          }) => {
            RevCircleDropdownOptions.push({
              label: circle['revenue-circle'],
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
    const timePeriod = params.get('time-period');
    if (timePeriod) {
      setTimePeriod(timePeriod);
    }
  }, []);

  // Filter revenue circles based on selected district
  const getRevenueCircleOptions = () => {
    const filteredRevenueCircles = RevCircleDropdownOptions.filter(
      (option) => option.districtCode === districtCode
    );

    filteredRevenueCircles.unshift({ label: '', value: '' });

    return filteredRevenueCircles;
  };

  // Handle district change
  const handleDistrictChange = (districtCode: string) => {
    setDistrictCode(districtCode, { shallow: false });
  };

  const [activeButton, setActiveButton] = useState(view);
  // const [activeButton, setActiveButton] = useState(''); // State for managing active buttons
  const [isShareOptionsVisible, setShareOptionsVisible] = useState(false); // State for share options visibility
  const currentURL = window.location.href; // Get the current URL

  const toggleShareOptions = () => {
    setShareOptionsVisible((prev) => !prev); // Toggle visibility of share options
  };

  const RenderView = ({ selectedView }: any) => {
    const isRegionSelected = Boolean(districtCode || revenueCode);

    switch (selectedView) {
      case 'map':
        return (
          <MapComponent
            indicator={indicator}
            mapDataloading={mapData?.isFetching}
            revenueMapDataLoading={revenueMapData?.isFetching}
            indicatorsData={indicatorsData?.data?.indicators}
            setRegion={setDistrictCode}
            setRevenueRegion={setRevenueCode}
            revenueMapData={revenueMapData?.data?.revCircleMapData}
            mapData={mapData?.data?.districtMapData}
          />
        );

      case 'chart':
        return <div className="pt-[62px]"></div>;

      case 'table':
        return <div className="pt-[62px]"></div>;

      default:
        return null;
    }
  };

  return (
    <section className="flex h-full flex-col items-center justify-center gap-2 bg-[#FFFF]">
      <div
        className={cn(
          'relative h-[calc(100dvh_-_130px)] w-full flex-grow flex-col gap-3 overflow-y-scroll '
        )}
      >
        <div className="fixed top-[56px] z-9 flex h-[10%] w-full items-center bg-[#FFFF] px-4">
          <FactorList />
          <FilterComp timePeriod={timePeriod} />
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

      <div className="sticky bottom-0 flex h-[86px] w-full flex-row justify-between gap-1 bg-baseIndigoSolid1 p-1">
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
                {
                  content: 'Download Report',
                  icon: Icons.download,
                  onAction: (event) => {
                    const downloadLink =
                      process.env.NEXT_PUBLIC_DOWNLOAD_REPORT_LINK;
                    if (!downloadLink) {
                      console.error('Download link is undefined!');
                      alert('Download link is not available.');
                      return;
                    }

                    const confirmation = window.confirm(
                      `You are being redirected to "${downloadLink}". `
                    );
                    if (confirmation) {
                      window.open(downloadLink, '_blank');
                    }
                  },
                },
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
