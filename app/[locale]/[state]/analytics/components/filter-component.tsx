'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { parseDate } from '@internationalized/date';
import { useQuery } from '@tanstack/react-query';
import { parseAsString, useQueryState } from 'next-usequerystate';
import {
  Button,
  Icon,
  RadioGroup,
  RadioItem,
  Select,
  TextField,
  YearCalendar,
} from 'opub-ui';

import { STATE_CODES, STATE_CODES_DROPDOWN } from '@/config/consts';
import {
  ANALYTICS_GEOGRAPHY_DATA,
  ANALYTICS_TIME_PERIODS,
} from '@/config/graphql/analaytics-queries';
import { GraphQL } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import Icons from '@/components/icons';
import {
  MobileFilterBox,
  MobileFilterContent,
} from '@/components/MobileFilterBox';

export function FilterComp({ timePeriod }: { timePeriod: string }) {
  interface OptionType {
    label: string;
    value: string;
    type: 'group' | 'item';
    options?: OptionType[]; // Only 'group' type will have nested options
  }

  interface Option {
    disabled?: boolean;
    value: string;
    label: string;
    type?: string;
  }
  type FilterButtonOption = {
    title: string;
    value: string;
    options?: Option[];
    type: string;
  }[];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // URL parameters
  const [timePeriodParam, setTimePeriod] = useQueryState(
    'time-period',
    parseAsString.withDefault(timePeriod)
  );

  const [districtCode, setDistrictCode] = useQueryState('district-code');
  const [revenueCode, setRevenueCode] = useQueryState('revenue-code');

  // State variables
  const [regionSelected, setRegionSelected] = useState(districtCode || '');
  const [regionName, setRegionName] = useState(''); // New state for region name
  const [revenueSelected, setRevenueSelected] = useState(revenueCode || '');
  const [timePeriodSelected, setTimePeriodSelected] = useState(timePeriodParam);

  //filter variables
  const [filterOption, setFilterOption] = useState('state');
  const routerParams = useParams();

  useEffect(() => {
    setRegionSelected(regionSelected || '');
    setRevenueSelected(revenueSelected || '');
    setTimePeriodSelected(timePeriodParam);
  }, [regionSelected, revenueSelected, timePeriodParam]);

  // Fetch district geographies data
  const districtGeographiesData = useQuery(
    [`geographies_data_district_${routerParams.state}`],
    () =>
      GraphQL(
        `${process.env.NEXT_PUBLIC_DATA_MANAGEMENT_LAYER_URL}/graphql`,
        ANALYTICS_GEOGRAPHY_DATA,
        {
          geoFilter: {
            type: 'district',
            code: [STATE_CODES[routerParams.state as keyof typeof STATE_CODES]],
          },
        }
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  // Fetch revenue circle geographies data
  const revenueGeographiesData = useQuery(
    [`geographies_data_revenue`],
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
    }
  );

  // Fetch time periods
  const timePeriods = useQuery(
    [`timePeriods`],
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

  const getStateOptions = useCallback(() => {
    return STATE_CODES_DROPDOWN;
  }, []);

  // Function to format district options
  const getDistrictOptions = useCallback(() => {
    if (districtGeographiesData.data) {
      const rawData = districtGeographiesData?.data?.getDistrictRevCircle;

      return rawData.map((district: { code: string; district: string }) => ({
        label: district.district,
        value: district.code,
      }));
    }
    return [];
  }, [districtGeographiesData]);

  // Function to format revenue circle options based on selected district
  const getRevenueOptions = useCallback(() => {
    if (revenueGeographiesData.data && regionName) {
      // Use regionName
      const rawData = revenueGeographiesData?.data?.getDistrictRevCircle;

      const selectedDistrictData = rawData[regionName]; // Use regionName to get the data

      return (
        selectedDistrictData?.map(
          (circle: { code: string; 'revenue-circle': string }) => ({
            label: circle['revenue-circle'],
            value: circle.code,
          })
        ) || []
      );
    }
    return [];
  }, [revenueGeographiesData, regionName]);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleApplyFilters = () => {
    setDistrictCode(regionSelected, { shallow: false });
    setRevenueCode(revenueSelected, { shallow: false });
    setTimePeriod(timePeriodSelected, { shallow: false });
    toggleDrawer();
  };

  const handleClearAllFilters = () => {
    setRegionSelected('');
    setRegionName(''); // Clear region name
    setRevenueSelected('');
    setTimePeriodSelected(timePeriod);
    setDistrictCode('', { shallow: false });
    setRevenueCode('', { shallow: false });
    setTimePeriod(timePeriod, { shallow: false });
    toggleDrawer();
  };

  const handleSelectedOption = (val: string) => {
    setFilterOption(val);
  };

  const handleDistrictChange = (value: string) => {
    setRegionSelected(value);

    // Set the region name based on the selected district code
    const selectedDistrict = getDistrictOptions().find(
      (option: { value: string }) => option.value === value
    );
    setRegionName(selectedDistrict ? selectedDistrict.label : ''); // Set region name
  };

  const FilterOptions: FilterButtonOption = [
    {
      title: 'State',
      value: 'state',
      options: getStateOptions(),
      type: 'radio-button',
    },
    {
      title: 'District',
      value: 'district',
      options: getDistrictOptions(),
      type: 'radio-button',
    },
    {
      title: 'Revenue-circle',
      value: 'revenue-circle',
      options: getRevenueOptions(),
      type: 'radio-button',
    },
    {
      title: 'Month',
      value: 'month',
      type: 'month-picker',
    },
  ];

  return (
    <>
      <Button
        className="m-0 ml-auto border-1 border-solid border-[#8C9196]"
        kind="tertiary"
        onClick={toggleDrawer}
      >
        <Icon source={Icons.filter} />
      </Button>

      <MobileFilterBox
        filterOptions={FilterOptions || []}
        handleApplyFilters={handleApplyFilters}
        handleClearFilters={handleClearAllFilters}
        open={isDrawerOpen}
        toggleDrawerCallback={toggleDrawer}
        onSelectedOption={handleSelectedOption}
      >
        <MobileFilterContent>
          <RenderOptions
            filterOptions={FilterOptions || []}
            selectedOption={filterOption}
            regionOptions={getDistrictOptions()} // Pass the result of getDistrictOptions here
            revenueOptions={getRevenueOptions()} // Pass the result of getRevenueOptions here
            regionSelected={regionSelected}
            setRegionSelected={handleDistrictChange}
            revenueSelected={revenueSelected}
            setRevenueSelected={setRevenueSelected}
            timePeriodData={timePeriods}
            timePeriodSelected={timePeriodSelected}
            setTimePeriodSelected={setTimePeriodSelected}
          />
        </MobileFilterContent>
      </MobileFilterBox>
    </>
  );
}

export const RenderOptions = ({
  filterOptions,
  selectedOption,
  regionOptions,
  revenueOptions, // New revenue options
  regionSelected,
  setRegionSelected,
  revenueSelected,
  setRevenueSelected,
  timePeriodData,
  timePeriodSelected,
  setTimePeriodSelected,
  handleDistrictChange,
}: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const routerParams = useParams();
  const router = useRouter();

  const findSelectedValue = filterOptions.filter(
    (opt: { value: string }) => opt.value === selectedOption
  );

  const type = findSelectedValue[0]?.type;
  const value = findSelectedValue[0]?.value;
  const options = findSelectedValue[0]?.options;

  const filteredRegionOptions = regionOptions.filter(
    (opt: { value: string }) => opt.value === regionSelected
  );

  const onRadioButtonChange = (selectedValue: string, value: string) => {
    setSelectedState(selectedValue);

    if (value === 'state') {
      // const selectedStateValue = STATE_CODES_DROPDOWN.find(
      //   (item) => item.value === routerParams.state
      // )?.value;

      router.push(
        `/${selectedValue}/analytics/?indicator=risk-score&time-period=${process.env.TIME_PERIOD || process.env.NEXT_PUBLIC_TIME_PERIOD}&view=map`
      );
    } else if (value === 'district') {
      setRegionSelected(selectedValue); // Directly set the region
      // regionOptions(selectedValue);
    } else if (value === 'revenue-circle' || value === 'tehsil') {
      setRevenueSelected(selectedValue);
      // revenueOptions(selectedValue);
    }
  };

  let minDate: string, maxDate: string;

  const datesArray = timePeriodData?.data?.getDataTimePeriods.map(
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

  switch (type) {
    case 'radio-button':
      return (
        <RadioGroup
          onChange={(e) => onRadioButtonChange(e, value)}
          name={value}
          value={
            value === 'state'
              ? selectedState
              : value === 'district'
                ? regionSelected
                : revenueSelected
          }
        >
          {options.map((item: any, idx: any) =>
            item.type === 'group' ? (
              <div
                key={idx}
                style={{
                  backgroundColor: '#F7F7F8',
                  padding: '10px',
                  marginTop: '15px',
                }}
              >
                <span>{item.label}</span>
              </div>
            ) : (
              <RadioItem key={idx} value={item.value}>
                {item.label}
              </RadioItem>
            )
          )}
        </RadioGroup>
      );
    case 'month-picker':
      return (
        <div className=" self-center">
          <YearCalendar
            defaultValue={parseDate(
              `${timePeriodSelected.split('_')[0]}-${timePeriodSelected.split('_')[1]}-01` ||
                '23-08-01'
            )}
            minValue={parseDate(minDate || '2023-01-04')}
            maxValue={parseDate(maxDate || '2023-01-04')}
            onChange={(date) => {
              setTimePeriodSelected(
                `${date.year}_${date.month < 10 ? `0${date.month}` : `${date.month}`}`
              );
            }}
          />
        </div>
      );
  }
};
