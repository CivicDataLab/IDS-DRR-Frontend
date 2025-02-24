'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLockBody } from '@/hooks/use-lock-body';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Button, Icon, Menu, Select, Text } from 'opub-ui';

import {
  cn,
  copyCurrentURL,
  downloadStateReport,
  formatDate,
} from '@/lib/utils';
import Icons from '@/components/icons';
import { MediaRendering } from '@/components/media-rendering';
import { getLatestDate } from '../utils/utils';
import { OutputWindowComponent } from './analytics-layout';
import { ChartView } from './chart-view';
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
  indicatorsData,
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
  timePeriods: any;
  indicatorsData: any;
  tableData: any;
  currentSelectedState: any;
  statesList: Array<any>;
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
      title: 'Chart',
      value: 'chart',
      disabled: false,
    },
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

  const stateCode = currentSelectedState.code;

  const [view, setView] = useQueryState(
    'view',
    parseAsString.withDefault('map')
  );
  const searchParams = useSearchParams();
  const region =
    searchParams.get('revenue-code') || searchParams.get('district-code');

  let minDate, maxDate;
  if (timePeriods.data) {
    const datesArray = timePeriods?.data?.getDataTimePeriods.map(
      (date: any) => {
        const [year, month] = date.value.split('_');
        return new Date(parseInt(year), parseInt(month));
      }
    );
    const timestamps = datesArray.map((date: any) => date.getTime());
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
                circle[stateCode == '02' ? 'tehsil' : 'revenue-circle'] ||
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
  const [filteredTableData, setFilteredTableData] = useState(
    tableData.data?.tableData
  );

  function SelectOptions() {
    return (
      <React.Fragment>
        <Select
          label="Select District"
          value={districtCode || ''}
          name="district-select"
          className=" flex-grow"
          onChange={(e) => {
            handleDistrictChange(e);
          }}
          options={DistrictDropDownOption}
        />
        <Select
          label="Select Revenue Circle"
          value={revenueCode || ''}
          placeholder={
            !districtCode
              ? 'Select a district to enable'
              : 'Select a revenue circle'
          }
          name="revenue-circle-select"
          className=" flex-grow"
          disabled={!districtCode}
          onChange={(e) => {
            setRevenueCode(e, { shallow: false });
          }}
          options={getRevenueCircleOptions()}
        />
      </React.Fragment>
    );
  }

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
          'relative h-[calc(100dvh_-_160px)] w-full flex-grow flex-col gap-3 overflow-y-scroll'
          // 'sm:h-[calc(100dvh_-_120px)] md:h-[calc(100dvh_-_100px)]'
        )}
      >
        <div className="fixed top-[56px] z-9 flex h-[8vh] w-full items-center bg-[#FFFF] px-4 sm:h-[6%] sm:px-6 md:h-[5%] md:px-8">
          <FactorList currentState={currentSelectedState} />
          <FilterComp
            timePeriod={timePeriod}
            timePeriods={timePeriods}
            districtGeographiesData={districtGeographiesData}
            revenueGeographiesData={revenueGeographiesData}
            currentSelectedState={currentSelectedState}
            statesList={statesList}
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
      {region !== null && region.length > 0 && view === 'map' && (
        <OutputWindowComponent
          currentState={currentSelectedState}
          time_period={timePeriodSelected}
        />
      )}

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
                {
                  content: 'Download Report',
                  icon: Icons.download,
                  onAction: () => {
                    const confirmation = window.confirm(
                      `Do you want to download the report for "${currentSelectedState.name}". `
                    );
                    if (confirmation) {
                      downloadStateReport(
                        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/report?geo_code=${currentSelectedState.code}`,
                        `${currentSelectedState.name}-Report`
                      );
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
