'use client';

import React, { useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useLockBody } from '@/hooks/use-lock-body';
import { parseAsString, useQueryState } from 'next-usequerystate';
import { Button, Icon, Menu, Select, Text } from 'opub-ui';

import { cn, copyCurrentURL, formatDate } from '@/lib/utils';
import Icons from '@/components/icons';
import { OutputWindowComponent } from './analytics-layout';
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
      title: 'Bar',
      value: 'bar',
      disabled: true,
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
        return <div className="pt-[62px]"></div>;

      case 'table':
        return (
          <div>
            <div className="mb-2 mt-16 flex items-start justify-evenly gap-3 p-4 pb-1 pt-0">
              <SelectOptions />
            </div>
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
          'relative h-[calc(100dvh_-_130px)] w-full flex-grow flex-col gap-3 overflow-y-scroll '
        )}
      >
        <div className="fixed top-[56px] z-9 flex h-[10%] w-full items-center bg-[#FFFF] px-4">
          <FactorList />
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
        <OutputWindowComponent currentStateCode={currentSelectedState.code} />
      )}

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
